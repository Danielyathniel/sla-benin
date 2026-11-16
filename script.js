// ===================================
// PRELOADER
// ===================================
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        // Ajout de la classe 'hide' pour la transition CSS
        preloader.classList.add('hide'); 
    }, 1000);
});


// Désactiver le clic droit et les raccourcis clavier de copie
document.addEventListener('contextmenu', function(e) {
    e.preventDefault(); // Empêche l'ouverture du menu contextuel
    alert('Clic droit désactivé pour protéger le contenu.'); // Avertissement optionnel
});

document.addEventListener('keydown', function(e) {
    // Désactive Ctrl+C (ou Cmd+C sur Mac), Ctrl+X, Ctrl+U, etc.
    if (e.ctrlKey && (e.key === 'c' || e.key === 'x' || e.key === 'u')) {
        e.preventDefault();
        alert('Cette action est désactivée.');
    }
});

// ===================================
// NAVIGATION MOBILE
// ===================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Fermer le menu quand on clique sur un lien
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ===================================
// NAVBAR SCROLL EFFECT
// ===================================
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ===================================
// HERO SLIDER (CAROUSEL) : OPTIMISÉ AVEC RÉINITIALISATION DE L'INTERVALLE
// ===================================
(function() {
    let slideIndex = 0; // Renommée pour éviter conflit avec fonction exportée
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const totalSlides = slides.length;
    let slideInterval;
    const intervalTime = 5000; // 5 secondes

    if (totalSlides === 0) return; // S'assurer que le slider existe

    function showSlide(n) {
        // Bouclage des slides
        slideIndex = (n + totalSlides) % totalSlides;
        
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[slideIndex].classList.add('active');
        dots[slideIndex].classList.add('active');
    }

    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(() => {
            showSlide(slideIndex + 1);
        }, intervalTime);
    }
    
    function changeSlide(n) {
        showSlide(slideIndex + n);
        resetInterval(); // Réinitialiser après interaction manuelle (flèche)
    }

    function goToSlide(n) {
        showSlide(n);
        resetInterval(); // Réinitialiser après interaction manuelle (point)
    }

    // Initialisation
    document.addEventListener('DOMContentLoaded', () => {
        showSlide(slideIndex);
        resetInterval();
    });

    // Rendre les fonctions accessibles globalement pour les 'onclick' du HTML
    window.changeSlide = changeSlide;
    window.currentSlide = goToSlide; // Le HTML utilise currentSlideFunc (renommée en goToSlide)
    
    // Swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    const sliderElement = document.querySelector('.hero-slider');
    if (sliderElement) {
        sliderElement.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });

        sliderElement.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }

    function handleSwipe() {
        // Décalage minimal pour être considéré comme un glissement
        const swipeThreshold = 50; 

        if (touchEndX < touchStartX - swipeThreshold) {
            changeSlide(1); // Glissement vers la gauche = slide suivante
        } else if (touchEndX > touchStartX + swipeThreshold) {
            changeSlide(-1); // Glissement vers la droite = slide précédente
        }
    }


})();


// ===================================
// STATS COUNTER ANIMATION
// ===================================
const statsSection = document.querySelector('.stats-section');
let statsAnimated = false;

function animateStats() {
    if (statsAnimated) return;
    
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                // Utilisation de toLocaleString pour les séparateurs de milliers
                stat.textContent = Math.ceil(current).toLocaleString('fr-FR'); 
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target.toLocaleString('fr-FR');
            }
        };
        
        updateCounter();
    });
    
    statsAnimated = true;
}

// Observer pour déclencher l'animation quand la section est visible
if (statsSection) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                // Arrêter l'observation après l'animation
                observer.unobserve(statsSection); 
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(statsSection);
}

// ===================================
// SCROLL TO TOP BUTTON
// ===================================
const scrollTopBtn = document.getElementById('scrollTop');

if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        // Utilisation de window.scrollY au lieu de pageYOffset qui est déprécié
        if (window.scrollY > 300) { 
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===================================
// AOS ANIMATION INITIALIZATION
// ===================================
// S'assurer que AOS.init est appelé une seule fois, au chargement
document.addEventListener('DOMContentLoaded', () => {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
});


// ===================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                // Décalage de 80px pour laisser de la place à la barre de navigation fixe
                const offsetTop = target.offsetTop - 80; 
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ===================================
// FORM VALIDATION (pour la page contact)
// ===================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Récupérer les valeurs
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        // const phone = document.getElementById('phone').value.trim(); // Non utilisé dans la validation
        const message = document.getElementById('message').value.trim();
        
        // Validation simple
        if (!name || !email || !message) {
            showAlert('Veuillez remplir tous les champs obligatoires', 'error');
            return;
        }
        
        // Validation email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showAlert('Veuillez entrer une adresse email valide', 'error');
            return;
        }
        
        // Simulation d'envoi
        showAlert('Votre message a été envoyé avec succès! Nous vous contacterons bientôt.', 'success');
        contactForm.reset();
    });
}

