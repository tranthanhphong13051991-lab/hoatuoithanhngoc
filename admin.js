// =====================================================
// admin.js — Logic trang quản trị
// Thanh Ngọc Flower's
// =====================================================

// ===== DOM =====
var tbody       = document.getElementById('product-tbody');
var countEl     = document.getElementById('product-count');
var formPanel   = document.getElementById('form-panel');
var formOverlay = document.getElementById('form-overlay');
var form        = document.getElementById('product-form');
var formTitle   = document.getElementById('form-title');
var toast       = document.getElementById('admin-toast');
var confirmDlg  = document.getElementById('confirm-dialog');

// Form fields
var fId          = document.getElementById('field-id');
var fName        = document.getElementById('field-name');
var fSlug        = document.getElementById('field-slug');
var fCatLabel    = document.getElementById('field-category-label');
var fBadge       = document.getElementById('field-badge');
var fImage       = document.getElementById('field-image');
var fDesc        = document.getElementById('field-description');
var fMeaning     = document.getElementById('field-meaning');
var fFeatured    = document.getElementById('field-featured');
var imagePreview = document.getElementById('image-preview');
var catList      = document.getElementById('category-list');

var pendingDeleteId = null;
var toastTimer;

// ===== KHỞI ĐỘNG =====
document.addEventListener('DOMContentLoaded', function () {
    renderTable();
    bindEvents();
});

// ===== RENDER BẢNG SẢN PHẨM =====
function renderTable() {
    var products = getProducts();
    countEl.textContent = products.length + ' sản phẩm';

    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="table-empty">Chưa có sản phẩm nào. Bấm "+ Thêm" để bắt đầu!</td></tr>';
        return;
    }

    // Cập nhật datalist danh mục
    var cats = {};
    products.forEach(function (p) {
        if (p.category && p.categoryLabel) cats[p.category] = p.categoryLabel;
    });
    catList.innerHTML = Object.values(cats).map(function (l) {
        return '<option value="' + l + '">';
    }).join('');

    tbody.innerHTML = products.map(function (p, index) {
        var thumb = p.image
            ? '<img class="tbl-thumb" src="' + p.image + '" alt="' + p.name + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' +
              '<div class="tbl-thumb-placeholder" style="display:none">🌸</div>'
            : '<div class="tbl-thumb-placeholder">🌸</div>';

        var badge = p.badge ? '<span class="badge-pill">' + p.badge + '</span>' : '<span style="color:#9CA3AF;font-size:0.75rem">—</span>';

        return '<tr data-id="' + p.id + '">' +
            '<td>' + thumb + '</td>' +
            '<td>' +
                '<div class="tbl-name">' + escHtml(p.name) + '</div>' +
                '<div class="tbl-slug">' + escHtml(p.slug || '') + '</div>' +
            '</td>' +
            '<td><span class="cat-pill">' + escHtml(p.categoryLabel || '') + '</span></td>' +
            '<td>' + badge + '</td>' +
            '<td style="font-family:monospace;font-size:0.76rem;color:#9CA3AF">' + escHtml(p.slug || '') + '</td>' +
            '<td>' +
                '<div class="tbl-actions">' +
                    '<button class="btn-edit" data-id="' + p.id + '">Sửa</button>' +
                    '<button class="btn-delete" data-id="' + p.id + '">Xoá</button>' +
                '</div>' +
            '</td>' +
        '</tr>';
    }).join('');
}

// ===== GẮN SỰ KIỆN =====
function bindEvents() {
    // Mở form thêm mới
    document.getElementById('btn-open-form').addEventListener('click', openFormNew);

    // Đóng form
    document.getElementById('btn-close-form').addEventListener('click', closeForm);
    document.getElementById('btn-cancel-form').addEventListener('click', closeForm);
    formOverlay.addEventListener('click', closeForm);

    // Submit form
    form.addEventListener('submit', handleSave);

    // Auto-slug khi gõ tên
    fName.addEventListener('input', function () {
        fSlug.value = generateSlug(fName.value);
    });

    // Preview ảnh realtime
    fImage.addEventListener('input', updateImagePreview);

    // Bảng sản phẩm — event delegation
    tbody.addEventListener('click', function (e) {
        var editBtn = e.target.closest('.btn-edit');
        var delBtn  = e.target.closest('.btn-delete');
        if (editBtn) openFormEdit(editBtn.dataset.id);
        if (delBtn)  openConfirmDelete(delBtn.dataset.id);
    });

    // Confirm xoá
    document.getElementById('confirm-ok').addEventListener('click', function () {
        if (pendingDeleteId) {
            deleteProduct(pendingDeleteId);
            pendingDeleteId = null;
            closeConfirm();
            renderTable();
            showToast('✅ Đã xoá sản phẩm!');
        }
    });

    document.getElementById('confirm-cancel').addEventListener('click', closeConfirm);

    // ESC đóng form / confirm
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeForm();
            closeConfirm();
        }
    });
}

