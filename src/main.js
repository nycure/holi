import './style.css';
import confetti from 'canvas-confetti';

document.querySelector('#app').innerHTML = `
    <div class="container">
        <div class="glass">
            <h1 class="title">हैप्पी <span class="holi-text">होली</span></h1>
            <p class="subtitle">रंगों के इस पावन पर्व पर आपके जीवन में खुशियों के नए रंग भर जाएं।</p>
            
            <div class="actions">
                <button id="splashBtn" class="primary-btn">रंग बिखेरें!</button>
            </div>
        </div>
    </div>
`;

const setupApp = () => {
    const splashBtn = document.getElementById('splashBtn');
    const canvas = document.getElementById('paintCanvas');
    const ctx = canvas.getContext('2d');

    // Resize Canvas
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Interactive Paint Trail (Mouse Movement)
    let isMoving = false;
    let particlesArray = [];
    const colors = ['#ff007f', '#00f0ff', '#ffea00', '#8a2be2', '#00ff88', '#ff4500'];

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 15 + 5;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = 1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.size > 0.1) this.size -= 0.1;
            this.opacity -= 0.02;
        }
        draw() {
            ctx.globalAlpha = Math.max(0, this.opacity);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1; // Reset alpha
        }
    }

    const handleInteraction = (x, y) => {
        // Add multiple particles for a splash effect
        for (let i = 0; i < 3; i++) {
            particlesArray.push(new Particle(x, y));
        }
    };

    window.addEventListener('mousemove', (e) => {
        handleInteraction(e.x, e.y);
    });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
        }
    });

    const animateParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();

            // Remove particles that are too small or invisible
            if (particlesArray[i].size <= 0.2 || particlesArray[i].opacity <= 0) {
                particlesArray.splice(i, 1);
                i--;
            }
        }
        requestAnimationFrame(animateParticles);
    };
    animateParticles();


    // Enhanced Multi-Color Splash Effect using canvas-confetti
    const splashColors = () => {
        const duration = 4000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 35, spread: 360, ticks: 80, zIndex: 100 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 60 * (timeLeft / duration);

            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: colors,
                shapes: ['circle', 'square'], // Mimic powder and paper
                scalar: randomInRange(0.8, 1.2)
            }));
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: colors,
                shapes: ['circle', 'square'],
                scalar: randomInRange(0.8, 1.2)
            }));
        }, 200);

        // Huge central burst
        confetti({
            particleCount: 200,
            spread: 120,
            origin: { y: 0.6 },
            startVelocity: 45,
            colors: colors,
            zIndex: 100
        });
    };

    splashBtn.addEventListener('click', () => {
        splashColors();
    });

    // Subtly track mouse to tilt the glass card for 3D effect
    const container = document.querySelector('.container');
    const glass = document.querySelector('.glass');

    document.addEventListener('mousemove', (e) => {
        let xAxis = (window.innerWidth / 2 - e.pageX) / 40;
        let yAxis = (window.innerHeight / 2 - e.pageY) / 40;

        // Prevent jarring rotation if mouse is far from center
        if (Math.abs(xAxis) > 15) xAxis = 15 * Math.sign(xAxis);
        if (Math.abs(yAxis) > 15) yAxis = 15 * Math.sign(yAxis);

        glass.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });

    // Reset rotation on mouse leave
    document.addEventListener('mouseleave', () => {
        glass.style.transform = `rotateY(0deg) rotateX(0deg)`;
    });

    // Initial splash on load
    setTimeout(splashColors, 500);
};

setupApp();
