// SISTEMA AVANÇADO DE LAZY LOADING E IMAGENS RESPONSIVAS
class ResponsiveImageManager {
    constructor() {
        this.supportsWebP = false;
        this.imageObserver = null;
        this.init();
    }

    async init() {
        await this.checkWebPSupport();
        this.setupLazyLoading();
        this.setupResponsiveImages();
    }

    // Verificar suporte a WebP
    async checkWebPSupport() {
        return new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = () => {
                this.supportsWebP = (webP.height === 2);
                console.log(`WebP suportado: ${this.supportsWebP}`);
                resolve(this.supportsWebP);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
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
        const dataSrcset = img.dataset.srcset;
        
        try {
            // Mostrar placeholder de carregamento
            img.classList.add('loading');
            
            // Determinar melhor formato e tamanho
            const optimizedSrc = this.getOptimizedImageSrc(dataSrc, img);
            const optimizedSrcset = this.getOptimizedSrcset(dataSrcset, img);
            
            // Pré-carregar imagem
            await this.preloadImage(optimizedSrc);
            
            // Aplicar src e srcset
            if (optimizedSrcset) {
                img.srcset = optimizedSrcset;
            }
            img.src = optimizedSrc;
            
            // Remover placeholder quando carregada
            img.onload = () => {
                img.classList.remove('loading');
                img.classList.add('loaded');
                
                // Rastrear carregamento de imagem
                this.trackImageLoad(img);
            };
            
            img.onerror = () => {
                img.classList.remove('loading');
                img.classList.add('error');
                console.warn(`Erro ao carregar imagem: ${optimizedSrc}`);
            };
            
        } catch (error) {
            console.error('Erro no carregamento da imagem:', error);
            img.src = dataSrc; // Fallback para imagem original
        }
    }

    // Obter src otimizada baseada no dispositivo e suporte
    getOptimizedImageSrc(originalSrc, img) {
        if (!originalSrc) return '';
        
        const devicePixelRatio = window.devicePixelRatio || 1;
        const imgWidth = img.offsetWidth || 300;
        const targetWidth = Math.ceil(imgWidth * devicePixelRatio);
        
        // Determinar tamanho apropriado
        let size = 'medium';
        if (targetWidth <= 200) size = 'thumbnail';
        else if (targetWidth <= 500) size = 'medium';
        else size = 'large';
        
        // Construir caminho otimizado
        const pathParts = originalSrc.split('/');
        const fileName = pathParts.pop();
        const baseName = fileName.split('.')[0];
        const category = pathParts[pathParts.length - 1];
        
        // Preferir WebP se suportado
        if (this.supportsWebP) {
            return `images/optimized/${category}/webp/${baseName}_${size}.webp`;
        } else {
            return `images/optimized/${category}/${size}/${baseName}.jpg`;
        }
    }

    // Gerar srcset responsivo
    getOptimizedSrcset(originalSrcset, img) {
        if (!originalSrcset) return '';
        
        const pathParts = originalSrcset.split('/');
        const fileName = pathParts.pop();
        const baseName = fileName.split('.')[0];
        const category = pathParts[pathParts.length - 1];
        
        if (this.supportsWebP) {
            return [
                `images/optimized/${category}/webp/${baseName}_thumb.webp 150w`,
                `images/optimized/${category}/webp/${baseName}_medium.webp 400w`,
                `images/optimized/${category}/webp/${baseName}_large.webp 800w`
            ].join(', ');
        } else {
            return [
                `images/optimized/${category}/thumbnail/${baseName}.jpg 150w`,
                `images/optimized/${category}/medium/${baseName}.jpg 400w`,
                `images/optimized/${category}/large/${baseName}.jpg 800w`
            ].join(', ');
        }
    }

    // Pré-carregar imagem
    preloadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = src;
        });
    }

    // Configurar imagens responsivas existentes
    setupResponsiveImages() {
        document.querySelectorAll('img:not([data-src])').forEach(img => {
            if (img.src && !img.dataset.optimized) {
                this.optimizeExistingImage(img);
            }
        });
    }

    // Otimizar imagem existente
    optimizeExistingImage(img) {
        const originalSrc = img.src;
        const optimizedSrc = this.getOptimizedImageSrc(originalSrc, img);
        
        if (optimizedSrc !== originalSrc) {
            img.dataset.originalSrc = originalSrc;
            img.src = optimizedSrc;
            img.dataset.optimized = 'true';
        }
    }

    // Rastrear carregamento de imagem para analytics
    trackImageLoad(img) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'image_load', {
                'custom_parameter_1': img.alt || 'sem_alt',
                'custom_parameter_2': img.src.includes('webp') ? 'webp' : 'jpg'
            });
        }
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
        img.dataset.src = src;
        img.dataset.srcset = src; // Para gerar srcset otimizado
        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNhcnJlZ2FuZG8uLi48L3RleHQ+PC9zdmc+';
        img.loading = 'lazy';
        
        // Adicionar ao observer quando disponível
        if (window.responsiveImageManager) {
            window.responsiveImageManager.addLazyImage(img);
        }
    } else {
        // Carregamento imediato
        img.src = src;
    }
    
    return img;
}

// CSS para animações de carregamento
const imageStyles = document.createElement('style');
imageStyles.textContent = `
    .responsive-image {
        transition: opacity 0.3s ease, filter 0.3s ease;
        max-width: 100%;
        height: auto;
    }
    
    .responsive-image.loading {
        opacity: 0.7;
        filter: blur(2px);
    }
    
    .responsive-image.loaded {
        opacity: 1;
        filter: none;
    }
    
    .responsive-image.error {
        opacity: 0.5;
        filter: grayscale(100%);
    }
    
    /* Placeholder para lazy loading */
    .responsive-image[data-src] {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
    }
    
    @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
    }
    
    /* Otimizações para diferentes tamanhos de tela */
    @media (max-width: 480px) {
        .responsive-image {
            width: 100%;
            height: auto;
        }
    }
    
    @media (min-width: 481px) and (max-width: 768px) {
        .responsive-image {
            max-width: 400px;
        }
    }
    
    @media (min-width: 769px) {
        .responsive-image {
            max-width: 800px;
        }
    }
`;
document.head.appendChild(imageStyles);

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.responsiveImageManager = new ResponsiveImageManager();
});

// Reinicializar quando novas imagens forem adicionadas dinamicamente
const imageObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element node
                const lazyImages = node.querySelectorAll ? node.querySelectorAll('img[data-src]') : [];
                lazyImages.forEach(img => {
                    if (window.responsiveImageManager) {
                        window.responsiveImageManager.addLazyImage(img);
                    }
                });
            }
        });
    });
});

imageObserver.observe(document.body, {
    childList: true,
    subtree: true
});

