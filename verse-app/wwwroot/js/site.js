var OldTestiment = ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", "1Samuel", "2Samuel", "1Kings", "2Kings", "1Chronicles", "2Chronicles", "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "SongofSolomon", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi"];

var NewTestament = ["Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1Corinthians", "2Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "1Thessalonians", "2Thessalonians", "1Timothy", "2Timothy", "Titus", "Philemon", "Hebrews", "James", "1Peter", "2Peter", "1John", "2John", "3John", "Jude", "Revelation"];

var Test = ["John3:16", "Proverbs 3:5-6", "Romans 3:23", "Jeremiah 29:11"];

function GetVerse(ref) {
    $.ajax({
        url: "https://api.esv.org/v3/passage/text/?q=" + ref + "&include-passage-references=false&include-first-verse-numbers=false&include-verse-numbers=false&include-footnotes=false&include-footnote-body=false&include-short-copyright=true&include-passage-horizontal-lines=false&include-heading-horizontal-lines=false&include-headings=false",
        type: 'GET',
        headers: { "Authorization": "Token 00706264fcd4c12e299878dbdf3af0608adbabff" },
        success: function (data) {
            $("#Board").append('<div class="card"><div class="front">' + ref + '</div><div class="back">' + data.passages + '</div></div>');
            $(".card").flip({
                trigger: 'click'
            });
        }
    });
}

$(document).ready(function () {
    //$.each(Test, function (key, value) {
    //    GetVerse(value);
    //});
    while (Test.length > 0) {
        var i = Math.floor(Math.random() * Test.length);
        GetVerse(Test[i]);
        $("#Board").append('<div class="card"><div class="front"></div><div class="back">' + Test[i] + '</div></div>');
        Test.splice(i, 1);
    }
});

