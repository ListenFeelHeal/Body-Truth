// --- 1. ГЛАДКИЙ СКРОЛ (LENIS) ---
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    smooth: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// --- 2. GSAP (REVEAL ON SCROLL) ---
gsap.registerPlugin(ScrollTrigger);

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time)=>{ lenis.raf(time * 1000) });
gsap.ticker.lagSmoothing(0);

document.addEventListener("DOMContentLoaded", () => {
    const reveals = gsap.utils.toArray('.reveal-up');
    
    reveals.forEach((elem) => {
        gsap.set(elem, { autoAlpha: 1 }); 
        
        gsap.from(elem, {
            scrollTrigger: {
                trigger: elem,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            y: 40,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });
});

// --- 3. SMART STICKY BAR (Точна логіка приховування/появи) ---
const stickyBar = document.getElementById('smart-sticky');
let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (!stickyBar) return;

    // Якщо ми на самому верху сайту (перші 500px) - ховаємо
    if (currentScroll < 500) {
        stickyBar.classList.add('hide');
    } 
    // Якщо скролимо ВНИЗ (читаємо) - ховаємо
    else if (currentScroll > lastScrollTop) {
        stickyBar.classList.add('hide');
    } 
    // Якщо скролимо ВГОРУ (шукаємо меню/кнопку) - показуємо
    else {
        stickyBar.classList.remove('hide');
    }
    
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; 
}, false);

// --- 4. МАСКА ТЕЛЕФОНУ (СТАБІЛЬНИЙ IMASK) ---
document.addEventListener("DOMContentLoaded", () => {
    const phoneInput = document.getElementById('user-phone');
    if (phoneInput) {
        const maskOptions = {
            mask: '+{380} (00) 000-00-00',
            lazy: false, // Одразу показує +380 (__) ___-__-__
            placeholderChar: '_'
        };
        const mask = IMask(phoneInput, maskOptions);
    }
});

// --- 5. POPUP ---
const modal = document.getElementById('popup-modal');
function openPopup() { 
    modal.classList.add('active'); 
    lenis.stop(); // Зупиняємо фоновий скрол
}
function closePopup() { 
    modal.classList.remove('active'); 
    lenis.start(); 
}
if (document.getElementById('close-popup')) {
    document.getElementById('close-popup').addEventListener('click', closePopup);
}
window.addEventListener('click', (e) => { if (e.target === modal) closePopup(); });
