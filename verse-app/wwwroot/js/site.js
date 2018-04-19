// Write your JavaScript code.

var verse = "Proverbs" + Math.floor(Math.random() * 31) + ":" + Math.floor(Math.random() * 36);

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
    GetVerse();
});