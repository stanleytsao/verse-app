var books = { Matthew: 28, Mark: 16, Luke: 24, John: 21, Acts: 28, Romans: 16, "1 Corinthians": 16, "2 Corinthians": 13, Galatians: 6, Ephesians: 6, Philippians: 4, Colossians: 4, "1 Thessalonians": 5, "2 Thessalonians": 3, "1 Timothy": 6, "2 Timothy": 4, Titus: 3, Philemon: 1, Hebrews: 13, James: 5, "1 Peter": 5, "2 Peter": 3, "1 John": 5, "2 John": 1, "3 John": 1, Jude: 1, Revelation: 22 };

var Timer = null;
var Time = 0;

$(document).ready(function() {
    $("#PassageTyper").hide();
    $("#EndPage").hide();
    $("#History").hide();

    $.each(books, function (book) {
        $("#Book").append('<li><a href="#">' + book + '</a></li>');
    });

    $("#Book li > a").click(function() {
        var value = $(this).text();
        $("#SelectedBook").text(value);
        var chapters = books[value];
        $("#Chapter").html('');
        for (var i = 0; i < chapters; i++) {
            $("#Chapter").append('<li><a href="#">' + (i + 1) + '</a></li>');
            $("#Chapter li > a").click(function () {
                var value = $(this).text();
                $("#SelectedChapter").text(value);
            });
        }
    })
});

$("#Start").click(function () {
    var ref = $("#SelectedBook").text() + $("#SelectedChapter").text();
    $("#PassageTyper").show();
    GetPassage(ref);
});

// ESV API
function GetPassage(ref) {
    $.ajax({
        url: "https://api.esv.org/v3/passage/html/?q=" + ref + "&include-verse-anchors=false&include-chapter-numbers=false&include-first-verse-numbers=false&include-footnotes=false&include-headings=false&include-subheadings=false&include-audio-link=false",
        type: 'GET',
        headers: { "Authorization": "Token 00706264fcd4c12e299878dbdf3af0608adbabff" },
        success: function (data) {
            $("#Passage").html(data.passages);
            $("#TextBox").focus();
            setTimeout(
                Timer = setInterval(TimeTick, 1000),
                500
            );
        }
    });
}

function TimeTick() {
    Time += 1;
    if (Time % 60 < 10) {
        $("#Time").text("Time: " + Math.floor(Time / 60) + ":0" + Time % 60);
    } else {
        $("#Time").text("Time: " + Math.floor(Time / 60) + ":" + Time % 60);
    }
}


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


