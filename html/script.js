// global vars
var winsize;
var squaresize;
var boundaries;

function startup() {
  var el = document.documentElement;
  el.addEventListener("touchstart", handleStart, false);
  el.addEventListener("touchend", handleEnd, false);
  el.addEventListener("touchcancel", handleCancel, false);
  el.addEventListener("touchmove", handleMove, false);
  updatewindowsize()
  window.onresize = updatewindowsize
}
document.addEventListener("DOMContentLoaded", startup);

var ongoingTouches = [];
var lastKeyStateObj = {
  "0": "0",
  "1": "0",
  "2": "0",
  "3": "0",
  "4": "0",
  "5": "0",
  "6": "0",
  "7": "0",
  "8": "0",
  "9": "0",
  A: "0",
  B: "0",
  C: "0",
  D: "0",
  E: "0",
  F: "0",
  G: "0",
  H: "0",
  I: "0",
  J: "0",
  K: "0",
  L: "0",
  M: "0",
  N: "0",
  O: "0"
};
var keytranslationobj = {
  "A1": "0",
  "A2": "1",
  "A3": "2",
  "A4": "3",
  "A5": "4",
  "A6": "5",
  "A7": "6",
  "A8": "7",
  "B1": "8",
  "B2": "9",
  "B3": "A",
  "B4": "B",
  "B5": "C",
  "B6": "D",
  "B7": "E",
  "B8": "F",
  "C": "G",
  "o1": "H",
  "o2": "I",
  "o3": "J",
  "o4": "K",
  "o5": "L",
  "o6": "M",
  "o7": "N",
  "o8": "O"
}

function handleStart(evt) {
  evt.preventDefault();
  //console.log("touchstart.");
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    //console.log("touchstart:" + i + "...");
    //console.log(touches[i].clientX, touches[i].clientY)
    //console.log(resolveTouch(touches[i].clientX, touches[i].clientY))
    ongoingTouches.push(
      copyTouch(
        touches[i],
        resolveTouch(touches[i].clientX, touches[i].clientY)
      )
    );
    //console.log("touchstart:" + i + ".");
  }
  updateKeyStateObject();
}

function handleMove(evt) {
  evt.preventDefault();
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    var idx = ongoingTouchIndexById(touches[i].identifier);

    if (idx >= 0) {
      //console.log(ongoingTouches[idx].clientX, ongoingTouches[idx].clientY)   //old touch
      //console.log(resolveTouch(ongoingTouches[idx].clientX, ongoingTouches[idx].clientY))
      //console.log(touches[i].clientX, touches[i].clientY); //new touch
      //console.log("last resolve", ongoingTouches[idx].key)
      //console.log(resolveTouch(touches[i].clientX, touches[i].clientY))
      ongoingTouches.splice(
        idx,
        1,
        copyTouch(
          touches[i],
          resolveTouch(touches[i].clientX, touches[i].clientY)
        )
      ); // swap in the new touch record
      //console.log(".");
    } else {
      console.log("can't figure out which touch to continue");
    }
  }
  updateKeyStateObject();
}

function handleEnd(evt) {
  evt.preventDefault();
  //console.log("touchend");
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    var idx = ongoingTouchIndexById(touches[i].identifier);
    //console.log(touches[i].clientX, touches[i].clientY) //end point
    //console.log(resolveTouch(touches[i].clientX, touches[i].clientY))
    if (idx >= 0) {
      ongoingTouches.splice(idx, 1); // remove it; we're done
    } else {
      console.log("can't figure out which touch to end");
    }
  }
  updateKeyStateObject();
}

function handleCancel(evt) {
  evt.preventDefault();
  //console.log("touchcancel.");
  var touches = evt.changedTouches;
  for (var i = 0; i < touches.length; i++) {
    //console.log(touches[i].clientX, touches[i].clientY) //cancel point
    //console.log(resolveTouch(touches[i].clientX, touches[i].clientY))
    var idx = ongoingTouchIndexById(touches[i].identifier);
    ongoingTouches.splice(idx, 1); // remove it; we're done
  }
  updateKeyStateObject();
}

function copyTouch({ identifier, clientX, clientY }, key) {
  return { identifier, clientX, clientY, key };
}

function ongoingTouchIndexById(idToFind) {
  for (var i = 0; i < ongoingTouches.length; i++) {
    var id = ongoingTouches[i].identifier;

    if (id == idToFind) {
      return i;
    }
  }
  return -1; // not found
}

