// =====================================================
// products.js — Tầng dữ liệu dùng chung
// Dùng cho cả trang chính (index.html) và admin.html
// =====================================================

var TNF_KEY = 'tnf_products';

// Số điện thoại liên hệ của shop
var TNF_PHONES = {
    phone1: '0934926092',
    phone1_display: '093 492 6092',
    phone2: '0866086574',
    phone2_display: '086 608 6574'
};

// ===== DỮ LIỆU MẶC ĐỊNH =====
var DEFAULT_PRODUCTS = [
    {
        id: '1',
        name: 'Bó Hoa Hồng Kem Tinh Tế',
        slug: 'bo-hoa-hong-kem-tinh-te',
        category: 'bo-hoa',
        categoryLabel: 'Bó Hoa',
        image: 'image/hoa1.jpg',
        description: 'Hoa hồng kem thuần khiết, gói kraft thủ công, dành tặng những khoảnh khắc đặc biệt.',
        meaning: 'Hoa hồng kem tượng trưng cho tình yêu trong sáng, thuần khiết và sự ngưỡng mộ chân thành. Không quá nồng nàn như đỏ, không quá hồn nhiên như trắng — kem là giữa hai thế giới, là lời nói "tôi trân trọng bạn" nhẹ nhàng nhất. Tặng hoa hồng kem trong ngày sinh nhật, kỷ niệm hay đơn giản chỉ để nói rằng bạn đang nghĩ đến ai đó.',
        badge: 'Bán Chạy',
        featured: true
    },
    {
        id: '2',
        name: 'Giỏ Hoa Trắng Xanh Thanh Nhã',
        slug: 'gio-hoa-trang-xanh-thanh-nha',
        category: 'gio-hoa',
        categoryLabel: 'Giỏ Hoa',
        image: 'image/hoa2.jpg',
        description: 'Hồng trắng, cúc trắng, cẩm tú cầu xanh — vẻ đẹp thanh nhã kết hợp hoàn hảo trong một giỏ hoa sang trọng.',
        meaning: 'Sắc trắng trong giỏ hoa mang ý nghĩa của sự thuần khiết, bình an và khởi đầu mới. Cẩm tú cầu xanh nhẹ nhàng tượng trưng cho lòng biết ơn và sự chân thành. Kết hợp cùng nhau, giỏ hoa này là món quà lý tưởng cho những dịp quan trọng như chúc mừng tốt nghiệp, sinh nhật người thân hoặc thăm hỏi ốm.',
        badge: 'Mới',
        featured: false
    },
    {
        id: '3',
        name: 'Hoa Khai Trương Thịnh Vượng',
        slug: 'hoa-khai-truong-thinh-vuong',
        category: 'khai-truong',
        categoryLabel: 'Khai Trương',
        image: 'image/hoa3.jpg',
        description: 'Rực rỡ, tươi vui, đầy sức sống — bó hoa khai trương mang trọn ý nghĩa chúc phú quý và thịnh vượng.',
        meaning: 'Hoa khai trương thường được chọn với những gam màu rực rỡ như đỏ, vàng, cam — tượng trưng cho lửa nhiệt huyết, tài lộc và may mắn. Tặng hoa khai trương là cách bày tỏ sự chúc mừng chân thành và niềm tin vào thành công của đối tác, người thân. Mỗi cánh hoa là một lời chúc phát đạt được gửi trao.',
        badge: '',
        featured: false
    },
    {
        id: '4',
        name: 'Hoa Chia Buồn Lý Bạch Hợp',
        slug: 'hoa-chia-buon-ly-bach-hop',
        category: 'chia-buon',
        categoryLabel: 'Chia Buồn',
        image: 'image/hoa4.jpg',
        description: 'Trắng tinh thanh lịch, trang trọng — lời đồng cảm chân thành trong những giây phút khó khăn nhất.',
        meaning: 'Trong văn hóa Á Đông, hoa trắng — đặc biệt là lý, cúc trắng, bạch hợp — mang ý nghĩa tiễn biệt trang trọng và lời cầu nguyện bình an cho người đã khuất. Tặng hoa chia buồn là hành động đồng cảm, chia sẻ nỗi đau cùng gia đình trong những lúc mất mát. Sự xuất hiện của bạn và bó hoa chính là điểm tựa vô hình cho người đang đau.',
        badge: 'Phổ Biến',
        featured: false
    },
    {
        id: '5',
        name: 'Hoa Lan Hồ Điệp Trắng Quý Phái',
        slug: 'hoa-lan-ho-diep-trang-quy-phai',
        category: 'lan-ho-diep',
        categoryLabel: 'Lan Hồ Điệp',
        image: 'image/hoa5.jpg',
        description: 'Lan hồ điệp trắng thuần khiết, sang trọng — lựa chọn hoàn hảo cho mọi dịp đặc biệt trong năm.',
        meaning: 'Hoa lan hồ điệp được mệnh danh là "nữ hoàng của các loài hoa" — biểu tượng của sự sang trọng, quý giá và trường tồn. Lan hồ điệp trắng đặc biệt mang ý nghĩa thanh cao, thuần khiết và đức hạnh. Thích hợp tặng trong các dịp trang trọng như sinh nhật người lớn tuổi, khai trương công ty, hay đặt tại nơi thờ cúng để thể hiện lòng thành kính.',
        badge: '',
        featured: true
    },
    {
        id: '6',
        name: 'Bó Hoa Mùa Xuân Rực Rỡ',
        slug: 'bo-hoa-mua-xuan-ruc-ro',
        category: 'bo-hoa',
        categoryLabel: 'Bó Hoa',
        image: 'image/hoa6.jpg',
        description: 'Tổng hòa các loài hoa mùa xuân — rực rỡ, tươi vui, trọn vẹn yêu thương trong mỗi cánh hoa.',
        meaning: 'Bó hoa mùa xuân là sự kết hợp đa sắc màu tượng trưng cho niềm vui, sự đổi mới và hy vọng. Mỗi loài hoa trong bó mang một ý nghĩa riêng, nhưng cùng nhau tạo nên một thông điệp rõ ràng: "Cuộc sống thật đáng yêu và bạn là một phần tươi đẹp trong cuộc sống của tôi." Lựa chọn lý tưởng cho ngày Tết, Valentine hay bất kỳ ngày nào bạn muốn mang lại nụ cười.',
        badge: 'Premium',
        featured: true
    }
];

