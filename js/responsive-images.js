// SISTEMA AVANÇADO DE LAZY LOADING E IMAGENS RESPONSIVAS
class ResponsiveImageManager {
    constructor() {
        this.supportsWebP = false;
        this.imageObserver = null;
        this.init();
    }

    async init() {
        // Não verificar suporte a WebP ou otimizar por enquanto para depuração
        this.setupLazyLoading();
        this.setupResponsiveImages();
    }

    // Configurar Intersection Observer para lazy loading
    setupLazyLoading() {
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        this.imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.imageObserver.unobserve(entry.target);
                }
            });
        }, options);

        // Observar todas as imagens lazy
        document.querySelectorAll('img[data-src]').forEach(img => {
            this.imageObserver.observe(img);
        });
    }

    // Carregar imagem com fallback
    async loadImage(img) {
        const dataSrc = img.dataset.src;
        
        try {
            // Mostrar placeholder de carregamento
            img.classList.add('loading');
            
            // Usar o src original diretamente para depuração
            img.src = dataSrc;
            
            // Remover placeholder quando carregada
            img.onload = () => {
                img.classList.remove('loading');
                img.classList.add('loaded');
            };
            
            img.onerror = () => {
                img.classList.remove('loading');
                img.classList.add('error');
                console.warn(`Erro ao carregar imagem: ${dataSrc}`);
            };
            
        } catch (error) {
            console.error('Erro no carregamento da imagem:', error);
            img.src = dataSrc; // Fallback para imagem original
        }
    }

    // Não otimizar imagens existentes por enquanto
    setupResponsiveImages() {
        // No-op for now
    }

    // Método público para adicionar novas imagens lazy
    addLazyImage(img) {
        if (this.imageObserver) {
            this.imageObserver.observe(img);
        }
    }

    // Método para forçar carregamento de todas as imagens
    loadAllImages() {
        document.querySelectorAll('img[data-src]').forEach(img => {
            this.loadImage(img);
        });
    }
}

// Função para criar elemento de imagem responsiva
function createResponsiveImage(config) {
    const {
        src,
        alt,
        className = '',
        sizes = '(max-width: 768px) 100vw, 50vw',
        lazy = true,
        category = 'products'
    } = config;
    
    const img = document.createElement('img');
    
    // Configurar atributos básicos
    img.alt = alt;
    img.className = `responsive-image ${className}`;
    img.sizes = sizes;
    
    if (lazy) {
        // Lazy loading
        img.datimageObserver.observe(document.body, {
    childList: true,
    subtree: true
});