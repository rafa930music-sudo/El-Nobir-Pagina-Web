// =========================================
// INICIALIZACIÓN AOS
// =========================================
AOS.init({ duration: 400, once: true, disable: 'mobile', startEvent: 'DOMContentLoaded' });

// =========================================
// PRELOADER - PARTÍCULAS + GLITCH
// =========================================
(function() {
    var preloader = document.getElementById('preloader');
    var preloaderHidden = false;
    var particlesBgAnimId = null;

    function hidePreloader() {
        if (!preloaderHidden && preloader) {
            preloaderHidden = true;
            preloader.classList.add('hidden');
            preloader.setAttribute('aria-hidden', 'true');
            if (particlesBgAnimId) { cancelAnimationFrame(particlesBgAnimId); particlesBgAnimId = null; }
            setTimeout(function() { if (preloader && preloader.parentNode) { preloader.parentNode.removeChild(preloader); } }, 800);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { setTimeout(hidePreloader, 2000); });
    } else {
        setTimeout(hidePreloader, 1500);
    }
    setTimeout(hidePreloader, 5000);

    // Partículas flotantes de fondo
    (function() {
        var pCanvas = document.getElementById('preloaderParticlesBg');
        if (!pCanvas) return;
        pCanvas.width = window.innerWidth;
        pCanvas.height = window.innerHeight;
        var pCtx = pCanvas.getContext('2d');
        var pParticles = [];
        for (var i = 0; i < 50; i++) {
            pParticles.push({ x: Math.random() * pCanvas.width, y: Math.random() * pCanvas.height, size: Math.random() * 3 + 0.5, speedX: (Math.random() - 0.5) * 0.4, speedY: -(Math.random() * 0.6 + 0.1), opacity: Math.random() * 0.4 + 0.15 });
        }
        function animateBgParticles() {
            if (preloaderHidden) return;
            pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
            for (var j = 0; j < pParticles.length; j++) {
                var pp = pParticles[j];
                pp.x += pp.speedX; pp.y += pp.speedY;
                if (pp.y < -10) { pp.y = pCanvas.height + 10; pp.x = Math.random() * pCanvas.width; }
                if (pp.x < 0) pp.x = pCanvas.width;
                if (pp.x > pCanvas.width) pp.x = 0;
                pCtx.beginPath(); pCtx.arc(pp.x, pp.y, pp.size, 0, Math.PI * 2);
                pCtx.fillStyle = 'rgba(255,20,147,' + pp.opacity + ')'; pCtx.fill();
            }
            particlesBgAnimId = requestAnimationFrame(animateBgParticles);
        }
        particlesBgAnimId = requestAnimationFrame(animateBgParticles);
    })();
})();

// =========================================
// NAVBAR SCROLL
// =========================================
(function() {
    var navbar = document.getElementById('navbar');
    var backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', function() {
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
        if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 500);
    });
    if (backToTop) backToTop.addEventListener('click', function() { window.scrollTo({ top: 0, behavior: 'smooth' }); });
})();

// =========================================
// MENÚ MÓVIL
// =========================================
(function() {
    var hamburger = document.getElementById('hamburger');
    var mobileMenu = document.getElementById('mobileMenu');
    var mobileClose = document.getElementById('mobileClose');
    function closeMenu() {
        if (mobileMenu) mobileMenu.classList.remove('active');
        if (hamburger) { hamburger.classList.remove('active'); hamburger.setAttribute('aria-expanded', 'false'); hamburger.setAttribute('aria-label', 'Abrir menú de navegación'); }
        document.body.style.overflow = '';
    }
    function openMenu() {
        if (mobileMenu) mobileMenu.classList.add('active');
        if (hamburger) { hamburger.classList.add('active'); hamburger.setAttribute('aria-expanded', 'true'); hamburger.setAttribute('aria-label', 'Cerrar menú de navegación'); }
        document.body.style.overflow = 'hidden';
    }
    if (hamburger) hamburger.addEventListener('click', function() { if (mobileMenu && mobileMenu.classList.contains('active')) closeMenu(); else openMenu(); });
    if (mobileClose) mobileClose.addEventListener('click', closeMenu);
    var mobileLinks = document.querySelectorAll('.mobile-menu a');
    for (var i = 0; i < mobileLinks.length; i++) mobileLinks[i].addEventListener('click', closeMenu);
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) closeMenu(); });
})();

