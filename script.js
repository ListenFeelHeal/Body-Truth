// --- ФУНКЦІОНАЛ ТАЙМЕРА (5 ГОДИН ІЗ ЗБЕРЕЖЕННЯМ) ---
function initTimer() {
    let endTime = localStorage.getItem('courseTimerDirect');
    if (!endTime) {
        const now = new Date().getTime();
        endTime = now + (5 * 60 * 60 * 1000); 
        localStorage.setItem('courseTimerDirect', endTime);
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

closeBtn.addEventListener('click', closePopup);

window.addEventListener('click', (event) => {
    if (event.target === modal) { closePopup(); }
});

// --- ФУНКЦІОНАЛ ОПЛАТИ (WAYFORPAY) ---
const popupForm = document.querySelector('.popup-form');

if (popupForm) {
    popupForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Зупиняємо перезавантаження
        
        // Перенаправляємо на твоє посилання WayForPay
        window.location.href = 'https://secure.wayforpay.com/button/b2669a557ef69';
    });
}
// --- ФУНКЦІОНАЛ АВТОЗАПОВНЕННЯ EMAIL ---
const emailInput = document.getElementById('user-email');
const emailChips = document.querySelectorAll('.email-chip');

if (emailInput && emailChips) {
    emailChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const val = emailInput.value;
            // Якщо людина вже ввела @, просто замінюємо домен
            if (val.includes('@')) {
                emailInput.value = val.split('@')[0] + chip.innerText;
            } else {
                // Якщо @ ще немає, просто додаємо домен до тексту
                emailInput.value = val + chip.innerText;
            }
            // Повертаємо курсор у поле
            emailInput.focus();
        });
    });
}

// --- ФУНКЦІОНАЛ ТЕЛЕФОНУ (+380) ---
const phoneInput = document.getElementById('user-phone');

if (phoneInput) {
    // Якщо поле у фокусі, і воно пусте, ставимо +380
    phoneInput.addEventListener('focus', function() {
        if (this.value === '') {
            this.value = '+380';
        }
    });

    // Забороняємо видаляти +380 під час вводу
    phoneInput.addEventListener('input', function() {
        if (this.value.length < 4 || !this.value.startsWith('+380')) {
            this.value = '+380';
        }
    });
}
