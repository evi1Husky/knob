const circle = document.getElementById('circle');

// get the volume knob component

const knob = document.getElementById('knob');

// use .value setter to set initial knob value in percents

knob.value = 40

// use .currentValue getter to get current knob value

console.log(knob.currentValue)

// write an event handler

function evt() {
  let val = (knob.currentValue /  100) * 7;
  circle.style.width = `${val}rem`
  circle.style.height = `${val}rem`
}

// pass event handler to the knob element through connectedCallback() method

knob.connectedCallback(evt)

