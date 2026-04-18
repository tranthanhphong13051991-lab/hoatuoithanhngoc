// =====================================================
// script.js — Trang chính Thanh Ngọc Flower's
// Dùng products.js để render sản phẩm
// =====================================================

// ===== DOM =====
var header       = document.getElementById('header');
var menuToggle   = document.getElementById('menu-toggle');
var nav          = document.querySelector('nav');
var toast        = document.getElementById('toast');
var productsGrid = document.getElementById('products-grid');
var filterWrap   = document.getElementById('products-filter');
var contactForm  = document.getElementById('contact-form');
var productModal    = document.getElementById('product-modal');
var productOverlay  = document.getElementById('product-overlay');
var productModalInner = document.getElementById('product-modal-inner');
var closeProductModal = document.getElementById('close-product-modal');

var toastTimer;

// =====================================================
// RENDER SẢN PHẨM TỪ products.js
// =====================================================
function renderProducts() {
    var products = getProducts();
    if (!products || products.length === 0) {
        productsGrid.innerHTML = '<li style="grid-column:1/-1;text-align:center;padding:60px;color:#9CA3AF">Chưa có sản phẩm nào. <a href="admin.html" style="color:#2A7B73">Thêm sản phẩm mới</a></li>';
        return;
    }

    productsGrid.innerHTML = products.map(function (p) {
        var badge = p.badge
            ? '<span class="product-badge ' + getBadgeClass(p.badge) + '">' + p.badge + '</span>'
            : '';
        var imgSrc = p.image || '';
        var placeholder = 'https://placehold.co/400x320/E5F3F1/2A7B73?text=' + encodeURIComponent(p.categoryLabel || 'Hoa');

        return '<li class="product-card" data-category="' + p.category + '" data-id="' + p.id + '" id="pcard-' + p.id + '" role="button" tabindex="0" aria-label="Xem chi tiết ' + p.name + '">' +
            '<div class="product-img-wrap">' +
                '<img src="' + imgSrc + '" alt="' + p.name + '" loading="lazy" onerror="this.src=\'' + placeholder + '\'">' +
                badge +
            '</div>' +
            '<div class="product-info">' +
                '<span class="product-category">' + (p.categoryLabel || '') + '</span>' +
                '<h3 class="product-name">' + p.name + '</h3>' +
                '<p class="product-desc">' + (p.description || '') + '</p>' +
                '<div class="product-footer product-footer--contact">' +
                    '<a href="tel:' + TNF_PHONES.phone1 + '" class="btn-contact-call" id="call-' + p.id + '" onclick="event.stopPropagation()">📞 Gọi ngay</a>' +
                    '<a href="' + getZaloLink(TNF_PHONES.phone1) + '" class="btn-contact-zalo" id="zalo-' + p.id + '" target="_blank" rel="noopener" onclick="event.stopPropagation()">Zalo</a>' +
                '</div>' +
            '</div>' +
        '</li>';
    }).join('');

    // Gắn sự kiện click mở modal
    productsGrid.querySelectorAll('.product-card').forEach(function (card) {
        card.addEventListener('click', function () {
            openProductModal(card.dataset.id);
        });
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') openProductModal(card.dataset.id);
        });
    });
}

function getBadgeClass(badge) {
    var map = { 'Mới': 'new', 'Premium': 'premium', 'Phổ Biến': 'sale' };
    return map[badge] || '';
}

// =====================================================
// MODAL CHI TIẾT SẢN PHẨM
// =====================================================
function openProductModal(id) {
    var products = getProducts();
    var p = products.find(function (x) { return x.id === id; });
    if (!p) return;

    var related = getRelated(p.id, p.category, 4);
    var placeholder = 'https://placehold.co/600x420/E5F3F1/2A7B73?text=' + encodeURIComponent(p.name);

    var relatedHtml = '';
    if (related.length > 0) {
        relatedHtml = '<div class="modal-related">' +
            '<h4 class="modal-related-title">✿ Sản Phẩm Tương Tự</h4>' +
            '<div class="modal-related-grid">' +
            related.map(function (r) {
                var rImg = r.image || 'https://placehold.co/200x160/E5F3F1/2A7B73?text=' + encodeURIComponent(r.name);
                return '<div class="modal-related-card" data-id="' + r.id + '" role="button" tabindex="0">' +
                    '<img src="' + rImg + '" alt="' + r.name + '" onerror="this.src=\'https://placehold.co/200x160/E5F3F1/2A7B73?text=Hoa\'">' +
                    '<p>' + r.name + '</p>' +
                '</div>';
            }).join('') +
            '</div>' +
        '</div>';
    }

    productModalInner.innerHTML =
        '<div class="modal-layout">' +
            '<div class="modal-img-col">' +
                '<img src="' + (p.image || placeholder) + '" alt="' + p.name + '" class="modal-img" onerror="this.src=\'' + placeholder + '\'">' +
                (p.badge ? '<span class="modal-badge">' + p.badge + '</span>' : '') +
            '</div>' +
            '<div class="modal-info-col">' +
                '<span class="modal-cat-badge">' + (p.categoryLabel || '') + '</span>' +
                '<h2 class="modal-product-name">' + p.name + '</h2>' +
                '<div class="modal-contact-cta">' +
                    '<a href="tel:' + TNF_PHONES.phone1 + '" class="btn-modal-call" id="modal-call-1">📞 ' + TNF_PHONES.phone1_display + '</a>' +
                    '<a href="tel:' + TNF_PHONES.phone2 + '" class="btn-modal-call btn-modal-call--2" id="modal-call-2">📞 ' + TNF_PHONES.phone2_display + '</a>' +
                    '<a href="' + getZaloLink(TNF_PHONES.phone1) + '" class="btn-modal-zalo" id="modal-zalo" target="_blank" rel="noopener">💬 Nhắn Zalo ngay</a>' +
                '</div>' +
                '<div class="modal-desc">' +
                    '<p>' + (p.description || '') + '</p>' +
                '</div>' +
                '<div class="modal-meaning">' +
                    '<h3 class="modal-meaning-title">🌸 Ý Nghĩa Của Hoa</h3>' +
                    '<p class="modal-meaning-text">' + (p.meaning || '') + '</p>' +
                '</div>' +
            '</div>' +
        '</div>' +
        relatedHtml;

    // Sự kiện click sản phẩm liên quan
    productModalInner.querySelectorAll('.modal-related-card').forEach(function (card) {
        card.addEventListener('click', function () {
            openProductModal(card.dataset.id);
        });
    });

    // Cập nhật URL hash và title (SEO)
    if (p.slug) {
        history.replaceState(null, '', '#san-pham/' + p.slug);
        document.title = p.name + ' — Thanh Ngọc Flower\'s';
    }

    productModal.classList.add('open');
    productOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    productModal.scrollTop = 0;
}

