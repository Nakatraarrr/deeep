document.addEventListener('DOMContentLoaded', () => {
    const prevButton = document.querySelector('.carousel-control-prev');
    const nextButton = document.querySelector('.carousel-control-next');
    const carouselInner = document.querySelector('.carousel-inner');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const largeBox = document.getElementById('large-box');
    const smallBox1 = document.getElementById('small-box-1');
    const smallBox2 = document.getElementById('small-box-2');
    let currentIndex = 0;

    function updateText() {
        const currentItem = carouselItems[currentIndex];
        const largeText = currentItem.getAttribute('data-large-text');
        const smallText1 = currentItem.getAttribute('data-small-text1');
        const smallText2 = currentItem.getAttribute('data-small-text2');
        const smallText3 = currentItem.getAttribute('data-small-text3');
        largeBox.innerHTML = largeText;
        smallBox1.innerHTML = smallText1;
        smallBox2.innerHTML = smallText2;
    }

    prevButton.addEventListener('click', (event) => {
        event.preventDefault();
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : carouselItems.length - 1;
        updateCarousel();
    });

    nextButton.addEventListener('click', (event) => {
        event.preventDefault();
        currentIndex = (currentIndex < carouselItems.length - 1) ? currentIndex + 1 : 0;
        updateCarousel();
    });

    function updateCarousel() {
        const offset = -currentIndex * 100;
        carouselInner.style.transform = `translateX(${offset}%)`;
        carouselItems.forEach(item => item.classList.remove('active'));
        carouselItems[currentIndex].classList.add('active');
        updateText();
    }

    updateText();

    // Плавная прокрутка
    const links = document.querySelectorAll('a[href^="#"]');
    for (const link of links) {
        link.addEventListener('click', clickHandler);
    }

    function clickHandler(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        const offsetTop = document.querySelector(href).offsetTop;

        scroll({
            top: offsetTop,
            behavior: 'smooth'
        });
    }

    // Функциональность карты Яндекс
    ymaps.ready(init);
    function init() {
        var myMap = new ymaps.Map("map", {
            center: [52.612550, 39.525711], // Координаты Москвы
            zoom: 18
        });

        var myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
            hintContent: 'Наш офис',
            balloonContent: 'Территория Инвестирования'
        });

        myMap.geoObjects.add(myPlacemark);
    }

    // Функция для добавления размытия при прокрутке
    function addBlurOnScroll() {
        document.body.classList.add('blur');
    }

    // Функция для удаления размытия при остановке прокрутки
    function removeBlurOnStop() {
        document.body.classList.remove('blur');
    }

    let isScrolling;

    window.addEventListener('scroll', () => {
        window.clearTimeout(isScrolling);

        // Добавляем размытие при прокрутке
        addBlurOnScroll();

        // Удаляем размытие через 200 мс после остановки прокрутки
        isScrolling = setTimeout(removeBlurOnStop, 200);
    });

    // Показать модальное окно при клике на кнопку
    const optionsButton = document.getElementById('optionsButton');
    const optionsModal = document.getElementById('optionsModal');
    const closeModal = document.getElementById('closeModal');

    optionsButton.addEventListener('click', function() {
        optionsModal.classList.remove('hidden');
        optionsModal.style.display = 'block';
    });

    closeModal.addEventListener('click', function() {
        optionsModal.classList.add('hidden');
        optionsModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === optionsModal) {
            optionsModal.classList.add('hidden');
            optionsModal.style.display = 'none';
        }
    });

    // Новая функциональность для отзывов с сохранением в localStorage
    const reviewForm = document.getElementById('reviewForm');
    const reviewsContainer = document.getElementById('reviews-container');
    const stars = document.querySelectorAll('.stars span');
    let selectedStars = 0;

    stars.forEach(star => {
        star.addEventListener('click', () => {
            selectedStars = star.getAttribute('data-value');
            document.getElementById('selectedStars').value = selectedStars;
            updateStars(selectedStars);
        });

        star.addEventListener('mouseover', () => {
            const value = star.getAttribute('data-value');
            updateStars(value);
        });

        star.addEventListener('mouseout', () => {
            updateStars(selectedStars);
        });
    });

    reviewForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const userName = document.getElementById('userName').value;
        const userComment = document.getElementById('userComment').value;
        const review = createReview(userName, selectedStars, userComment);

        // Сохранение отзыва в localStorage
        saveReviewToLocalStorage(userName, selectedStars, userComment);

        reviewsContainer.appendChild(review);

        reviewForm.reset();
        selectedStars = 0;
        updateStars(selectedStars);
    });

    function updateStars(value) {
        stars.forEach(star => {
            if (star.getAttribute('data-value') <= value) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    function createReview(name, stars, comment) {
        const review = document.createElement('div');
        review.classList.add('review');

        const avatar = document.createElement('img');
        avatar.src = 'avatar.jpg';
        avatar.alt = 'Avatar';
        avatar.classList.add('avatar');

        const nameElement = document.createElement('div');
        nameElement.classList.add('name');
        nameElement.innerText = name;

        const clientTag = document.createElement('span');
        clientTag.classList.add('client');
        clientTag.innerText = '(Клиент)';

        const starsElement = document.createElement('div');
        starsElement.classList.add('stars');
        for (let i = 0; i < 5; i++) {
            const star = document.createElement('span');
            star.innerHTML = '&#9733;';
            star.classList.add(i < stars ? 'active' : 'inactive');
            starsElement.appendChild(star);
        }

        const commentElement = document.createElement('p');
        commentElement.classList.add('review-text');
        commentElement.innerText = comment;

        const nameWrapper = document.createElement('div');
        nameWrapper.classList.add('name-wrapper');
        nameWrapper.appendChild(nameElement);
        nameWrapper.appendChild(clientTag);

        const contentWrapper = document.createElement('div');
        contentWrapper.classList.add('content-wrapper');
        contentWrapper.appendChild(nameWrapper);
        contentWrapper.appendChild(starsElement);
        contentWrapper.appendChild(commentElement);

        review.appendChild(avatar);
        review.appendChild(contentWrapper);

        return review;
    }

    function saveReviewToLocalStorage(name, stars, comment) {
        const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
        reviews.push({ name, stars, comment });
        localStorage.setItem('reviews', JSON.stringify(reviews));
    }

    function loadReviewsFromLocalStorage() {
        const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
        reviews.forEach(reviewData => {
            const review = createReview(reviewData.name, reviewData.stars, reviewData.comment);
            reviewsContainer.appendChild(review);
        });
    }

    // Загрузка отзывов при загрузке страницы
    loadReviewsFromLocalStorage();

    // Очистка полей ввода при нажатии на кнопку "Подобрать сделки"
    const userPhoneInput = document.getElementById('userPhone');
    const submitButton = document.getElementById('submitButton');
    const userNameInput = document.getElementById('userName');

    // Ограничение ввода только цифр и символа "+"
    userPhoneInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^\d+]/g, ''); // Разрешаем ввод только цифр и символа "+"
        if (!this.value.startsWith('+7')) {
            this.value = '+7';
        }
    });

    // Очистка полей при нажатии на кнопку
    submitButton.addEventListener('click', function() {
        userNameInput.value = ''; // Очищаем поле имени
        userPhoneInput.value = ''; // Очищаем поле телефона
        optionsModal.classList.add('hidden'); // Скрываем модальное окно
    });
});
