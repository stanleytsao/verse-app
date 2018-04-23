var OldTestiment = ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", "1Samuel", "2Samuel", "1Kings", "2Kings", "1Chronicles", "2Chronicles", "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "SongofSolomon", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi"];

var NewTestament = ["Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1Corinthians", "2Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "1Thessalonians", "2Thessalonians", "1Timothy", "2Timothy", "Titus", "Philemon", "Hebrews", "James", "1Peter", "2Peter", "1John", "2John", "3John", "Jude", "Revelation"];

var Test = [{ "r": 1, "v": "verse1" }, { "r": 2, "v": "verse2" }, { "r": 3, "v": "verse3" }, { "r": 4, "v": "verse4" }];

var verse = "John3:16";
//var verse = "Proverbs" + Math.floor(Math.random() * 31) + ":" + Math.floor(Math.random() * 36);

function GetVerse() {
    $.ajax({
        url: "https://api.esv.org/v3/passage/html/?q=" + verse + "&include-footnotes=false&include-footnote-body=false&include-audio-link=false&include-short-copyright=false",
        type: 'GET',
        headers: { "Authorization": "Token 00706264fcd4c12e299878dbdf3af0608adbabff" },
        success: function (data) {
            //alert(JSON.stringify(data));
            //$("#Ref").text(JSON.stringify(data.canonical));
            $("#VerseDisplay").append(data.passages);
        }
    });
}

$(document).ready(function () {
    //GetVerse();

    //$.each(Test, function (key, value) {
    //    var $btn = $('<input/>').attr({ type: 'button', value: value.v });
    //    $(".test").append($btn);
    //});
});

$(".card").flip({
    trigger: 'click'
});