// ===== MỞ FORM THÊM MỚI =====
function openFormNew() {
    fId.value       = '';
    form.reset();
    fSlug.value     = '';
    imagePreview.innerHTML = '<span>Xem trước ảnh</span>';
    formTitle.textContent  = 'Thêm Sản Phẩm Mới';
    document.getElementById('btn-save-form').textContent = 'Lưu Sản Phẩm';
    openFormPanel();
}

// ===== MỞ FORM SỬA =====
function openFormEdit(id) {
    var products = getProducts();
    var p = products.find(function (x) { return x.id === id; });
    if (!p) return;

    fId.value              = p.id;
    fName.value            = p.name || '';
    fSlug.value            = p.slug || '';
    fCatLabel.value        = p.categoryLabel || '';
    fBadge.value           = p.badge || '';
    fImage.value           = p.image || '';
    fDesc.value            = p.description || '';
    fMeaning.value         = p.meaning || '';
    fFeatured.checked      = !!p.featured;
    formTitle.textContent  = 'Chỉnh Sửa Sản Phẩm';
    document.getElementById('btn-save-form').textContent = 'Cập Nhật';

    updateImagePreview();
    openFormPanel();
}

// ===== XỬ LÝ LƯU =====
function handleSave(e) {
    e.preventDefault();

    // Validate
    var valid = true;
    [fName, fImage, fDesc, fMeaning].forEach(function (f) {
        if (!f.value.trim()) {
            f.classList.add('error');
            valid = false;
        } else {
            f.classList.remove('error');
        }
    });

    if (!fCatLabel.value.trim()) {
        fCatLabel.classList.add('error');
        valid = false;
    } else {
        fCatLabel.classList.remove('error');
    }

    if (!valid) {
        showToast('⚠️ Vui lòng điền đầy đủ các trường bắt buộc!');
        return;
    }

    // Build data
    var catLabel = fCatLabel.value.trim();
    var catSlug  = generateSlug(catLabel);

    var data = {
        name:          fName.value.trim(),
        slug:          fSlug.value || generateSlug(fName.value.trim()),
        category:      catSlug,
        categoryLabel: catLabel,
        badge:         fBadge.value,
        image:         fImage.value.trim(),
        description:   fDesc.value.trim(),
        meaning:       fMeaning.value.trim(),
        featured:      fFeatured.checked
    };

    var id = fId.value;
    if (id) {
        updateProduct(id, data);
        showToast('✅ Đã cập nhật sản phẩm!');
    } else {
        addProduct(data);
        showToast('✅ Đã thêm sản phẩm mới!');
    }

    closeForm();
    renderTable();
}

// ===== PREVIEW ẢNH =====
function updateImagePreview() {
    var url = fImage.value.trim();
    if (!url) {
        imagePreview.innerHTML = '<span>Xem trước ảnh</span>';
        return;
    }
    imagePreview.innerHTML = '<img src="' + url + '" alt="preview" onerror="this.parentElement.innerHTML=\'<span>Không tìm thấy ảnh</span>\'">';
}

// ===== MỞ / ĐÓNG FORM PANEL =====
function openFormPanel() {
    formPanel.classList.add('open');
    formOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    fName.focus();
}

function closeForm() {
    formPanel.classList.remove('open');
    formOverlay.classList.remove('open');
    document.body.style.overflow = '';
}

// ===== CONFIRM XOÁ =====
function openConfirmDelete(id) {
    pendingDeleteId = id;
    confirmDlg.classList.add('open');
}

function closeConfirm() {
    confirmDlg.classList.remove('open');
    pendingDeleteId = null;
}

// ===== TOAST =====
function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
        toast.classList.remove('show');
    }, 3000);
}

// ===== ESCAPE HTML =====
function escHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
