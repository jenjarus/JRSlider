/*
    JenjaRusSlider - слайдер
    Copyright (c) 2022 JenjaRus
*/

export default function JRSlider(options = {}) {
    const defaults = {
        elem: '.jrslider', // Селектор с блоком слайдов
        slidesShow: 1, // Количество показываемых слайдов
        slidesScroll: 1, // Количество пролистываемых слайдов
        speed: 500, // Время пролистывания
        loop: true,     // Бесконечное зацикливание слайдера
        autoplay: false,     // Автоматическое пролистывание
        autoplayHover: false, // Ставить на паузу пролистывание при наведении
        interval: 5000, // Интервал между пролистыванием элементов (мс)
        arrows: true,   // Пролистывание стрелками
        customPrev: false, // Назначение элемента для кнопки назад
        customNext: false, // Назначение элемента для кнопки вперед
        dots: true, // Точки навигации
        customDots: false, // Изменить место прикрепления точек навигации
        swipe: true, // Пролистывание свайпом
        responsive: false, // Адаптив

        currentSlide: {}, // Текущий слайд для каждого созданного слайдера
    };
    const config = extend(options, defaults);
    const sliderList = document.querySelectorAll(config.elem);

    if (sliderList.length) {
        for(let i = 0; i < sliderList.length; i++) {
            checkResponsive(sliderList[i], config, i);
        }
        window.addEventListener('resize', () => {
            for(let i = 0; i < sliderList.length; i++) {
                checkResponsive(sliderList[i], config, i);
            }
        });
    }
}

