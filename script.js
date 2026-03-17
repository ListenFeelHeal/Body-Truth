// =========================================================
// 1. ФУНКЦІОНАЛ ТАЙМЕРА (ЗАХИСТ ВІД 00:00:00)
// =========================================================
function initTimer() { 
    let endTime = localStorage.getItem('courseTimerDirect'); 
    const now = new Date().getTime(); 
    
    // Якщо таймера немає, або час ВЖЕ вийшов - ставимо на 5 годин
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

    // Якщо час вийшов прямо зараз, поки юзер на сайті - непомітно перезапускаємо
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


// =========================================================
// 2. ФУНКЦІОНАЛ POP-UP ВІКНА
// =========================================================
const modal = document.getElementById('popup-modal'); 
const closeBtn = document.getElementById('close-popup'); 

function openPopup() { 
    if(modal) modal.classList.add('active'); 
} 
function closePopup() { 
    if(modal) modal.classList.remove('active'); 
} 

if(closeBtn) closeBtn.addEventListener('click', closePopup); 
window.addEventListener('click', (event) => { 
    if (event.target === modal) { closePopup(); } 
}); 


// =========================================================
// 3. ІНІЦІАЛІЗАЦІЯ ПРАПОРЦІВ (intl-tel-input)
// =========================================================
const phoneInputField = document.querySelector("#user-phone"); 
let phoneInput; 

if (phoneInputField && typeof window.intlTelInput !== 'undefined') { 
    phoneInput = window.intlTelInput(phoneInputField, { 
        preferredCountries: ["ua", "pl", "de", "us", "gb", "cz", "it", "es"], 
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js", 
    }); 
} 


// =========================================================
// 4. ФУНКЦІОНАЛ CRM ТА ОПЛАТИ (SendPulse + Facebook + WayForPay)
// =========================================================
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

        // Відправка події в Facebook Pixel
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


// =========================================================
// 5. ЕФЕКТ ПАРАЛАКСУ ДЛЯ ФОТО СВІТЛАНИ
// =========================================================
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


// =========================================================
// 6. SCROLL REVEAL (Плавна поява блоків при скролі)
// =========================================================
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

    // Плавний скрол для кнопки "Як допомогти тілу?"
    document.querySelectorAll('a.smooth-scroll, a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if(targetId === "#") return; // Ігноруємо пусті посилання
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });


    // =========================================================
    // 7. РОЗУМНИЙ STICKY BAR (Поява тільки на певних блоках)
    // =========================================================
    const stickyBarEl = document.getElementById('smartStickyBar');
    // Можеш змінити 'program-trigger' на ID блоку, з якого хочеш щоб з'являлася кнопка
    const programSection = document.getElementById('program-trigger') || document.querySelector('.program');
    const finalOfferSection = document.getElementById('final-offer') || document.querySelector('.offer-section');
    
    window.addEventListener('scroll', function() {
        if (!programSection || !stickyBarEl) return;
        
        let st = window.pageYOffset || document.documentElement.scrollTop;
        
        let programTop = programSection.offsetTop - window.innerHeight / 2; 
        let offerTop = finalOfferSection ? finalOfferSection.offsetTop - window.innerHeight + 100 : Infinity; 
        
        // Показуємо панель, якщо ми проскролили до програми, але ще не дійшли до фінальної ціни
        if (st > programTop && st < offerTop) {
            stickyBarEl.classList.remove('sticky-hidden');
        } else {
            stickyBarEl.classList.add('sticky-hidden');
        }
    }, false);


    // =========================================================
// DRAG-TO-SCROLL ДЛЯ APP STORE КАРТОК (Тільки для мишки на ПК)
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('app-slider');
    let isDown = false;
    let startX;
    let scrollLeft;

    if(slider) {
        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
            // Вимикаємо плавний скрол під час перетягування мишкою
            slider.style.scrollSnapType = 'none'; 
            slider.style.scrollBehavior = 'auto';
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active');
            slider.style.scrollSnapType = 'x mandatory';
            slider.style.scrollBehavior = 'smooth';
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active');
            // Повертаємо магнітний скрол
            slider.style.scrollSnapType = 'x mandatory';
            slider.style.scrollBehavior = 'smooth';
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; // Швидкість перетягування (x2)
            slider.scrollLeft = scrollLeft - walk;
        });
    }
});
