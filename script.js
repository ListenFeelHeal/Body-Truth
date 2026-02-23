// --- ФУНКЦІОНАЛ ТАЙМЕРА (5 ГОДИН ІЗ ЗБЕРЕЖЕННЯМ) ---

function initTimer() {
    // Перевіряємо, чи пам'ятає браузер час завершення для цього користувача
    let endTime = localStorage.getItem('courseTimerEndTime');

    if (!endTime) {
        // Якщо клієнт зайшов вперше, встановлюємо таймер на 5 годин вперед
        const now = new Date().getTime();
        endTime = now + (5 * 60 * 60 * 1000); // 5 годин у мілісекундах
        // Зберігаємо цей час у пам'ять браузера
        localStorage.setItem('courseTimerEndTime', endTime);
    } else {
        // Якщо клієнт вже був тут, беремо збережений час
        endTime = parseInt(endTime, 10);
    }

    return endTime;
}

// Отримуємо кінцевий час
const endTime = initTimer();

function updateTimers() {
    const now = new Date().getTime();
    let timeLeft = endTime - now;

    // Якщо 5 годин минуло, зупиняємо таймер на нулях
    if (timeLeft < 0) {
        timeLeft = 0;
        // Якщо хочеш, щоб після закінчення 5 годин таймер почався ЗНОВУ 
        // при наступному оновленні сторінки — розкоментуй рядок нижче:
        // localStorage.removeItem('courseTimerEndTime'); 
    }

    // Переведення мілісекунд у години, хвилини, секунди
    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    // Функція для додавання нуля спереду (наприклад, "09" замість "9")
    function formatTime(time) {
        return time < 10 ? `0${time}` : time;
    }

    // Оновлення всіх таймерів на сторінці (на лендінгу і в попапі)
    const timerElements = [document.getElementById('landing-timer'), document.getElementById('popup-timer')];

    timerElements.forEach(timer => {
        if (timer) {
            timer.querySelector('.hours').textContent = formatTime(hours);
            timer.querySelector('.minutes').textContent = formatTime(minutes);
            timer.querySelector('.seconds').textContent = formatTime(seconds);
        }
    });
}

// Запускаємо таймер і оновлюємо кожну секунду
updateTimers();
setInterval(updateTimers, 1000);


// --- ФУНКЦІОНАЛ POP-UP ВІКНА ---

const modal = document.getElementById('popup-modal');
const closeBtn = document.getElementById('close-popup');

// Функція відкриття попапу
function openPopup() {
    modal.classList.add('active');
}

// Функція закриття попапу
function closePopup() {
    modal.classList.remove('active');
}

// 1. Відкрити попап автоматично через 5 секунд після завантаження
setTimeout(openPopup, 5000);

// 2. Закрити при натисканні на хрестик
closeBtn.addEventListener('click', closePopup);

// 3. Закрити при натисканні поза межами вікна (на затемнений фон)
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closePopup();
    }
});
