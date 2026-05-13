// ===== PARTÍCULAS =====
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;
        this.resizeObserver = null;
        this.init();
    }
    init() {
        this.resizeCanvas();
        this.createParticles(60);
        this.animate();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.resizeObserver = new ResizeObserver(() => this.resizeCanvas());
        const hero = document.querySelector('.hero');
        if (hero) this.resizeObserver.observe(hero);
    }
    resizeCanvas() {
        const hero = document.querySelector('.hero');
        if (hero) {
            const rect = hero.getBoundingClientRect();
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
            this.particles.forEach(p => {
                p.x = Math.random() * this.canvas.width;
                p.y = Math.random() * this.canvas.height;
            });
        }
    }
    createParticles(count) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2.5 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.6 + 0.2,
                color: ['#ffffff', '#aaccff', '#88aaff', '#cce4ff', '#ffffff'][Math.floor(Math.random() * 5)]
            });
        }
    }
    update() {
        for (let p of this.particles) {
            p.x += p.speedX;
            p.y += p.speedY;
            if (p.x < 0) { p.x = 0; p.speedX *= -0.98; }
            if (p.x > this.canvas.width) { p.x = this.canvas.width; p.speedX *= -0.98; }
            if (p.y < 0) { p.y = 0; p.speedY *= -0.98; }
            if (p.y > this.canvas.height) { p.y = this.canvas.height; p.speedY *= -0.98; }
            p.radius += (Math.random() - 0.5) * 0.1;
            p.radius = Math.min(3.5, Math.max(0.8, p.radius));
            p.opacity += (Math.random() - 0.5) * 0.02;
            p.opacity = Math.min(0.9, Math.max(0.2, p.opacity));
        }
    }
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let p of this.particles) {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.opacity;
            this.ctx.fill();
        }
        this.ctx.globalAlpha = 1;
    }
    animate() {
        this.update();
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}
let particleSystem = null;
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particlesCanvas');
    if (canvas && document.querySelector('.hero')) {
        particleSystem = new ParticleSystem(canvas);
    }
});

