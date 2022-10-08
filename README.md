# JRSlider

JenjaRusSlider - легкий, адаптивный слайдер на чистом javascript.

Поддержка IE >= 10 (если им еще пользуются)

[DEMO](http://jenjarus.github.io/JRSlider/)

## Документация

### Подключение

Подключите к проекту файлы из папки dist
- jrslider.min.js
- jrslider.min.css

### Базовое использование

- HTML

```html
  <div class="jrslider">
      <div class="item">Item 1</div>
      <div class="item">Item 2</div>
      <div class="item">...</div>
      ...
  </div>
```

- JavaScript

```javascript
  JRSlider();
```

### Расширенное использование

- JavaScript

```javascript
  JRSlider({
    elem: '.jrslider',    // Селектор с блоком слайдов (class .jrslider - по умолчанию)
    slidesShow: 1,        // Количество показываемых слайдов
    speed: 500,           // Время пролистывания
    loop: true,           // Бесконечное зацикливание слайдера
    autoplay: false,      // Автоматическое пролистывание
    autoplayHover: false, // Ставить на паузу пролистывание при наведении
    interval: 5000,       // Интервал между пролистыванием элементов (мс)
    arrows: true,         // Пролистывание стрелками
    customPrev: false,    // Назначение элемента для кнопки назад
    customNext: false,    // Назначение элемента для кнопки вперед
    dots: true,           // Точки навигации
    customDots: false,    // Изменить место прикрепления точек навигации
    swipe: true,          // Пролистывание свайпом
    responsive: [{        // Поддержка изменений настроек при изменении разрешения ширины экрана
        breakpoint: 1024, // Изменить настройки до данной ширины экрана
        settings: {       // Изменяемые настройки
            slidesShow: 3,
            dots: false,
            ...
        },
        breakpoint: 768,
        settings: {
            slidesShow: 2,
            arrows: false,
            ...
        },
        ...
    }]
  });
```

#
Copyright (c) 2022 JenjaRus
