// FUNCIONALIDADES DOS PRODUTOS
class ProductManager {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.init();
    }

    init() {
        this.loadProducts();
        this.setupEventListeners();
    }

    loadProducts() {
        // Dados dos produtos (em produção, viria de uma API)
        this.products = [
            {
                id: 'beija-flor',
                name: 'Camisa Beija-Flor Enredo 2025',
                school: 'beija-flor',
                price: 89.90,
                image: 'images/products/camisa-beija-flor-frente.jpg',
                description: 'Camisa oficial licenciada da escola de samba Beija-Flor de Nilópolis',
                keywords: ['beija-flor', 'nilópolis', 'carnaval', 'camisa oficial']
            },
            {
                id: 'salgueiro',
                name: 'Camisa Salgueiro Enredo 2025',
                school: 'salgueiro',
                price: 89.90,
                image: 'images/products/camisa-salgueiro-frente.jpg',
                description: 'Camisa oficial licenciada da escola de samba Acadêmicos do Salgueiro',
                keywords: ['salgueiro', 'acadêmicos', 'carnaval', 'camisa oficial']
            },
            {
                id: 'viradouro',
                name: 'Camisa Viradouro Enredo 2025',
                school: 'viradouro',
                price: 89.90,
                image: 'images/products/camisa-viradouro-frente.jpg',
                description: 'Camisa oficial licenciada da escola de samba Unidos do Viradouro',
                keywords: ['viradouro', 'unidos', 'carnaval', 'camisa oficial']
            }
        ];
        this.filteredProducts = [...this.products];
    }

    setupEventListeners() {
        // Configurar lazy loading para imagens
        this.setupLazyLoading();
        
        // Configurar intersection observer para rastreamento de visualizações
        this.setupViewTracking();
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    setupViewTracking() {
        const productCards = document.querySelectorAll('.product-card');
        
        if ('IntersectionObserver' in window) {
            const viewObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const productId = entry.target.dataset.school;
                        const product = this.products.find(p => p.id === productId);
                        if (product && window.marketingTracker) {
                            window.marketingTracker.trackViewContent(product.name);
                        }
                    }
                });
            }, { threshold: 0.5 });

            productCards.forEach(card => viewObserver.observe(card));
        }
    }

    filterProducts() {
        const schoolFilter = document.getElementById('school-filter')?.value || '';
        const priceFilter = document.getElementById('price-filter')?.value || '';
        const searchTerm = document.getElementById('product-search')?.value.toLowerCase() || '';

        this.filteredProducts = this.products.filter(product => {
            // Filtro por escola
            if (schoolFilter && product.school !== schoolFilter) {
                return false;
            }

            // Filtro por preço
            if (priceFilter) {
                const [min, max] = priceFilter.split('-').map(p => parseFloat(p) || Infinity);
                if (product.price < min || (max !== Infinity && product.price > max)) {
                    return false;
                }
            }

            // Filtro por busca
            if (searchTerm) {
                const searchableText = [
                    product.name,
                    product.description,
                    ...product.keywords
                ].join(' ').toLowerCase();
                
                if (!searchableText.includes(searchTerm)) {
                    return false;
                }
            }

            return true;
        });

        this.renderProducts();
    }

    renderProducts() {
        // Em uma implementação completa, isso re-renderizaria os produtos filtrados
        console.log('Produtos filtrados:', this.filteredProducts);
        
        // Rastrear busca se houver termo
        const searchTerm = document.getElementById('product-search')?.value;
        if (searchTerm && window.marketingTracker) {
            window.marketingTracker.trackSearch(searchTerm);
        }
    }

    getProduct(productId) {
        return this.products.find(p => p.id === productId);
    }
}

// Funções globais para produtos
function addToCart(productId, price) {
    const product = window.productManager?.getProduct(productId);
    if (!product) return;

    console.log(`Adicionando ao carrinho: ${product.name}`);
    
    // Atualizar contador do carrinho
    if (window.headerManager) {
        window.headerManager.addToCart();
    }
    
    // Rastrear conversão
    if (window.marketingTracker) {
        window.marketingTracker.trackAddToCart(product.name, price);
    }

    // Feedback visual
    showNotification(`${product.name} adicionado ao carrinho!`, 'success');
}

function buyNow(productId, price) {
    const product = window.productManager?.getProduct(productId);
    if (!product) return;

    console.log(`Compra direta: ${product.name}`);
    
    // Rastrear início do checkout
    if (window.marketingTracker) {
        window.marketingTracker.trackInitiateCheckout(price);
    }

    // Redirecionar para checkout (implementar conforme necessário)
    // window.location.href = `/checkout?product=${productId}`;
    
    showNotification(`Redirecionando para checkout...`, 'info');
}

function addToWishlist(productId) {
    const product = window.productManager?.getProduct(productId);
    if (!product) return;

    console.log(`Adicionando à lista de desejos: ${product.name}`);
    
    // Rastrear evento
    if (typeof gtag !== 'undefined') {
        gtag('event', 'add_to_wishlist', {
            currency: 'BRL',
            value: product.price,
            items: [{
                item_id: productId,
                item_name: product.name,
                item_category: 'camisas_carnaval',
                price: product.price,
                quantity: 1
            }]
        });
    }

    showNotification(`${product.name} adicionado à lista de desejos!`, 'success');
}

function openProductModal(productId) {
    const product = window.productManager?.getProduct(productId);
    if (!product) return;

    console.log(`Abrindo modal do produto: ${product.name}`);
    
    // Implementar modal de produto
    // Por enquanto, apenas rastrear o evento
    if (window.marketingTracker) {
        window.marketingTracker.trackViewContent(product.name);
    }
}

function filterProducts() {
    if (window.productManager) {
        window.productManager.filterProducts();
    }
}

function searchProducts() {
    filterProducts();
}

function trackSearch(searchTerm) {
    if (searchTerm.length > 2 && window.marketingTracker) {
        // Debounce para evitar muitos eventos
        clearTimeout(window.searchTimeout);
        window.searchTimeout = setTimeout(() => {
            window.marketingTracker.trackSearch(searchTerm);
        }, 500);
    }
}

function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function showNotification(message, type = 'info') {
    // Implementar sistema de notificações
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // Criar notificação temporária
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.productManager = new ProductManager();
});

// CSS para animação da notificação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