function getWindowSize() {
  var thiswindow = {
    height: -1,
    width: -1
  };
  if (
    "standalone" in window.navigator && // Check if "standalone" property exists
    !window.navigator.standalone // Test if using standalone navigator
  ) {
    thiswindow.height = window.screen.height;
    thiswindow.width = window.screen.width;
  } else {
    thiswindow.height = window.innerHeight;
    thiswindow.width = window.innerWidth;
  }
  return thiswindow;
}

function generateBoundaries() {
  var thiswindow = getWindowSize();
  //return a specialised object
  var boundryObject = {
    vert: {
      //px from top
      vBoundry0: thiswindow.height/2,
    },
    hori: {
      //px from left
      hBoundry0: thiswindow.width/2,
    }
  };
  return boundryObject;
}

function resolveTouch(x, y) {
  //return key x,y resolves to
  //resolve air or key
  //console.log("resolvetouch:",x,y,y < boundaries.vert.airBoundry)
  var centered = {
    x: x-boundaries.hori.hBoundry0,
    y: boundaries.vert.vBoundry0-y,
  }
  switch (true) {
    case y < boundaries.vert.vBoundry0:
        switch (true) {
          case x < boundaries.hori.hBoundry0:
            //top left
              if(centered.x*-1 > centered.y){
                return resolveKey(centered.x, centered.y, "7")
              }else{
                return resolveKey(centered.x, centered.y, "8")
              }
          default:
            //top right
            if(centered.x > centered.y){
              return resolveKey(centered.x, centered.y, "2")
            }else{
              return resolveKey(centered.x, centered.y, "1")
            }
        }
      break
    default:
      switch (true) {
        case x < boundaries.hori.hBoundry0:
            //bottom left
            if(centered.x > centered.y){
              return resolveKey(centered.x, centered.y, "5")
            }else{
              return resolveKey(centered.x, centered.y, "6")
            }
        default:
            //bottom right
            if(centered.x*-1 > centered.y){
              return resolveKey(centered.x, centered.y, "4")
            }else{
              return resolveKey(centered.x, centered.y, "3")
            }
      }
  }
}

function updateKeyStateObject() {
  var newKeyStateObj = {
    "0": "0",
    "1": "0",
    "2": "0",
    "3": "0",
    "4": "0",
    "5": "0",
    "6": "0",
    "7": "0",
    "8": "0",
    "9": "0",
    A: "0",
    B: "0",
    C: "0",
    D: "0",
    E: "0",
    F: "0",
    G: "0",
    H: "0",
    I: "0",
    J: "0",
    K: "0",
    L: "0",
    M: "0",
    N: "0",
    O: "0"
  };

  for (const element of ongoingTouches) {
    newKeyStateObj[element.key] = "1";
  }

  for (const property in newKeyStateObj) {
    if (newKeyStateObj[property] != lastKeyStateObj[property]) {
      switch (newKeyStateObj[property]) {
        case "1":
          //newKeydown.push(property);
          btdown(property);
          activeBt(property);
          console.log("\\/" + property);
          break;
        case "0":
          //newKeyup.push(property);
          btup(property);
          inactiveBt(property);
          console.log("/\\" + property);
          break;
        default:
          console.log("Error at updateKeyStateObject():1");
      }
    }
  }

  lastKeyStateObj = newKeyStateObj;
}

function resolveKey(x, y, segment) {
  var distance = Math.hypot(x, y);
  var radius = squaresize/2;
  var percentage = distance/radius*100;
  //c - 20%
  //b - 50%
  //a - 90%
  //o - 100%
  switch (true){
    case percentage<20:
      return keytranslationobj["C"]
    case percentage<50:
      return keytranslationobj["B" + segment]
    case percentage<90:
      return keytranslationobj["A" + segment]
    default:
      return keytranslationobj["o" + segment]
  }
}

function updatewindowsize(){
  winsize = getWindowSize()
  switch(winsize.height>winsize.width){
    case true:
        squaresize = winsize.width
      break
    case false:
        squaresize = winsize.height
      break
  }
  document.getElementById("bigsquare").style.height = squaresize + "px";
  document.getElementById("bigsquare").style.width = squaresize + "px";
  boundaries = generateBoundaries();
}

async function activeBt(key) {
  document.getElementById(key).classList.add("active");
  console.log("ac");
}

async function inactiveBt(key) {
  document.getElementById(key).classList.remove("active");
  console.log("in");
}
