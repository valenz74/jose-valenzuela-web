// ========== SISTEMA DE PARTÍCULAS ==========
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
                color: this.getRandomColor()
            });
        }
    }
    getRandomColor() {
        const colors = ['#ffffff', '#aaccff', '#88aaff', '#cce4ff', '#ffffff'];
        return colors[Math.floor(Math.random() * colors.length)];
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
    destroy() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
        if (this.resizeObserver) this.resizeObserver.disconnect();
        window.removeEventListener('resize', () => this.resizeCanvas());
    }
}
let particleSystem = null;
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particlesCanvas');
    if (canvas && document.querySelector('.hero')) {
        particleSystem = new ParticleSystem(canvas);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Menú, FAQ, Typed, etc. (sin cambios relevantes)
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
        document.querySelectorAll('.nav-list a').forEach(link => link.addEventListener('click', () => navMenu.classList.remove('active')));
    }
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const q = item.querySelector('.faq-question');
        if (q) q.addEventListener('click', () => {
            const active = item.classList.contains('active');
            faqItems.forEach(i => i.classList.remove('active'));
            if (!active) item.classList.add('active');
        });
    });
    const typedElements = document.querySelectorAll('.typed-title');
    const typedInstances = new Map();
    const observerTitles = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.getAttribute('data-text');
                if (text && !typedInstances.has(el)) {
                    const typed = new Typed(el, { strings: [text], typeSpeed: 50, backSpeed: 0, startDelay: 200, loop: false, showCursor: false });
                    typedInstances.set(el, typed);
                    observerTitles.unobserve(el);
                }
            }
        });
    }, { threshold: 0.5 });
    typedElements.forEach(el => observerTitles.observe(el));
    const animatedElements = document.querySelectorAll('.service-card, .beneficio-card, .paso, .portfolio-card');
    const observerReveal = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observerReveal.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    animatedElements.forEach(el => observerReveal.observe(el));

    // ========== PORTAFOLIO CON CREACIÓN FORZADA Y ESTILOS INLINE ==========
    const proyectos = [
        { nombre: "Repuestos Alternativos", imagenes: ["imagenes/ralternativos1.jpg","imagenes/ralternativos2.jpg","imagenes/ralternativos3.jpg","imagenes/ralternativos4.jpg","imagenes/ralternativos5.jpg","imagenes/ralternativos6.jpg"] },
        { nombre: "Aprueba Xtreme", imagenes: ["imagenes/plataforma-formacion1.jpg","imagenes/plataforma-formacion2.jpg","imagenes/plataforma-formacion3.jpg","imagenes/plataforma-formacion4.jpg","imagenes/plataforma-formacion5.jpg","imagenes/plataforma-formacion6.jpg"] },
        { nombre: "Academia Aprueba", imagenes: ["imagenes/aprueba1.jpg","imagenes/aprueba2.jpg","imagenes/aprueba3.jpg","imagenes/aprueba4.jpg","imagenes/aprueba5.jpg"] }
    ];

    function renderPortfolio() {
        let grid = document.getElementById('portfolioGrid');
        if (!grid) {
            const container = document.querySelector('.portafolio .container');
            if (container) {
                grid = document.createElement('div');
                grid.id = 'portfolioGrid';
                grid.className = 'portfolio-grid';
                container.appendChild(grid);
            } else return;
        }
        // Forzar estilos inline
        grid.style.display = 'grid';
        grid.style.visibility = 'visible';
        grid.style.opacity = '1';
        grid.style.minHeight = '200px';
        grid.innerHTML = '';
        proyectos.forEach((p, idx) => {
            const card = document.createElement('div');
            card.className = 'portfolio-card';
            card.style.display = 'block';
            card.style.visibility = 'visible';
            card.style.opacity = '1';
            card.innerHTML = `
                <img src="${p.imagenes[0]}" class="portfolio-img" onerror="this.src='https://placehold.co/400x300?text=Imagen+no+disponible'">
                <h3>${p.nombre}</h3>
                <p>Proyecto web profesional, diseño conversivo.</p>
                <button class="portfolio-btn" data-proyecto="${idx}">Ver proyecto</button>
            `;
            grid.appendChild(card);
        });
        document.querySelectorAll('.portfolio-btn').forEach(btn => {
            btn.removeEventListener('click', portfolioHandler);
            btn.addEventListener('click', portfolioHandler);
        });
        console.log("Portafolio renderizado. Grid visible:", grid.offsetHeight > 0);
    }

    function portfolioHandler(e) {
        const idx = e.currentTarget.getAttribute('data-proyecto');
        if (idx && proyectos[idx]) abrirPopupGaleria(proyectos[idx].imagenes, proyectos[idx].nombre);
    }

    function abrirPopupGaleria(imagenes, titulo) {
        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay';
        const popup = document.createElement('div');
        popup.className = 'popup-container';
        popup.innerHTML = `<button class="popup-close">&times;</button><h3>${titulo}</h3><div class="popup-gallery"></div>`;
        const gallery = popup.querySelector('.popup-gallery');
        imagenes.forEach((url, i) => {
            const img = document.createElement('img');
            img.src = url;
            img.className = 'gallery-thumb';
            img.onerror = () => img.src = 'https://placehold.co/400x300';
            img.addEventListener('click', (e) => { e.stopPropagation(); abrirLightbox(imagenes, i); });
            gallery.appendChild(img);
        });
        overlay.appendChild(popup);
        document.body.appendChild(overlay);
        popup.querySelector('.popup-close').onclick = () => overlay.remove();
        overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    }

    function abrirLightbox(imagenes, actual) {
        const overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        const container = document.createElement('div');
        container.className = 'lightbox-container';
        const img = document.createElement('img');
        img.className = 'lightbox-img';
        const update = (idx) => {
            let newIdx = idx;
            if (newIdx < 0) newIdx = imagenes.length - 1;
            if (newIdx >= imagenes.length) newIdx = 0;
            img.src = imagenes[newIdx];
            return newIdx;
        };
        let current = update(actual);
        const close = document.createElement('button');
        close.innerHTML = '&times;';
        close.className = 'lightbox-close';
        close.onclick = () => overlay.remove();
        const prev = document.createElement('button');
        prev.innerHTML = '&#10094;';
        prev.className = 'lightbox-prev';
        prev.onclick = () => { current = update(current - 1); };
        const next = document.createElement('button');
        next.innerHTML = '&#10095;';
        next.className = 'lightbox-next';
        next.onclick = () => { current = update(current + 1); };
        container.append(img, close, prev, next);
        overlay.appendChild(container);
        document.body.appendChild(overlay);
        overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    }

    renderPortfolio();
    setTimeout(renderPortfolio, 300);
    setTimeout(renderPortfolio, 800);

    // Cookies, scroll, etc.
    const banner = document.getElementById('cookieBanner');
    const accept = document.getElementById('acceptCookies');
    const reject = document.getElementById('rejectCookies');
    if (banner) {
        if (localStorage.getItem('cookieConsent')) banner.style.display = 'none';
        else banner.style.display = 'flex';
        accept?.addEventListener('click', () => { localStorage.setItem('cookieConsent', 'accepted'); banner.style.display = 'none'; });
        reject?.addEventListener('click', () => { localStorage.setItem('cookieConsent', 'rejected'); banner.style.display = 'none'; });
    }
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            const id = this.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
        });
    });
    const topBtn = document.getElementById('scrollTopBtn');
    window.addEventListener('scroll', () => {
        if (topBtn) (window.scrollY > 300) ? topBtn.classList.add('show') : topBtn.classList.remove('show');
        const header = document.querySelector('.header');
        if (window.scrollY > 20) header.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
        else header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
    });
    topBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});