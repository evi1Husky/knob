const circle = document.getElementById('circle');

const main = document.getElementById('main');
// get the knob component html element

const knob = document.getElementById('knob');

// use .value setter to set initial knob value in percents

knob.value = 40

// use .currentValue getter to get current knob value

console.log(knob.currentValue)

// write an event handler

function evt() {
  const val = (knob.currentValue /  100) * 7;
  circle.style.width = `${val}rem`
  circle.style.height = `${val}rem`
}

// assign event handler to .knobEventHandler property of knob object

knob.knobEventHandler = evt;

// style your knob

knob.knobColor ='black';

knob.knobSize = 80;

knob.lightColor = 'cyan';
