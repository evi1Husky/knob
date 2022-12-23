const knob = document.querySelector('.knob');
const knobDial = document.querySelector('.knob-dial');
const value = document.getElementById('value');

let dialAngle = 180
let lastX = 0;
let currentX = 0;

knobDial.style.transform = `rotate(${dialAngle}deg)`;
value.innerHTML = getCurrentValue();

knob.ontouchmove = (event) => {
  knobEvent(~~(event.touches[0].clientX));
}

knob.onmousedown = () => {
  knob.style.cursor = 'grabbing';
  window.onmousemove = (event) => {
    knobEvent(event.x);
    makeTicks(getCurrentValue())
    setTimeout(() => {
      value.innerHTML = getCurrentValue();
    }, 50);
  }
}

window.onmouseup = () => {
  knob.style.cursor = 'pointer';
  window.onmousemove = null;
}

function knobEvent(x) {
  lastX = x
  if (lastX > currentX) {
    rotateRight(x)
  } else if (lastX < currentX){
    rotateLeft(x)
  }
}

function rotateRight(x) {
  if (dialAngle <= 450) {
    dialAngle += 7
    knobDial.style.transform = `rotate(${dialAngle}deg)`;
    currentX = x;
  }
}

function rotateLeft(x) {
  if (dialAngle >= 90) {
    dialAngle -= 7
    knobDial.style.transform = `rotate(${dialAngle}deg)`;
    currentX = x;
  }
}

function reset() {
  if (dialAngle < 90) {
    dialAngle = 90
    currentX = 0
    lastX = 0
    knobDial.style.transform = `rotate(${dialAngle}deg)`;
  } else if (dialAngle > 450) {
    dialAngle = 450
    currentX = 0
    lastX = 0
    knobDial.style.transform = `rotate(${dialAngle}deg)`;
  }
}

function getCurrentValue() {
  let knobValuePercent = ~~((dialAngle - 90) * 124 / 450);
  if (knobValuePercent === -1) {
    knobValuePercent = 0;
  }
  return knobValuePercent;
}

const tickContainer = document.querySelector('.ticks');

function makeTicks(val) {
  let highlightNumTicks = val / 4.7
  let div = 360 / 20;
  let radius = 45;
  while(tickContainer.firstChild) {
    tickContainer.removeChild(tickContainer.firstChild);
  }
  let offsetToParentCenter = parseInt(tickContainer.offsetWidth / 2);
  let offsetToChildCenter = 3;
  let totalOffset = offsetToParentCenter - offsetToChildCenter;
  for (let i = 0; i < 20; ++i) {
    var childdiv = document.createElement('div');
    if(i < highlightNumTicks){
      childdiv.className = "tick activetick";
    } else {
      childdiv.className = "tick";
    }
    childdiv.style.position = 'absolute';
    let y = Math.sin((div * i) * (Math.PI / 180)) * radius;
    let x = Math.cos((div * i) * (Math.PI / 180)) * radius;
    childdiv.style.top = (y + totalOffset).toString() + "px";
    childdiv.style.left = (x + totalOffset).toString() + "px";
    tickContainer.appendChild(childdiv);
    childdiv.style.transform = "rotate(" + startingTickAngle + "deg)";
    startingTickAngle += 18;
  }
  startingTickAngle = 0
}
let startingTickAngle = 0
makeTicks(getCurrentValue())