import { DISC_COUNT, ROTATION_LEVELS } from "./utils.js";
export default class Disc {
    tier;
    onRotate;
    rotation = 0;
    constructor(tier, picURL, onRotate) {
        this.tier = tier;
        this.onRotate = onRotate;
        this.createHTML(picURL);
    }
    createHTML(picURL) {
        const root = document.querySelector('#discs-wrapper');
        root.innerHTML += `
			<style>@import url("../css/Disc.css");</style>
			<div class="disc" id="disc${this.tier}">
				<div class="hilite"></div>
			</div>
		`;
        const disc = root.querySelector(`#disc${this.tier}`);
        disc.style.backgroundImage = `url(${picURL})`;
    }
    setRotation(value) {
        this.rotation = value;
        this.getDiscEl().style.transform = `rotate(${360 / ROTATION_LEVELS * this.rotation}deg)`;
        this.onRotate();
    }
    getDiscEl() {
        return document.querySelector(`#disc${this.tier}`);
    }
    shuffle() {
        this.setRotation(Math.floor(Math.random() * ROTATION_LEVELS * 4 - ROTATION_LEVELS * 2));
    }
    resize(size) {
        const disc = this.getDiscEl();
        const offset = 100 / DISC_COUNT;
        disc.style.width = `${100 - this.tier * offset}%`;
        disc.style.left = disc.style.top = `${this.tier * offset / 2}%`;
        disc.style.backgroundSize = `auto ${size}`;
    }
    enable() {
        const disc = this.getDiscEl();
        disc.addEventListener('click', (e) => this.onClick(e));
        disc.classList.add('enabled');
    }
    disable() {
        const disc = this.getDiscEl();
        disc.classList.remove('enabled');
        disc.classList.add('complete');
    }
    isAligned() {
        return this.rotation % ROTATION_LEVELS === 0 && this.getDiscEl().classList.contains('enabled');
    }
    onClick(e) {
        const parent = this.getDiscEl().offsetParent;
        const midPoint = parent.offsetLeft + parent.offsetWidth / 2;
        const inc = e.clientX > midPoint ? 1 : -1;
        this.setRotation(this.rotation + inc);
    }
}
