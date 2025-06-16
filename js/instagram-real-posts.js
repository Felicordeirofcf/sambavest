/**
 * Instagram Real Posts Integration
 * Utiliza embeds do Instagram para exibir posts reais com fallback para cards estáticos
 */

class InstagramRealPosts {
    constructor() {
        this.posts = [
            {
                url: 'https://www.instagram.com/reel/DK0MwOkxJZ5/',
                fallbackImage: 'images/instagram/post2.jpg',
                type: 'reel'
            },
            {
                url: 'https://www.instagram.com/reel/DKuaAL5R9ye/',
                fallbackImage: 'images/instagram/post3.jpg',
                type: 'reel'
            },
            {
                url: 'https://www.instagram.com/reel/DKdBpRHJ20O/',
                fallbackImage: 'images/instagram/post4.jpg',
                type: 'reel'
            },
            {
                url: 'https://www.instagram.com/reel/DKQJj2XJknc/',
                fallbackImage: 'images/instagram/post5.jpg',
                type: 'reel'
            },
            {
                url: 'https://www.instagram.com/reel/DJ-JOo5JkDK/',
                fallbackImage: 'images/instagram/post1.jpg',
                type: 'reel'
            }
        ];
        
        this.cache = new Map();
        this.useRealEmbeds = true; // Flag para controlar se deve tentar embeds reais
        this.init();
    }

    init() {
        // Aguarda o DOM estar carregado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.loadInstagramPosts());
        } else {
            this.loadInstagramPosts();
        }
    }

    async loadInstagramPosts() {
        const container = document.querySelector('.instagram-embed-grid');
        if (!container) return;

        // Remove loading placeholder
        const placeholder = container.querySelector('.loading-placeholder');
        if (placeholder) {
            placeholder.remove();
        }

        // Adiciona classe de loading à seção
        const section = document.querySelector('.instagram-section');
        if (section) {
            section.classList.add('loading');
        }

        // Carrega os posts
        for (let i = 0; i < this.posts.length; i++) {
            const post = this.posts[i];
            await this.loadPost(post, container, i);
        }

        // Remove classe de loading
        if (section) {
            section.classList.remove('loading');
        }
    }

    async loadPost(post, container, index) {
        try {
            if (this.useRealEmbeds) {
                // Tenta criar embed real primeiro
                const embedCard = await this.createRealEmbedCard(post, index);
                if (embedCard) {
                    container.appendChild(embedCard);
                    return;
                }
            }
            
            // Fallback para card estático
            container.appendChild(this.createFallbackCard(post, index));
        } catch (error) {
            console.warn('Erro ao carregar post do Instagram:', error);
            // Fallback para card estático
            container.appendChild(this.createFallbackCard(post, index));
        }
    }

    async createRealEmbedCard(post, index) {
        const postId = this.extractPostId(post.url);
        if (!postId) return null;

        const card = document.createElement('div');
        card.className = 'instagram-embed-card real-post loading';
        card.setAttribute('data-post-id', postId);
        
        card.innerHTML = `
            <div class="embed-header">
                <div class="profile-info">
                    <img src="images/logo-icon.png" alt="SambaVest" class="profile-pic">
                    <div class="profile-details">
                        <span class="username">@sambavest</span>
                        <span class="verified">✓</span>
                    </div>
                </div>
                <a href="https://www.instagram.com/sambavest/" target="_blank" class="follow-btn">Seguir</a>
            </div>
            <div class="embed-content real-embed">
                <iframe src="https://www.instagram.com/p/${postId}/embed/captioned/" 
                        width="100%" 
                        height="500" 
                        frameborder="0" 
                        scrolling="no" 
                        allowtransparency="true"
                        loading="lazy"
                        onload="this.parentElement.parentElement.classList.remove('loading')"
                        onerror="this.parentElement.parentElement.classList.add('error')">
                </iframe>
            </div>
            <div class="embed-footer">
                <a href="${post.url}" target="_blank" class="view-post">Ver Post Original</a>
            </div>
        `;

        // Adiciona timeout para fallback em caso de erro
        setTimeout(() => {
            if (card.classList.contains('loading')) {
                card.classList.add('error');
                card.classList.remove('loading');
            }
        }, 10000); // 10 segundos timeout

        return card;
    }

    extractPostId(url) {
        // Extrai ID do post da URL
        const match = url.match(/\/(?:p|reel)\/([A-Za-z0-9_-]+)/);
        return match ? match[1] : null;
    }

    createFallbackCard(post, index) {
        const card = document.createElement('div');
        card.className = 'instagram-embed-card fallback-post';
        card.setAttribute('data-media-type', post.type || 'image');
        
        card.innerHTML = `
            <div class="embed-header">
                <div class="profile-info">
                    <img src="images/logo-icon.png" alt="SambaVest" class="profile-pic">
                    <div class="profile-details">
                        <span class="username">@sambavest</span>
                        <span class="verified">✓</span>
                    </div>
                </div>
                <a href="https://www.instagram.com/sambavest/" target="_blank" class="follow-btn">Seguir</a>
            </div>
            <div class="embed-content">
                <img src="${post.fallbackImage}" alt="Post Instagram" loading="lazy">
                <div class="play-overlay">
                    <div class="play-icon">▶</div>
                </div>
            </div>
            <div class="embed-footer">
                <a href="${post.url}" target="_blank" class="view-post">Ver Post Original</a>
            </div>
        `;
        
        return card;
    }

    // Método para alternar entre embeds reais e fallback
    toggleEmbedMode(useReal = true) {
        this.useRealEmbeds = useReal;
        this.loadInstagramPosts();
    }

    // Método para atualizar posts manualmente
    updatePosts(newPosts) {
        this.posts = newPosts;
        this.cache.clear();
        this.loadInstagramPosts();
    }

    // Método para adicionar novo post
    addPost(url, fallbackImage, type = 'image') {
        this.posts.push({ url, fallbackImage, type });
        this.loadInstagramPosts();
    }

    // Método para remover post
    removePost(url) {
        this.posts = this.posts.filter(post => post.url !== url);
        this.loadInstagramPosts();
    }

    // Método para obter estatísticas
    getStats() {
        const container = document.querySelector('.instagram-embed-grid');
        if (!container) return null;

        const realPosts = container.querySelectorAll('.real-post').length;
        const fallbackPosts = container.querySelectorAll('.fallback-post').length;
        const errorPosts = container.querySelectorAll('.error').length;

        return {
            total: this.posts.length,
            realPosts,
            fallbackPosts,
            errorPosts,
            successRate: ((realPosts / this.posts.length) * 100).toFixed(1) + '%'
        };
    }
}

// Inicializa quando o script é carregado
const instagramRealPosts = new InstagramRealPosts();

// Expõe globalmente para uso manual
window.InstagramRealPosts = InstagramRealPosts;
window.instagramRealPosts = instagramRealPosts;

// Função de conveniência para desenvolvedores
window.instagramStats = () => {
    console.log('Instagram Posts Stats:', instagramRealPosts.getStats());
};

// Log de inicialização
console.log('Instagram Real Posts carregado com sucesso!');