// =========================================
// REPRODUCTOR DE AUDIO
// =========================================
(function() {
    var tracks = ["https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3","https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3","https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"];
    var currentAudio = null, currentButton = null;
    function initPlayer(selector, attr) {
        var buttons = document.querySelectorAll(selector);
        for (var i = 0; i < buttons.length; i++) {
            (function(btn) {
                btn.addEventListener('click', function() {
                    var index = parseInt(btn.getAttribute(attr));
                    if (isNaN(index) || index < 0 || index >= tracks.length) return;
                    var src = tracks[index];
                    if (currentAudio && currentAudio.src === src && !currentAudio.paused) {
                        currentAudio.pause(); btn.innerHTML = '<i class="fas fa-play" aria-hidden="true"></i>'; btn.classList.remove('playing');
                        updateLabel(btn, 'Reproducir'); currentAudio = null; currentButton = null; return;
                    }
                    if (currentAudio) { currentAudio.pause(); if (currentButton) { currentButton.innerHTML = '<i class="fas fa-play" aria-hidden="true"></i>'; currentButton.classList.remove('playing'); updateLabel(currentButton, 'Reproducir'); } }
                    var audio = new Audio(src);
                    audio.play().then(function() {
                        btn.innerHTML = '<i class="fas fa-pause" aria-hidden="true"></i>'; btn.classList.add('playing'); updateLabel(btn, 'Pausar');
                        currentAudio = audio; currentButton = btn;
                        audio.addEventListener('ended', function() { btn.innerHTML = '<i class="fas fa-play" aria-hidden="true"></i>'; btn.classList.remove('playing'); updateLabel(btn, 'Reproducir'); if (currentAudio === audio) { currentAudio = null; currentButton = null; } });
                        audio.addEventListener('error', function() { btn.innerHTML = '<i class="fas fa-play" aria-hidden="true"></i>'; btn.classList.remove('playing'); updateLabel(btn, 'Reproducir'); currentAudio = null; currentButton = null; });
                    }).catch(function() { alert('No se pudo reproducir el audio. Prueba con otra pista.'); });
                });
            })(buttons[i]);
        }
    }
    function updateLabel(btn, action) { var trackItem = btn.closest('.track-item'); var titleEl = trackItem ? trackItem.querySelector('.track-title') : null; var title = titleEl ? titleEl.textContent : 'pista'; btn.setAttribute('aria-label', action + ' ' + title); }
    initPlayer('.play-btn', 'data-track'); initPlayer('.play-btn-feat', 'data-track-feat');
})();

// =========================================
// ACORDEONES
// =========================================
(function() {
    var accordions = document.querySelectorAll('.accordion');
    for (var i = 0; i < accordions.length; i++) {
        (function(accordion) {
            var header = accordion.querySelector('.accordion-header');
            if (!header) return;
            header.setAttribute('aria-expanded', 'false');
            header.addEventListener('click', function() {
                var isActive = accordion.classList.contains('active');
                for (var j = 0; j < accordions.length; j++) {
                    if (accordions[j] !== accordion) { accordions[j].classList.remove('active'); var otherHeader = accordions[j].querySelector('.accordion-header'); if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false'); }
                }
                accordion.classList.toggle('active'); header.setAttribute('aria-expanded', !isActive);
            });
        })(accordions[i]);
    }
})();

// =========================================
// MODO OSCURO/CLARO
// =========================================
(function() {
    var themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    var themeIcon = themeToggle.querySelector('i');
    if (!themeIcon) return;
    if (localStorage.getItem('theme') === 'light') { document.body.classList.add('light-mode'); themeIcon.classList.replace('fa-moon', 'fa-sun'); }
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('light-mode');
        var isLight = document.body.classList.contains('light-mode');
        if (isLight) themeIcon.classList.replace('fa-moon', 'fa-sun'); else themeIcon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
})();

// =========================================
// PARTÍCULAS CANVAS (HERO)
// =========================================
(function() {
    var canvas = document.getElementById('particles');
    if (!canvas) return;
    if (window.innerWidth < 768) { canvas.style.display = 'none'; return; }
    var ctx = canvas.getContext('2d'), particles = [], animationId = null;
    function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    function createParticles() { particles = []; var count = window.innerWidth < 1024 ? 30 : 60; for (var i = 0; i < count; i++) particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, size: Math.random() * 2 + 0.5, speedX: (Math.random() - 0.5) * 0.3, speedY: -(Math.random() * 0.4 + 0.1), opacity: Math.random() * 0.5 + 0.2 }); }
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < particles.length; i++) { var p = particles[i]; p.x += p.speedX; p.y += p.speedY; if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; } if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,20,147,' + p.opacity + ')'; ctx.fill(); }
        animationId = requestAnimationFrame(animateParticles);
    }
    resizeCanvas(); createParticles(); animateParticles();
    var resizeTimeout;
    window.addEventListener('resize', function() { clearTimeout(resizeTimeout); resizeTimeout = setTimeout(function() { resizeCanvas(); createParticles(); }, 250); });
    document.addEventListener('visibilitychange', function() { if (document.hidden) { if (animationId) { cancelAnimationFrame(animationId); animationId = null; } } else { if (!animationId) animateParticles(); } });
})();