function closeProductModalFn() {
    productModal.classList.remove('open');
    productOverlay.classList.remove('open');
    document.body.style.overflow = '';
    history.replaceState(null, '', window.location.pathname);
    document.title = 'Thanh Ngọc Flower\'s - Hoa Tươi Tinh Tế';
}

closeProductModal.addEventListener('click', closeProductModalFn);
productOverlay.addEventListener('click', closeProductModalFn);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeProductModalFn();
        closeMenu();
    }
});

// =====================================================
// BỘ LỌC SẢN PHẨM — TỰ ĐỘNG
// =====================================================
function buildFilters() {
    var cards = productsGrid.querySelectorAll('.product-card');
    var categoryMap = {};

    cards.forEach(function (card) {
        var slug  = card.dataset.category;
        var label = card.querySelector('.product-category');
        if (slug && label && !categoryMap[slug]) {
            categoryMap[slug] = label.textContent.trim();
        }
    });

    filterWrap.innerHTML = '';

    var btnAll = document.createElement('button');
    btnAll.className = 'filter-btn active';
    btnAll.dataset.filter = 'all';
    btnAll.id = 'filter-all';
    btnAll.textContent = 'Tất Cả';
    filterWrap.appendChild(btnAll);

    Object.keys(categoryMap).forEach(function (slug) {
        var btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.dataset.filter = slug;
        btn.id = 'filter-' + slug;
        btn.textContent = categoryMap[slug];
        filterWrap.appendChild(btn);
    });

    filterWrap.querySelectorAll('.filter-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterWrap.querySelectorAll('.filter-btn').forEach(function (b) {
                b.classList.remove('active');
            });
            btn.classList.add('active');

            var filter = btn.dataset.filter;
            productsGrid.querySelectorAll('.product-card').forEach(function (card) {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'none';
                    void card.offsetWidth;
                    card.style.animation = 'fadeInUp 0.4s ease both';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

// =====================================================
// HEADER SCROLL + ACTIVE NAV
// =====================================================
window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveNav();
}, { passive: true });

var sections = document.querySelectorAll('section[id], .banner[id]');
var navLinks  = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    var scrollY = window.scrollY + 100;
    sections.forEach(function (section) {
        var top    = section.offsetTop;
        var height = section.offsetHeight;
        var id     = section.getAttribute('id');
        if (scrollY >= top && scrollY < top + height) {
            navLinks.forEach(function (link) {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + id) link.classList.add('active');
            });
        }
    });
}

// =====================================================
// MOBILE MENU
// =====================================================
function openMenu() {
    nav.classList.add('mobile-open');
    document.body.style.overflow = 'hidden';
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.innerHTML = [
        '<span style="transform:rotate(45deg) translate(5px,5px)"></span>',
        '<span style="opacity:0"></span>',
        '<span style="transform:rotate(-45deg) translate(5px,-5px)"></span>'
    ].join('');
}

function closeMenu() {
    nav.classList.remove('mobile-open');
    document.body.style.overflow = '';
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.innerHTML = '<span></span><span></span><span></span>';
}

menuToggle.addEventListener('click', function () {
    nav.classList.contains('mobile-open') ? closeMenu() : openMenu();
});

navLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
});

// =====================================================
// FORM LIÊN HỆ
// =====================================================
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var name  = document.getElementById('name-input').value.trim();
        var phone = document.getElementById('phone-input').value.trim();

        if (!name) {
            showToast('⚠️ Vui lòng nhập họ tên của bạn!');
            document.getElementById('name-input').focus();
            return;
        }
        if (!phone) {
            showToast('⚠️ Vui lòng nhập số điện thoại!');
            document.getElementById('phone-input').focus();
            return;
        }
        if (!/^[0-9]{9,11}$/.test(phone.replace(/\s/g, ''))) {
            showToast('⚠️ Số điện thoại không hợp lệ!');
            return;
        }

        showToast('✅ Cảm ơn ' + name + '! Chúng tôi sẽ liên hệ bạn sớm 🌸');
        contactForm.reset();
    });
}

// =====================================================
// TOAST
// =====================================================
function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
        toast.classList.remove('show');
    }, 2800);
}

// =====================================================
// KHỞI ĐỘNG
// =====================================================
renderProducts();
buildFilters();
updateActiveNav();