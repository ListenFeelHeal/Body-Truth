document.addEventListener("DOMContentLoaded", function() { 

    // =========================================================
    // 1. ЕФЕКТ ДРУКУ ТЕКСТУ
    // =========================================================
    const typeTarget = document.getElementById('typewriter');
    if (typeTarget) {
        const textToType = 'чому болить, коли “все нормально”';
        let i = 0;
        typeTarget.innerHTML = ''; 
        
        function typeWriter() {
            if (i < textToType.length) {
                typeTarget.innerHTML += textToType.charAt(i);
                i++;
                setTimeout(typeWriter, 60); 
            }
        }
        setTimeout(typeWriter, 1200); 
    }

    // =========================================================
    // 2. АНІМАЦІЯ ПОЯВИ ПРИ СКРОЛІ
    // =========================================================
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-zoom');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active-reveal');
                    obs.unobserve(entry.target);
                }
            });
        }, { root: null, rootMargin: '0px 0px -50px 0px', threshold: 0.1 });

        revealElements.forEach(el => {
            el.setAttribute('data-reveal', '');
            revealObserver.observe(el);
        });
    }

    // =========================================================
    // 3. ПЛАВНИЙ СКРОЛ
    // =========================================================
    document.querySelectorAll('a.smooth-scroll, a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if(targetId === "#" || targetId === "") return; 
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // =========================================================
    // 4. РОЗУМНИЙ STICKY BAR
    // =========================================================
    const stickyBarEl = document.getElementById('smartStickyBar');
    const programSection = document.getElementById('program-trigger');
    const finalOfferSection = document.getElementById('final-offer');
    
    window.addEventListener('scroll', function() {
        if (!programSection || !stickyBarEl) return;
        
        let st = window.pageYOffset || document.documentElement.scrollTop;
        let programTop = programSection.offsetTop - window.innerHeight / 2; 
        let offerTop = finalOfferSection ? finalOfferSection.offsetTop - window.innerHeight + 100 : Infinity; 
        
        if (st > programTop && st < offerTop) {
            stickyBarEl.classList.remove('sticky-hidden');
        } else {
            stickyBarEl.classList.add('sticky-hidden');
        }
    }, false);
}); 

// =========================================================
// 5. ТАЙМЕР
// =========================================================
function initTimer() { 
    let endTime = localStorage.getItem('courseTimer47'); 
    const now = new Date().getTime(); 
    if (!endTime || parseInt(endTime, 10) <= now) { 
        endTime = now + (47 * 60 * 1000); 
        localStorage.setItem('courseTimer47', endTime); 
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
        endTime = now + (47 * 60 * 1000); 
        localStorage.setItem('courseTimer47', endTime); 
        timeLeft = endTime - now; 
    } 

    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24); 
    const minutes = Math.floor((timeLeft / (1000 * 60)) % 60); 
    const seconds = Math.floor((timeLeft / 1000) % 60); 

    function formatTime(time) { return time < 10 ? `0${time}` : time; } 

    const mainTimer = document.getElementById('landing-timer');
    if (mainTimer) { 
        mainTimer.querySelector('.hours').textContent = formatTime(hours); 
        mainTimer.querySelector('.minutes').textContent = formatTime(minutes); 
        mainTimer.querySelector('.seconds').textContent = formatTime(seconds); 
    } 
    
    const miniTimer = document.getElementById('sticky-mini-timer');
    if (miniTimer) {
        miniTimer.querySelector('.m-hours').textContent = formatTime(hours);
        miniTimer.querySelector('.m-minutes').textContent = formatTime(minutes);
        miniTimer.querySelector('.m-seconds').textContent = formatTime(seconds);
    }
} 
updateTimers(); 
setInterval(updateTimers, 1000);

// =========================================================
// 6. POP-UP ВІКНО ТА ФОРМА
// =========================================================
const modal = document.getElementById('popup-modal'); 
const closeBtn = document.getElementById('close-popup'); 

// Робимо функцію глобальною, щоб HTML її точно бачив
window.openPopup = function() { 
    if(modal) modal.classList.add('active'); 
}; 
window.closePopup = function() { 
    if(modal) modal.classList.remove('active'); 
}; 

if(closeBtn) closeBtn.addEventListener('click', closePopup); 
window.addEventListener('click', (event) => { 
    if (event.target === modal) { closePopup(); } 
}); 

const phoneInputField = document.querySelector("#user-phone"); 
let phoneInput; 

if (phoneInputField && typeof window.intlTelInput !== 'undefined') { 
    phoneInput = window.intlTelInput(phoneInputField, { 
        preferredCountries: ["ua", "pl", "de", "us", "gb", "cz", "it", "es"], 
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js", 
    }); 
} 

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
            fbq('track', 'InitiateCheckout', { value: 399.00, currency: 'UAH' }); 
        } 

        window.location.href = 'https://secure.wayforpay.com/button/b2669a557ef69'; 
    }); 
}

// =========================================================
// 7. КУЛЕНЕПРОБИВНИЙ ПРЕЛОАДЕР
// =========================================================
function hidePreloader() {
    const preloader = document.getElementById('premium-preloader');
    if (preloader && !preloader.classList.contains('preloader-hidden')) {
        preloader.classList.add('preloader-hidden');
        document.body.classList.remove('loading-lock');
    }
}

// Спосіб 1: Чекаємо повного завантаження сторінки
window.addEventListener('load', function() {
    setTimeout(hidePreloader, 500); // Пів секунди для плавності
});

// Спосіб 2 (Запобіжник): Якщо щось "зависло" (наприклад, важка картинка), 
// примусово ховаємо прелоадер через 3 секунди
setTimeout(hidePreloader, 3000);
