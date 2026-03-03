import './style.css';
import confetti from 'canvas-confetti';

// ============================================================
//  HTML SKELETON  — injected before any JS runs
// ============================================================
document.querySelector('#app').innerHTML = `
    <div class="container">
        <div class="glass">
            <h1 class="title glass-content-enter" style="animation-delay:0.1s">
                Happy Holi <br/>
                <span class="romantic-name">Tannu ❤️</span>
            </h1>

            <p class="subtitle glass-content-enter" style="animation-delay:0.4s" id="subtitleEl"></p>

            <p class="message glass-content-enter" style="animation-delay:0.8s">
                May our love be as vibrant and beautiful as this festival.
            </p>

            <div id="photoContainer" class="photo-container">
                <div class="polaroid">
                    <img
                        src="./tan.jpg"
                        alt="Tannu and Me"
                        class="romantic-photo"
                        id="photoImg"
                        loading="lazy"
                    />
                    <div class="polaroid-caption">My favourite colour 💕</div>
                </div>
            </div>

            <div class="actions glass-content-enter" style="animation-delay:1s">
                <button id="splashBtn" class="primary-btn">Tap to Open My Heart ❤️</button>
            </div>
        </div>
    </div>
`;

// ============================================================
//  LIGHTBOX
// ============================================================
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.innerHTML = '<img src="./tan.jpg" alt="Tannu and Me" />';
document.body.appendChild(lightbox);

// ============================================================
//  MUSIC TOGGLE
// ============================================================
const musicToggle = document.createElement('button');
musicToggle.id = 'musicToggle';
musicToggle.title = 'Toggle background music';
musicToggle.textContent = '🎵';
document.body.appendChild(musicToggle);

