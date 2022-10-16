// each particle will be a pixel in the image
// break the image into individual pieces, at the same time
// these particles will react to mouse in a dynamic way with friction and physics
export default class Particle {
    constructor(effect, x, y, color) {
        this.effect = effect; // does not create a copy, just a reference to the memory of Effect class

        // determines initial position of particles
        this.x = Math.random() * this.effect.width; // spread particles around canvas at initial page load
        this.y = Math.random() * this.effect.height;

        // original coordinate of pixel before starting to move
        // round down so anti-aliasing isnt needed, improves performance
        this.originX = Math.floor(x);
        this.originY = Math.floor(y);
        this.color = color;

        this.size = this.effect.gap; // each particle rectangle will be size x size pixels

        // random value between -1 and +1
        // this.velocityX = Math.random() * 2 - 1;
        // this.velocityY = Math.random() * 2 - 1;

        this.velocityX = 0;
        this.velocityY = 0;

        this.distanceX = 0;
        this.distanceY = 0;
        this.distance = 0;
        this.force = 0;
        this.angle = 0;
        this.friction = 0.7; // higher value = less friction, particles get pushed further

        this.ease = 0.05; // controls speed particles return to origin
    }

    draw(context) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.size, this.size);
    }

    update() {
        this.distanceX = this.effect.mouse.x - this.x;
        this.distanceY = this.effect.mouse.y - this.y;

        // not using Math.sqrt for pythagoran distance because its an expensive operation,
        // instead just set mouse radius to large value
        this.distance =
            this.distanceX * this.distanceX + this.distanceY * this.distanceY;

        // force pushing particles = mouse radius:distance of the particle to that mouse cursor
        this.force = -this.effect.mouse.radius / this.distance;

        if (this.distance < this.effect.mouse.radius) {
            this.angle = Math.atan2(this.distanceY, this.distanceX);
            this.velocityX += this.force * Math.cos(this.angle);
            this.velocityY += this.force * Math.sin(this.angle);
        }

        // *= lets the particles return to original position
        this.x +=
            (this.velocityX *= this.friction) +
            (this.originX - this.x) * this.ease;
        this.y +=
            (this.velocityY *= this.friction) +
            (this.originY - this.y) * this.ease;
    }

    warp() {
        this.x = Math.random() * this.effect.width;
        this.y = Math.random() * this.effect.height;
        // this.ease = Math.random() * (0.05 - 0.01) + 0.01; // random number between 0.01 to 0.05
    }
}
