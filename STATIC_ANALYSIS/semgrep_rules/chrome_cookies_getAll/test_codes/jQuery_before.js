/*******************
chrome_cookies_getAll-jQuery_before
*******************/

// Expected total matches: 40

// case 1
function kms(n, a) {
    console.log();
    $("f").before(n.linkUrl); // Expect 1 match here
    $("f").before(n.srcUrl); // Expect 1 match here
    $("f").before(n.pageUrl); // Expect 1 match here
    $("f").before(n.frameUrl); // Expect 1 match here
    $("f").before(n.selectionText); // Expect 1 match here

    console.log();

    let x = n.linkUrl;
    $("f").before(x); // Expect 1 match here

    x = n.srcUrl;
    $("f").before(x); // Expect 1 match here

    x = n.pageUrl;
    $("f").before(x); // Expect 1 match here

    x = n.frameUrl;
    $("f").before(x); // Expect 1 match here

    x = n.selectionText;
    $("f").before(x); // Expect 1 match here
    console.log();
}

let n = { linkUrl: "" };
let a = n.linkUrl;
$("f").before(x);

chrome.cookies.getAll({ name: "" }, kms);

// case 2
chrome.cookies.getAll({ name: "" }, aaa);

let b = n.linkUrl;
$("f").before(x);

function aaa(n, a) {
    console.log();
    $("f").before(n.linkUrl); // Expect 1 match here
    $("f").before(n.srcUrl); // Expect 1 match here
    $("f").before(n.pageUrl); // Expect 1 match here
    $("f").before(n.frameUrl); // Expect 1 match here
    $("f").before(n.selectionText); // Expect 1 match here

    $("f").before(a.linkUrl);
    console.log();

    let x = n.linkUrl;
    $("f").before(x); // Expect 1 match here

    x = n.srcUrl;
    $("f").before(x); // Expect 1 match here

    x = n.pageUrl;
    $("f").before(x); // Expect 1 match here

    x = n.frameUrl;
    $("f").before(x); // Expect 1 match here

    x = n.selectionText;
    $("f").before(x); // Expect 1 match here
    console.log();
}

// case 3
chrome.cookies.getAll({ name: "" }, function (n, a) {
    console.log();
    $("f").before(n.linkUrl); // Expect 1 match here
    $("f").before(n.srcUrl); // Expect 1 match here
    $("f").before(n.pageUrl); // Expect 1 match here
    $("f").before(n.frameUrl); // Expect 1 match here
    $("f").before(n.selectionText); // Expect 1 match here
    console.log();

    let x = n.linkUrl;
    $("f").before(x); // Expect 1 match here

    x = n.srcUrl;
    $("f").before(x); // Expect 1 match here

    x = n.pageUrl;
    $("f").before(x); // Expect 1 match here

    x = n.frameUrl;
    $("f").before(x); // Expect 1 match here

    x = n.selectionText;
    $("f").before(x); // Expect 1 match here
    console.log();
});

// case 4
chrome.cookies.getAll({ name: "" }, function bbb(n, a) {
    console.log();
    $("f").before(n.linkUrl); // Expect 1 match here
    $("f").before(n.srcUrl); // Expect 1 match here
    $("f").before(n.pageUrl); // Expect 1 match here
    $("f").before(n.frameUrl); // Expect 1 match here
    $("f").before(n.selectionText); // Expect 1 match here
    console.log();

    let x = n.linkUrl;
    $("f").before(x); // Expect 1 match here

    x = n.srcUrl;
    $("f").before(x); // Expect 1 match here

    x = n.pageUrl;
    $("f").before(x); // Expect 1 match here

    x = n.frameUrl;
    $("f").before(x); // Expect 1 match here

    x = n.selectionText;
    $("f").before(x); // Expect 1 match here
    console.log();

    $(x).before("f");
});
