'use strict'

const template = document.createElement("template");

template.innerHTML = `
  <style>
    :host {
    --knobColor: black;
    --width: 60px;
    --height: 60px;
    --dialColor: green;
    --dialHeight: 120%;
    --tickColor: green;
    --tickLength: 7px;
    --tickWidth: 1.3px;
    --ticksMarginBottom: 3px;
    }

    .knob {
    position: relative;
    cursor: pointer;
    width: var(--width);
    height: var(--height);
    border-radius: 50%;
    background-color: var(--knobColor);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .knob-dial {
    width: 100%;
    height: 3px;
    background: transparent;
    border-radius: 5px;
    transform: rotate(0deg);
  }
  
  .dial {
    position: absolute;
    width: 20%;
    height: var(--dialHeight);
    margin-left: 80%;
    border-radius: 100px;
    background: var(--dialColor);
  }
  
  .tick {
    position: absolute;
    width: var(--tickLength);
    height: var(--tickWidth);
    background-color: #3b3f48;
    border-radius: 10px;
    transform: rotate(0deg);
  }
  
  .lit-tick {
    background-color: var(--tickColor);
  }
  
  .tick-container {
    background: transparent;
    position: absolute;
    transform: rotate(90deg);
    margin-right: 4px;
    margin-bottom: var(--ticksMarginBottom);
  }
  </style>
  <div class="knob">
    <div class="knob-dial">
      <div class="dial"></div>
    </div>
    <div class="tick-container"></div>
  </div>
`;

class Knob extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.knob = this.shadow.querySelector('.knob');
    this.knobDial = this.shadow.querySelector('.knob-dial');
    this.tickContainer = this.shadow.querySelector('.tick-container');
  
    this.dialAngle = 160
    this.lastX = 0;
    this.currentX = 0;
    this.initialTickAngle = 0;
    this.minAngle = 90;
    this.maxAngle = 450;
    this.dialRotationRate = 7;
    this.knobEventHandler = null;
    this.ticksRadius = 45

    this.knobDial.style.transform = `rotate(${this.dialAngle}deg)`;
  }
  
  connectedCallback() {
    this.knob.ontouchmove = (event) => {
      this.knobEvent(~~(event.touches[0].clientX));
      this.makeTicks(this.currentValue);
      if(this.knobEventHandler) {
        this.knobEventHandler()
      }
    }

    this.knob.onmousedown = () => {
      this.knob.style.cursor = 'grabbing';
      window.onmousemove = (event) => {
        this.knobEvent(event.x);
        this.makeTicks(this.currentValue, this.ticksRadius);
        if(this.knobEventHandler) {
          this.knobEventHandler()
        }
      }
    }

    window.onmouseup = () => {
      this.knob.style.cursor = 'pointer';
      window.onmousemove = null;
    }

    this.makeTicks(this.currentValue, this.ticksRadius);
  }

  knobEvent(x) {
    this.lastX = x
    if (this.lastX > this.currentX) {
      this.rotateRight(x)
    } else if (this.lastX < this.currentX){
      this.rotateLeft(x)
    }
  }

  rotateRight(x) {
    if (this.dialAngle <= this.maxAngle) {
      if (this.dialAngle > this.maxAngle - 7) {
        this.dialRotationRate = 1;
      } else {
        this.dialRotationRate = 7;
      }
      this.dialAngle += this.dialRotationRate;
      this.knobDial.style.transform = `rotate(${this.dialAngle}deg)`;
      this.currentX = x;
    } 
  }

  rotateLeft(x) {
    if (this.dialAngle >= this.minAngle) {
      if (this.dialAngle < this.minAngle + 7) {
        this.dialRotationRate = 1;
      } else {
        this.dialRotationRate = 7;
      }
      this.dialAngle -= this.dialRotationRate;
      this.knobDial.style.transform = `rotate(${this.dialAngle}deg)`;
      this.currentX = x;
    }
  }

  makeTicks(numberOfActiveTicks, ticksRadius) {
    while(this.tickContainer.firstChild) {
      this.tickContainer.removeChild(this.tickContainer.firstChild);
    }
    const numberOfTicksToLight = numberOfActiveTicks / 4.8;
    const knob = 360 / 20;
    const offset = this.tickContainer.offsetWidth - 2.5;
    for (let i = 0; i < 20; ++i) {
      const tick = document.createElement('div');
      const y = Math.sin((knob * i) * (Math.PI / 180)) * ticksRadius;
      const x = Math.cos((knob * i) * (Math.PI / 180)) * ticksRadius;
      tick.style.top = `${y + offset}px`;
      tick.style.left = `${x + offset}px`;
      this.tickContainer.appendChild(tick);
      if (i < numberOfTicksToLight) {
        tick.className = "tick lit-tick";
      } else {
        tick.className = "tick";
      }
      tick.style.transform = `rotate(${this.initialTickAngle}deg)`;
      this.initialTickAngle += 18;
    }
    this.initialTickAngle = 0;
  }

  get currentValue() {
    let knobValuePercent = Math.floor((this.dialAngle - 90) * 125 / 450);
    if (knobValuePercent < 0) {
      knobValuePercent = 0;
    } else if (knobValuePercent >= 99){
      knobValuePercent = 100;
    }
    return knobValuePercent;
  }

  set value(percent) {
    if (percent >= 0 && percent <= 100) {
      this.dialAngle = 
      (((this.maxAngle - this.minAngle) / 99) * percent ) + this.minAngle;
      this.knobDial.style.transform = `rotate(${this.dialAngle}deg)`;
      this.makeTicks(this.currentValue, this.ticksRadius);
    }
    if (percent === 100) {
      this.dialAngle = this.maxAngle - 1
      this.knobDial.style.transform = `rotate(${this.maxAngle - 1}deg)`;
    }
  }

  set knobColor(value) {
    this.style.setProperty('--knobColor', value); 
  }

  set knobSize(value) {
    this.style.setProperty('--width', `${value}px`);
    this.style.setProperty('--height',`${value}px`);
    this.style.setProperty('--dialHeight',`${value + 30}%`);
    this.ticksRadius = value / 1.6;
    this.style.setProperty('--tickLength', `${value / 10}px`);
    this.style.setProperty('--tickWidth', `${value / 50}px`);
    if (value > 90) {
      this.style.setProperty('--ticksMarginBottom', `${value / 20}px`);
    } else if (value < 90 && value > 60){
      this.style.setProperty('--ticksMarginBottom', `${value / 50}px`);
    } else if (value < 61) {
      this.style.setProperty('--ticksMarginBottom', `${-value / 40}px`);
    }
    this.makeTicks(this.currentValue, this.ticksRadius);
  }

  set lightColor(value) {
    this.style.setProperty('--dialColor', value);
    this.style.setProperty('--tickColor', value);
  }
}

customElements.define("volume-knob", Knob);
