// --- APPLE SCROLL ЛОГІКА (Intersection Observer) ---
document.addEventListener("DOMContentLoaded", function() {
    const steps = document.querySelectorAll('.apple-step');
    const screens = document.querySelectorAll('.phone-screen-img');

    if (steps.length > 0 && screens.length > 0) {
        // Налаштовуємо Observer: він спрацює, коли картка з текстом буде посередині екрана
        const stepObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    
                    // 1. Всі тексти робимо напівпрозорими, а поточний - яскравим
                    steps.forEach(s => s.classList.remove('active'));
                    entry.target.classList.add('active');

                    // 2. Отримуємо номер кроку (1, 2 або 3)
                    const stepIndex = entry.target.getAttribute('data-step');
                    
                    // 3. Ховаємо всі картинки на телефоні і показуємо потрібну
                    screens.forEach(screen => screen.classList.remove('active'));
                    const targetScreen = document.getElementById(`screen-${stepIndex}`);
                    if (targetScreen) {
                        targetScreen.classList.add('active');
                    }
                }
            });
        }, { 
            // Відступи, щоб тригер спрацьовував саме по центру екрана
            rootMargin: '-40% 0px -40% 0px' 
        });

        // Запускаємо стеження за всіма кроками
        steps.forEach(step => stepObserver.observe(step));
    }
});
