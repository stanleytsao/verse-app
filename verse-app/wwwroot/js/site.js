﻿var books = { Matthew: 28, Mark: 16, Luke: 24, John: 21, Acts: 28, Romans: 16, "1 Corinthians": 16, "2 Corinthians": 13, Galatians: 6, Ephesians: 6, Philippians: 4, Colossians: 4, "1 Thessalonians": 5, "2 Thessalonians": 3, "1 Timothy": 6, "2 Timothy": 4, Titus: 3, Philemon: 1, Hebrews: 13, James: 5, "1 Peter": 5, "2 Peter": 3, "1 John": 5, "2 John": 1, "3 John": 1, Jude: 1, Revelation: 22 };

var Timer = null;
var Time;
var SplitTime;
var TotalWords;
var FirstVerse;
var LastVerse;

$(document).ready(function () {
    if ($(window).width() >= 768) {
        $("#NoMobile").hide();
    } else {
        $("#NoMobile").show();
    }

    $("#EndPage").hide();
    $("#PassageTyper").hide();
    $("#History").hide();

    // Generate list of books
    $.each(books, function (book) {
        $("#Book").append('<option value="' + book + '">' + book + '</option>');
    });

    // Generate chapters in selected book
    $("#Book").change(function () {
        var value = $(this).val();
        var chapters = books[value];
        $("#Chapter").html('<option></option>');
        for (var i = 0; i < chapters; i++) {
            $("#Chapter").append('<option value="' + (i + 1) + '">' + (i + 1) + '</option>');
        }
    });
});

$(window).on('resize', function () {
    var win = $(this);
    if (win.width() >= 768) {
        $("#NoMobile").hide();
    } else {
        $("#NoMobile").show();
    }
});

$("#Start").click(function () {
    if ($("#Chapter").val() > 0) {
        Time = 0;
        SplitTime = 0;
        TotalWords = 0;
        var ref = $("#Book").val() + $("#Chapter").val();
        GetStartEnd(ref);
        $("#PassageTyper").show();
    }
    
});

// ESV API
function GetStartEnd(ref) {
    $.ajax({
        url: "https://api.esv.org/v3/passage/html/?q=" + ref + "&include-verse-anchors=false&include-chapter-numbers=false&include-first-verse-numbers=false&include-footnotes=false&include-headings=false&include-subheadings=false&include-audio-link=false",
        type: 'GET',
        headers: { "Authorization": "Token 00706264fcd4c12e299878dbdf3af0608adbabff" },
        success: function (data) {
            FirstVerse = data.parsed[0][0];
            LastVerse = data.parsed[0][1];
            GetVerse(FirstVerse);
            $("#TextBox").focus();
            setTimeout(
                Timer = setInterval(TimeTick, 1000),
                500
            );
        }
    });
}

function GetVerse(ref) {
    $.ajax({
        url: "https://api.esv.org/v3/passage/html/?q=" + ref + "&include-verse-anchors=false&include-chapter-numbers=false&include-first-verse-numbers=false&include-footnotes=false&include-headings=false&include-subheadings=false&include-audio-link=false",
        type: 'GET',
        headers: { "Authorization": "Token 00706264fcd4c12e299878dbdf3af0608adbabff" },
        success: function (data) {
            $("#Passage").html(data.passages);
        }
    });
}

function TimeTick() {
    Time += 1;
    if (Time === 180) {
        clearInterval(Timer);
        $("#FinalScore").text((TotalWords / Time * 60).toFixed(1) + " WPM");
        $("#EndPage").show();
        $("#PassageTyper").hide();
    } else {
        if (Time % 60 < 10) {
            $("#Time").text("Time: " + Math.floor(Time / 60) + ":0" + Time % 60);
        } else {
            $("#Time").text("Time: " + Math.floor(Time / 60) + ":" + Time % 60);
        }
    }    
}

$("#Submit").click(function () {
    var src = $("#TextBox").val().replace(/[^A-Za-z]/gi, '').toLowerCase();
    var tgt = $("#Passage").find("p").not("p:last").text().replace(/[^A-Za-z]/gi, '').toLowerCase();
    var max = calculateLevDistance("", tgt);
    var act = calculateLevDistance(src, tgt);
    var percent = ((1 - act / max) * 100).toFixed(1);
    var words = $("#TextBox").val().split(" ").length;
    var WPM = (words / (Time - SplitTime) * 60).toFixed(1) + " WPM";

    $("#History").show();
    $("#History > tbody").prepend('<tr><td>' + WPM + '</td > <td>' + percent + '%</td> <td class="mdl-data-table__cell--non-numeric">' + $("#TextBox").val() + '</td></tr > ');
    $("#TextBox").val('');
    TotalWords += words;
    $("#WPM").text((TotalWords / Time * 60).toFixed(1));

    if (FirstVerse < LastVerse) {
        FirstVerse += 1;
        GetVerse(FirstVerse);
        SplitTime = Time;
    } else {
        clearInterval(Timer);
        $("#FinalScore").text((TotalWords / Time * 60).toFixed(1));
        $("#EndPage").show();
        $("#PassageTyper").hide();
    }
});

$("#TextBox").on("keypress", function (e) {
    if (e.keyCode === 13 && $("#TextBox").val().length > 1) {
        $("#Submit").click();    
    }
});


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


