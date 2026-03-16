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

    const timerElements = [
    document.getElementById('landing-timer'), 
    document.getElementById('landing-timer-top'), 
    document.getElementById('popup-timer')
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
            e.preventDefault(); 
            let val = emailInput.value;
            if (val.includes('@')) {
                val = val.split('@')[0];
            }
            emailInput.value = val + this.innerText;
            emailInput.focus();
        });
    });
}

// --- ІНІЦІАЛІЗАЦІЯ ПРАПОРЦІВ ТА КОДІВ КРАЇН (intl-tel-input) ---
const phoneInputField = document.querySelector("#user-phone");
let phoneInput;

if (phoneInputField) {
    phoneInput = window.intlTelInput(phoneInputField, {
        preferredCountries: ["ua", "pl", "de", "us", "gb", "cz", "it", "es"],
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
    });
}

// --- ФУНКЦІОНАЛ CRM (SENDPULSE EVENTS) ТА ОПЛАТИ ---
const popupForm = document.querySelector('.popup-form');

if (popupForm) {
    popupForm.addEventListener('submit', async function(event) {
        event.preventDefault(); 
        
        const submitBtn = popupForm.querySelector('button[type="submit"]');
        submitBtn.innerText = "ОБРОБЛЕННЯ...";
        
        const emailValue = document.getElementById('user-email').value;
        
        let phoneValue = "";
        if (typeof phoneInput !== 'undefined' && typeof phoneInput.getNumber === 'function') {
            phoneValue = phoneInput.getNumber(); 
        } else {
            phoneValue = document.getElementById('user-phone').value;
        }
        
        const today = new Date();
        const eventDate = today.toISOString().split('T')[0];

        const sendPulseEventUrl = "https://events.sendpulse.com/events/id/7cc034c090fb4866b3509f19abc80ae6/9215091";

        const requestData = {
            "email": emailValue,
            "phone": phoneValue,
            "event_date": eventDate
        };

        try {
            await fetch(sendPulseEventUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(requestData)
            });
            console.log("Дані полетіли в CRM");
        } catch (error) {
            console.error("Помилка відправки:", error);
        }

        window.location.href = 'https://secure.wayforpay.com/button/b2669a557ef69';
    });
}

// --- ЕФЕКТ PARALLAX ДЛЯ ФОТОГРАФІЇ СВІТЛАНИ ---
window.addEventListener('scroll', function() {
    const parallaxImage = document.querySelector('.about-img');
    const wrapper = document.querySelector('.about-image-wrapper');
    
    if (!parallaxImage || !wrapper) return;

    const rect = wrapper.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top <= windowHeight && rect.bottom >= 0) {
        const speed = 0.1; // Швидкість паралаксу
        const yPos = (rect.top - windowHeight / 2) * speed;
        parallaxImage.style.transform = `scale(1.05) translateY(${yPos}px)`;
    }
});

// --- БРОНЬОВАНИЙ ЗАПУСК АНІМАЦІЙ (SCROLL REVEAL) ---
document.addEventListener("DOMContentLoaded", function() {
    setTimeout(() => {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show-block');
                    obs.unobserve(entry.target);
                }
            });
        }, { 
            root: null,
            rootMargin: '0px',
            threshold: 0.1 
        });

        document.querySelectorAll('.hidden-block').forEach(el => {
            observer.observe(el);
        });
    }, 100); 
});
