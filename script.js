// 回到顶部按钮
const backToTopBtn = document.querySelector('button.fixed');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.remove('opacity-0', 'invisible');
        backToTopBtn.classList.add('opacity-100', 'visible');
    } else {
        backToTopBtn.classList.remove('opacity-100', 'visible');
        backToTopBtn.classList.add('opacity-0', 'invisible');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 导航栏滚动效果
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('shadow-md');
        header.classList.remove('shadow-sm');
    } else {
        header.classList.remove('shadow-md');
        header.classList.add('shadow-sm');
    }
});

// 轮播图：自动轮播 + 指示器切换 + 悬停暂停
const heroImage = document.getElementById('hero-image');
const indicators = document.querySelectorAll('.carousel-indicator');
const heroSection = heroImage ? heroImage.closest('.group') : null;
const pleasantImages = [
    'https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=1600&auto=format&fit=crop', // 家居陈设
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1600&auto=format&fit=crop', // 清新餐具与食物
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1600&auto=format&fit=crop'  // 清爽数码摆拍
];
let currentIndex = 0;
let autoTimer = null;
let switchToken = 0; // 防止快速切换造成动画错乱

// 预加载图片，避免点击后切换不明显
pleasantImages.forEach(src => {
    const img = new Image();
    img.src = src;
});

function setSlide(index) {
    if (!heroImage) return;
    const token = ++switchToken;
    const nextIndex = (index + pleasantImages.length) % pleasantImages.length;
    // 淡出
    heroImage.classList.add('opacity-0');
    setTimeout(() => {
        if (token !== switchToken) return; // 有新切换发生，丢弃旧动画
        currentIndex = nextIndex;
        heroImage.src = pleasantImages[currentIndex];
        // 等待浏览器应用新图像再淡入
        requestAnimationFrame(() => {
            heroImage.classList.remove('opacity-0');
            heroImage.classList.add('opacity-100');
        });
    }, 200);
    indicators.forEach((el, i) => {
        const isActive = i === currentIndex;
        el.classList.toggle('opacity-100', isActive);
        el.classList.toggle('opacity-50', !isActive);
    });
}

function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => setSlide(currentIndex + 1), 1000);
}
function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
}

indicators.forEach((indicator) => {
    indicator.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const idx = parseInt(indicator.dataset.index || '0', 10);
        // 立即切到目标并重启自动轮播，保证点击后不会马上跳过
        setSlide(idx);
        startAuto();
    });
});

if (heroSection) {
    heroSection.addEventListener('mouseenter', stopAuto);
    heroSection.addEventListener('mouseleave', startAuto);
}

setSlide(0);
startAuto();

// 购物车交互：加入购物车计数 + 轻量提示
const cartCountEl = document.getElementById('cart-count');
const heroAddBtn = document.getElementById('hero-add-to-cart');
function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = 'fixed bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-sm px-4 py-2 rounded-full shadow-lg z-50';
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('opacity-0'), 1600);
    setTimeout(() => toast.remove(), 2000);
}

function incrementCart(by = 1) {
    if (!cartCountEl) return;
    const current = parseInt(cartCountEl.textContent || '0', 10) || 0;
    cartCountEl.textContent = String(current + by);
}

if (heroAddBtn) {
    heroAddBtn.addEventListener('click', () => {
        incrementCart(1);
        showToast('已加入购物车');
    });
}


