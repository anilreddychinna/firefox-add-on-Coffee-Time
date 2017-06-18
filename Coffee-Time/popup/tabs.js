/*
Given the name of a beast, get the URL to the corresponding image.
*/
function beastNameToURL(beastName) {
  switch (beastName) {
    case "Frog":
      return browser.extension.getURL("beasts/frog.jpg");
    case "Snake":
      return browser.extension.getURL("beasts/snake.jpg");
    case "Turtle":
      return browser.extension.getURL("beasts/turtle.jpg");
    case "Game":
      return browser.extension.getURL("Templates/App/index.html");
  }
}





function myFunction() {
  alert("hiiii");
  function openMyPage() {
  console.log("injecting");
   browser.tabs.create({
     "url": "Templates/index.html"
   });
}

browser.browserAction.onClicked.addListener(openMyPage);

  /*  document.getElementById("demo").innerHTML = "Hello World"; 
    browser.extension.getURL("Templates/App/index.html"); */
}

function popupconfoms() {
    var txt;
    if (confirm("Press a button!") == true) {
        txt = "You pressed OK!";
    } else {
        txt = "You pressed Cancel!";
    }
    alert(txt);
}


document.addEventListener("click", (e) => {
  if (e.target.classList.contains("beast")) {
    var chosenBeast = e.target.textContent;
    var chosenBeastURL = beastNameToURL(chosenBeast);

    browser.tabs.executeScript(null, {
      file: "/content_scripts/beastify.js"
    });

    var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
    gettingActiveTab.then((tabs) => {
      browser.tabs.sendMessage(tabs[0].id, {beastURL: chosenBeastURL});
    });
  }
  else if (e.target.classList.contains("clear")) {
    browser.tabs.reload();
    window.close();

    return;
  }
});

//------------------
// Zoom constants. Define Max, Min, increment and default values
const ZOOM_INCREMENT = 0.2;
const MAX_ZOOM = 3;
const MIN_ZOOM = 0.3;
const DEFAULT_ZOOM = 1;

function firstUnpinnedTab(tabs) {
  for (var tab of tabs) {
    if (!tab.pinned) {
      return tab.index;
    }
  }
}

/**
 * listTabs to switch to
 */
function listTabs() {
  getCurrentWindowTabs().then((tabs) => {
    let tabsList = document.getElementById('tabs-list');
    let currentTabs = document.createDocumentFragment();
    let limit = 5;
    let counter = 0;

    tabsList.textContent = '';

    for (let tab of tabs) {
      if (!tab.active && counter <= limit) {
        let tabLink = document.createElement('a');

        tabLink.textContent = tab.title || tab.id;
        tabLink.setAttribute('href', tab.id);
        tabLink.classList.add('switch-tabs');
        currentTabs.appendChild(tabLink);
      }

      counter += 1;
    }

    tabsList.appendChild(currentTabs);
  });
}

document.addEventListener("DOMContentLoaded", listTabs);

function getCurrentWindowTabs() {
  return browser.tabs.query({currentWindow: true});
}

