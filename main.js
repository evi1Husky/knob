const knob = document.getElementById('knob');
const circle = document.getElementById('circle');

knob.value = 20


function evt() {
  let val = knob.currentValue;
  circle.style.width = `${val}rem`
  circle.style.height = `${val}rem`
}

knob.connectedCallback(evt)