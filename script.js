document.addEventListener('DOMContentLoaded', () => {
    const isTouch = !window.matchMedia("(hover:hover)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion:reduce)").matches;

    // === THEME ===
    const html = document.documentElement;
    const toggle = document.getElementById('themeToggle');
    html.setAttribute('data-theme', localStorage.getItem('theme') || 'dark');
    if (toggle) toggle.addEventListener('click', () => {
        const n = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', n);
        localStorage.setItem('theme', n);
    });

    // === CURSOR ===
    const cDot = document.querySelector('.cursor-dot');
    const cRing = document.querySelector('.cursor-ring');
    const cGlow = document.querySelector('.cursor-glow');
    let mx = 0, my = 0, rx = 0, ry = 0, gx = 0, gy = 0;
    if (!isTouch && cDot && !reduceMotion) {
        document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cDot.style.left = mx+'px'; cDot.style.top = my+'px'; });
        (function loop() {
            rx += (mx-rx)*.12; ry += (my-ry)*.12;
            gx += (mx-gx)*.05; gy += (my-gy)*.05;
            cRing.style.left = rx+'px'; cRing.style.top = ry+'px';
            cGlow.style.left = gx+'px'; cGlow.style.top = gy+'px';
            requestAnimationFrame(loop);
        })();
        document.querySelectorAll('a,button,.tilt-card').forEach(el => {
            el.addEventListener('mouseenter', () => cRing.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cRing.classList.remove('hovering'));
        });
    }

    // === NAVBAR ===
    const header = document.querySelector('.glass-header');
    const hamburger = document.getElementById('hamburger');
    const mobMenu = document.getElementById('mobileMenu');
    const mobLinks = document.querySelectorAll('.mobile-nav-link');
    let lastY = 0, menuOpen = false;

    if (hamburger && mobMenu) {
        hamburger.addEventListener('click', () => {
            menuOpen = !menuOpen;
            hamburger.classList.toggle('active');
            mobMenu.classList.toggle('active');
            if (mobMenu.classList.contains('active')) {
                mobLinks.forEach((l, i) => { l.style.transitionDelay = (.08+i*.04)+'s'; });
                header.classList.remove('nav-hidden'); header.classList.add('nav-visible');
            } else { mobLinks.forEach(l => { l.style.transitionDelay = '0s'; }); }
        });
        mobLinks.forEach(l => l.addEventListener('click', () => {
            menuOpen = false; hamburger.classList.remove('active'); mobMenu.classList.remove('active');
        }));
    }

    // Active links
    const secs = document.querySelectorAll('section,footer,[id]');
    const navLs = document.querySelectorAll('.nav-link,.mobile-nav-link');

    // === REVEAL (IntersectionObserver) ===
    if (!reduceMotion) {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    e.target.querySelectorAll('.stagger-child').forEach((c, i) => setTimeout(() => c.classList.add('visible'), 120*i));
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: .08, rootMargin: '0px 0px -40px 0px' });
        document.querySelectorAll('.reveal-section').forEach(el => obs.observe(el));
    } else {
        document.querySelectorAll('.reveal-section,.stagger-child').forEach(el => el.classList.add('visible'));
    }

    // === 3D TILT (hover only, no layout positioning) ===
    if (!isTouch && !reduceMotion) {
        document.querySelectorAll('.tilt-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const r = card.getBoundingClientRect();
                const rY = ((e.clientX - r.left - r.width/2) / (r.width/2)) * 6;
                const rX = ((r.height/2 - (e.clientY - r.top)) / (r.height/2)) * 6;
                card.style.transform = 'perspective(800px) rotateX('+rX+'deg) rotateY('+rY+'deg) translateZ(8px) scale(1.01)';
                card.style.boxShadow = (-rY*1.5)+'px '+(rX*1.5)+'px 25px rgba(0,0,0,.15)';
            });
            card.addEventListener('mouseleave', () => { card.style.transform = ''; card.style.boxShadow = ''; });
        });
    }

    // === CANVAS ===
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');
    const scrollSec = document.querySelector('.scroll-canvas-section');
    const frameCount = 120;
    const images = new Array(frameCount);
    let currentFrame = 0;

    function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; renderFrame(currentFrame); }
    window.addEventListener('resize', resizeCanvas);

    function framePath(i) { return 'sequence/frame_'+i.toString().padStart(3,'0')+'_delay-0.066s.png'; }

    function renderFrame(idx) {
        const img = images[idx];
        if (!img || !img.complete || !img.naturalWidth) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const cR = canvas.width/canvas.height, iR = img.width/img.height;
        let dw = canvas.width, dh = canvas.height, dx = 0, dy = 0;
        if (cR > iR) { dh = canvas.width/iR; dy = (canvas.height-dh)/2; }
        else { dw = canvas.height*iR; dx = (canvas.width-dw)/2; }
        ctx.drawImage(img, dx, dy, dw, dh);
    }

    // Lazy preload: first 10 priority, rest in batches
    function loadFrame(i) {
        return new Promise(resolve => {
            const img = new Image(); img.src = framePath(i);
            img.onload = () => { images[i] = img; resolve(); };
            img.onerror = resolve;
        });
    }
    const priority = [];
    for (let i = 0; i < 10 && i < frameCount; i++) priority.push(loadFrame(i));
    Promise.all(priority).then(() => {
        resizeCanvas();
        let idx = 10;
        (function batch() {
            if (idx >= frameCount) return;
            const b = [];
            for (let j = 0; j < 5 && idx < frameCount; j++, idx++) b.push(loadFrame(idx));
            Promise.all(b).then(() => requestAnimationFrame(batch));
        })();
    });

    // === MASTER LOOP ===
    const progressBar = document.querySelector('.progress-bar');
    const t1 = document.getElementById('text-1');
    const t2 = document.getElementById('text-2');
    const t3 = document.getElementById('text-3');
    const parallaxBgs = document.querySelectorAll('.parallax-bg');

    let targetScroll = window.scrollY, currentScroll = window.scrollY;
    window.addEventListener('scroll', () => { targetScroll = window.scrollY; }, { passive: true });

    function masterLoop() {
        currentScroll += (targetScroll - currentScroll) * .1;
        const docH = document.body.scrollHeight - window.innerHeight;

        // Progress bar
        if (docH > 0) progressBar.style.width = (currentScroll/docH*100)+'%';

        // Navbar
        if (!menuOpen) {
            if (currentScroll > lastY && currentScroll > 120) { header.classList.add('nav-hidden'); header.classList.remove('nav-visible'); }
            else { header.classList.remove('nav-hidden'); header.classList.add('nav-visible'); }
        }
        if (currentScroll > 60) header.classList.add('scrolled'); else header.classList.remove('scrolled');
        lastY = targetScroll;

        // Active link
        let cur = '';
        const targets = ['hero', 'summary', 'skills', 'projects', 'experience', 'education', 'certifications', 'contact'];
        targets.forEach(id => {
            const el = document.getElementById(id);
            if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) {
                cur = id;
            }
        });
        navLs.forEach(l => {
            if (l.getAttribute('href') === '#' + cur) l.classList.add('active');
            else l.classList.remove('active');
        });

        // Canvas
        const secTop = scrollSec.offsetTop, secH = scrollSec.offsetHeight - window.innerHeight;
        let p = secH > 0 ? (currentScroll - secTop)/secH : 0;
        p = Math.max(0, Math.min(1, p));
        const fi = Math.floor(p*(frameCount-1));
        if (fi !== currentFrame) { currentFrame = fi; renderFrame(fi); }
        animText(t1, p, 0, .25);
        animText(t2, p, .35, .60);
        animText(t3, p, .70, .95);

        // Sticky 3D
        const sticky = document.querySelector('.sticky-container');
        if (p > 0 && p < 1) { sticky.style.transform = 'scale('+(1+p*.04)+') rotateX('+((p-.5)*3)+'deg)'; }
        else sticky.style.transform = p >= 1 ? 'scale(1.04) rotateX(1.5deg)' : '';

        // Parallax blobs
        if (!reduceMotion) {
            parallaxBgs.forEach(el => {
                const speed = parseFloat(el.dataset.speed) || .02;
                el.style.transform = 'translateY('+(currentScroll*speed*-60)+'px)';
            });
        }

        requestAnimationFrame(masterLoop);
    }

    function animText(el, p, start, end) {
        if (!el) return;
        const range = end-start, mid = start+range/2;
        if (p >= start && p <= end) {
            let o = p <= mid ? (p-start)/(range/2) : 1-(p-mid)/(range/2);
            const y = 50*(1-(p-start)/range), b = 8*(1-o);
            el.style.opacity = o;
            el.style.transform = 'translate(-50%,calc(-50% + '+y+'px))';
            el.style.filter = 'blur('+b+'px)';
            el.querySelectorAll('.parallax-text').forEach(c => {
                const sp = parseFloat(c.dataset.speed) || .1;
                c.style.transform = 'translateY('+((p-mid)*180*sp)+'px)';
            });
        } else { el.style.opacity = 0; el.style.filter = 'blur(8px)'; }
    }

    masterLoop();
});
