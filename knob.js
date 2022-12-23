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
