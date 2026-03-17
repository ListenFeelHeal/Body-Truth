// --- ТАЙМЕР ---
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

// --- POPUP ---
const modal = document.getElementById('popup-modal');
function openPopup() { modal.classList.add('active'); }
function closePopup() { modal.classList.remove('active'); }
document.getElementById('close-popup').addEventListener('click', closePopup);
window.addEventListener('click', (e) => { if (e.target === modal) closePopup(); });

// --- РОЗУМНА STICKY-КНОПКА ---
const stickyBar = document.getElementById('smart-sticky');
const programSection = document.getElementById('program');

window.addEventListener('scroll', () => {
    if (!stickyBar || !programSection) return;
    
    // Кнопка з'являється, коли верх секції "Програма" доходить до середини екрану
    const rect = programSection.getBoundingClientRect();
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
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: "0px 0px -50px 0px", threshold: 0.1 });

    reveals.forEach(reveal => observer.observe(reveal));
});
