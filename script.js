const correctSequence = ['motherboard', 'cpu', 'cooler', 'ram', 'power', 'ssd', 'gpu'];
let currentStep = 0;
const totalSteps = correctSequence.length;

// Текстовые подсказки для игрока в зависимости от текущего шага
const hints = {
    'motherboard': 'Подсказка: Сначала нужно заложить основу ПК, куда крепятся все остальные комплектующие.',
    'cpu': 'Подсказка: Теперь пора установить "мозг" компьютера в сокет материнской платы.',
    'cooler': 'Подсказка: Процессор станет очень горячим! Защитите его массивным охлаждением.',
    'ram': 'Подсказка: Установите плашки кратковременной памяти рядом с кулером процессора.',
    'power': 'Подсказка: Системе нужна энергия. Время установить источник питания в нижнюю часть корпуса.',
    'ssd': 'Подсказка: Куда мы запишем операционную систему? Нужен быстрый накопитель.',
    'gpu': 'Подсказка: Финальный штрих! Самая большая деталь для обработки игровой графики.'
};

const slots = document.querySelectorAll('.card_board');
const selectionModal = document.getElementById('selectionModal');
const closeSelection = document.getElementById('closeSelection');
const optionRows = document.querySelectorAll('.option-row');
const modalSlotTitle = document.getElementById('modal-slot-title');
const modalHint = document.getElementById('modal-hint');

let activeSlot = null;

// 1. Открытие окна при клике на ячейку ПК
slots.forEach(slot => {
    slot.addEventListener('click', () => {
        if (slot.classList.contains('installed')) return;

        activeSlot = slot;
        modalSlotTitle.textContent = `Установка в слот: "${slot.textContent}"`;
        
        // Генерация подсказки
        const requiredType = correctSequence[currentStep];
        const slotType = slot.getAttribute('data-type');

        if (slotType !== requiredType) {
            // Если игрок нажал не на тот слот, который нужен по очереди
            modalHint.textContent = `⚠️ Вы зашли не туда. Сейчас очередь для другого компонента!`;
            modalHint.style.color = '#ff7675';
        } else {
            // Если слот выбран верно, даем наводку на деталь
            modalHint.textContent = hints[requiredType] || '';
            modalHint.style.color = '#eccc68';
        }

        selectionModal.classList.add('show');
    });
});

// Закрытие окна
closeSelection.addEventListener('click', () => selectionModal.classList.remove('show'));
selectionModal.addEventListener('click', (e) => {
    if (e.target === selectionModal) selectionModal.classList.remove('show');
});

// 2. Логика выбора варианта внутри окна
optionRows.forEach(row => {
    row.addEventListener('click', () => {
        if (!activeSlot) return;
        
        // Если деталь уже была использована ранее — игнорируем клик
        if (row.classList.contains('used')) return;

        const slotType = activeSlot.getAttribute('data-type');
        const itemType = row.getAttribute('data-value');
        const componentName = row.getAttribute('data-name');
        const requiredType = correctSequence[currentStep];

        selectionModal.classList.remove('show');

        // Проверяем: подходит ли деталь к типу слота
        if (itemType !== slotType) {
            alert('Вы пытаетесь вставить деталь не в тот слот!');
            return;
        }

        // Проверяем: соблюдена ли последовательность сборки
        if (itemType === requiredType) {
            // Выделяем деталь в списке как "использованную"
            row.classList.add('used');

            // Заменяем текст старой ячейки на название детали
            activeSlot.textContent = componentName;
            activeSlot.classList.add('installed');

            currentStep++;

            // Обновляем прогресс-бар
            const currentPercent = Math.round((currentStep / totalSteps) * 100);
            const progressText = document.getElementById('progress-text');
            if (progressText) progressText.textContent = `${currentPercent}%`;
            
            const progressFill = document.getElementById('progress-fill');
            if (progressFill) progressFill.style.width = `${currentPercent}%`;

            // Финал игры
            if (currentStep === totalSteps) {
                setTimeout(() => {
                    const led = document.getElementById('led');
                    if (led) led.classList.add('led-green');

                    const pcCase = document.getElementById('pc-case');
                    if (pcCase) pcCase.classList.add('rgb-active');

                    setTimeout(() => {
                        const modal = document.getElementById('winModal');
                        if (modal) modal.classList.add('show');
                    }, 1000);
                }, 500);
            }
        } else {
            alert('Слот верный, но нарушена последовательность сборки! Подумайте, что нужно установить сначала.');
        }
    });
});
