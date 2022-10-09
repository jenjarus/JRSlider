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

По умолчанию
```html
  <div class="jrslider">
      <div class="item">Item 1</div>
      <div class="item">Item 2</div>
      <div class="item">...</div>
      ...
  </div>
```
или
```html
  <div class="*your-selector*">
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
    elem: '.jrslider',    // Селектор с блоком слайдов (class .jrslider - по умолчанию) (string - selector)
    slidesShow: 1,        // Количество показываемых слайдов (number)
    speed: 500,           // Время пролистывания (мс) (number)
    loop: true,           // Бесконечное зацикливание слайдера (boolean)
    autoplay: false,      // Автоматическое пролистывание (boolean)
    autoplayHover: false, // Ставить на паузу пролистывание при наведении (boolean)
    interval: 5000,       // Интервал между пролистыванием элементов (мс) (number)
    arrows: true,         // Пролистывание стрелками (boolean)
    customPrev: false,    // Назначение элемента для кнопки назад (string - selector)
    customNext: false,    // Назначение элемента для кнопки вперед (string - selector)
    dots: true,           // Точки навигации (boolean)
    customDots: false,    // Изменить место прикрепления точек навигации (string - selector)
    swipe: true,          // Пролистывание свайпом (boolean)
    responsive: [{        // Поддержка изменений настроек при изменении разрешения ширины экрана (object array)
        breakpoint: 1024, // Изменить настройки до данной ширины экрана (number)
        settings: {       // Изменяемые настройки (object)
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
