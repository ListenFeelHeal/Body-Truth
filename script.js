// --- 1. ПЛАВНИЙ СКРОЛ (LENIS) ---
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Плавна кіношна крива
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// --- 2. GSAP АНІМАЦІЇ ПОЯВИ (REVEAL ON SCROLL) ---
gsap.registerPlugin(ScrollTrigger);

// Синхронізація GSAP та Lenis
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time)=>{ lenis.raf(time * 1000) });
gsap.ticker.lagSmoothing(0);

// Анімуємо всі елементи з класом .gsap-reveal
document.addEventListener("DOMContentLoaded", () => {
    const reveals = gsap.utils.toArray('.gsap-reveal');
    
    reveals.forEach((elem) => {
        // Автоматично робимо їх видимими для GSAP
        gsap.set(elem, { autoAlpha: 1 }); 
        
        gsap.from(elem, {
            scrollTrigger: {
                trigger: elem,
                start: "top 85%", // Починає анімацію, коли верх елемента на 85% висоти екрану
                toggleActions: "play none none none"
            },
            y: 40, // Виїжджає знизу на 40px
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            stagger: 0.2 // Якщо елементів кілька, вони з'являться каскадом
        });
    });
});

// --- 3. SMART STICKY BAR (Ховається при скролі вниз, з'являється вгору) ---
const stickyBar = document.getElementById('smart-sticky');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    if (!stickyBar) return;

    // Якщо скролимо вниз і ми нижче 300px від верху — ховаємо кнопку
    if (currentScroll > lastScrollTop && currentScroll > 300) {
        stickyBar.classList.add('hide');
    } 
    // Якщо скролимо вгору — показуємо
    else {
        stickyBar.classList.remove('hide');
    }
    
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // Захист від від'ємного скролу
}, false);

// --- 4. POPUP ---
const modal = document.getElementById('popup-modal');
function openPopup() { 
    modal.classList.add('active'); 
    lenis.stop(); // Зупиняємо скрол сайту, коли відкрито модалку
}
function closePopup() { 
    modal.classList.remove('active'); 
    lenis.start(); // Відновлюємо скрол
}
if (document.getElementById('close-popup')) {
    document.getElementById('close-popup').addEventListener('click', closePopup);
}
window.addEventListener('click', (e) => { if (e.target === modal) closePopup(); });

// --- 5. ТАЙМЕР ---
function initTimer() {
    let endTime = localStorage.getItem('courseTimerDirect');
    const now = new Date().getTime();
    if (!endTime || parseInt(endTime, 10) <= now) {
        endTime = now + (5 * 60 * 60 * 1000); 
        localStorage.setItem('courseTimerDirect', endTime);
    } else {
        endTime = parseInt(endTime, 10);
    }
    return endTime;
}
let endTime = initTimer();

function updateTimers() {
    const now = new Date().getTime();
    let timeLeft = endTime - now;
    if (timeLeft <= 0) { 
        endTime = now + (5 * 60 * 60 * 1000);
        localStorage.setItem('courseTimerDirect', endTime);
        timeLeft = endTime - now;
    }
    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    function formatTime(time) { return time < 10 ? `0${time}` : time; }

    const timerElement = document.getElementById('landing-timer');
    if (timerElement) {
        timerElement.querySelector('.hours').textContent = formatTime(hours);
        timerElement.querySelector('.minutes').textContent = formatTime(minutes);
        timerElement.querySelector('.seconds').textContent = formatTime(seconds);
    }
}
setInterval(updateTimers, 1000);
updateTimers();