const setupApp = () => {
    const splashBtn = document.getElementById('splashBtn');
    const photoContainer = document.getElementById('photoContainer');
    const photoImg = document.getElementById('photoImg');
    const subtitleEl = document.getElementById('subtitleEl');
    const canvas = document.getElementById('paintCanvas');
    const ctx = canvas.getContext('2d');
    let clickCount = 0;

    // ── Button message cycle ──────────────────────────────────
    const btnMessages = [
        'Tap to Open My Heart ❤️',
        'Happy Holi My Love! 💖',
        'Send More Colours! 🎨',
        'Rango ki duniya! 🌈',
        'You are my favourite colour ✨',
        'Forever yours this Holi 💞',
    ];

    // ── Subtitle typewriter ───────────────────────────────────
    const subtitleText = 'Out of all the colors of Holi,\nthe color of your smile is my absolute favorite.';
    let charIndex = 0;

    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';

    const typeChar = () => {
        if (charIndex < subtitleText.length) {
            const ch = subtitleText[charIndex];
            if (ch === '\n') {
                subtitleEl.insertBefore(document.createElement('br'), cursor);
            } else {
                subtitleEl.insertBefore(document.createTextNode(ch), cursor);
            }
            charIndex++;
            setTimeout(typeChar, 45);
        }
    };

    subtitleEl.appendChild(cursor);
    setTimeout(typeChar, 1200); // start after entrance animations settle

    // ── Floating Petals  (Holi-coloured, varied shapes) ───────
    const createPetals = () => {
        const container = document.getElementById('petals');
        const petalColors = [
            '#ff2a75', // pink
            '#ffdf00', // saffron yellow
            '#00d4ff', // teal
            '#8a2be2', // purple
            '#ff69b4', // hot pink
            '#ff6b00', // orange
        ];
        const petalShapes = [
            '50% 0 50% 50%',  // petal
            '50%',             // circle
            '50% 0 50% 0',    // diamond-ish
        ];

        for (let i = 0; i < 28; i++) {
            const petal = document.createElement('div');
            petal.classList.add('petal');
            const size = Math.random() * 14 + 8;
            const color = petalColors[Math.floor(Math.random() * petalColors.length)];
            const shape = petalShapes[Math.floor(Math.random() * petalShapes.length)];

            petal.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${Math.random() * 100}vw;
                background: radial-gradient(circle, ${color}, transparent 80%);
                border-radius: ${shape};
                color: ${color};
                animation-duration: ${Math.random() * 12 + 14}s;
                animation-delay: ${Math.random() * 18}s;
            `;
            container.appendChild(petal);
        }
    };
    createPetals();

    // ── Canvas resize ─────────────────────────────────────────
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', () => setTimeout(resizeCanvas, 300));
    resizeCanvas();

    // ── Particle system  (swap-delete optimised) ───────────────
    const holiTrailColors = ['#ff2a75', '#ffb6c1', '#ffffff', '#ffdf00', '#00d4ff', '#8a2be2'];
    const pool = [];
    let poolSize = 0;

    class Particle {
        constructor(x, y) { this.reset(x, y); }
        reset(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 6 + 2;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * -2 - 0.5;
            this.color = holiTrailColors[Math.floor(Math.random() * holiTrailColors.length)];
            this.opacity = 1;
            this.isHeart = Math.random() > 0.5;
            this.dead = false;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity -= 0.016;
            this.size -= 0.04;
            if (this.opacity <= 0 || this.size <= 0.1) this.dead = true;
        }
        draw() {
            ctx.globalAlpha = Math.max(0, this.opacity);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            if (this.isHeart) {
                const d = this.size * 2;
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
        for (let i = 0; i < 3; i++) {
            if (poolSize < pool.length) {
                pool[poolSize].reset(x, y);
            } else {
                pool.push(new Particle(x, y));
            }
            poolSize++;
        }
    };

    window.addEventListener('mousemove', e => handleInteraction(e.clientX, e.clientY));
    window.addEventListener('touchmove', e => {
        e.preventDefault();
        if (e.touches.length > 0) handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false });

    const animateParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let i = 0;
        while (i < poolSize) {
            pool[i].update();
            if (pool[i].dead) {
                // swap with last alive particle
                pool[i] = pool[poolSize - 1];
                poolSize--;
            } else {
                pool[i].draw();
                i++;
            }
        }
        requestAnimationFrame(animateParticles);
    };
    animateParticles();

    // ── Confetti heart shape ──────────────────────────────────
    const heart = confetti.shapeFromPath({
        path: 'M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z',
        matrix: [0.033, 0, 0, 0.033, -5, -4],
    });

    const splashColors = () => {
        const duration = 4000;
        const animEnd = Date.now() + duration;
        const holiColors = ['#ff2a75', '#ffea00', '#00f0ff', '#8a2be2', '#ff69b4', '#ff6b00'];
        const heartColors = ['#ff2a75', '#ffb6c1', '#ff1493'];

        const interval = setInterval(() => {
            const timeLeft = animEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 40 * (timeLeft / duration);
            confetti({ particleCount, origin: { x: Math.random() * 0.2, y: Math.random() - 0.2 }, colors: holiColors, startVelocity: 30, spread: 360, zIndex: 200 });
            confetti({ particleCount, origin: { x: Math.random() * 0.2 + 0.8, y: Math.random() - 0.2 }, colors: holiColors, startVelocity: 30, spread: 360, zIndex: 200 });
        }, 200);

        confetti({ particleCount: 150, spread: 120, origin: { y: 0.6 }, startVelocity: 45, colors: heartColors, shapes: [heart], scalar: 2, zIndex: 200 });
        confetti({ particleCount: 100, spread: 100, origin: { y: 0.6 }, startVelocity: 35, colors: holiColors, zIndex: 200 });
    };

    const gentleColourRain = () => {
        confetti({
            particleCount: 80,
            spread: 80,
            origin: { y: 0.3 },
            startVelocity: 25,
            colors: ['#ff2a75', '#ffdf00', '#00f0ff', '#8a2be2', '#ff6b00'],
            gravity: 0.5,
            zIndex: 200,
        });
    };

    // ── Button click ─────────────────────────────────────────
    splashBtn.addEventListener('click', () => {
        clickCount++;

        // First click — big reveal
        if (clickCount === 1) {
            splashColors();
            photoContainer.classList.add('visible');
            splashBtn.classList.add('revealed');
        } else {
            gentleColourRain();
        }

        splashBtn.textContent = btnMessages[Math.min(clickCount, btnMessages.length - 1)];
    });

    // ── Photo lightbox ────────────────────────────────────────
    const lb = document.getElementById('lightbox');
    photoImg.addEventListener('click', () => lb.classList.add('open'));
    lb.addEventListener('click', () => lb.classList.remove('open'));

    // ── 3D glass tilt (mouse + gyroscope) ────────────────────
    const glass = document.querySelector('.glass');

    document.addEventListener('mousemove', e => {
        let xAxis = Math.max(-10, Math.min(10, (window.innerWidth / 2 - e.pageX) / 50));
        let yAxis = Math.max(-10, Math.min(10, (window.innerHeight / 2 - e.pageY) / 50));
        glass.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });
    document.addEventListener('mouseleave', () => {
        glass.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });

    // Gyroscope tilt for mobile
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', e => {
            if (e.gamma === null) return;
            const xAxis = Math.max(-10, Math.min(10, e.gamma / 4));
            const yAxis = Math.max(-10, Math.min(10, (e.beta - 45) / 4));
            glass.style.transform = `rotateY(${xAxis}deg) rotateX(${-yAxis}deg)`;
        });
    }

    // ── Music toggle ─────────────────────────────────────────
    // We generate a soft ambient tone in the Web Audio API (no external file needed)
    let audioCtx = null;
    let gainNode = null;
    let isPlaying = false;
    const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00]; // C major scale
    let noteIdx = 0;
    let noteTimer = null;

    const playNote = () => {
        if (!audioCtx || !isPlaying) return;
        const osc = audioCtx.createOscillator();
        const env = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = notes[noteIdx % notes.length];
        noteIdx++;
        env.gain.setValueAtTime(0, audioCtx.currentTime);
        env.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 0.3);
        env.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.4);
        osc.connect(env);
        env.connect(gainNode);
        osc.start();
        osc.stop(audioCtx.currentTime + 1.4);
        if (isPlaying) noteTimer = setTimeout(playNote, 900);
    };

    musicToggle.addEventListener('click', () => {
        if (!isPlaying) {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                gainNode = audioCtx.createGain();
                gainNode.gain.value = 1;
                gainNode.connect(audioCtx.destination);
            }
            isPlaying = true;
            musicToggle.textContent = '🔇';
            musicToggle.classList.add('playing');
            playNote();
        } else {
            isPlaying = false;
            clearTimeout(noteTimer);
            musicToggle.textContent = '🎵';
            musicToggle.classList.remove('playing');
        }
    });

    // ── Intro confetti spark ──────────────────────────────────
    setTimeout(() => {
        confetti({
            particleCount: 55,
            spread: 65,
            origin: { y: 0.8 },
            colors: ['#ff2a75', '#ffdf00', '#8a2be2'],
            zIndex: 200,
        });
    }, 2600); // fires after splash screen exits
};

setupApp();
