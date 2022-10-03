/*
    JenjaRusSlider - слайдер
    Copyright (c) 2022 JenjaRus
*/

export default function JRSlider(options = {}) {
    const defaults = {
        elem: '.jrslider', // Селектор с блоком слайдов
        slidesShow: 1, // Количество показываемых слайдов
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
    };
    const config = extend(options, defaults);
    const sliderList = document.querySelectorAll(config.elem);

    if (sliderList.length) {
        for (let element of sliderList) {
            if (element.classList.contains('jrslider-init')) continue;
            createSlider(element, config)
        }
    }
}

function createSlider(sliders, config) {
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

    // Перерисовка слайдера при изменении ширины экрана
    window.addEventListener('resize', () => init('resize'));

    // === Создание элементов ===
    // Создание кнопки назад
    function createPrevButton() {
        const prevButton = document.createElement("a");
        prevButton.classList.add('slider-button__prev');
        sliderNav.appendChild(prevButton);
        prevButton.addEventListener('click', () => {
            moveTo(currentSlide - config.slidesScroll);
        });
    }

    // Создание кнопки вперед
    function createNextButton() {
        const nextButton = document.createElement("a");
        nextButton.classList.add('slider-button__next');
        sliderNav.appendChild(nextButton);
        nextButton.addEventListener('click', () => {
            moveTo(currentSlide + config.slidesScroll);
        });
    }

    // Назначить кнопку назад на кастомный элемент
    function createCustomPrevButton() {
        const prevButton = document.querySelector(config.customPrev);
        prevButton.addEventListener('click', () => {
            moveTo(currentSlide - config.slidesScroll);
        });
    }

    // Назначить кнопку вперед на кастомный элемент
    function createCustomNextButton() {
        const nextButton = document.querySelector(config.customNext);
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
            sliders.addEventListener("mouseover", () => clearTimeout(autoPlayInterval));
            sliders.addEventListener("mouseout", () => autoPlayInterval = setInterval(autoPlayHandle, config.interval));
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
        }
        allowTransition = false;
    }

    // "Бесшовное" перемещение в конец или начало в зацикленном слайдере
    function loopBeginEnd() {
        if(config.loop) {
            if (currentSlide > slidersItems.length - (checkClone() * 2)) {
                currentSlide = config.slidesScroll;
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
    function init(flag = 'init') {
        if (flag === 'init') {
            config.loop ? currentSlide = checkClone() : currentSlide = 0;
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

    // Выводит сколько нужно сделано клонов на одной стороне
    function checkClone() {
        return config.slidesScroll > config.slidesShow ? config.slidesScroll : config.slidesShow;
    }
    // === Вспомогательные функции END ===
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