document.addEventListener("click", function(e) {
  function callOnActiveTab(callback) {
    getCurrentWindowTabs().then((tabs) => {
      for (var tab of tabs) {
        if (tab.active) {
          callback(tab, tabs);
        }
      }
    });
}

  if (e.target.id === "tabs-move-beginning") {
    callOnActiveTab((tab, tabs) => {
      var index = 0;
      if (!tab.pinned) {
        index = firstUnpinnedTab(tabs);
      }
      console.log(`moving ${tab.id} to ${index}`)
      browser.tabs.move([tab.id], {index});
    });
  }

  if (e.target.id === "tabs-move-end") {
    callOnActiveTab((tab, tabs) => {
      var index = -1;
      if (tab.pinned) {
        var lastPinnedTab = Math.max(0, firstUnpinnedTab(tabs) - 1);
        index = lastPinnedTab;
      }
      browser.tabs.move([tab.id], {index});
    });
  }

  else if (e.target.id === "tabs-game") {
    callOnActiveTab((tab) => {
      browser.tabs.create({
  /* url:"/Templates/index.html" */
    url:"http://plnkr.co/edit/EiCEe4Aw7QWuFoHB305P?p=preview"
    });

    });
  }
  else if (e.target.id === "tabs-youtube") {
    callOnActiveTab((tab) => {
      browser.tabs.create({
    url:"https://www.youtube.com/"
    });

    });
  }
  else if (e.target.id === "tabs-facebook") {
    function popupconfoms() {
    var txt;
    if (confirm("Press a button!") == true) {
        txt = "You pressed OK!";
    } else {
        txt = "You pressed Cancel!";
    }
    alert(txt);
}

    callOnActiveTab((tab) => {
      browser.tabs.create({
    url:"https://www.facebook.com/"
    });

    });
  }

  else if (e.target.id === "tabs-remove") {
    callOnActiveTab((tab) => {
      browser.tabs.remove(tab.id);
    });
  }
  else if (e.target.id === "tabs-1") {
    browser.tabs.create({url: "https://www.google.co.in"});
    browser.extension.getURL("Templates/App/index.html");
  }
  else if (e.target.id === "tabs-create") {
    browser.tabs.create({url: "https://developer.mozilla.org/en-US/Add-ons/WebExtensions"});
  }

  else if (e.target.id === "tabs-alertinfo") {
  //this for open webpage
    
    function openMyPage() {
  console.log("injecting");
  //this is for open url in new tab
   browser.tabs.create({
     "url": "www.mozilla.com"
   });
   }


    callOnActiveTab((tab) => {
      let props = "anil";
      for (let item in tab) {
        props += `${ item } = ${ tab[item] } \n`;
      }
      alert(props);

    });
  } 
  else if (e.target.id === "tabs-alertinfo1") {
    console.log(" alert tab clicked");
    callOnActiveTab((tab) => {
      let props1 = "anil";
    /*  for (let item in tab) {
        props += `${ item } = ${ tab[item] } \n`;
      } */
      alert(props);
      
    });
  }

  else if (e.target.id === "tabs-add-zoom") {
    callOnActiveTab((tab) => {
      var gettingZoom = browser.tabs.getZoom(tab.id);
      gettingZoom.then((zoomFactor) => {
        //the maximum zoomFactor is 3, it can't go higher
        if (zoomFactor >= MAX_ZOOM) {
          alert("Tab zoom factor is already at max!");
        } else {
          var newZoomFactor = zoomFactor + ZOOM_INCREMENT;
          //if the newZoomFactor is set to higher than the max accepted
          //it won't change, and will never alert that it's at maximum
          newZoomFactor = newZoomFactor > MAX_ZOOM ? MAX_ZOOM : newZoomFactor;
          browser.tabs.setZoom(tab.id, newZoomFactor);
        }
      });
    });
  }

  else if (e.target.id === "tabs-decrease-zoom") {
    callOnActiveTab((tab) => {
      var gettingZoom = browser.tabs.getZoom(tab.id);
      gettingZoom.then((zoomFactor) => {
        //the minimum zoomFactor is 0.3, it can't go lower
        if (zoomFactor <= MIN_ZOOM) {
          alert("Tab zoom factor is already at minimum!");
        } else {
          var newZoomFactor = zoomFactor - ZOOM_INCREMENT;
          //if the newZoomFactor is set to lower than the min accepted
          //it won't change, and will never alert that it's at minimum
          newZoomFactor = newZoomFactor < MIN_ZOOM ? MIN_ZOOM : newZoomFactor;
          browser.tabs.setZoom(tab.id, newZoomFactor);
        }
      });
    });
  }

  else if (e.target.id === "tabs-default-zoom") {
    callOnActiveTab((tab) => {
      var gettingZoom = browser.tabs.getZoom(tab.id);
      gettingZoom.then((zoomFactor) => {
        if (zoomFactor == DEFAULT_ZOOM) {
          alert("Tab zoom is already at the default zoom factor");
        } else {
          browser.tabs.setZoom(tab.id, DEFAULT_ZOOM);
        }
      });
    });
  }
  // Currently (11/2/2016) only supported by Chrome
  else if (e.target.id === "tabs-highlight") { // highlights current tab and next tab (cycles back to first tab if current tab is the last one)
    callOnActiveTab((tab, tabs) => {
      next = (tab.index+1) % tabs.length;
      browser.tabs.highlight({tabs:[tab.index, next]});
    });
  }

  else if (e.target.classList.contains('switch-tabs')) {
    var tabId = +e.target.getAttribute('href');

    chrome.tabs.query({
      currentWindow: true
    }, function(tabs) {
      for (var tab of tabs) {
        if (tab.id === tabId) {
          chrome.tabs.update(tabId, {
              active: true
          });
        }
      }
    });
  }

  e.preventDefault();
});

//onRemoved listener. fired when tab is removed
browser.tabs.onRemoved.addListener(function(tabId, removeInfo){
  console.log(`The tab with id: ${tabId}, is closing`);

  if(removeInfo.isWindowClosing) {
    console.log(`Its window is also closing.`);
  } else {
    console.log(`Its window is not closing`);
  }
});

//onMoved listener. fired when tab is moved into the same window
browser.tabs.onMoved.addListener(function(tabId, moveInfo){
  var startIndex = moveInfo.fromIndex;
  var endIndex = moveInfo.toIndex;
  console.log(`Tab with id: ${tabId} moved from index: ${startIndex} to index: ${endIndex}`);
});

//------------------------------
