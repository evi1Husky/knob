'use strict'

const template = document.createElement("template");
template.innerHTML = `
  <style>
    .knob {
    position: relative;
    cursor: pointer;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: black;
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
    width: 25%;
    height: 120%;
    margin-left: 75%;
    border-radius: 5px;
    background: #ac5;
  }
  
  .tick {
    position: absolute;
    width: 7px;
    height: 1.3px;
    background-color: #3b3f48;
    border-radius: 0.8px;
    transform: rotate(0deg);
  }
  
  .lit-tick {
    background-color: #ac5;
  }
  
  .tick-container {
    background: transparent;
    position: absolute;
    transform: rotate(90deg);
    margin-right: 4px;
    margin-bottom: 2.5px;
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
    this.dialRotationRate = 8;

    this.knobDial.style.transform = `rotate(${this.dialAngle}deg)`;
  }
  
  connectedCallback(eventHandler) {
    this.knob.ontouchmove = (event) => {
      this.knobEvent(~~(event.touches[0].clientX));
      this.makeTicks(this.currentValue);
      if(eventHandler) {
        eventHandler()
      }
    }

    this.knob.onmousedown = () => {
      this.knob.style.cursor = 'grabbing';
      window.onmousemove = (event) => {
        this.knobEvent(event.x);
        this.makeTicks(this.currentValue);
        if(eventHandler) {
          eventHandler()
        }
      }
    }

    window.onmouseup = () => {
      this.knob.style.cursor = 'pointer';
      window.onmousemove = null;
    }

    this.makeTicks(this.currentValue);
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
      if (this.dialAngle > this.maxAngle - 8) {
        this.dialRotationRate = 1;
      } else {
        this.dialRotationRate = 8;
      }
      this.dialAngle += this.dialRotationRate;
      this.knobDial.style.transform = `rotate(${this.dialAngle}deg)`;
      this.currentX = x;
    } 
  }

  rotateLeft(x) {
    if (this.dialAngle >= this.minAngle) {
      if (this.dialAngle < this.minAngle + 8) {
        this.dialRotationRate = 1;
      } else {
        this.dialRotationRate = 8;
      }
      this.dialAngle -= this.dialRotationRate;
      this.knobDial.style.transform = `rotate(${this.dialAngle}deg)`;
      this.currentX = x;
    }
  }

  makeTicks(numberOfActiveTicks) {
    while(this.tickContainer.firstChild) {
      this.tickContainer.removeChild(this.tickContainer.firstChild);
    }
    const numberOfTicksToLight = numberOfActiveTicks / 4.7;
    const knob = 360 / 20;
    const radius = 40;
    const offset = this.tickContainer.offsetWidth - 2.5;
    for (let i = 0; i < 20; ++i) {
      const tick = document.createElement('div');
      const y = Math.sin((knob * i) * (Math.PI / 180)) * radius;
      const x = Math.cos((knob * i) * (Math.PI / 180)) * radius;
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
    let knobValuePercent = Math.floor((this.dialAngle - 90) * 124 / 450);
    if (knobValuePercent < 0) {
      knobValuePercent = 0;
    } else if (knobValuePercent >= 98){
      knobValuePercent = 100;
    }
    return knobValuePercent;
  }

  set value(percent) {
    if (percent >= 0 && percent <= 100) {
      this.dialAngle = 
      (((this.maxAngle - this.minAngle) / 100) * percent ) + this.minAngle;
      this.knobDial.style.transform = `rotate(${this.dialAngle}deg)`;
      this.makeTicks(this.currentValue);
    }
  }
}

customElements.define("volume-knob", Knob);
