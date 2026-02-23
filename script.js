// --- ФУНКЦІОНАЛ ТАЙМЕРА (5 ГОДИН ІЗ ЗБЕРЕЖЕННЯМ) ---

function initTimer() {
    let endTime = localStorage.getItem('courseTimerEndTime');
    if (!endTime) {
        const now = new Date().getTime();
        endTime = now + (5 * 60 * 60 * 1000); 
        localStorage.setItem('courseTimerEndTime', endTime);
    } else {
        endTime = parseInt(endTime, 10);
    }
    return endTime;
}

const endTime = initTimer();

function updateTimers() {
    const now = new Date().getTime();
    let timeLeft = endTime - now;

    if (timeLeft < 0) { timeLeft = 0; }

    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    function formatTime(time) { return time < 10 ? `0${time}` : time; }

    const timerElements = [document.getElementById('landing-timer'), document.getElementById('popup-timer')];

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

setTimeout(openPopup, 5000);

closeBtn.addEventListener('click', closePopup);

window.addEventListener('click', (event) => {
    if (event.target === modal) { closePopup(); }
});


// --- ФУНКЦІОНАЛ ОПЛАТИ (WAYFORPAY) ---

const popupForm = document.querySelector('.popup-form');

if (popupForm) {
    popupForm.addEventListener('submit', function(event) {
        // Зупиняємо стандартну поведінку форми
        event.preventDefault(); 
        
        // Перенаправляємо на твоє посилання WayForPay
        window.location.href = 'https://secure.wayforpay.com/button/b2669a557ef69';
    });
}
