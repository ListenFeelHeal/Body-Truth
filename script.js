// --- ФУНКЦІОНАЛ ТАЙМЕРА ---
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

    const timerElements = [
        document.getElementById('landing-timer')
    ];

    timerElements.forEach(timer => {
        if (timer) {
            timer.querySelector('.hours').textContent = formatTime(hours);
            timer.querySelector('.minutes').textContent = formatTime(minutes);
            timer.querySelector('.seconds').textContent = formatTime(seconds);
        }
    });
}

updateTimers();
setInterval(updateTimers, 1000);

// --- ФУНКЦІОНАЛ POP-UP ВІКНА ---
const modal = document.getElementById('popup-modal');
const closeBtn = document.getElementById('close-popup');

function openPopup() { modal.classList.add('active'); }
function closePopup() { modal.classList.remove('active'); }

if (closeBtn) { closeBtn.addEventListener('click', closePopup); }
window.addEventListener('click', (event) => {
    if (event.target === modal) { closePopup(); }
});

// --- ІНІЦІАЛІЗАЦІЯ ПРАПОРЦІВ (intl-tel-input) ---
// (Ми видалили intlTelInput для простоти, якщо він потрібен - повернемо, 
// але для преміум-вигляду проста форма працює краще)

// --- РОЗУМНА STICKY-КНОПКА (З'являється на блоці "Програма") ---
window.addEventListener('scroll', function() {
    const stickyBar = document.querySelector('.sticky-bar');
    const programSection = document.querySelector('.program'); // Знаходимо секцію програми
    
    if (!stickyBar || !programSection) return;

    // Визначаємо точку появи (коли верх секції "Програма" з'являється на екрані)
    const triggerPoint = programSection.offsetTop - window.innerHeight + 150;

    if (window.scrollY > triggerPoint) {
        stickyBar.classList.add('visible');
    } else {
        stickyBar.classList.remove('visible');
    }
});

// --- SCROLL REVEAL АНІМАЦІЇ ---
document.addEventListener("DOMContentLoaded", function() {
    setTimeout(() => {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show-block');
                    obs.unobserve(entry.target);
                }
            });
        }, { root: null, rootMargin: '0px', threshold: 0.1 });

        document.querySelectorAll('.hidden-block').forEach(el => observer.observe(el));
    }, 50); 
});