// ===== FUNCIONES PRINCIPALES =====
document.addEventListener('DOMContentLoaded', () => {
    // Menú hamburguesa
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
        document.querySelectorAll('.nav-list a').forEach(link => {
            link.addEventListener('click', () => navMenu.classList.remove('active'));
        });
    }

    // FAQ acordeón
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const q = item.querySelector('.faq-question');
        if (q) {
            q.addEventListener('click', () => {
                const active = item.classList.contains('active');
                faqItems.forEach(i => i.classList.remove('active'));
                if (!active) item.classList.add('active');
            });
        }
    });

    // Typed.js en títulos
    const typedElements = document.querySelectorAll('.typed-title');
    const typedInstances = new Map();
    const observerTitles = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.getAttribute('data-text');
                if (text && !typedInstances.has(el)) {
                    const typed = new Typed(el, {
                        strings: [text],
                        typeSpeed: 50,
                        backSpeed: 0,
                        startDelay: 200,
                        loop: false,
                        showCursor: false
                    });
                    typedInstances.set(el, typed);
                    observerTitles.unobserve(el);
                }
            }
        });
    }, { threshold: 0.5 });
    typedElements.forEach(el => observerTitles.observe(el));

    // Animación de entrada para tarjetas y testimonios
    const animatedElements = document.querySelectorAll('.service-card, .beneficio-card, .paso, .portfolio-card, .testimonial-card');
    const observerReveal = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observerReveal.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    animatedElements.forEach(el => observerReveal.observe(el));

    // ===== PORTAFOLIO =====
    const proyectos = [
        { nombre: "Virtual Academy Panamá", imagenes: Array.from({ length: 11 }, (_, i) => `imagenes/academia${i+1}.jpg`) },
        { nombre: "Elite Core", imagenes: Array.from({ length: 12 }, (_, i) => `imagenes/gimnasio${i+1}.jpg`) },
        { nombre: "Aurelia", imagenes: Array.from({ length: 11 }, (_, i) => `imagenes/joya${i+1}.jpg`) },
        { nombre: "Repuestos Alternativos", imagenes: [ "imagenes/ralternativos1.jpg", "imagenes/ralternativos2.jpg", "imagenes/ralternativos3.jpg", "imagenes/ralternativos4.jpg", "imagenes/ralternativos5.jpg", "imagenes/ralternativos6.jpg" ] },
        { nombre: "Aprueba Xtreme", imagenes: [ "imagenes/plataforma-formacion1.jpg", "imagenes/plataforma-formacion2.jpg", "imagenes/plataforma-formacion3.jpg", "imagenes/plataforma-formacion4.jpg", "imagenes/plataforma-formacion5.jpg", "imagenes/plataforma-formacion6.jpg" ] },
        { nombre: "Academia Aprueba", imagenes: [ "imagenes/aprueba1.jpg", "imagenes/aprueba2.jpg", "imagenes/aprueba3.jpg", "imagenes/aprueba4.jpg", "imagenes/aprueba5.jpg" ] }
    ];
    const portfolioGrid = document.getElementById('portfolioGrid');
    function renderPortfolio() {
        if (!portfolioGrid) return;
        portfolioGrid.innerHTML = '';
        proyectos.forEach((proy, idx) => {
            const card = document.createElement('div');
            card.className = 'portfolio-card';
            card.innerHTML = `
                <img src="${proy.imagenes[0]}" class="portfolio-img" onerror="this.src='https://placehold.co/400x300?text=Imagen+no+disponible'">
                <h3>${proy.nombre}</h3>
                <p>Proyecto web profesional, diseño conversivo.</p>
                <button class="portfolio-btn" data-proyecto="${idx}">Ver proyecto</button>
            `;
            portfolioGrid.appendChild(card);
        });
        document.querySelectorAll('.portfolio-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.currentTarget.getAttribute('data-proyecto');
                if (idx !== null && proyectos[idx]) abrirPopupGaleria(proyectos[idx].imagenes, proyectos[idx].nombre);
            });
        });
    }
    function abrirPopupGaleria(imagenes, titulo) {
        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay';
        const popupDiv = document.createElement('div');
        popupDiv.className = 'popup-container';
        popupDiv.innerHTML = `<button class="popup-close">&times;</button><h3>${titulo}</h3><div class="popup-gallery"></div>`;
        const gallery = popupDiv.querySelector('.popup-gallery');
        imagenes.forEach((url, i) => {
            const img = document.createElement('img');
            img.src = url;
            img.classList.add('gallery-thumb');
            img.onerror = () => img.src = 'https://placehold.co/400x300?text=Sin+imagen';
            img.addEventListener('click', (e) => { e.stopPropagation(); abrirLightbox(imagenes, i); });
            gallery.appendChild(img);
        });
        overlay.appendChild(popupDiv);
        document.body.appendChild(overlay);
        popupDiv.querySelector('.popup-close').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    }
    function abrirLightbox(imagenes, index) {
        const overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        const container = document.createElement('div');
        container.className = 'lightbox-container';
        const img = document.createElement('img');
        img.className = 'lightbox-img';
        let current = index;
        function update(idx) {
            let newIdx = idx;
            if (newIdx < 0) newIdx = imagenes.length - 1;
            if (newIdx >= imagenes.length) newIdx = 0;
            img.src = imagenes[newIdx];
            return newIdx;
        }
        img.src = imagenes[current];
        img.onerror = () => img.src = 'https://placehold.co/800x600?text=No+disponible';
        const close = document.createElement('button');
        close.innerHTML = '&times;'; close.className = 'lightbox-close';
        close.onclick = () => overlay.remove();
        const prev = document.createElement('button');
        prev.innerHTML = '&#10094;'; prev.className = 'lightbox-prev';
        prev.onclick = () => { current = update(current - 1); };
        const next = document.createElement('button');
        next.innerHTML = '&#10095;'; next.className = 'lightbox-next';
        next.onclick = () => { current = update(current + 1); };
        container.append(img, close, prev, next);
        overlay.appendChild(container);
        document.body.appendChild(overlay);
        overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    }
    renderPortfolio();

    // ===== COOKIES =====
    const cookiesBanner = document.getElementById('cookieBanner');
    const acceptBtn = document.getElementById('acceptCookies');
    const rejectBtn = document.getElementById('rejectCookies');
    if (cookiesBanner) {
        if (localStorage.getItem('cookieConsent')) cookiesBanner.style.display = 'none';
        else cookiesBanner.style.display = 'flex';
        acceptBtn?.addEventListener('click', () => { localStorage.setItem('cookieConsent', 'accepted'); cookiesBanner.style.display = 'none'; });
        rejectBtn?.addEventListener('click', () => { localStorage.setItem('cookieConsent', 'rejected'); cookiesBanner.style.display = 'none'; });
    }

    // ===== SMOOTH SCROLL Y BOTÓN SCROLL TOP =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === "#") return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    window.addEventListener('scroll', () => {
        if (scrollTopBtn) {
            if (window.scrollY > 300) scrollTopBtn.classList.add('show');
            else scrollTopBtn.classList.remove('show');
        }
        const header = document.querySelector('.header');
        if (window.scrollY > 20) header.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
        else header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
    });
    scrollTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});