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

// --- АВТОЗАПОВНЕННЯ EMAIL (КНОПКИ) ---
const emailInput = document.getElementById('user-email');
const emailChips = document.querySelectorAll('.email-chip');

if (emailInput && emailChips.length > 0) {
    emailChips.forEach(chip => {
        chip.addEventListener('click', function(e) {
            e.preventDefault(); // Запобігає перезавантаженню
            let val = emailInput.value;
            // Якщо вже є @, відрізаємо все, що після неї
            if (val.includes('@')) {
                val = val.split('@')[0];
            }
            emailInput.value = val + this.innerText;
            emailInput.focus();
        });
    });
}

// --- БЛОКУВАННЯ ВИДАЛЕННЯ +380 ---
const phoneInput = document.getElementById('user-phone');

if (phoneInput) {
    phoneInput.value = '+380'; // Встановлюємо початкове значення

    phoneInput.addEventListener('input', function() {
        // Забороняємо стерти +380 при вводі
        if (!this.value.startsWith('+380')) {
            let digits = this.value.replace(/\D/g, ''); // витягуємо тільки цифри
            if(digits.startsWith('380')) {
                digits = digits.substring(3);
            }
            this.value = '+380' + digits;
        }
    });

    // Фізично блокуємо клавіші Backspace/Delete, якщо курсор на +380
    phoneInput.addEventListener('keydown', function(e) {
        if ((e.key === 'Backspace' || e.key === 'Delete') && this.selectionStart <= 4) {
            e.preventDefault();
        }
    });
}

// --- ФУНКЦІОНАЛ ОПЛАТИ (WAYFORPAY) ---
const popupForm = document.querySelector('.popup-form');

if (popupForm) {
    popupForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Зупиняємо перезавантаження
        
        // Перенаправляємо на твоє посилання WayForPay
        window.location.href = 'https://secure.wayforpay.com/button/b2669a557ef69';
    });
}
