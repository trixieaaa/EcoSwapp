document.addEventListener('DOMContentLoaded', () => {
    initModal();
    loadPage('home');
    
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.getAttribute('href').substring(1);
            loadPage(page);
        });
    });
});

function loadPage(page) {
    showLoader();
    const pages = {
        home: `
            <section class="hero">
                <h1>Дадим вещам вторую жизнь! ♻</h1>
                <p>Присоединяйтесь к сообществу EcoSwap</p>
                <button onclick="loadPage('catalog')">Смотреть каталог</button>
                <div class="carousel-container">
                    <div class="carousel" id="ecoCarousel">
                        <div class="carousel-item active">
                            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c" alt="Эко-совет 1">
                            <div class="carousel-caption">Сортируйте мусор для переработки</div>
                        </div>
                        <div class="carousel-item">
                            <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09" alt="Эко-совет 2">
                            <div class="carousel-caption">Обменивайтесь вещами вместо покупки новых</div>
                        </div>
                        <div class="carousel-item">
                            <img src="https://images.unsplash.com/photo-1519681393784-d120267933ba" alt="Эко-совет 3">
                            <div class="carousel-caption">Используйте многоразовые предметы</div>
                        </div>
                    </div>
                    <button class="carousel-control prev" onclick="changeSlide(-1)">❮</button>
                    <button class="carousel-control next" onclick="changeSlide(1)">❯</button>
                </div>
                <div class="stats">
                    <div class="stat-item">
                        <h3>${getTotalItems()}+</h3>
                        <p>Вещей обменяно</p>
                    </div>
                    <div class="stat-item">
                        <h3>${getTotalUsers()}+</h3>
                        <p>Участников</p>
                    </div>
                </div>
            </section>
            <section class="join-us">
                <h2>Почему EcoSwap?</h2>
                <div class="benefits-grid">
                    <div class="benefit-item">
                        <h3>Экология</h3>
                        <p>Сокращайте отходы, дарите вещам вторую жизнь.</p>
                    </div>
                    <div class="benefit-item">
                        <h3>Экономия</h3>
                        <p>Обменивайтесь бесплатно, экономьте деньги.</p>
                    </div>
                    <div class="benefit-item">
                        <h3>Сообщество</h3>
                        <p>Присоединяйтесь к единомышленникам.</p>
                    </div>
                </div>
                <button onclick="loadPage('add-item')">Добавить свою вещь</button>
            </section>
        `,
        catalog: `
            <h2>Каталог вещей</h2>
            <div class="filter">
                <select id="categoryFilter">
                    <option value="all">Все категории</option>
                    <option value="clothes">Одежда</option>
                    <option value="books">Книги</option>
                    <option value="electronics">Электроника</option>
                </select>
            </div>
            <div class="items-grid" id="itemsGrid"></div>
        `,
        'add-item': `
            <div class="form-container">
                <h2>Добавить вещь</h2>
                <form id="addItemForm">
                    <div class="form-group">
                        <label>Название:</label>
                        <input type="text" id="itemName" required>
                    </div>
                    <div class="form-group">
                        <label>Описание:</label>
                        <textarea id="itemDescription" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Адрес получения:</label>
                        <input type="text" id="itemAddress" required>
                    </div>
                    <div class="form-group">
                        <label>Категория:</label>
                        <select id="itemCategory" required>
                            <option value="clothes">Одежда</option>
                            <option value="books">Книги</option>
                            <option value="electronics">Электроника</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Фото (до 5 МБ):</label>
                        <input type="file" id="itemImage" accept="image/*">
                    </div>
                    <button type="submit">Добавить вещь</button>
                </form>
            </div>
        `,
        contact: `
            <div class="form-container">
                <h2>Контакты</h2>
                <p>✉️ Email: contact@ecoswap.com</p>
                <p>📞 Телефон: +7 (776) 228-45-67</p>
                <h3>Форма обратной связи</h3>
                <form id="contactForm">
                    <div class="form-group">
                        <label>Ваше имя:</label>
                        <input type="text" required>
                    </div>
                    <div class="form-group">
                        <label>Сообщение:</label>
                        <textarea required></textarea>
                    </div>
                    <button type="submit">Отправить</button>
                </form>
            </div>
        `
    };

    const content = document.getElementById('content');
    content.innerHTML = pages[page] || '<h2>Страница не найдена</h2>';
    
    switch(page) {
        case 'home':
            initCarousel();
            break;
        case 'catalog':
            initCategoryFilter();
            loadItems();
            break;
        case 'add-item':
            initAddItemForm();
            break;
    }
    
    hideLoader();
    window.scrollTo(0, 0);
}

