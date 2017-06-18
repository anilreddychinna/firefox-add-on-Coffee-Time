/*
Open a new tab, and load "my-page.html" into it.
*/
document.body.style.border = "1px solid green";
console.log("backgroun");

function openMyPage() {
  console.log("injecting");
   browser.tabs.create({
     "url": "Templates/index.html"
   });
}


/*
Add openMyPage() as a listener to clicks on the browser action.
*/
browser.browserAction.onClicked.addListener(openMyPage);