// Popup da Promoção das Campeãs
class PromoPopup {
    constructor() {
        this.popup = null;
        this.overlay = null;
        this.isVisible = false;
        this.hasBeenShown = false;
        
        this.init();
    }
    
    init() {
        // Verifica se o popup já foi mostrado nesta sessão
        if (sessionStorage.getItem('promoPopupShown')) {
            return;
        }
        
        this.createPopup();
        this.bindEvents();
        
        // Mostra o popup após 2 segundos
        setTimeout(() => {
            this.show();
        }, 2000);
    }
    
    createPopup() {
        // Cria o overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'popup-overlay';
        this.overlay.id = 'promoPopup';
        
        // Cria o conteúdo do popup
        this.overlay.innerHTML = `
            <div class="popup-content">
                <div class="popup-header">
                    <button class="popup-close" aria-label="Fechar popup">&times;</button>
                    <h2 class="popup-title">🎉 Promoção das Campeãs!</h2>
                    <p class="popup-subtitle">Oferta especial por tempo limitado</p>
                </div>
                <div class="popup-body">
                    <img src="images/products/promocao-das-campeas.jpg" 
                         alt="Promoção das Campeãs - 2 Camisas" 
                         class="popup-image"
                         loading="lazy">
                    
                    <p class="popup-description">
                        Leve 2 camisas oficiais das escolas campeãs por um preço especial! 
                        Qualidade premium e licenciamento oficial garantido.
                    </p>
                    
                    <div class="popup-price">
                        <div class="popup-original-price">De R$ 239,90</div>
                        <div class="popup-current-price">R$ 149,90</div>
                        <div class="popup-discount">38% OFF</div>
                        <div class="popup-installment">em até 3x de R$ 49,97 sem juros</div>
                        <div class="popup-pix">💳 à vista R$ 134,91 no PIX</div>
                    </div>
                    
                    <div class="popup-buttons">
                        <a href="https://sambavest.com/produto/promocao-das-campeas/" 
                           class="popup-btn popup-btn-primary" 
                           target="_blank" 
                           rel="noopener">
                            Aproveitar Oferta
                        </a>
                        <button class="popup-btn popup-btn-secondary" id="closePopup">
                            Continuar Navegando
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.overlay);
        this.popup = this.overlay.querySelector('.popup-content');
    }
    
    bindEvents() {
        // Fechar ao clicar no X
        const closeBtn = this.overlay.querySelector('.popup-close');
        closeBtn.addEventListener('click', () => this.hide());
        
        // Fechar ao clicar no botão "Continuar Navegando"
        const continueBtn = this.overlay.querySelector('#closePopup');
        continueBtn.addEventListener('click', () => this.hide());
        
        // Fechar ao clicar fora do popup
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.hide();
            }
        });
        
        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });
        
        // Tracking de cliques no botão principal
        const primaryBtn = this.overlay.querySelector('.popup-btn-primary');
        primaryBtn.addEventListener('click', () => {
            this.trackConversion();
            this.hide();
        });
    }
    
    show() {
        if (this.hasBeenShown || !this.overlay) return;
        
        this.isVisible = true;
        this.hasBeenShown = true;
        
        // Adiciona classe ativa
        this.overlay.classList.add('active');
        this.popup.classList.add('animate-in');
        
        // Previne scroll do body
        document.body.style.overflow = 'hidden';
        
        // Marca como mostrado na sessão
        sessionStorage.setItem('promoPopupShown', 'true');
        
        // Tracking de visualização
        this.trackView();
    }
    
    hide() {
        if (!this.isVisible || !this.overlay) return;
        
        this.isVisible = false;
        
        // Remove classes ativas
        this.overlay.classList.remove('active');
        
        // Restaura scroll do body
        document.body.style.overflow = '';
        
        // Remove o popup após a animação
        setTimeout(() => {
            if (this.overlay && this.overlay.parentNode) {
                this.overlay.parentNode.removeChild(this.overlay);
            }
        }, 300);
    }
    
    trackView() {
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'popup_view', {
                'event_category': 'engagement',
                'event_label': 'promocao_campeas'
            });
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'ViewContent', {
                content_name: 'Popup Promoção das Campeãs',
                content_category: 'popup'
            });
        }
        
        // TikTok Pixel
        if (typeof ttq !== 'undefined') {
            ttq.track('ViewContent', {
                content_name: 'Popup Promoção das Campeãs'
            });
        }
    }
    
    trackConversion() {
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'popup_click', {
                'event_category': 'conversion',
                'event_label': 'promocao_campeas_cta'
            });
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'InitiateCheckout', {
                content_name: 'Promoção das Campeãs',
                value: 149.90,
                currency: 'BRL'
            });
        }
        
        // TikTok Pixel
        if (typeof ttq !== 'undefined') {
            ttq.track('ClickButton', {
                content_name: 'Promoção das Campeãs',
                value: 149.90,
                currency: 'BRL'
            });
        }
    }
}

// Inicializa o popup quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new PromoPopup();
});

// Exporta para uso global se necessário
window.PromoPopup = PromoPopup;