function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#75A13F' : '#e74c3c'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        /* Ajout d'une animation CSS pour l'entrée */
        transition: transform 0.3s ease-out, opacity 0.3s ease-out;
        transform: translateX(100%);
        opacity: 0;
    `;
    
    document.body.appendChild(alert);
    
    // Afficher l'alerte
    requestAnimationFrame(() => {
        alert.style.transform = 'translateX(0)';
        alert.style.opacity = '1';
    });
    
    setTimeout(() => {
        // Cacher l'alerte
        alert.style.transform = 'translateX(100%)';
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}

// ===================================
// PARALLAX EFFECT
// ===================================
window.addEventListener('scroll', () => {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    parallaxElements.forEach(el => {
        const speed = el.getAttribute('data-parallax') || 0.5;
        // Utilisation de window.scrollY
        const yPos = -(window.scrollY * speed);
        el.style.transform = `translateY(${yPos}px)`;
    });
});

// ===================================
// LAZY LOADING IMAGES
// ===================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) { // Vérification de l'attribut data-src
                    img.src = img.dataset.src;
                }
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===================================
// PREVENT RIGHT CLICK (Optional)
// ===================================
/*
document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
    }
});
*/

// ===================================
// CONSOLE SIGNATURE
// ===================================
console.log('%c Designed & Developed by Alliance ODAH ', 'background: #75A13F; color: white; font-size: 16px; padding: 10px; border-radius: 5px;');
console.log('%c 🚀 SIL Campus Bénin - 2025 ', 'background: #2c3e50; color: white; font-size: 14px; padding: 8px;');

// ===================================
// PERFORMANCE MONITORING
// ===================================
window.addEventListener('load', () => {
    if (window.performance) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⚡ Page chargée en ${pageLoadTime}ms`);
    }
});

// ===================================
// KEYBOARD NAVIGATION
// ===================================
document.addEventListener('keydown', (e) => {
    // Slider navigation avec flèches - Utilise la fonction globale 'changeSlide'
    if (document.querySelector('.hero-slider')) {
        if (e.key === 'ArrowLeft') window.changeSlide(-1);
        if (e.key === 'ArrowRight') window.changeSlide(1);
    }
    
    // Scroll to top avec Ctrl + Home
    if (e.key === 'Home' && e.ctrlKey) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// ===================================
// CURSOR CUSTOM (Optional - Pour desktop uniquement)
// ===================================
if (window.innerWidth > 768) {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        width: 20px;
        height: 20px;
        border: 2px solid #75A13F;
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.2s ease;
        display: none;
    `;
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.display = 'block';
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });
    
    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.borderColor = '#5a7f31';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.borderColor = '#75A13F';
        });
    });
}

// ===================================
// PAGE VISIBILITY API
// ===================================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.title = '👋 Revenez vite! - SIL Campus';
    } else {
        document.title = 'SIL Campus Bénin - Accueil';
    }

    document.addEventListener('DOMContentLoaded', function() {
    // 1. Fonction pour masquer l'alerte après un délai
    function hideAlert(element) {
        setTimeout(function() {
            element.style.display = 'none';
        }, 8000); // 8 secondes
    }

    // 2. Vérifier les paramètres 'success' ou 'error'
    const urlParams = new URLSearchParams(window.location.search);
    const successAlert = document.getElementById('alertSuccess');
    const errorAlert = document.getElementById('alertError');

    if (urlParams.get('success') === 'true' && successAlert) {
        successAlert.style.display = 'flex';
        hideAlert(successAlert);
    } else if (urlParams.get('error') === 'true' && errorAlert) {
        errorAlert.style.display = 'flex';
        // Mettre à jour le message d'erreur si vous voulez un message générique
        document.getElementById('errorMessage').textContent = 'Erreur serveur lors de l\'envoi. Veuillez réessayer.';
        hideAlert(errorAlert);
    }
    
    // OPTIONNEL : Nettoyer l'URL après l'affichage pour éviter la réapparition au rechargement
    if (window.history.replaceState) {
        const cleanUrl = window.location.pathname;
        window.history.replaceState(null, '', cleanUrl);
    }
    // ... reste de votre code JS ...
});
});