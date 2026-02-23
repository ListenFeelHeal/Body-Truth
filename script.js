// Таймер на 5 годин з пам'яттю
function initTimer() {
    let endTime = localStorage.getItem('courseTimer');
    if (!endTime) {
        endTime = new Date().getTime() + (5 * 60 * 60 * 1000);
        localStorage.setItem('courseTimer', endTime);
    }
    return endTime;
}

const finalTime = initTimer();

function update() {
    const now = new Date().getTime();
    let diff = finalTime - now;
    if (diff < 0) diff = 0;

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    const str = `${h < 10 ? '0'+h : h}:${m < 10 ? '0'+m : m}:${s < 10 ? '0'+s : s}`;
    document.querySelector('.hours').innerText = h < 10 ? '0'+h : h;
    document.querySelector('.minutes').innerText = m < 10 ? '0'+m : m;
    document.querySelector('.seconds').innerText = s < 10 ? '0'+s : s;
}
setInterval(update, 1000);

// Попап логіка
const modal = document.getElementById('popup-modal');
function openPopup() { modal.classList.add('active'); }
function closePopup() { modal.classList.remove('active'); }

document.getElementById('close-popup').onclick = closePopup;
window.onclick = (e) => { if(e.target == modal) closePopup(); }

// Оплата
document.querySelector('.popup-form').onsubmit = (e) => {
    e.preventDefault();
    // Тут можна додати збір даних у Telegram
    window.location.href = 'https://secure.wayforpay.com/button/b2669a557ef69';
};
