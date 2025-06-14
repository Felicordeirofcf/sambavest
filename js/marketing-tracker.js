// GERENCIADOR DE CONVERSÕES E EVENTOS DE MARKETING
// Este arquivo centraliza todas as funções de rastreamento para facilitar campanhas

class MarketingTracker {
    constructor() {
        this.isDebug = false; // Ativar para debug em desenvolvimento
        this.init();
    }

    init() {
        // Aguarda carregamento dos pixels
        setTimeout(() => {
            this.setupEventListeners();
        }, 1000);
    }

    // Configurar listeners para eventos importantes
    setupEventListeners() {
        // Rastrear cliques em produtos
        document.querySelectorAll('.product-card, .product-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const productName = e.target.closest('.product-card, .product-item')
                    ?.querySelector('.product-name, h3, h4')?.textContent || 'Produto';
                this.trackViewContent(productName);
            });
        });

        // Rastrear adições ao carrinho
        document.querySelectorAll('.add-to-cart, .btn-add-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productCard = e.target.closest('.product-card, .product-item');
                const productName = productCard?.querySelector('.product-name, h3, h4')?.textContent || 'Produto';
                const price = this.extractPrice(productCard);
                this.trackAddToCart(productName, price);
            });
        });

        // Rastrear início do checkout
        document.querySelectorAll('.checkout-btn, .btn-checkout').forEach(btn => {
            btn.addEventListener('click', () => {
                this.trackInitiateCheckout();
            });
        });

        // Rastrear formulários de contato
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', () => {
                this.trackLead();
            });
        });
    }

    // Extrair preço do elemento
    extractPrice(element) {
        const priceElement = element?.querySelector('.price, .valor, [data-price]');
        if (priceElement) {
            const priceText = priceElement.textContent || priceElement.dataset.price || '0';
            return parseFloat(priceText.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
        }
        return 0;
    }

    // Rastrear visualização de produto
    trackViewContent(productName) {
        this.log('View Content:', productName);
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'ViewContent', {
                content_name: productName,
                content_category: 'camisas_carnaval',
                content_type: 'product'
            });
        }

        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'view_item', {
                item_name: productName,
                item_category: 'camisas_carnaval'
            });
        }
    }

    // Rastrear adição ao carrinho
    trackAddToCart(productName, value = 0) {
        this.log('Add to Cart:', productName, value);
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'AddToCart', {
                content_name: productName,
                value: value,
                currency: 'BRL',
                content_type: 'product'
            });
        }

        // TikTok Pixel
        if (typeof ttq !== 'undefined') {
            ttq.track('AddToCart', {
                content_name: productName,
                value: value,
                currency: 'BRL'
            });
        }

        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'add_to_cart', {
                currency: 'BRL',
                value: value,
                items: [{
                    item_name: productName,
                    item_category: 'camisas_carnaval',
                    price: value,
                    quantity: 1
                }]
            });
        }
    }

    // Rastrear início do checkout
    trackInitiateCheckout(value = 0) {
        this.log('Initiate Checkout:', value);
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'InitiateCheckout', {
                value: value,
                currency: 'BRL'
            });
        }

        // TikTok Pixel
        if (typeof ttq !== 'undefined') {
            ttq.track('InitiateCheckout', {
                value: value,
                currency: 'BRL'
            });
        }

        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'begin_checkout', {
                currency: 'BRL',
                value: value
            });
        }
    }

    // Rastrear compra finalizada
    trackPurchase(transactionId, value, items = []) {
        this.log('Purchase:', transactionId, value);
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Purchase', {
                value: value,
                currency: 'BRL',
                content_type: 'product',
                content_category: 'camisas_carnaval'
            });
        }

        // TikTok Pixel
        if (typeof ttq !== 'undefined') {
            ttq.track('CompletePayment', {
                value: value,
                currency: 'BRL'
            });
        }

        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'purchase', {
                transaction_id: transactionId,
                value: value,
                currency: 'BRL',
                items: items
            });
        }

        // Google Ads
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
                'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
                'value': value,
                'currency': 'BRL',
                'transaction_id': transactionId
            });
        }
    }

    // Rastrear lead (formulário de contato)
    trackLead() {
        this.log('Lead generated');
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead');
        }

        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'generate_lead');
        }
    }

    // Rastrear busca
    trackSearch(searchTerm) {
        this.log('Search:', searchTerm);
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Search', {
                search_string: searchTerm
            });
        }

        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'search', {
                search_term: searchTerm
            });
        }
    }

    // Log para debug
    log(...args) {
        if (this.isDebug) {
            console.log('[Marketing Tracker]', ...args);
        }
    }
}

// Inicializar o rastreador quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.marketingTracker = new MarketingTracker();
});

// Funções globais para uso manual
window.trackPurchase = function(transactionId, value, items) {
    if (window.marketingTracker) {
        window.marketingTracker.trackPurchase(transactionId, value, items);
    }
};

window.trackAddToCart = function(productName, value) {
    if (window.marketingTracker) {
        window.marketingTracker.trackAddToCart(productName, value);
    }
};

window.trackSearch = function(searchTerm) {
    if (window.marketingTracker) {
        window.marketingTracker.trackSearch(searchTerm);
    }
};