function initCarousel() {
    let slideIndex = 0;
    const slides = document.querySelectorAll('.carousel-item');
    const totalSlides = slides.length;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }

    window.changeSlide = (n) => {
        slideIndex = (slideIndex + n + totalSlides) % totalSlides;
        showSlide(slideIndex);
    };

    // Auto-advance carousel every 5 seconds
    setInterval(() => {
        changeSlide(1);
    }, 5000);

    showSlide(slideIndex);
}

function initCategoryFilter() {
    const filter = document.getElementById('categoryFilter');
    if(filter) {
        filter.addEventListener('change', () => {
            showLoader();
            setTimeout(loadItems, 300);
        });
    }
}

function loadItems() {
    const category = document.getElementById('categoryFilter')?.value || 'all';
    const items = JSON.parse(localStorage.getItem('items')) || [];
    const filteredItems = category === 'all' ? items : items.filter(item => item.category === category);
    
    const grid = document.getElementById('itemsGrid');
    if(grid) {
        grid.innerHTML = filteredItems.map(item => `
            <div class="item-card">
                ${item.image ? `
                    <img src="${item.image}" 
                        class="item-image" 
                        alt="${item.name.replace(/"/g, '"')}"
                        onclick="openModal('${item.image.replace(/'/g, "\\'")}', '${item.name.replace(/'/g, "\\'")}')">` : ''}
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="item-details">
                    <div class="detail-item">
                        <span>Категория:</span> ${getCategoryName(item.category)}
                    </div>
                    <div class="detail-item">
                        <span>Адрес:</span> 
                        <span class="address">${item.address || 'Не указан'}</span>
                    </div>
                    <div class="detail-item">
                        <span>Добавлено:</span> 
                        ${new Date(item.id).toLocaleDateString()}
                    </div>
                </div>
                <button onclick="takeItem('${item.id}')">Забрать</button>
            </div>
        `).join('');
    }
}

function getCategoryName(category) {
    const categories = {
        clothes: 'Одежда',
        books: 'Книги',
        electronics: 'Электроника'
    };
    return categories[category] || 'Другое';
}

function initAddItemForm() {
    const form = document.getElementById('addItemForm');
    if(form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const newItem = {
                id: Date.now(),
                name: document.getElementById('itemName').value,
                description: document.getElementById('itemDescription').value,
                address: document.getElementById('itemAddress').value,
                category: document.getElementById('itemCategory').value,
                image: ''
            };

            const fileInput = document.getElementById('itemImage');
            if(fileInput.files[0]) {
                if(fileInput.files[0].size > 5 * 1024 * 1024) {
                    showNotification('Файл слишком большой! Максимум 5 МБ');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = (e) => {
                    newItem.image = e.target.result;
                    saveItem(newItem);
                };
                reader.readAsDataURL(fileInput.files[0]);
            } else {
                saveItem(newItem);
            }
        };
    }
}

function saveItem(item) {
    const items = JSON.parse(localStorage.getItem('items')) || [];
    items.push(item);
    localStorage.setItem('items', JSON.stringify(items));
    showNotification('Вещь успешно добавлена!');
    loadPage('catalog');
}

function takeItem(itemId) {
    if(!confirm('Вы точно хотите забрать эту вещь?')) return;
    showLoader();
    setTimeout(() => {
        let items = JSON.parse(localStorage.getItem('items')) || [];
        items = items.filter(item => item.id != itemId);
        localStorage.setItem('items', JSON.stringify(items));
        loadItems();
        hideLoader();
        showNotification('Вещь успешно забрана!');
    }, 300);
}

function initModal() {
    const modal = document.getElementById('imageModal');
    const span = document.querySelector('.close');
    
    if(modal && span) {
        span.onclick = () => {
            modal.style.display = "none";
            document.removeEventListener('keydown', handleEsc);
        };
        
        window.onclick = (event) => {
            if(event.target == modal) {
                modal.style.display = "none";
                document.removeEventListener('keydown', handleEsc);
            }
        };
        
        const handleEsc = (e) => {
            if(e.key === 'Escape') {
                modal.style.display = "none";
                document.removeEventListener('keydown', handleEsc);
            }
        };
        
        document.addEventListener('keydown', handleEsc);
    }
}

function openModal(imageSrc, title) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const captionText = document.getElementById('caption');
    
    if(modal && modalImg && captionText) {
        modal.style.display = "block";
        modalImg.src = imageSrc;
        captionText.textContent = title;
    }
}

function showNotification(message, duration = 3000) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    notification.style.display = 'block';
    setTimeout(() => notification.remove(), duration);
}

function showLoader() {
    const loader = document.createElement('div');
    loader.className = 'loader';
    document.body.appendChild(loader);
    loader.style.display = 'block';
}

function hideLoader() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.remove();
    }
}

function getTotalItems() {
    return JSON.parse(localStorage.getItem('items'))?.length || 0;
}

function getTotalUsers() {
    return Math.floor(getTotalItems() * 0.7);
}