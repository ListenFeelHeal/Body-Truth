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
// 7. РОЗУМНИЙ ПРЕЛОАДЕР (ЧЕКАЄ ТІЛЬКИ БЛОК 1 ТА БЛОК СИМПТОМІВ)
// =========================================================
function hidePreloader() {
    const preloader = document.getElementById('premium-preloader');
    if (preloader && !preloader.classList.contains('preloader-hidden')) {
        preloader.classList.add('preloader-hidden');
        document.body.classList.remove('loading-lock');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Шукаємо ТІЛЬКИ картинки в хедері (квіти, лого) та в блоці симптомів (іконки)
    const criticalImages = document.querySelectorAll('.hero img, #symptoms img');
    
    let imagesLoaded = 0;
    const totalImages = criticalImages.length;

    // Якщо раптом картинок немає, просто вимикаємо екран
    if (totalImages === 0) {
        hidePreloader();
        return;
    }

    // Рахуємо кожну завантажену картинку з цих двох блоків
    function imageLoaded() {
        imagesLoaded++;
        if (imagesLoaded === totalImages) {
            setTimeout(hidePreloader, 250); // Трохи плавності перед зникненням
        }
    }

    criticalImages.forEach(img => {
        // Якщо картинка вже встигла завантажитись
        if (img.complete) {
            imageLoaded();
        } else {
            // Чекаємо завантаження або ігноруємо, якщо файл не знайдено
            img.addEventListener('load', imageLoaded);
            img.addEventListener('error', imageLoaded); 
        }
    });

    // Запобіжник: якщо в клієнтки дуже слабкий мобільний інтернет, 
    // пускаємо її на сайт примусово через 2.5 секунди.
    setTimeout(hidePreloader, 2500);
});

// Керування відгуками: клік — стоп, другий клік — гоу
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.reviews-track');
    const cards = document.querySelectorAll('.review-card');

    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Перевіряємо, чи ця картка вже була натиснута
            const wasActive = this.classList.contains('is-active');

            // Скидаємо все (зменшуємо всі картки, запускаємо рух)
            cards.forEach(c => c.classList.remove('is-active'));
            track.classList.remove('paused');

            // Якщо вона не була активною — зупиняємо і збільшуємо
            if (!wasActive) {
                this.classList.add('is-active');
                track.classList.add('paused');
            }
            
            e.stopPropagation(); // Щоб клік не "пролетів" до фону
        });
    });

    // Якщо клікнути просто на фон сайту — все запускається знову
    document.body.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('is-active'));
        track.classList.remove('paused');
    });
});
