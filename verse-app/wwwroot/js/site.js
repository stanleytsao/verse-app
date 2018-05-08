var Timer = null;
var Time = 120;
var LastTime = 120;
var Score = 0;
var Verse;

$(document).ready(function () {
    $("#EndPage").hide();
});

$("#Start").click(function () {
    $("#StartPage").hide();
    GetVerse("jn3:16");
    $("#Typed").focus();
    setTimeout(
        Timer = setInterval(TimeTick, 1000),
        1000
    );
});

$("#Submit").click(function () {
    SubmitVerse();
});

$("#Typed").on("keypress", function (e) {
    if (e.keyCode === 13) {
        SubmitVerse();
    }
});

function GetVerse(ref) {
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
    var src = $("#Typed").val().replace(/\W/g, '');
    var tgt = $(".woc").text().replace(/\W/g, '');
    var max = calculateLevDistance("", tgt);
    var act = calculateLevDistance(src, tgt);
    var subscore = Math.round((1 - act / max) * max * 10 / (LastTime - Time));

    Score += subscore;
    $("#Score").text("Score: " + Score);
    
    var row = $("#History").insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    //cell1.innerHTML = subscore;
    cell2.innerHTML = (1 - act / max).toFixed(2);
    //cell3.innerHTML = LastTime - Time + " sec";
    //cell4.innerHTML = $("#Typed").val();

    LastTime = Time;
    GetVerse();
}

function TimeTick() {
    Time -= 1;
    if (Time === 0) {
        clearInterval(Timer);
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


