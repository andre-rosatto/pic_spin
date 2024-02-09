import { DISC_COUNT, ROTATION_LEVELS } from "./utils.js";

export default class Disc {
	private rotation = 0;

	constructor(private tier: number, picURL: string, private onRotate: () => void) {
		this.createHTML(picURL);
	}

	createHTML(picURL: string) {
		const root = document.querySelector('#discs-wrapper') as HTMLDivElement;
		root.innerHTML += `
			<style>@import url("../css/Disc.css");</style>
			<div class="disc" id="disc${this.tier}">
				<div class="hilite"></div>
			</div>
		`;
		const disc = root.querySelector(`#disc${this.tier}`) as HTMLDivElement;
		disc.style.backgroundImage = `url(${picURL})`;
	}

	setRotation(value: number) {
		this.rotation = value;
		this.getDiscEl().style.transform = `rotate(${360 / ROTATION_LEVELS * this.rotation}deg)`;
		this.onRotate();
	}

	getDiscEl(): HTMLDivElement {
		return document.querySelector(`#disc${this.tier}`) as HTMLDivElement;
	}

	shuffle() {
		this.setRotation(Math.floor(Math.random() * ROTATION_LEVELS * 4 - ROTATION_LEVELS * 2));
	}

	resize(size: string) {
		const disc = this.getDiscEl();
		const offset = 100 / DISC_COUNT;
		disc.style.width = `${100 - this.tier * offset}%`;
		disc.style.left = disc.style.top = `${this.tier * offset / 2}%`;
		disc.style.backgroundSize = `auto ${size}`;
	}

	enable() {
		const disc = this.getDiscEl();
		disc.addEventListener('click', (e: MouseEvent) => this.onClick(e));
		disc.classList.add('enabled');
	}

	disable() {
		const disc = this.getDiscEl();
		disc.classList.remove('enabled');
		disc.classList.add('complete');
	}

	isAligned(): boolean {
		return this.rotation % ROTATION_LEVELS === 0 && this.getDiscEl().classList.contains('enabled');
	}

	onClick(e: MouseEvent) {
		const parent = this.getDiscEl().offsetParent as HTMLDivElement;
		const midPoint = parent.offsetLeft + parent.offsetWidth / 2;
		const inc = e.clientX > midPoint ? 1 : -1;
		this.setRotation(this.rotation + inc);
	}
}