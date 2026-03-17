// --- ТАЙМЕР ---
function initTimer() {
    let endTime = localStorage.getItem('courseTimerDirect');
    const now = new Date().getTime();
    if (!endTime || parseInt(endTime, 10) <= now) {
        endTime = now + (5 * 60 * 60 * 1000); // 5 годин
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

// --- POPUP ---
const modal = document.getElementById('popup-modal');
function openPopup() { modal.classList.add('active'); }
function closePopup() { modal.classList.remove('active'); }
if (document.getElementById('close-popup')) {
    document.getElementById('close-popup').addEventListener('click', closePopup);
}
window.addEventListener('click', (e) => { if (e.target === modal) closePopup(); });

// --- ІНТЕРАКТИВНА ГАЛЕРЕЯ ЧАТ-БОТА (Нова функція) ---
const phoneGallery = document.getElementById('phone-gallery');
if (phoneGallery) {
    phoneGallery.addEventListener('click', () => {
        // Додаємо або прибираємо клас, який змінює місцями телефони
        phoneGallery.classList.toggle('swapped');
    });
}

// --- РОЗУМНА STICKY-КНОПКА ---
const stickyBar = document.getElementById('smart-sticky');
const programSection = document.getElementById('program');

window.addEventListener('scroll', () => {
    if (!stickyBar || !programSection) return;
    
    const rect = programSection.getBoundingClientRect();
    // Кнопка з'являється, коли блок програми доходить до середини екрану
    if (rect.top < window.innerHeight / 2) {
        stickyBar.classList.add('visible');
    } else {
        stickyBar.classList.remove('visible');
    }
});

// --- ПЛАВНА АНІМАЦІЯ ПОЯВИ БЛОКІВ (REVEAL) ---
document.addEventListener("DOMContentLoaded", () => {
    const reveals = document.querySelectorAll(".reveal");
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Додаємо клас 'active', коли блок потрапляє на екран
                entry.target.classList.add("active");
                observer.unobserve(entry.target); // Більше не відстежуємо цей блок
            }
        });
    }, {
        root: null, rootMargin: "0px 0px -50px 0px", // Невеликий відступ, щоб блок почав з'являтися раніше
        threshold: 0.1 // Блок повинен бути на 10% на екрані
    });

    reveals.forEach(reveal => observer.observe(reveal));
});