// ===== HÀM ĐỌC SẢN PHẨM =====
function getProducts() {
    try {
        var stored = localStorage.getItem(TNF_KEY);
        if (stored) {
            var parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (e) {}
    // Nếu chưa có, seed dữ liệu mặc định
    saveProducts(DEFAULT_PRODUCTS);
    return DEFAULT_PRODUCTS.slice();
}

// ===== HÀM LƯU SẢN PHẨM =====
function saveProducts(arr) {
    try {
        localStorage.setItem(TNF_KEY, JSON.stringify(arr));
    } catch (e) {
        console.warn('Không lưu được localStorage:', e);
    }
}

// ===== THÊM SẢN PHẨM =====
function addProduct(product) {
    var products = getProducts();
    product.id = Date.now().toString();
    products.push(product);
    saveProducts(products);
    return product;
}

// ===== SỬA SẢN PHẨM =====
function updateProduct(id, data) {
    var products = getProducts();
    var idx = products.findIndex(function (p) { return p.id === id; });
    if (idx !== -1) {
        products[idx] = Object.assign({}, products[idx], data);
        saveProducts(products);
        return products[idx];
    }
    return null;
}

// ===== XÓA SẢN PHẨM =====
function deleteProduct(id) {
    var products = getProducts().filter(function (p) { return p.id !== id; });
    saveProducts(products);
}

// ===== TẠO SLUG SEO =====
function generateSlug(str) {
    var map = {
        'à':'a','á':'a','ả':'a','ã':'a','ạ':'a',
        'ă':'a','ắ':'a','ặ':'a','ằ':'a','ẳ':'a','ẵ':'a',
        'â':'a','ấ':'a','ầ':'a','ẩ':'a','ẫ':'a','ậ':'a',
        'đ':'d',
        'è':'e','é':'e','ẻ':'e','ẽ':'e','ẹ':'e',
        'ê':'e','ế':'e','ề':'e','ể':'e','ễ':'e','ệ':'e',
        'ì':'i','í':'i','ỉ':'i','ĩ':'i','ị':'i',
        'ò':'o','ó':'o','ỏ':'o','õ':'o','ọ':'o',
        'ô':'o','ố':'o','ồ':'o','ổ':'o','ỗ':'o','ộ':'o',
        'ơ':'o','ớ':'o','ờ':'o','ở':'o','ỡ':'o','ợ':'o',
        'ù':'u','ú':'u','ủ':'u','ũ':'u','ụ':'u',
        'ư':'u','ứ':'u','ừ':'u','ử':'u','ữ':'u','ự':'u',
        'ỳ':'y','ý':'y','ỷ':'y','ỹ':'y','ỵ':'y'
    };
    return str.toLowerCase()
        .split('').map(function (c) { return map[c] || c; }).join('')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

// ===== LẤY SẢN PHẨM LIÊN QUAN =====
function getRelated(currentId, category, limit) {
    limit = limit || 4;
    return getProducts()
        .filter(function (p) { return p.category === category && p.id !== currentId; })
        .slice(0, limit);
}

// ===== LINK LIÊN HỆ =====
function getZaloLink(phone) {
    return 'https://zalo.me/' + phone.replace(/\s/g, '');
}
