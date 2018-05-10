

var Timer = null;
var Time = 0;
var Score = 0;
var Page = 1;

var Phil = ["1:6", "2:1", "2:5", "2:6", "2:12", "3:20", "4:4", "4:6-7", "4:8", "4:13", "4:19"];
var ChVs = [30, 30, 21, 23];
var Refs = [];

$(document).ready(function () {
    $("#TimeScore").hide();
    $("#Typer").hide();
    $("#EndPage").hide();
    $("#History").hide();



    //for (var i = 0; i < ChVs.length; i++) {
    //    for (var j = 0; j < ChVs[i]; j++) {
    //        Refs.push(i + 1 + ":" + j + 1);
    //    }
    //}
});

$("#Start").click(function () {
    $("#StartPage").hide();
    Status = 2;
    GetVerse();
    $("#Typed").focus();
    setTimeout(
        Timer = setInterval(TimeTick, 1000),
        1000
    );
});

$(document).keypress(function (e) {
    if (e.keyCode === 13 && Status === 1) {
        $("#Start").click();
    } else if (e.keyCode === 13 && Status === 4) {
        $("#Restart").click();
    }
});

$("#Restart").click(function () {
    $("#EndPage").hide();
    Status = 2;
    Score = 0;
    GetVerse();
    $("#Typed").focus();
    setTimeout(
        Timer = setInterval(TimeTick, 1000),
        1000
    );
});

$("#Submit").click(function () {
    if (Status === 2) {
        Status = 3;
    } else {
        Status = 2;
    }
    SubmitVerse();
    GetVerse();
    $("#Typed").val('');
});

$("#Typed").on("keypress", function (e) {
    if (e.keyCode === 13 && $("#Typed").val().length > 5) {
        $("#Submit").click();    
    }
});

function GetVerse() {
    var ref = Phil[Math.round(Math.random() * (Phil.length - 1))];

    if (Status === 3) {
        ref = Refs[Math.round(Math.random() * (Refs.length - 1))];
    }
    
    $.ajax({
        url: "https://api.esv.org/v3/passage/html/?q=Philippians" + ref + "&include-verse-anchors=false&include-chapter-numbers=false&include-first-verse-numbers=false&include-footnotes=false&include-headings=false&include-subheadings=false&include-audio-link=false",
        type: 'GET',
        headers: { "Authorization": "Token 00706264fcd4c12e299878dbdf3af0608adbabff" },
        success: function (data) {
            $("#Verse").html(data.passages);
        }
    });
}

function SubmitVerse() {
    var src = $("#Typed").val().replace(/[^A-Za-z]/gi, '');
    var tgt = $("#Verse").find("p:first").text().replace(/[^A-Za-z]/gi, '');
    console.log(src, tgt);
    var max = calculateLevDistance("", tgt);
    var act = calculateLevDistance(src, tgt);
    var percent = Math.round((1 - act / max) * 100);
    var subscore = Math.round(percent * percent * max / 1000);
    console.log(act, max);

    Score += subscore;
    $("#Score").text("Score: " + Score);

    $("#History > tbody").prepend('<tr><td>' + subscore + '</td > <td>' + percent + '%</td> <td>' + $("#Typed").val() + '</td></tr > ');
}

function TimeTick() {
    Time -= 1;
    if (Time === 0) {
        SubmitVerse();
        $("#Typed").blur();
        clearInterval(Timer);
        Status = 4;
        $("#FinalScore").text("Score: " + Score);
        $("#EndPage").show();
    } else {
        if (Time % 60 < 10) {
            $("#Time").text("Time: " + Math.floor(Time / 60) + ":0" + Time % 60);
        } else {
            $("#Time").text("Time: " + Math.floor(Time / 60) + ":" + Time % 60);
        }        
    }
}

function calculateLevDistance(src, tgt) {
    var realCost;

    var srcLength = src.length,
        tgtLength = tgt.length,
        tempString, tempLength;

    var resultMatrix = new Array();
    resultMatrix[0] = new Array();
    
    if (srcLength < tgtLength) {
        tempString = src; src = tgt; tgt = tempString;
        tempLength = srcLength; srcLength = tgtLength; tgtLength = tempLength;
    }

    for (var c = 0; c < tgtLength + 1; c++) {
        resultMatrix[0][c] = c;
    }

    for (var i = 1; i < srcLength + 1; i++) {
        resultMatrix[i] = new Array();
        resultMatrix[i][0] = i;
        for (var j = 1; j < tgtLength + 1; j++) {
            realCost = src.charAt(i - 1) === tgt.charAt(j - 1) ? 0 : 1;
            resultMatrix[i][j] = Math.min(
                resultMatrix[i - 1][j] + 1,
                resultMatrix[i][j - 1] + 1,
                resultMatrix[i - 1][j - 1] + realCost
            );
        }
    }

    return resultMatrix[srcLength][tgtLength];
}


// ESV API
function GetPassage() {
    var ref = $("Book").val() + $("Chapter").val();
    $.ajax({
        url: "https://api.esv.org/v3/passage/html/?q=" + ref + "&include-verse-anchors=false&include-chapter-numbers=false&include-first-verse-numbers=false&include-footnotes=false&include-headings=false&include-subheadings=false&include-audio-link=false",
        type: 'GET',
        headers: { "Authorization": "Token 00706264fcd4c12e299878dbdf3af0608adbabff" },
        success: function (data) {
            $("#Passage").html(data.passages);
        }
    });
}