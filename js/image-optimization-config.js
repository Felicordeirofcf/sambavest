// CONFIGURAÇÃO DE OTIMIZAÇÕES DE IMAGEM E SEO
const ImageOptimizationConfig = {
    // Configurações de imagem
    images: {
        // Formatos suportados em ordem de preferência
        formats: ['webp', 'jpg', 'png'],
        
        // Tamanhos responsivos
        sizes: {
            thumbnail: { width: 150, height: 150, quality: 85 },
            medium: { width: 400, height: 400, quality: 90 },
            large: { width: 800, height: 800, quality: 95 }
        },
        
        // Configurações de lazy loading
        lazyLoading: {
            rootMargin: '50px',
            threshold: 0.1,
            placeholder: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNhcnJlZ2FuZG8uLi48L3RleHQ+PC9zdmc+'
        }
    },
    
    // Configurações de SEO
    seo: {
        // Palavras-chave principais para alt text
        keywords: {
            primary: [
                'camisas carnaval',
                'roupas carnaval',
                'carnaval carioca',
                'camisas oficiais',
                'samba vest',
                'carnaval rio de janeiro',
                'camisas licenciadas',
                'escolas de samba'
            ],
            schools: {
                'beija-flor': ['beija-flor', 'nilópolis', 'beija flor de nilópolis'],
                'salgueiro': ['salgueiro', 'acadêmicos', 'acadêmicos do salgueiro'],
                'viradouro': ['viradouro', 'unidos', 'unidos do viradouro']
            }
        },
        
        // Templates de alt text otimizado
        altTextTemplates: {
            product: (school, year = '2025') => {
                const schoolKeywords = ImageOptimizationConfig.seo.keywords.schools[school] || [school];
                const primaryKeywords = ImageOptimizationConfig.seo.keywords.primary.slice(0, 3);
                return `Camisa oficial ${schoolKeywords[0]} enredo ${year} - ${primaryKeywords.join(' ')}`;
            },
            logo: () => 'Samba Vest - Camisas oficiais e licenciadas do carnaval carioca Rio de Janeiro',
            banner: (description) => `${description} - ${ImageOptimizationConfig.seo.keywords.primary.slice(0, 4).join(' ')}`
        }
    },
    
    // Configurações de performance
    performance: {
        // Preload de imagens críticas
        criticalImages: [
            'images/logos/logo.jpg',
            'images/products/camisa-beija-flor-frente.jpg'
        ],
        
        // Prefetch de imagens importantes
        prefetchImages: [
            'images/products/camisa-salgueiro-frente.jpg',
            'images/products/camisa-viradouro-frente.jpg'
        ],
        
        // Configurações de cache
        cache: {
            maxAge: 31536000, // 1 ano
            staleWhileRevalidate: 86400 // 1 dia
        }
    }
};

// Função para gerar alt text otimizado
function generateOptimizedAltText(type, context = {}) {
    const { seo } = ImageOptimizationConfig;
    
    switch (type) {
        case 'product':
            return seo.altTextTemplates.product(context.school, context.year);
        case 'logo':
            return seo.altTextTemplates.logo();
        case 'banner':
            return seo.altTextTemplates.banner(context.description);
        default:
            return context.fallback || 'Samba Vest - Camisas carnaval carioca';
    }
}

// Função para gerar srcset otimizado
function generateOptimizedSrcset(basePath, category, fileName) {
    const { images } = ImageOptimizationConfig;
    const baseName = fileName.split('.')[0];
    
    // Verificar suporte a WebP
    const supportsWebP = window.responsiveImageManager?.supportsWebP || false;
    const format = supportsWebP ? 'webp' : 'jpg';
    const extension = supportsWebP ? '.webp' : '.jpg';
    
    if (supportsWebP) {
        return [
            `${basePath}/optimized/${category}/webp/${baseName}_thumb.webp 150w`,
            `${basePath}/optimized/${category}/webp/${baseName}_medium.webp 400w`,
            `${basePath}/optimized/${category}/webp/${baseName}_large.webp 800w`
        ].join(', ');
    } else {
        return [
            `${basePath}/optimized/${category}/thumbnail/${baseName}.jpg 150w`,
            `${basePath}/optimized/${category}/medium/${baseName}.jpg 400w`,
            `${basePath}/optimized/${category}/large/${baseName}.jpg 800w`
        ].join(', ');
    }
}

// Função para preload de imagens críticas
function preloadCriticalImages() {
    const { criticalImages } = ImageOptimizationConfig.performance;
    
    criticalImages.forEach(imagePath => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = imagePath;
        document.head.appendChild(link);
    });
}

// Função para prefetch de imagens importantes
function prefetchImportantImages() {
    const { prefetchImages } = ImageOptimizationConfig.performance;
    
    // Aguardar carregamento da página
    window.addEventListener('load', () => {
        setTimeout(() => {
            prefetchImages.forEach(imagePath => {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = imagePath;
                document.head.appendChild(link);
            });
        }, 2000); // Aguardar 2 segundos após o load
    });
}

// Função para configurar Service Worker para cache de imagens
function setupImageCaching() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('Service Worker registrado para cache de imagens');
        }).catch(error => {
            console.log('Erro ao registrar Service Worker:', error);
        });
    }
}

// Função para monitorar performance de imagens
function monitorImagePerformance() {
    // Usar Performance Observer para monitorar carregamento de imagens
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (entry.initiatorType === 'img') {
                    // Rastrear tempo de carregamento
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'image_performance', {
                            'custom_parameter_1': entry.name,
                            'custom_parameter_2': Math.round(entry.duration),
                            'custom_parameter_3': entry.transferSize || 0
                        });
                    }
                }
            });
        });
        
        observer.observe({ entryTypes: ['resource'] });
    }
}

// Inicializar otimizações
document.addEventListener('DOMContentLoaded', () => {
    preloadCriticalImages();
    prefetchImportantImages();
    setupImageCaching();
    monitorImagePerformance();
});

// Exportar configuração para uso global
window.ImageOptimizationConfig = ImageOptimizationConfig;
window.generateOptimizedAltText = generateOptimizedAltText;
window.generateOptimizedSrcset = generateOptimizedSrcset;

