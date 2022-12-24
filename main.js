const knob = document.getElementById('knob');
const circle = document.getElementById('circle');

knob.value = 100


function evt() {
  let val = (knob.currentValue /  100) * 7;
  circle.style.width = `${val}rem`
  circle.style.height = `${val}rem`
}

knob.connectedCallback(evt)

