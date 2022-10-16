<script>
	import {
		Button,
		Modal,
		ModalBody,
		ModalFooter,
		ModalHeader,
		Icon,
		Spinner
	} from 'sveltestrap';
	import Slider from '@smui/slider';
	// import Effect from './Effect'

	let mouseRadius = 5000;
	let pixelSize = 10;
	let ease = 0.05;
	let friction = 0.7;

	let open = false;
	const toggle = () => {
		open = !open;
	}

	let effect;
	let handleSave;

	window.addEventListener("load", function() {
		// document.getElementById("loading").style.display = "none";

		const canvas = document.getElementById("canvas1");
		const ctx = canvas.getContext("2d");
		const image = document.getElementById("image1");
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		// step 1: draw image on canvas
		ctx.drawImage(image, (canvas.width * 0.5) - (image.width * 0.5), (canvas.height * 0.5) - (image.height * 0.5));
		// step 2: analyse canvas for pixel data
		const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

		// each particle will be a pixel in the image
		// break the image into individual pieces, at the same time
		// these particles will react to mouse in a dynamic way with friction and physics
		class Particle {
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
				this.friction = friction; // higher value = less friction, particles get pushed further
	
				this.ease = ease; // controls speed particles return to origin
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

		class Effect {
			constructor(width, height) {
				this.width = width;
				this.height = height;
				this.particlesArray = [];
				// this.image = image;
				this.centerX = this.width * 0.5;
				this.centerY = this.height * 0.5;
				this.x = this.centerX - image.width * 0.5;
				this.y = this.centerY - image.height * 0.5;
				this.gap = pixelSize; // higher value = better performance but bigger paricle chunk
				this.mouse = {
					radius: mouseRadius,
					x: undefined,
					y: undefined,
				};
				
				canvas.addEventListener("touchmove", (event) => {
					this.mouse.x = event.touches[0].clientX;
					this.mouse.y = event.touches[0].clientY;
				});

				canvas.addEventListener("mousemove", (event) => {
					this.mouse.x = event.x;
					this.mouse.y = event.y;
				});
	
				// window.addEventListener("mouseup", (event) => {
				// 	this.holding = false;
				// 	this.mouse.x = event.x;
				// 	this.mouse.y = event.y;
				// });
			}
			init(context) {
				// // step 1: draw image on canvas
				// context.drawImage(image, this.x, this.y);
				// // step 2: analyse canvas for pixel data
				// const pixels = context.getImageData(0, 0, this.width, this.height).data;
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
		}
	
		function createEffect() {
			if (effect) {
				effect = null;
			}
			effect = new Effect(canvas.width, canvas.height);
			effect.init(ctx);
		}
	
		function animate() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			effect.draw(ctx);
			effect.update();
			requestAnimationFrame(animate);
		}
	
		createEffect();
		animate();
		
		handleSave = () => {
			createEffect();
			toggle();
		}
	})
</script>

<svelte:head>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css">
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css">
	<script src="https://cdn.jsdelivr.net/npm/pace-js@latest/pace.min.js"></script>
	<!-- <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/svelte-material-ui@6.0.0/bare.min.css" /> -->
	<!-- SMUI Styles -->
	<!-- <link rel="stylesheet" href="./public/build/smui.css" /> -->
</svelte:head>
<main>
	<canvas id="canvas1"></canvas>
	<img
		id="image1"
		alt="canvas"
		src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAABmVSURBVHgB7d0LlBxllQfw+/VMd00SYhIDQgQTHrKi7IKLmKigxKghoBhdJKgYEFBYFGVdYXE5IHhkj4sERUFAEFDBRYL4IKKSRTmgwAIRQdkAGiAJcROJJGQTZqa7Z/ru/3ZPb5rOTNJdXe/+/86p6ZpHdfd01b31Paq+T4SIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIhC5oRERcbL+PGTZGhoquRyu0qlMkVUd8Kv8lL7jPAnUhHnBrFswt+sx+/XYZuNsmHDZlf7PUUMH3pOJk9+mQwOTsF+sf02FftlMpY+sd9t3Xcl/P5F7LeN+Jt1ks//VWbM2OiWLy9Jl+u6BKB9fTNkeHg2Dob9caDshh+9FgfHNKxPxWNfO0+FbTZhm79g/U9YVlQfK5VlUi4/ig+2KBSYarDn86/HfpuDb1+FZe/qojoN++BlWO9p4+ls37yAbVfj8Qk85yrss+XS0/OIK5Uely6S6QSAg6ZXCoX9cIAcgW+PxA5/PdYnS/iGsDyG1/oFlp/K7rsvcytWMCG0Qa301dv7RgTne/DtXHyO++OxnQTt1wCWZViW4Hi5Q0ql5a62PzMpcwlAJ02aIgMDc3DAvB3fHoclioDfPtUX8fUOPN4ufX0/cZs3Py+0Dd1pp12kWJyHfWcB/yFp76weDtWN+PpzLLfJ1KlL3Nq1/ZIhmUkAms8fhIPmsyOBP02SSvUFfP01qgqXos3hLrYfVKtls/G5fBrLYdh/L5ekUrXE/Uvsuyuw7+7Jwr5LdQLQnXeeKJs2nYRi4on49kBJn1U4mC4Sz7vVbdnynHQRnThxZ5ztT0LAfwLfzpD0eQLv/RI0QP4IQZTaEl0qE4COHz8NDXlWRLwAy0RJO9UNOJiuRyPUJa6/f61kWHXfDQ2dgP/3HMnCvhNZg/13HdorrkrjvktVAqieNcrlf8JZ8xM4gKZI9jyHg+lbKNF80w0OrpYMqe67Uuks/H+nYt9NkuyxfXcFSnOXp6mNJzUJQD3vNDz8C5Y9Jfs2IkjORvHy+rS3QFdb8z3vk1i1M/4ukn1rse/Ow777Thr2XeITABr33oCi8ZXIrm+UbqP6J/zvJ7qBgXslhdC4Z332F+H/OFi6jeoyK+24cvlhSbCcJJROmzYeZ/1/R3H47q4MfuPcvqju/BqfwxXoInuFpIROnjxZC4XrsN+WdGXwG+cOxrF7J05gF+uUKYmt8iSyBIAP7UB8eDeJXaVHdStxUJ2EtoG7JMGQrN6Jh6uw7CNUtxyJ/ASUBpZJwiSuBIBi40cR/A8Ig7/Znjib3okz65c0gYm7WmIrFM7F6lJh8Dd7HY7pn2mtLSRREnMgVYtJ/f1fxuopQtun+hAOqGNQGlglCVC9v6JS+R5KKIcI7cjVUix+Oin3iiQiAei4cbvjAPo+Vg8VatWzMjz8YTc09BuJEYL/7dWuy9rNOdQK1QfRM3JkEroLY08AOICqRVthsdEPtWsiULe8SmKAIu2p2HdfwZl/vFC7VuNzOwyluJUSo1jbAHAA7VPNhgx+vxyqAleg7n1BlO0C9lpI3F8Ua+xj8Ps1Hcf+r7HvDpAYxZYA1O7tFvmVdMfFIWFyCMLzJZ9fpBHsz+preN4lOHjPFerUHth3S5AE/k5iEksVoHrmrwX/dKHgVCrXojrwMQlJdXwFC36RTwsFx+4ydG6WKxafkohFngBG6vz3SG1UFwqa6mIplY4PupUZwe9JoXAlDtQThcJg937MRRJ4UiIUaRWgevuuqp35GfxhcW4BqgNfD7w6UChcy+APlbUJLNGI75CMLAFUi4+bN9+O1b2EwpXLnYKA/aIEBFU2a+k/Tihcdum35/0YsRLZpcPRlQA87+v4+lahaDh3DhqXzpMO4Tk+j4fPCEVlDkpwX5CIRNIGgBb/43FWul4SfPNRRg2jYfA0NAxeIz6MXLp6mXD4+OhVKidjv10nIQt9x+IMYsNu27X9WRj9JY3sYqGD270ttXobdi5njbXs54+HzT/xt25gYI2EKNQzstowzs5dKQz+ONnFQrfruHF7tLoBemr2wjZ2Uw+DPz6TZHj41mrvS4jCLZIXClZ3PEwobruhFHBTKy3MuuuuE9Aa/W2sJnd03m7h3Ezp7T1dQhRaFQD1x1fj4XdYdhJKhkrlMlQFtnsRD/bbIjx8VigpbOjxfcO6SCiUEsDIdenW6MfgT5Jc7lNokzlmrF9rT898YfAnTT2WQnvywOEgOxrFlx8IJdFaJIJZaFx6tvGH1Vl5yuXHsJqaoce6iuqxrlRaLAELvAQw0vB3kVBS2ZwK38B+Krzkp+XytcLgT7LPh3GBUPBVAOvz5+29yebcUWigfV/9W3T5nYCHo4SSyyZH7es7RgIWaBVArc5fKNjglVOFks3uQOvp+fvqeqXyX/j6SqGkWy/F4t4I2i0SkF4JkufZmYTBnwaWpCuVc5AIrMrG4E+HXRBjC5EErpSABFYCGJkBxrr99hdKk4rwEu00WYEuwX0lIMHteGv5Z/CnEYM/XV490mYTiOB2vnOnChGFL5f7aFBjQAbyJDp+/BvQtWSDe/JsQhQ+q7bZ1YFPS4eCCdjh4WOFwU8UlRwabwMZoCWooD1CiChKH9IAevE6TgA6btxMYeMfUbSc20/y+YPa2mYUnZcAKpWFwhFjiKJmMdfxlYFBVAE4nx9RHJzreKyNjs7c6nl2QcKTwhIAUTxyuVd1MmxYZyUAVav7M/iJ4jI8PFs60FkCyOXmCRHFx7lDpAO+E0D1SiRVjvdHFCfVQzvpDvRfAujrs+m9eN8/UZyc+xsZP973QC7+E4BzNsx0XogoTgUpl3cXn/wngKGhwG5JJKKOHCA++U8AudxMIaIk2E986qQXYG8hovjlcjGUAJzbWYgofqq7ik++EsBIFyCnjiJKAucmqc9Y9lsCsPnjAh+jnIh8mTCytM1fApgwYQKyDqf9IkoC1QnVmPTBXwIYHrZpowtCRPFzbhxisk988JcAKhU7+/MmIKJkcIjJCEsAvb2eEFFy2AQvPvhLAKo9QkRJ4uuGIL+9ACpElCS+YtJfAnCuIkSUJMPig78EUC77ejEiCk2ECcC5ohBRcviMSb8JYFCIKDkiTgBD4rPIQUSBG5ZcriQ++EsAPT2WbXy9IBEFroiYjDAB5PNFUWU7AFESqJZky5YIqwAvvFBiOwBRQtTq/77i0e+FQANixQ4iip/qFvFZJfeVAFztqqN+IaIk6HeRXgk48qJCREmwRXzqJAFsECKKX60K4Iv/BKD6ZyGi+Dm3VnzqZF4AJgCiZFgtPvlPAMPDq4SI4qf6lPjkPwH09DwtRBQ/1WfFJ/8JoLfXd72DiALk3PPiUydVgE3Ci4GI4laWfP458cl/AhgYsBf1/cJEFADVtdLfv1588p0AnGUekceFiOKj+sRILPrSyYVA5jEhojj9QTrQWQKoVH4vRBSfSuVB6UBnCaC3d4UQUXw6uAqwurl0QG1GUs97QXxOSkBEHVAdklLp5QjizeJTRyUAvPCLeGA1oF3XXCMyOLh1Wbhw7L9t/DtbZsx46e+ffHL035977rbb1pd160SWLt32dZvfVyvbNL/+295W+7k9Nv7c/q6Rvc/t/Z5asayT4Dedn7mdewyZ6CCh9Jg8uRagtlggXnhhe9tMmiRy+eVCsev4atxOewHsgqC7hNLLSgoW3O1uQ/FTvUM61HkJIJe7V2pXBHLG4CT7PWpqt91WO+M3F+OnT7dxHrfdxv7etmvept2EQWEYkp6eu6Xs+xKAqs4TQLH4DBoC12BtH6HkevTRrUX9Aw8UOeCArb9bPcbdpEuWiNxwQ229MQGMliwoWqqPI/Z83wZc13ECQCPEkDp3P94QE0CSWb3d6u929m4MfgvwsQLazvy2zXvf+9Kf33ijUOwe9jsOYKNguu8qlZ+gMfAjQsllQdwcyBb4Z5019jaj1fWtSnDmmUIxc+6HEoDOGwFNb2+9HYDSxEoDF1/c1ibV0gMbAeM2iATwqAQgkATg+vvtaqT7haJnRftGmzaN/nerVtWK+9aw18jq9vW++2b33FPbxh4b+ek5aNa8PdsV2nGfGxwMZESuYEoAJoAuCWpB44VAtt5qIFkQf/zjIgsW1Br3xnrORhb8ts3cubWif6PGdoTRNCciS1SN77V5+7ESF21LdakEJLhLeAuF69Al8SWh9p1++rZdc9Zqb/VzC7zGYLGr9S67rBYwzUXx5jP1aCwImwN+R2df26a5pLEjq1Zt+xwPPFDribDXt/+50e95QWlLVMso/t8qAQksAbgtW55Tz/sFVucJtce65cZiRfbGBGDBs2jR6H9b77IbjSWYsS45Hiv4LNnY0syCe0fJxpKK/U1j9cLe+2jPZyyp0Y45d58rFgO7CS+4KkDNEqFg2SW3rZwd7e+2lwDGYmfkVW1WJ7fXc9DIqg+tPLef99CtKpWbJUDBJoBi8XsSQN8kNbAzqdXBx+qvt59Zt1w7XXP1BkF73lbuA6hvY0lm5sxtGxK3t039vY/GEls776HbqQ6imv09CVBHtwOPRguFb6OYcoJQOOoX81id3NoJ0lJ3rl+AZNUAa7+w986zfntUv+tKpUBjK/gEMG7cLBRT7g/juYm6WqXyJlcuPyABCroNwEYLfgiZqqNhioioieq9KP4/JAELPAHgtF9BFeB6IaLgqF5Tja2AhVJMV0ssnmfzle0pRNSpdWhg3xvBOiABC74KICOlAJErhIiCcEkYwW9Ca6hDKeBlI+METBQi8msNzv77IFBLEoJQSgAGb/h/8fA5ISL/VK8IK/hNqF11KAW8HKUA67Z4tRBRu1bg7D8TQbpRQhJaCcDgjW/Aw6VCRO1TvSDM4DehX6yj9hqe9whWDxAiatUfcfbfL4hhv7Yn1BKAqf4DudxpQkStq1SODTv4TegJwLiBgftQnAn0JgaizFK92ZXLj0gEIrteX/v6piOrPSLOTREiGsuzKPq/xVn3XwQiKQEYNzi4GsF/vlBrxpqjz5YHH6wNrNE4sk8nc/HZnH/tzgnod85C2pHLogp+E1kCMK5YvAxJgDcKdcpuq7WAtCG2wg6s+pyAlnCah/GiYFUqD+Dsv0giFGkCqKpUThQOIR4MC85PfUoiE+VrdRvV59FYvjCKhr9GkScAVyotRymAvQLtstF4Rhs664AQeldtxB97reaRf1iMD49zF6KE/CeJWHCjArcB7QHXq+f9A1bfI9QaGzTTgt9GAFq8eOvPwxhPvz4noJUwGmcT4gg+4VC9FSfGWC6YiyUBVOXzJ40McMDTSivqw2l9pGkGtjDG0xtrTkA/g47SjqyWUumzEpPYEoDbsmU9ugZPRvb7T+HwYTt2yy3b/sxKBWGMCTjWnIAcvDNYqi+iTew4HPyxFa2ibwRsgKrAL1H3OUc4krA/1ig31rReQbMSCHsBgnapGxr6jcQo1gRQNTj4VWTCnwhtnzXIWRG8uR4exkSdYc4JSDWqi1Hvj32W1fjaAEag+FPUQuEUtAfsh2/3ExqdTcZhwW8BaBfn1NV7AZrn1qvPG1hvJGwuKWyvQc+Cv17ftwt66q3/9nzTp9ee05bGZGB/U39OW2/uMeDcf42eQr3/M5IAsScAU20PyOePQ3VgKZapQmMbq8hvwdcclHahUH3KreY+/FZa9C2Ix5oT0NoEGt9L45yFza9lcwBw9t8a1Y04xt+NE9//SAIkqvENJYH5+HB+LFS7fLYV9Rl8jV2y22qbwGteszUJtLqd/b1tZ6w9YFGLF63Z+2MPghlCAliAov+PJCHibwNogA/G2gJOFWqNBWRjy3yYc/HZGbxxTsBW5yxsrE7QOUkKfpOoBGBcsXg1Hr4mNDoLxHqX3KxZLw3kVubiW7Cgve68+pyA9lrNVwbaa9nvxpqz0F6nXjqhS3FsXywJk9j+d/W8H+DhaCF/6nPx1dsEwp6LL61zFkZB9VY0+n3QWRUgYZKbAER2Es+zKsEcIUor5x5Ce84sl9BrXRJXBajDB7ZFisWTsPrfQpRGqr9F8H8gqcFvEn8J7sjQ4g8L7xmgdFklPT1vdv39ayXBElsCqKsOLe7cYVhdKUTpsBKl17cmPfhN4hOAcYODq1CcOgLLBiFKtrV2rDob2y8FUnUXntqlwp73S6y+UoiSZz2C/53o609NF0gqSgB1yFZPSKXy/urwSUTJshbH5hFpCn6TqgRgXLlsg4rOxvJnIUqGPyP4j8Kx+VtJmdQOxKH5/IGSy/0Uq3sIUXyeQ/AfHtVEHkFL9Ug8Wii8Fj0Ev8LqbkIUvTWojs5Fsf9xSanUVQEaVT94NLpIjEMqUddaiWPv8DQHv8nEWHzqeXvjwcYW3FuIwmfDdx/pisUVknKpLgHUYUc8jfaA2VLbMURh+iOWo7IQ/CZTo/HqhAm7ydCQXSfwOiEKmuqjUirNRtBkZnijTJQA6tyLL66TYtEuG05ddwwl3t0I/vlZCn6TyfH41RKb5y3F6juEqHN34cRiwb9ZMiZTJYA67KgKdti7sXqtEHVC9buo78/JYvCbTCYAY8ONIwnYJKSXCJEflcoiFPs/JhmW2QRgkATKyN5ninMXCFHrFGf+C1y5fJYdQ5JhXTMnn3reJ6Q22Ggi5kKghFLtxwnjbJw4Lpcu0DUJwCAJ2HS3N2KZKETbsqG75iP4l0iX6KoEYDSfP1hyudux+goh2sru6Hsfiv3LpItkug1gNCM72KbBWSlENStQ9D+y24LfdF0CMCjiPVkdZ9C5B4W6m+r9OA7ekbaBPILSdVWARqjwjRPPs7kI5wp1o6XoKv4wgqBrR5jqyhJAHXb8AA6A92P1K0Ld5hsoCR7ezcFvujoBGBwA/UgCZ6EYeJ4keAIHCoh186leiH1+hlB3VwGaaV/fSTg4vim8ViCbVG167o+hse87QlVMAE2QBA7FQbIYq9OEsmSdDA8vdENDdwr9PyaAUWihsD+qBDbg6J5CWfAXJPU5aOlfLvQSTABjQGPAdCkUFiMRzBJKL9VlUiodjQN9tdA2ur4RcCzVA6ZUOrw6tzulk+qN2IfvYvCPjQlgO3DgbMIBdAxWvyyUJtab8w3su+OzNoJP0JgAdsDmdkd/8dkj3YRFoTSwu/lOd+zW3SG2AbQBjYPz8XAzkoEnlDyqJXz9KBr7bhJqCRNAm3TcuEOkUrFuQs5QnCxr0M13LLr57hNqGROAD9rXtxfONndgdV+hJHgCpbIj3ODgSqG2sA3ABxxoz0ix+BYkAZ5t4ncPgv9wBr8/TAA+oej0V7Qy27DjHHk4Lqo3IBHPQ/Czm88nJoAOIAkM4gA8BWegL4gNRU5RsUE7v4gEfEL1jk7yjW0AAVHP+2c8/BuWPqHwqBaRcD+Dbr4rhTrGBBCgag/B8PCdOECZBMKgugE9MAtcbf5HCgCrAAFyAwP34mGmcLzBMKxCApjH4A8WSwAhUJHdxfNuw+pBQp1T/Z3kcu9jY1/wWAIIgbMhpovFuThwu2Z8+dCo/gyNfW9m8IeDCSAk1bHmajcSLRLy62pXKr3b8R6M0DABhMgOXGfjDeZynxPemNIO+6zOQCnqH4VCxTaAiGih8EH0DtwgHG9w+1S3YDnDlcvXCYWOCSBC2tt7iPT0fB+rewiNxm7oOR4t/XcJRYIJIGIj4w3+SHgjUbOnsbwLVaanhSLDBBADtRKA5/0Cq/sLWbH/YZSM5ruBgTVCkWIjYAycFXWLRRt+/AfS7VRvQW/JbAZ/PJgAYlIdq65UOhar35Tu9S18Bifjs9gsFAsmgBjhwK846+py7nx8OyTdRPU8/O8fZ/DHi20ACaF9fSePTEvWI1mmuhnLmejmu1oodkwACaKeNw/B8R8oEUyRLFJ9Af/bh3Hm/7lQIjABJMxIN+HtWJ0h2bJaKpX5OPM/IpQYTAAJhOrAdJwt75bszE34DP6fI12p9IRQojABJJRaCaBQuAmlgTdLmtXm5ptXvTmKEoe9AAnlbACMUskmIknv3ISq35fa3XwM/oRiAkgwBM56KRY/iNWLJH1sbr6F+B+eE0osJoCEQwANodX8czibXiDpuKXYRuz90sjcfN11bUMKsQ0gRdBN+Ek8fBVLXpLrNAT/VUKpwASQMtrTc7T09t4iSdt3dh+/yMlo6V8slBpMACmk+fwbJZezawV2kWRYJcPDJ/I+/vRhAkgpJIE3IQlYSSDuwUXWS6VypCuXlwmlDhNAiqldKOR5dtbdU+LxjDg3hxNzphd7AVLM2QQkudyhscxSrPoQuihnMvjTjSWADEBJYGeUBKw6MFuiUKncJeXyB3DwbBBKNZYAMqA6VXmx+A4Ux2+WsKkuRvDPZ/BnAxNARtjgIjI4eAJWr5WwqF6Pbr5jOYhHdjABZEh1Bp1i8VSUBL4gQVP9spRKpwhlCtsAMkr7+s4fuXy446fCcjYSyyLH2Y0yhwkgw9TzzkASWIQSgb/ZiFSHsO2/OgS/UCYxAWQcSgInotX+awjkie1tqDYh50LU+W8RyiwmgC6AksDhePghlvGtbaD9kssdhT7+XwkRpZ/m8wdpobARyUB3sKzR3t63CRFlC5LAgQjwlWMGf6HwV/sbIaJsQpC/DsH+9CgJYCXaC/YSIso2G3C0qSTwlGZvGHIiGovutNMuKA08huUPDH6iLoTA303HjYt7PAEiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiKiLPs/2Uru6vrqMKMAAAAASUVORK5CYII="
	/>

	<!-- <img
		id="image1" 
		alt="canvas"
		src="data:image/png;base64,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"
	/> -->

	<div class="controls">
		<Button outline color="light" on:click={effect.warp()}>
			<Icon name="arrow-clockwise" style="font-size: 2rem;" />
		</Button>
		<Button outline color="light" on:click={toggle}>
			<Icon name="controller" style="font-size: 2rem;" />
		</Button>
	</div>

	<!-- <Fab color="primary" on:click={toggle}>
		<Icon class="material-icons">favorite</Icon>
	</Fab> -->
</main>

<Modal isOpen={open} {toggle}>
	<ModalHeader {toggle}>Controls</ModalHeader>
	<ModalBody>
		Pointer radius: {mouseRadius}
		<div class="slider-description">Controls radius around mouse/touch</div>
		<Slider bind:value={mouseRadius} min={1000} max={15000} step={1000} />

		Pixel size: {pixelSize}
		<div class="slider-description">Controls size of each pixel</div>
		<Slider bind:value={pixelSize} min={3} max={20} step={1} />

		Ease: {ease}
		<div class="slider-description">Controls speed at which pixels return to position. Lower value = slower speed</div>
		<Slider bind:value={ease} min={0.01} max={0.1} step={0.01} />

		Friction: {friction}
		<div class="slider-description">Controls friction of pixels when being pushed. Higher value = pushed further</div>
		<Slider bind:value={friction} min={0.1} max={0.9} step={0.1} />

	</ModalBody>
	<ModalFooter>
		<Button color="dark" on:click={handleSave}>Save controls</Button>
		<Button color="secondary" on:click={toggle}>Cancel</Button>
	</ModalFooter>
</Modal>

<style>
	* {
		margin: 0;
		padding: 0;
	}
	
	:global(body) {
		background-color: black !important;
		padding: 0;
		max-height: 100vh !important;
		overflow: hidden;
		font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", 
        Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif !important;
	}

	#canvas1 {
		position: absolute;
	}

	.controls {
		position: absolute;
		z-index: 100;
		bottom: 0;
		right: 0;
		margin: 0 2rem 2rem 0;
	}

	img {
		display: none;
		width: 1rem;
	}

	:global(.controls button) {
		border-radius: 100% !important;
		padding: 0.5rem 1rem !important;
	}

	:global(.modal .modal-content) {
		/* From https://css.glass */
		background: rgba(216, 216, 216, 0.38);
		border-radius: 16px;
		box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
		backdrop-filter: blur(10.2px);
		-webkit-backdrop-filter: blur(10.2px);
		border: 1px solid rgba(216, 216, 216, 1);

		color: #fff;
	}

	.slider-description {
		font-size: 0.8rem;
		font-style: italic;
	}

	/* @font-face {
		font-family: mrPixel;
		src: url(/public/build/MP16REG.ttf);
	} */

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>