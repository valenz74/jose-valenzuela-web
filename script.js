// MENÚ HAMBURGUESA
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-list a').forEach(link => {
    link.addEventListener('click', () => navMenu.classList.remove('active'));
});

// FAQ ACORDEÓN (solo uno abierto a la vez)
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
    });
});

// DATOS DEL PORTAFOLIO
const proyectos = [
    {
        nombre: "Repuestos Alternativos",
        imagenes: [
            "imagenes/ralternativos1.jpg",
            "imagenes/ralternativos2.jpg",
            "imagenes/ralternativos3.jpg",
            "imagenes/ralternativos4.jpg",
            "imagenes/ralternativos5.jpg",
            "imagenes/ralternativos6.jpg"
        ]
    },
    {
        nombre: "Aprueba Xtreme",
        imagenes: [
            "imagenes/plataforma-formacion1.jpg",
            "imagenes/plataforma-formacion2.jpg",
            "imagenes/plataforma-formacion3.jpg",
            "imagenes/plataforma-formacion4.jpg",
            "imagenes/plataforma-formacion5.jpg",
            "imagenes/plataforma-formacion6.jpg"
        ]
    },
    {
        nombre: "Academia Aprueba",
        imagenes: [
            "imagenes/aprueba1.jpg",
            "imagenes/aprueba2.jpg",
            "imagenes/aprueba3.jpg",
            "imagenes/aprueba4.jpg",
            "imagenes/aprueba5.jpg"
        ]
    }
];

// Renderizar tarjetas de portafolio
const portfolioGrid = document.getElementById('portfolioGrid');

function renderPortfolio() {
    portfolioGrid.innerHTML = '';
    proyectos.forEach((proy, idx) => {
        const card = document.createElement('div');
        card.className = 'portfolio-card';
        card.innerHTML = `
            <img src="${proy.imagenes[0]}" alt="${proy.nombre}" class="portfolio-img">
            <h3>${proy.nombre}</h3>
            <p>Proyecto web profesional, diseño conversivo.</p>
            <button class="portfolio-btn" data-proyecto="${idx}">Ver proyecto</button>
        `;
        portfolioGrid.appendChild(card);
    });

    document.querySelectorAll('.portfolio-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.dataset.proyecto;
            abrirPopupGaleria(proyectos[index].imagenes, proyectos[index].nombre);
        });
    });
}

// Abrir popup con galería de miniaturas
function abrirPopupGaleria(imagenes, titulo) {
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    const popupDiv = document.createElement('div');
    popupDiv.className = 'popup-container';
    popupDiv.innerHTML = `
        <button class="popup-close">&times;</button>
        <h3 style="margin-bottom:1rem">${titulo}</h3>
        <div class="popup-gallery"></div>
    `;
    const galleryDiv = popupDiv.querySelector('.popup-gallery');
    imagenes.forEach((imgUrl, idx) => {
        const img = document.createElement('img');
        img.src = imgUrl;
        img.alt = titulo;
        img.classList.add('gallery-thumb');
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            abrirLightboxConNavegacion(imagenes, idx);
        });
        galleryDiv.appendChild(img);
    });
    overlay.appendChild(popupDiv);
    document.body.appendChild(overlay);
    overlay.querySelector('.popup-close').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => { if(e.target === overlay) overlay.remove(); });
}

// Lightbox con navegación (flechas y X)
let currentLightbox = null;

function abrirLightboxConNavegacion(imagenes, indexActual) {
    if (currentLightbox) currentLightbox.remove();

    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';

    const container = document.createElement('div');
    container.className = 'lightbox-container';

    const img = document.createElement('img');
    img.src = imagenes[indexActual];
    img.className = 'lightbox-img';

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.className = 'lightbox-close';
    closeBtn.addEventListener('click', () => overlay.remove());

    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '&#10094;';
    prevBtn.className = 'lightbox-prev';
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = '&#10095;';
    nextBtn.className = 'lightbox-next';

    function updateImage(index) {
        let newIndex = index;
        if (newIndex < 0) newIndex = imagenes.length - 1;
        if (newIndex >= imagenes.length) newIndex = 0;
        img.src = imagenes[newIndex];
        return newIndex;
    }

    let currentIdx = indexActual;
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIdx = updateImage(currentIdx - 1);
    });
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIdx = updateImage(currentIdx + 1);
    });

    container.appendChild(img);
    container.appendChild(closeBtn);
    container.appendChild(prevBtn);
    container.appendChild(nextBtn);
    overlay.appendChild(container);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });

    currentLightbox = overlay;
}

// COOKIES
const cookiesBanner = document.getElementById('cookieBanner');
const acceptBtn = document.getElementById('acceptCookies');
const rejectBtn = document.getElementById('rejectCookies');

function getCookiePreference() {
    return localStorage.getItem('cookieConsent');
}

function setCookiePreference(value) {
    localStorage.setItem('cookieConsent', value);
    if (value === 'accepted') {
        console.log('✅ Cookies analíticas y de marketing ACTIVADAS');
    } else if (value === 'rejected') {
        console.log('❌ Solo cookies esenciales activas');
    }
    cookiesBanner.style.display = 'none';
}

if (getCookiePreference()) {
    cookiesBanner.style.display = 'none';
} else {
    cookiesBanner.style.display = 'flex';
}

acceptBtn.addEventListener('click', () => setCookiePreference('accepted'));
rejectBtn.addEventListener('click', () => setCookiePreference('rejected'));

// SMOOTH SCROLL
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

// EFECTO SOMBRA EN SCROLL
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 20) header.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
    else header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
});

// BOTÓN SCROLL TOP
const scrollTopBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }
});
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// INICIALIZAR PORTAFOLIO
renderPortfolio();