var Timer = null;
var Time = 120;
var Score = 0;
var Status = "Start";
var Phil = ["1:6", "2:1", "2:5", "2:6", "2:12", "3:20", "4:4", "4:6-7", "4:8", "4:13", "4:19"];

$(document).ready(function () {
    $("#EndPage").hide();
});

$("#Start").click(function () {
    $("#StartPage").hide();
    GetVerse();
    $("#Typed").focus();
    setTimeout(
        Timer = setInterval(TimeTick, 1000),
        1000
    );
});

$(document).keypress(function (e) {
    if (e.keyCode === 13 && Status === "Start") {
        Status = "";
        $("#Start").click();
    } else if (e.keyCode === 13 && Status === "End") {
        Status = "";
        $("#Restart").click();
    }
});

$("#Restart").click(function () {
    $("#EndPage").hide();
    Score = 0;
    GetVerse();
    $("#Typed").focus();
    setTimeout(
        Timer = setInterval(TimeTick, 1000),
        1000
    );
});

$("#Submit").click(function () {
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
    var rand = Math.round(Math.random() * (Phil.length - 1));
    var ref = "Philippians" + Phil[rand];
    $.ajax({
        url: "https://api.esv.org/v3/passage/html/?q=" + ref + "&include-verse-anchors=false&include-chapter-numbers=false&include-first-verse-numbers=false&include-footnotes=false&include-headings=false&include-subheadings=false&include-audio-link=false",
        type: 'GET',
        headers: { "Authorization": "Token 00706264fcd4c12e299878dbdf3af0608adbabff" },
        success: function (data) {
            $("#Verse").html(data.passages);
        }
    });
}

function SubmitVerse() {
    var src = $("#Typed").val();
    var tgt = $("#Verse").find("p:first").text();
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
        clearInterval(Timer);
        Status = "End";
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
        tempString, tempLength; // for swapping

    var resultMatrix = new Array();
    resultMatrix[0] = new Array(); // Multi dimensional

    // To limit the space in minimum of source and target,
    // we make sure that srcLength is greater than tgtLength
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
                resultMatrix[i - 1][j - 1] + realCost // same logic as our previous example.
            );
        }
    }

    return resultMatrix[srcLength][tgtLength];
}


