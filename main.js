const circle = document.getElementById('circle');

// get the knob component html element

const knob = document.getElementById('knob');

// use .value setter to set initial knob value in percents

knob.value = 56;

// use .currentValue getter to get current knob value

console.log(knob.currentValue);

circle.style.left = `${(knob.currentValue /  100) * 100}%`;

// write an event handler

function evt() {
  const val = (knob.currentValue /  100) * 100;
  circle.style.left = `${val}%`;
}

// assign event handler to .knobEventHandler property of knob object

knob.knobEventHandler = evt;

// style your knob

knob.knobSize = 100;
knob.knobColor ='#0b0e12';
knob.knobShadow = '0 0px 3px #242e3b inset';
knob.lightColor = '#c7ffff';
