(() => {
  'use strict'

const square = document.querySelector('.test');
const value = document.querySelector('.val')


const knob = document.querySelector('.knob');
const knobDial = document.querySelector('.knob-dial');
const tickContainer = document.querySelector('.tick-container');

let dialAngle = 160
let lastX = 0;
let currentX = 0;
let initialTickAngle = 0

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
    squareResize()
    value.innerHTML = getCurrentValue();
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
  if (dialAngle <= 447) {
    dialAngle += 6
    knobDial.style.transform = `rotate(${dialAngle}deg)`;
    currentX = x;
  }
}

function rotateLeft(x) {
  if (dialAngle >= 91) {
    dialAngle -= 6
    knobDial.style.transform = `rotate(${dialAngle}deg)`;
    currentX = x;
  }
}

function reset() {
  if (dialAngle <= 90) {
    dialAngle = 90
    currentX = 0
    lastX = 0
    knobDial.style.transform = `rotate(${dialAngle}deg)`;
  } else if (dialAngle >= 450) {
    dialAngle = 450
    currentX = 0
    lastX = 0
    knobDial.style.transform = `rotate(${dialAngle}deg)`;
  }
}

function getCurrentValue() {
  let knobValuePercent = Math.floor((dialAngle - 90) * 124 / 450);
  if (knobValuePercent < 0) {
    knobValuePercent = 0;
  } else if (knobValuePercent >= 98){
    knobValuePercent = 100;
  }
  return knobValuePercent;
}

function makeTicks(numberOfTicksToLight) {
  const numberOfTicksToLight = numberOfTicksToLight / 4.7
  const div = 360 / 20;
  const radius = 40;
  while(tickContainer.firstChild) {
    tickContainer.removeChild(tickContainer.firstChild);
  }
  const offsetToParentCenter = parseInt(tickContainer.offsetWidth / 2);
  const offsetToChildCenter = 3;
  const totalOffset = offsetToParentCenter - offsetToChildCenter;
  for (let i = 0; i < 20; ++i) {
    const tick = document.createElement('div');
    if(i < numberOfTicksToLight){
      tick.className = "tick lit-tick";
    } else {
      tick.className = "tick";
    }
    tick.style.position = 'absolute';
    let y = Math.sin((div * i) * (Math.PI / 180)) * radius;
    let x = Math.cos((div * i) * (Math.PI / 180)) * radius;
    tick.style.top = (y + totalOffset).toString() + "px";
    tick.style.left = (x + totalOffset).toString() + "px";
    tickContainer.appendChild(tick);
    tick.style.transform = "rotate(" + initialTickAngle + "deg)";
    initialTickAngle += 18;
  }
  initialTickAngle = 0
}

makeTicks(getCurrentValue())

function squareResize() {
  const val = (getCurrentValue() / 100) * 17;
  square.style.width = `${val}rem`
  square.style.height = `${val}rem`
}

squareResize()

})();