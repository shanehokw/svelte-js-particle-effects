import Particle from "./Particle";
import { writable } from "svelte/store";

export default class Effect {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.particlesArray = [];
        this.image = document.getElementById("image1");
        this.centerX = this.width * 0.5;
        this.centerY = this.height * 0.5;
        this.x = this.centerX - this.image.width * 0.5;
        this.y = this.centerY - this.image.height * 0.5;
        this.gap = 10; // higher value = better performance but bigger paricle chunk
        this.mouse = {
            radius: writable(1000),
            x: undefined,
            y: undefined,
        };
        this.holding = true;
        // window.addEventListener("mousedown", () => {
        //     this.holding = true;
        // });
        // canvas.addEventListener("touchmove", (event) => {
        //     if (this.holding) {
        //         this.mouse.x = event.touches[0].clientX;
        //         this.mouse.y = event.touches[0].clientY;
        //         console.log(this.mouse.clientX, this.mouse.clientY);
        //     }
        // });

        // window.addEventListener("mouseup", (event) => {
        //     this.holding = false;
        //     this.mouse.x = event.x;
        //     this.mouse.y = event.y;
        // });
    }
    init(context) {
        // step 1: draw image on canvas
        context.drawImage(this.image, this.x, this.y);
        // step 2: analyse canvas for pixel data
        const pixels = context.getImageData(0, 0, this.width, this.height).data;
        // step 3: loop through pixels
        for (let y = 0; y < this.height; y += this.gap) {
            for (let x = 0; x < this.width; x += this.gap) {
                // x4 because each pixel is represented by 4 consecutive values in the unsigned 8 bit clamped array
                const index = (y * this.width + x) * 4;
                const red = pixels[index];
                const green = pixels[index + 1];
                const blue = pixels[index + 2];
                const alpha = pixels[index + 3];
                const color = `rgb(${red}, ${green}, ${blue})`;

                // only if pixel is not transparent
                if (alpha > 0) {
                    this.particlesArray.push(new Particle(this, x, y, color));
                }
            }
        }
    }

    draw(context) {
        this.particlesArray.forEach((particle) => particle.draw(context));
    }

    update() {
        this.particlesArray.forEach((particle) => particle.update());
    }

    warp() {
        this.particlesArray.forEach((particle) => particle.warp());
    }

    parse(value) {
        this.mouse.radius.set(value);
    }
}
