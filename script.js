// --- ФУНКЦІОНАЛ ТАЙМЕРА (ЗАХИСТ ВІД 00:00:00) --- 
function initTimer() { 
    let endTime = localStorage.getItem('courseTimerDirect'); 
    const now = new Date().getTime(); 
    
    // Якщо таймера немає, або час ВЖЕ вийшов
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

    // Якщо час вийшов прямо зараз, поки юзер на сайті - перезапускаємо
    if (timeLeft <= 0) {  
        endTime = now + (5 * 60 * 60 * 1000); 
        localStorage.setItem('courseTimerDirect', endTime); 
        timeLeft = endTime - now; 
    } 

    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24); 
    const minutes = Math.floor((timeLeft / (1000 * 60)) % 60); 
    const seconds = Math.floor((timeLeft / 1000) % 60); 

    function formatTime(time) { return time < 10 ? `0${time}` : time; } 

    // Оновлюємо таймер у нижньому блоці
    const mainTimer = document.getElementById('landing-timer');
    if (mainTimer) { 
        mainTimer.querySelector('.hours').textContent = formatTime(hours); 
        mainTimer.querySelector('.minutes').textContent = formatTime(minutes); 
        mainTimer.querySelector('.seconds').textContent = formatTime(seconds); 
    } 
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

// --- ІНІЦІАЛІЗАЦІЯ ПРАПОРЦІВ (intl-tel-input) --- 
const phoneInputField = document.querySelector("#user-phone"); 
let phoneInput; 

if (phoneInputField) { 
    phoneInput = window.intlTelInput(phoneInputField, { 
        preferredCountries: ["ua", "pl", "de", "us", "gb", "cz", "it", "es"], 
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js", 
    }); 
} 

// --- ФУНКЦІОНАЛ CRM ТА ОПЛАТИ --- 
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
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, 
                body: JSON.stringify(requestData) 
            }); 
        } catch (error) { 
            console.error("Помилка відправки:", error); 
        } 

        if (typeof fbq === 'function') { 
            fbq('track', 'InitiateCheckout', { 
                value: 399.00, 
                currency: 'UAH' 
            }); 
        } 

        // Перехід на касу WayForPay
        window.location.href = 'https://secure.wayforpay.com/button/b2669a557ef69'; 
    }); 
} 

// --- ЕФЕКТ PARALLAX ДЛЯ ФОТО СВІТЛАНИ --- 
window.addEventListener('scroll', function() { 
    const parallaxImage = document.querySelector('.trust-img'); 
    const wrapper = document.querySelector('.trust-image-wrapper'); 
    if (!parallaxImage || !wrapper) return; 

    const rect = wrapper.getBoundingClientRect(); 
    const windowHeight = window.innerHeight; 

    if (rect.top <= windowHeight && rect.bottom >= 0) { 
        const speed = 0.08;  
        const yPos = (rect.top - windowHeight / 2) * speed; 
        parallaxImage.style.transform = `scale(1.05) translateY(${yPos}px)`; 
    } 
}); 

// --- SCROLL REVEAL (Плавна поява блоків) --- 
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

    // --- ПЛАВНИЙ СКРОЛ ДЛЯ КНОПКИ В HERO ---
    document.querySelectorAll('a.smooth-scroll').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --- РОЗУМНИЙ STICKY BAR (З'являється тільки на Програмі) ---
    const stickyBarEl = document.getElementById('smartStickyBar');
    const programSection = document.getElementById('program-trigger');
    const finalOfferSection = document.getElementById('final-offer');
    
    window.addEventListener('scroll', function() {
        if (!programSection || !stickyBarEl) return;
        
        let st = window.pageYOffset || document.documentElement.scrollTop;
        
        // Визначаємо межі: з'являємось на програмі, ховаємось на фінальній ціні
        let programTop = programSection.offsetTop - window.innerHeight / 2; 
        let offerTop = finalOfferSection ? finalOfferSection.offsetTop - window.innerHeight : Infinity; 
        
        // Показувати тільки якщо ми нижче початку Програми, але вище фінального блоку з ціною
        if (st > programTop && st < offerTop) {
            stickyBarEl.classList.remove('sticky-hidden');
        } else {
            stickyBarEl.classList.add('sticky-hidden');
        }
    }, false);
});