// PARALLAX SUAVE EN EL HERO
(function() {
    var heroBg = document.getElementById('heroBg');
    if (!heroBg) return;
    window.addEventListener('scroll', function() {
        var scrolled = window.pageYOffset;
        // Solo se mueve si el elemento está en viewport
        var hero = document.querySelector('.hero');
        if (hero && hero.getBoundingClientRect().bottom > 0) {
            heroBg.style.transform = 'translateY(' + (scrolled * 0.15) + 'px)';
        }
    }, { passive: true });
})();

// CURSOR PERSONALIZADO CON ESTELA
(function() {
    var cursor = document.getElementById('customCursor');
    if (!cursor) return;
    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    // Efecto al pasar sobre enlaces y botones
    var links = document.querySelectorAll('a, button, .btn, .play-btn, .accordion-header');
    for (var i = 0; i < links.length; i++) {
        links[i].addEventListener('mouseenter', function() { cursor.classList.add('active'); });
        links[i].addEventListener('mouseleave', function() { cursor.classList.remove('active'); });
    }
    // Ocultar cursor real
    document.body.style.cursor = 'none';
    // Restaurar al salir de la página (por si acaso)
    window.addEventListener('mouseleave', function() { cursor.style.opacity = '0'; });
    window.addEventListener('mouseenter', function() { cursor.style.opacity = '1'; });
})();

// ESTELA DE PARTÍCULAS ROSAS
(function() {
    var canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '99998';
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var particles = [];
    var mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        for (var i = 0; i < 2; i++) {
            particles.push({
                x: mouseX,
                y: mouseY,
                size: Math.random() * 4 + 2,
                speedX: (Math.random() - 0.5) * 2,
                speedY: (Math.random() - 0.5) * 2,
                life: 1,
                decay: 0.02 + Math.random() * 0.03
            });
        }
    });

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = particles.length - 1; i >= 0; i--) {
            var p = particles[i];
            p.x += p.speedX;
            p.y += p.speedY;
            p.life -= p.decay;
            if (p.life <= 0) {
                particles.splice(i, 1);
                continue;
            }
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,20,147,' + p.life + ')';
            ctx.fill();
        }
        requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
})();

// WIPE NEÓN CORREGIDO
(function() {
    var sections = document.querySelectorAll('section');
    // Inicialmente todas las secciones NO tienen la clase "revealed" 
    // -> la cortina las cubre completamente
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                // Añadir clase para abrir la cortina con transición
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.2 });  // Se activa cuando el 20% de la sección es visible

    sections.forEach(function(section) {
        observer.observe(section);
    });
})();


// =========================================
// SCHEMA.ORG
// =========================================
(function() {
    var schemas = [{ "@context": "https://schema.org", "@type": "Person", "name": "Pau Constantí", "alternateName": "ELNOBIR", "jobTitle": "Artista de Reguetón", "url": "https://elnobir.com", "sameAs": ["https://www.instagram.com/elnobir/","https://www.youtube.com/@elnobir","https://open.spotify.com/artist/2dgNUOfjtguki04EaDh2m2"] },{ "@context": "https://schema.org", "@type": "MusicGroup", "name": "ELNOBIR", "alternateName": "Pau Constantí", "url": "https://elnobir.com", "genre": "Reguetón", "sameAs": ["https://www.instagram.com/elnobir/","https://www.youtube.com/@elnobir","https://open.spotify.com/artist/2dgNUOfjtguki04EaDh2m2"] }];
    for (var i = 0; i < schemas.length; i++) { var script = document.createElement('script'); script.type = 'application/ld+json'; script.textContent = JSON.stringify(schemas[i]); document.head.appendChild(script); }
})();