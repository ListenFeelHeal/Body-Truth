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

// Синхронізація Lenis та GSAP
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time)=>{ lenis.raf(time * 1000) });
gsap.ticker.lagSmoothing(0);

document.addEventListener("DOMContentLoaded", () => {
    // Всі елементи з класом reveal-up
    const reveals = gsap.utils.toArray('.reveal-up');
    
    reveals.forEach((elem) => {
        gsap.set(elem, { autoAlpha: 1 }); // Знімаємо hidden
        
        gsap.from(elem, {
            scrollTrigger: {
                trigger: elem,
                start: "top 85%", // Починається, коли елемент на 85% екрану
                toggleActions: "play none none none"
            },
            y: 40,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // --- 3. LOTTIE АНІМАЦІЇ (МІКРОІНТЕРАКЦІЇ) ---
    // Я використовую публічні посилання на гарні мінімалістичні анімації. 
    // Ти зможеш замінити URL на свої власні JSON файли, якщо захочеш.
    const lottieData = [
        { id: 'lottie-pain', url: 'https://assets2.lottiefiles.com/packages/lf20_q5pk6p1k.json' }, // Пульс/Блискавка
        { id: 'lottie-nausea', url: 'https://assets9.lottiefiles.com/packages/lf20_t2xgmroi.json' }, // Вихор
        { id: 'lottie-cycle', url: 'https://assets8.lottiefiles.com/private_files/lf30_jlkegzxg.json' }, // Крапля/Квітка
        { id: 'lottie-tension', url: 'https://assets2.lottiefiles.com/packages/lf20_rbhngjcx.json' } // Камінь/Замок
    ];

    lottieData.forEach(item => {
        if(document.getElementById(item.id)) {
            lottie.loadAnimation({
                container: document.getElementById(item.id),
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: item.url 
            });
        }
    });
});

// --- 4. SMART STICKY BAR (Розумна кнопка) ---
const stickyBar = document.getElementById('smart-sticky');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (!stickyBar) return;

    // Ховаємо, якщо скролимо вниз і ми нижче першого екрана
    if (currentScroll > lastScrollTop && currentScroll > 500) {
        stickyBar.classList.add('hide');
    } 
    // Показуємо, якщо скролимо вгору (або ми на самому верху)
    else {
        stickyBar.classList.remove('hide');
    }
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; 
}, false);

// --- 5. МАСКА ТЕЛЕФОНУ (IMASK) ---
const phoneInput = document.getElementById('user-phone');
if (phoneInput) {
    const maskOptions = {
        mask: '+{380} (00) 000-00-00',
        lazy: false // Показує плейсхолдер маски одразу при кліку
    };
    const mask = IMask(phoneInput, maskOptions);
}

// --- 6. POPUP ---
const modal = document.getElementById('popup-modal');
function openPopup() { 
    modal.classList.add('active'); 
    lenis.stop(); // Зупиняємо скрол фону
}
function closePopup() { 
    modal.classList.remove('active'); 
    lenis.start(); 
}
if (document.getElementById('close-popup')) {
    document.getElementById('close-popup').addEventListener('click', closePopup);
}
window.addEventListener('click', (e) => { if (e.target === modal) closePopup(); });

// --- 7. ТАЙМЕР ---
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