function createSlider(sliders, config, indexSlider) {
    config.slidesScroll = 1; // Временно, до следующей версии

    let currentSlide; // Глобальное значение текущего слайда
    let allowTransition = true; // Флаг возможности перемещения слайда (дает анимации полностью отрабоать)

    // Создание обертки элементов слайдера
    sliders.classList.add('jrslider-init');
    sliders.innerHTML = "<div class='slider-wrap'>" + sliders.innerHTML + "</div>";
    const slidersItems = sliders.querySelector('.slider-wrap').children;
    const sliderWrap = sliders.querySelector('.slider-wrap');

    // Создание обертки навигационных кнопок
    const sliderNav = document.createElement("div");
    sliderNav.classList.add("slider-nav");
    sliders.appendChild(sliderNav);

    if (config.loop) {
        cloneElements();
    }
    if (config.arrows) {
        if (config.customPrev) {
            createCustomPrevButton();
        } else {
            createPrevButton();
        }
        if (config.customNext) {
            createCustomNextButton();
        } else {
            createNextButton();
        }
    }
    if (config.dots) {
        if (config.customDots) {
            createCustomDots();
        } else {
            createDots();
        }
    }
    if (config.autoplay) {
        autoPlay();
    }
    if (config.swipe) {
        createSwipe();
    }

    init();

    // === Создание элементов ===
    // Создание кнопки назад
    function createPrevButton() {
        const prevButton = document.createElement("a");
        prevButton.classList.add('slider-button__prev', 'slider-button');
        sliderNav.appendChild(prevButton);
        prevButton.addEventListener('click', () => {
            moveTo(currentSlide - config.slidesScroll);
        });
    }

    // Создание кнопки вперед
    function createNextButton() {
        const nextButton = document.createElement("a");
        nextButton.classList.add('slider-button__next', 'slider-button');
        sliderNav.appendChild(nextButton);
        nextButton.addEventListener('click', () => {
            moveTo(currentSlide + config.slidesScroll);
        });
    }

    // Назначить кнопку назад на кастомный элемент
    function createCustomPrevButton() {
        const prevButton = document.querySelector(config.customPrev);
        prevButton.classList.add('slider-button');
        prevButton.addEventListener('click', () => {
            moveTo(currentSlide - config.slidesScroll);
        });
    }

    // Назначить кнопку вперед на кастомный элемент
    function createCustomNextButton() {
        const nextButton = document.querySelector(config.customNext);
        nextButton.classList.add('slider-button');
        nextButton.addEventListener('click', () => {
            moveTo(currentSlide + config.slidesScroll);
        });
    }

    // Автоматическое пролистывание слайдов
    function autoPlay() {
        let autoPlayInterval; // Переменная с setInterval
        const autoPlayHandle = () => {
            moveTo(currentSlide + config.slidesScroll);
        };
        autoPlayInterval = setInterval(autoPlayHandle, config.interval);

        if (!config.autoplayHover) {
            sliders.addEventListener("pointerover", () => clearTimeout(autoPlayInterval));
            sliders.addEventListener("pointerout", () => autoPlayInterval = setInterval(autoPlayHandle, config.interval));
        }
    }

    // Создание Точек
    function createDots() {
        const dot = document.createElement("div");
        sliderNav.appendChild(dot);
        cycleCreateDots(dot);
    }

    // Создание Точек в кастомном элементе
    function createCustomDots() {
        const dot = document.querySelector(config.customDots);
        cycleCreateDots(dot);
    }

    // Создание клонов в конце и начале слайдера
    function cloneElements() {
        let cloneFirst = [];
        let cloneLast = [];

        for(let i = 0; i < checkClone(); i++) {
            let firstSlide = slidersItems[i];
            cloneFirst.push(firstSlide.cloneNode(true));
        }

        for(let i = slidersItems.length - 1; i >= slidersItems.length - checkClone() ; i--) {
            let lastSlide = slidersItems[i];
            cloneLast.push(lastSlide.cloneNode(true));
        }

        for (let element of cloneFirst) {
            element.classList.add('clone');
            sliderWrap.appendChild(element);
        }
        for (let element of cloneLast) {
            element.classList.add('clone');
            sliderWrap.insertBefore(element, slidersItems[0]);
        }
    }
    // === Создание элементов END ===

    // === Перемещение ===
    // Изменение позиции в слайдере
    function transitionMove(step) {
        sliderWrap.style.transform = `translateX(-${offset()}px)`;

        for (let element of slidersItems) element.classList.remove("active");
        for (let i = step; i <= step + config.slidesScroll - 1; i++) {
            if (i < slidersItems.length) {
                slidersItems[i].classList.add("active");
            }
        }

        if (config.dots) {
            if (config.customDots) {
                const dots = document.querySelectorAll(config.customDots+" .slider-dots__item");
                cycleActiveDots(dots, step)
            } else {
                const dots = sliders.querySelectorAll(".slider-dots__item");
                cycleActiveDots(dots, step)
            }
        }

        if(config.arrows) {
            checkButtonLoop();
        }
    }

    // Добавление style transition. По окончанию transition переход на конец или начало слайдера
    function addTransition() {
        sliderWrap.style.transition = `transform ${config.speed}ms`;
        setTimeout(() => {
            sliderWrap.style.transition = '';
            loopBeginEnd();
            allowTransition = true;
        }, config.speed);
    }

    // Перемещение сладов
    function moveTo(step) {
        if(allowTransition) {
            if (config.loop || !(step >= slidersItems.length || step < 0)) {
                currentSlide = step;
            }

            addTransition();
            transitionMove(currentSlide);
            config.currentSlide[indexSlider] = currentSlide;
        }
        allowTransition = false;
    }

    // Отключение стрелки, если это крайний слайд
    function checkButtonLoop() {
        if(currentSlide - config.slidesScroll < 0) {
            if (config.customPrev) {
                document.querySelector(config.customPrev).classList.add('disabled');
            } else {
                sliders.querySelector('.slider-button__prev').classList.add('disabled');
            }
        } else {
            if (config.customPrev) {
                document.querySelector(config.customPrev).classList.remove('disabled');
            } else {
                sliders.querySelector('.slider-button__prev').classList.remove('disabled');
            }
        }

        if(currentSlide + config.slidesScroll >= slidersItems.length) {
            if (config.customNext) {
                document.querySelector(config.customNext).classList.add('disabled');
            } else {
                sliders.querySelector('.slider-button__next').classList.add('disabled');
            }
        } else {
            if (config.customNext) {
                document.querySelector(config.customNext).classList.remove('disabled');
            } else {
                sliders.querySelector('.slider-button__next').classList.remove('disabled');
            }
        }
    }

    // "Бесшовное" перемещение в конец или начало в зацикленном слайдере
    function loopBeginEnd() {
        if(config.loop) {
            if (currentSlide > slidersItems.length - (checkClone() * 2)) {
                currentSlide = checkClone();
                transitionMove(currentSlide);
            } else if (currentSlide <= 0) {
                currentSlide = slidersItems.length - (checkClone() * 2);
                transitionMove(currentSlide);
            }
        }
    }

    // Пролистывание свайпом
    function createSwipe() {
        let posX1 = 0;
        let posX2 = 0;
        let posInitial;
        let posFinal;
        const threshold = sliders.offsetWidth * 0.3; // Растояние до срабатывания свайпа

        const swipeStart = (e) => {
            e.preventDefault();
            posInitial = getTransformX(sliderWrap);

            if (e.type === 'touchstart') {
                posX1 = e.touches[0].clientX;
            } else {
                posX1 = e.clientX;
                document.onmouseup = swipeEnd;
                document.onmousemove = swipeAction;
            }
        };

        const swipeEnd = () => {
            posFinal = getTransformX(sliderWrap);

            if (posFinal - posInitial < -threshold) {
                moveTo(currentSlide + config.slidesScroll);
            } else if (posFinal - posInitial > threshold) {
                moveTo(currentSlide - config.slidesScroll);
            } else {
                addTransition(); // При переключении слайжов добавляет transition
                sliderWrap.style.transform = `translateX(${posInitial}px)`;
            }

            document.onmouseup = null;
            document.onmousemove = null;
        };

        const swipeAction = (e) => {
            if (e.type === 'touchmove') {
                posX2 = posX1 - e.touches[0].clientX;
                posX1 = e.touches[0].clientX;
            } else {
                posX2 = posX1 - e.clientX;
                posX1 = e.clientX;
            }

            sliderWrap.style.transform = `translateX(${getTransformX(sliderWrap) - posX2}px)`;
        };

        // Получаем число из стиля transformX
        const getTransformX = (el) => {
            return +el.style.transform.replace(/[^-\d.]/g, '');
        };

        sliderWrap.onmousedown = swipeStart;
        sliderWrap.addEventListener('touchstart', swipeStart);
        sliderWrap.addEventListener('touchend', swipeEnd);
        sliderWrap.addEventListener('touchmove', swipeAction);
    }
    // === Перемещение END ===

    // === Инициализация слайдера ===
    function init() {
        if(config.currentSlide[indexSlider]) {
            currentSlide = config.currentSlide[indexSlider];
        } else {
            if(config.loop) {
                currentSlide = config.slidesScroll
            } else {
                currentSlide = 0
            }
        }

        transitionMove(currentSlide);
        for (let element of slidersItems) element.style.width = sliderItemWidth() + 'px'; // Назначение ширины одного слайда
        sliderWrap.style.width = slidersItems.length * sliderItemWidth() + 'px'; // Назначение ширины "карусели" слайдов
    }
    // === Инициализация слайдера END ===

    // === Вспомогательные функции ===
    // Ширина одного слайда
    function sliderItemWidth() {
        return sliders.offsetWidth / config.slidesShow;
    }

    // Расстояние перемещения слайдов для текущего шага
    function offset(step = currentSlide) {
        return sliderItemWidth() * step;
    }

    // Цикл для создания точек
    function cycleCreateDots(dot) {
        dot.classList.add("slider-dots");

        if(config.loop) {
            for (let i = checkClone() - 1; i < slidersItems.length - (checkClone() * 2); i += checkClone()) {
                const dots = document.createElement("span");
                dots.classList.add('slider-dots__item');
                dot.appendChild(dots);
                dots.addEventListener('click', () => {
                    moveTo(i + 1);
                });
            }
        } else {
            for (let i = 0; i < slidersItems.length; i += config.slidesScroll) {
                const dots = document.createElement("span");
                dots.classList.add('slider-dots__item');
                dot.appendChild(dots);
                dots.addEventListener('click', () => {
                    moveTo(i);
                });
            }
        }
    }

    // Цикл изменения точек
    function cycleActiveDots(dots, step) {
        let loop = config.loop ? 1 : 0;
        for (let element of dots) element.classList.remove("active");
        if(dots[step / checkClone() - loop]) {
            dots[step / checkClone() - loop].classList.add("active");
        }
    }

    // Выводит сколько сделано клонов на одной стороне
    function checkClone() {
        return config.slidesScroll > config.slidesShow ? config.slidesScroll : config.slidesShow;
    }
    // === Вспомогательные функции END ===
}

