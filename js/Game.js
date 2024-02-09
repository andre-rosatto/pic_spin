import Disc from "./Disc.js";
import { API, DISC_COUNT } from "./utils.js";
export default class Game {
    discs = [];
    constructor() {
        this.createHTML();
        this.startLevel();
        window.addEventListener('resize', () => this.onWindowResize());
    }
    createHTML() {
        const root = document.querySelector('#root');
        root.innerHTML = `
			<style>@import url("../css/Game.css");</style>
			<div id="game">
				<div id="discs-wrapper"></div>
				<div id="next"></div>
			</div>
		`;
        this.onWindowResize();
        document.querySelector('#next').addEventListener('click', () => this.onNextClick());
    }
    startLevel() {
        this.discs = [];
        document.querySelector('#discs-wrapper').innerHTML = '';
        fetch(API)
            .then(res => res.json())
            .then(data => {
            const picURL = data.hits[Math.floor(Math.random() * data.hits.length)].largeImageURL;
            console.log(picURL);
            document.querySelector('#game').style.backgroundImage = `url(${picURL})`;
            for (let i = 0; i < DISC_COUNT; i++) {
                const disc = new Disc(i, picURL, () => this.onDiscRotate());
                this.discs.push(disc);
                setTimeout(() => {
                    disc.shuffle();
                    disc.enable();
                }, 1000);
            }
            this.onWindowResize();
        });
    }
    showNext() {
        const next = document.querySelector('#next');
        next.className = 'show';
    }
    onDiscRotate() {
        if (this.discs.find(disc => !disc.isAligned()))
            return;
        this.discs.forEach(disc => disc.disable());
        setTimeout(() => {
            this.showNext();
        }, 500);
    }
    onNextClick() {
        this.startLevel();
        const next = document.querySelector('#next');
        next.className = 'hide';
        setTimeout(() => next.className = '', 200);
    }
    onWindowResize() {
        const viewportWidth = document.documentElement.clientWidth;
        const game = document.querySelector('#game');
        const size = `${Math.min(viewportWidth * 0.9, 600)}px`;
        game.style.width = size;
        game.style.backgroundSize = `auto ${size}`;
        this.discs.forEach(disc => disc.resize(size));
    }
}
