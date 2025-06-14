// FUNCIONALIDADES PRINCIPAIS DO SITE
class SambaVestApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupGlobalEventListeners();
        this.loadComponents();
        this.setupSmoothScrolling();
        this.setupFormValidation();
    }

    setupGlobalEventListeners() {
        // Scroll suave para links internos
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const targetId = e.target.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });

        // Fechar modais com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    loadComponents() {
        // Carregar componentes dinamicamente se necessário
        this.loadProductsSection();
        this.loadFooterSection();
    }

    loadProductsSection() {
        const productsContainer = document.getElementById('products-section');
        if (productsContainer && !productsContainer.innerHTML.trim()) {
            // Simular carregamento do componente de produtos
            fetch('/components/products-optimized.html')
                .then(response => response.text())
                .then(html => {
                    productsContainer.innerHTML = html;
                    // Reinicializar lazy loading para novas imagens
                    if (window.responsiveImageManager) {
                        window.responsiveImageManager.setupLazyLoading();
                    }
                })
                .catch(error => {
                    console.error('Erro ao carregar seção de produtos:', error);
                });
        }
    }

    loadFooterSection() {
        const footerContainer = document.getElementById('footer-section');
        if (footerContainer && !footerContainer.innerHTML.trim()) {
            footerContainer.innerHTML = `
                <footer class="footer">
                    <div class="container">
                        <div class="footer-content">
                            <div class="footer-section">
                                <h3>Samba Vest</h3>
                                <p>Camisas oficiais e licenciadas do carnaval carioca</p>
                                <div class="social-links">
                                    <a href="#" aria-label="Facebook">📘</a>
                                    <a href="#" aria-label="Instagram">📷</a>
                                    <a href="#" aria-label="WhatsApp">📱</a>
                                </div>
                            </div>
                            <div class="footer-section">
                                <h4>Produtos</h4>
                                <ul>
                                    <li><a href="#products">Camisas Carnaval</a></li>
                                    <li><a href="#products">Escolas de Samba</a></li>
                                    <li><a href="#products">Lançamentos</a></li>
                                </ul>
                            </div>
                            <div class="footer-section">
                                <h4>Atendimento</h4>
                                <ul>
                                    <li><a href="#contact">Contato</a></li>
                                    <li><a href="/sobre">Sobre Nós</a></li>
                                    <li><a href="#">Política de Privacidade</a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="footer-bottom">
                            <p>&copy; 2025 Samba Vest. Todos os direitos reservados.</p>
                        </div>
                    </div>
                </footer>
            `;
        }
    }

    setupSmoothScrolling() {
        // Configurar scroll suave para toda a página
        if ('scrollBehavior' in document.documentElement.style) {
            document.documentElement.style.scrollBehavior = 'smooth';
        }
    }

    setupFormValidation() {
        // Configurar validação de formulários
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });
        });
    }

    validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, 'Este campo é obrigatório');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });

        // Validar email
        const emailFields = form.querySelectorAll('input[type="email"]');
        emailFields.forEach(field => {
            if (field.value && !this.isValidEmail(field.value)) {
                this.showFieldError(field, 'Email inválido');
                isValid = false;
            }
        });

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showFieldError(field, message) {
        field.classList.add('error');
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
    }

    // Método para rastrear eventos personalizados
    trackEvent(eventName, parameters = {}) {
        if (window.marketingTracker) {
            // Usar o sistema de rastreamento existente
            if (typeof gtag !== 'undefined') {
                gtag('event', eventName, parameters);
            }
        }
    }
}

// Funções utilitárias globais
window.utils = {
    // Debounce para otimizar eventos
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle para otimizar scroll
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Formatação de preço
    formatPrice: (price) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    },

    // Gerar ID único
    generateId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};

// Inicializar aplicação
document.addEventListener('DOMContentLoaded', () => {
    window.sambaVestApp = new SambaVestApp();
    
    // Configurar Google Analytics Enhanced Ecommerce
    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID', {
            custom_map: {
                'custom_parameter_1': 'escola_samba',
                'custom_parameter_2': 'tipo_produto'
            }
        });
    }
});

// Service Worker para cache offline
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registrado: ', registration);
            })
            .catch(registrationError => {
                console.log('SW falhou: ', registrationError);
            });
    });
}



// Popup de Promoção
document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("promo-popup");
    const closeBtn = popup.querySelector(".close-popup");
    const hasSeenPopup = sessionStorage.getItem("hasSeenPromoPopup");

    if (!hasSeenPopup) {
        setTimeout(() => {
            popup.classList.add("active");
        }, 1000); // Atraso de 1 segundo para o pop-up aparecer
    }

    closeBtn.addEventListener("click", () => {
        popup.classList.remove("active");
        sessionStorage.setItem("hasSeenPromoPopup", "true");
    });

    popup.addEventListener("click", (e) => {
        if (e.target === popup) {
            popup.classList.remove("active");
            sessionStorage.setItem("hasSeenPromoPopup", "true");
        }
    });
});


