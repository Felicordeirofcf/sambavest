// FUNCIONALIDADES DO HEADER
class HeaderManager {
    constructor() {
        this.cartCount = 0;
        this.wishlistCount = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCartCount();
    }

    setupEventListeners() {
        // Mobile menu toggle
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Scroll effect no header
        window.addEventListener('scroll', () => this.handleScroll());
    }

    toggleMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.classList.toggle('active');
        }
    }

    handleScroll() {
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            }
        }
    }

    updateCartCount() {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = this.cartCount;
            cartCountElement.style.display = this.cartCount > 0 ? 'flex' : 'none';
        }
    }

    addToCart() {
        this.cartCount++;
        this.updateCartCount();
        
        // Rastrear evento de adição ao carrinho
        if (window.marketingTracker) {
            window.marketingTracker.trackAddToCart('Produto', 0);
        }
    }

    removeFromCart() {
        if (this.cartCount > 0) {
            this.cartCount--;
            this.updateCartCount();
        }
    }
}

// Funções globais para o header
function toggleCart() {
    // Implementar modal/sidebar do carrinho
    console.log('Abrindo carrinho...');
    
    // Rastrear evento
    if (typeof gtag !== 'undefined') {
        gtag('event', 'view_cart');
    }
}

function openSearch() {
    // Implementar modal de busca
    console.log('Abrindo busca...');
    
    // Rastrear evento
    if (typeof gtag !== 'undefined') {
        gtag('event', 'search_opened');
    }
}

function openAccount() {
    // Implementar modal de conta/login
    console.log('Abrindo conta...');
    
    // Rastrear evento
    if (typeof gtag !== 'undefined') {
        gtag('event', 'login_opened');
    }
}

function toggleWishlist() {
    // Implementar lista de desejos
    console.log('Abrindo lista de desejos...');
    
    // Rastrear evento
    if (typeof gtag !== 'undefined') {
        gtag('event', 'view_wishlist');
    }
}

function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.headerManager = new HeaderManager();
});

