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
        img.dataset.src = src;
        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDMvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmM2Y0ZjYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTlhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Q2FycmVnYW5kby4uLjwvdGV4dD48L3N2Zz4=';
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
}); // Para gerar srcset otimizado
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