// Проверка значений в responsive
function checkResponsive(sliders, config, indexSlider) {
    const windowsWidth = window.innerWidth; // Ширина экрана
    let flagResponsive = true;

    // Проверка на наличие элементов в слайдере
    if(!sliders.children.length) {
        return false;
    }

    if(config.responsive) {
        config.responsive.sort((prev, next) => next.breakpoint - prev.breakpoint);

        // Responsive значения config
        for (let element of config.responsive) {
            if (windowsWidth <= element.breakpoint) {
                flagResponsive = false;
                config = extend(element.settings, config);
                reCreateSlider(sliders, config, indexSlider);
            }
        }
    }

    // Стандартные значения config
    if(flagResponsive) {
        reCreateSlider(sliders, config, indexSlider);
    }
}

// Пересоздать слайдер
function reCreateSlider(sliders, options, indexSlider) {
    // Если слайдер создан, то тогда он удаляется
    if (sliders.classList.contains('jrslider-init')) {
        destroySlider(sliders);
    }
    createSlider(sliders, options, indexSlider);
}

// Удаляет элементы связанные со слайдером
function destroySlider(sliders) {
    let cloneItems = [];

    for (let element of sliders.querySelectorAll(".clone")) {
        element.remove()
    }

    const slidersItems = sliders.querySelectorAll('.slider-wrap > *');

    for (let element of slidersItems) {
        cloneItems.push(element.cloneNode(true))
    }

    sliders.classList.remove('jrslider-init');
    sliders.querySelector(".slider-wrap").remove();
    sliders.querySelector(".slider-nav").remove();

    for (let element of cloneItems) {
        element.classList.remove('active');
        element.style = '';
        sliders.appendChild(element);
    }
}

function extend(options, defaults) {
    for (const key in defaults) {
        if (options[key] == null) {
            const value = defaults[key];
            options[key] = value;
        }
    }
    return options;
}
