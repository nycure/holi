import './style.css';
import confetti from 'canvas-confetti';

document.querySelector('#app').innerHTML = `
    <div class="container">
        <div class="glass">
            <h1 class="title">Happy Holi <br/> <span class="romantic-name">Tannu ❤️</span></h1>
            
            <p class="subtitle">Out of all the colors of Holi,<br />the color of your smile is my absolute favorite.</p>
            
            <p class="message">May our love be as vibrant and beautiful as this festival.</p>

            <div id="photoContainer" class="photo-container">
                <img src="./tan.jpg" alt="Tannu and Me" class="romantic-photo" />
            </div>
            
            <div class="actions">
                <button id="splashBtn" class="primary-btn">Tap to Open My Heart ❤️</button>
            </div>
        </div>
    </div>
`;

const setupApp = () => {
    const splashBtn = document.getElementById('splashBtn');
    const photoContainer = document.getElementById('photoContainer');
    const canvas = document.getElementById('paintCanvas');
    const ctx = canvas.getContext('2d');
    let hasRevealedSurprise = false;

    // --- Background Floating Petals ---
    const createPetals = () => {
        const container = document.getElementById('petals');
        for (let i = 0; i < 20; i++) {
            const petal = document.createElement('div');
            petal.classList.add('petal');

            // Randomize properties
            const size = Math.random() * 15 + 10;
            const left = Math.random() * 100;
            const animDuration = Math.random() * 10 + 15;
            const animDelay = Math.random() * 15;

            petal.style.width = `${size}px`;
            petal.style.height = `${size}px`;
            petal.style.left = `${left}vw`;
            petal.style.animationDuration = `${animDuration}s`;
            petal.style.animationDelay = `${animDelay}s`;

            container.appendChild(petal);
        }
    };
    createPetals();

    // --- Interactive Heart Paint Trail ---
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let particlesArray = [];
    const romanticColors = ['#ff2a75', '#ffb6c1', '#ffffff', '#ffdf00', '#ff69b4'];

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 6 + 2;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * -2 - 0.5; // Float upwards mostly!
            this.color = romanticColors[Math.floor(Math.random() * romanticColors.length)];
            this.opacity = 1;
            this.isHeart = Math.random() > 0.5; // 50% chance to be a heart instead of a dot
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity -= 0.015;
            if (this.size > 0.1) this.size -= 0.05;
        }
        draw() {
            ctx.globalAlpha = Math.max(0, this.opacity);
            ctx.fillStyle = this.color;
            ctx.beginPath();

            if (this.isHeart) {
                // Draw a tiny heart
                const w = this.size * 2;
                const h = this.size * 2;
                const d = Math.min(w, h);
                const k = this.x - d / 2;
                const l = this.y - d / 2;

                ctx.moveTo(k, l + d / 4);
                ctx.quadraticCurveTo(k, l, k + d / 4, l);
                ctx.quadraticCurveTo(k + d / 2, l, k + d / 2, l + d / 4);
                ctx.quadraticCurveTo(k + d / 2, l, k + d * 3 / 4, l);
                ctx.quadraticCurveTo(k + d, l, k + d, l + d / 4);
                ctx.quadraticCurveTo(k + d, l + d / 2, k + d * 3 / 4, l + d * 3 / 4);
                ctx.lineTo(k + d / 2, l + d);
                ctx.lineTo(k + d / 4, l + d * 3 / 4);
                ctx.quadraticCurveTo(k, l + d / 2, k, l + d / 4);
                ctx.fill();
            } else {
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        }
    }

    const handleInteraction = (x, y) => {
        for (let i = 0; i < 2; i++) {
            particlesArray.push(new Particle(x, y));
        }
    };

    window.addEventListener('mousemove', (e) => { handleInteraction(e.x, e.y); });
    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
    });

    const animateParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
            if (particlesArray[i].opacity <= 0 || particlesArray[i].size <= 0.1) {
                particlesArray.splice(i, 1);
                i--;
            }
        }
        requestAnimationFrame(animateParticles);
    };
    animateParticles();


    // --- Romantic Confetti Burst ---

    // Define custom heart shape for confetti
    const heart = confetti.shapeFromPath({
        path: 'M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z',
        matrix: [0.033, 0, 0, 0.033, -5, -4] // Scale down the SVG path
    });

    const splashColors = () => {
        const duration = 4000;
        const animationEnd = Date.now() + duration;
        const holiColors = ['#ff2a75', '#ffea00', '#00f0ff', '#8a2be2', '#ff69b4', '#ffffff'];
        const heartColors = ['#ff2a75', '#ffb6c1', '#ff1493']; // Pinks and reds for hearts

        // Side cannons (Standard colors)
        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);

            const particleCount = 40 * (timeLeft / duration);

            confetti({
                particleCount,
                origin: { x: Math.random() * 0.2, y: Math.random() - 0.2 },
                colors: holiColors,
                startVelocity: 30,
                spread: 360,
                zIndex: 100
            });
            confetti({
                particleCount,
                origin: { x: Math.random() * 0.2 + 0.8, y: Math.random() - 0.2 },
                colors: holiColors,
                startVelocity: 30,
                spread: 360,
                zIndex: 100
            });
        }, 200);

        // Massive central heart explosion
        confetti({
            particleCount: 150,
            spread: 120,
            origin: { y: 0.6 },
            startVelocity: 45,
            colors: heartColors,
            shapes: [heart], // Only heart shapes
            scalar: 2, // Make hearts bigger
            zIndex: 100
        });
        // Mix in some normal confetti with the hearts
        confetti({
            particleCount: 100,
            spread: 100,
            origin: { y: 0.6 },
            startVelocity: 35,
            colors: holiColors,
            zIndex: 100
        });
    };

    splashBtn.addEventListener('click', () => {
        splashColors();

        // Photo Reveal Logic
        if (!hasRevealedSurprise) {
            photoContainer.classList.add('visible');
            splashBtn.textContent = 'Happy Holi My Love! 💖';
            hasRevealedSurprise = true;
        }
    });

    // --- 3D Glass Tilt (Subtle) ---
    const glass = document.querySelector('.glass');
    document.addEventListener('mousemove', (e) => {
        let xAxis = (window.innerWidth / 2 - e.pageX) / 50;
        let yAxis = (window.innerHeight / 2 - e.pageY) / 50;
        if (Math.abs(xAxis) > 10) xAxis = 10 * Math.sign(xAxis);
        if (Math.abs(yAxis) > 10) yAxis = 10 * Math.sign(yAxis);
        glass.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });
    document.addEventListener('mouseleave', () => {
        glass.style.transform = `rotateY(0deg) rotateX(0deg)`;
    });

    // Small introductory confetti
    setTimeout(() => {
        confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#ff2a75', '#ffdf00'],
            zIndex: 100
        });
    }, 800);
};

setupApp();
