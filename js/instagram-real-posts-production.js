/**
 * Instagram Real Posts Integration - Versão Produção
 * Solução robusta para exibir posts do Instagram em produção
 * Funciona com fallback inteligente quando embeds são bloqueados
 */

class InstagramRealPosts {
    constructor() {
        this.posts = [
            {
                url: 'https://www.instagram.com/reel/DK0MwOkxJZ5/',
                fallbackImage: 'images/instagram/post2.jpg',
                type: 'reel',
                title: 'Novo reel da Samba Vest',
                description: 'Confira nosso mais recente conteúdo sobre carnaval!'
            },
            {
                url: 'https://www.instagram.com/reel/DKuaAL5R9ye/',
                fallbackImage: 'images/instagram/post3.jpg',
                type: 'reel',
                title: 'Bastidores do carnaval',
                description: 'Veja os bastidores da produção das nossas camisas.'
            },
            {
                url: 'https://www.instagram.com/reel/DKdBpRHJ20O/',
                fallbackImage: 'images/instagram/post4.jpg',
                type: 'reel',
                title: 'Escolas de samba 2025',
                description: 'Conheça as novidades das escolas para 2025.'
            },
            {
                url: 'https://www.instagram.com/reel/DKQJj2XJknc/',
                fallbackImage: 'images/instagram/post5.jpg',
                type: 'reel',
                title: 'Qualidade premium',
                description: 'Veja a qualidade dos nossos produtos.'
            },
            {
                url: 'https://www.instagram.com/reel/DJ-JOo5JkDK/',
                fallbackImage: 'images/instagram/post1.jpg',
                type: 'reel',
                title: 'Tradição do samba',
                description: 'A paixão pelo samba em cada detalhe.'
            }
        ];
        
        this.cache = new Map();
        this.useRealEmbeds = false; // Desabilitado por padrão para produção
        this.embedAttempted = false;
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

        // Detecta se estamos em produção
        const isProduction = window.location.hostname !== 'localhost' && 
                           window.location.hostname !== '127.0.0.1';

        // Em produção, usa apenas fallback por padrão
        if (isProduction) {
            this.useRealEmbeds = false;
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

        // Tenta carregar um embed real como teste (apenas uma vez)
        if (!this.embedAttempted && this.posts.length > 0) {
            this.embedAttempted = true;
            setTimeout(() => this.testEmbedCapability(), 2000);
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
            
            // Usa card estático melhorado
            container.appendChild(this.createEnhancedFallbackCard(post, index));
        } catch (error) {
            console.warn('Erro ao carregar post do Instagram:', error);
            // Fallback para card estático
            container.appendChild(this.createEnhancedFallbackCard(post, index));
        }
    }

    async testEmbedCapability() {
        // Testa se embeds funcionam criando um invisível
        const testContainer = document.createElement('div');
        testContainer.style.cssText = 'position:absolute;top:-9999px;left:-9999px;width:1px;height:1px;overflow:hidden;';
        document.body.appendChild(testContainer);

        const testPost = this.posts[0];
        const postId = this.extractPostId(testPost.url);
        
        if (postId) {
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.instagram.com/p/${postId}/embed/captioned/`;
            iframe.width = '1';
            iframe.height = '1';
            iframe.frameBorder = '0';
            
            let embedWorking = false;
            
            iframe.onload = () => {
                embedWorking = true;
                console.log('Instagram embeds funcionando - habilitando modo real');
                this.useRealEmbeds = true;
            };
            
            iframe.onerror = () => {
                console.log('Instagram embeds bloqueados - mantendo modo fallback');
            };
            
            testContainer.appendChild(iframe);
            
            // Remove teste após 5 segundos
            setTimeout(() => {
                document.body.removeChild(testContainer);
                if (embedWorking && !this.useRealEmbeds) {
                    // Se funcionou, recarrega com embeds reais
                    this.useRealEmbeds = true;
                    this.loadInstagramPosts();
                }
            }, 5000);
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
        }, 8000); // 8 segundos timeout

        return card;
    }

    extractPostId(url) {
        // Extrai ID do post da URL
        const match = url.match(/\/(?:p|reel)\/([A-Za-z0-9_-]+)/);
        return match ? match[1] : null;
    }

    createEnhancedFallbackCard(post, index) {
        const card = document.createElement('div');
        card.className = 'instagram-embed-card enhanced-fallback-post';
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
            <div class="embed-content enhanced-content">
                <div class="image-container">
                    <img src="${post.fallbackImage}" alt="${post.title || 'Post Instagram'}" loading="lazy">
                    <div class="content-overlay">
                        <div class="play-icon">▶</div>
                        <div class="content-info">
                            <h4>${post.title || 'Post do Instagram'}</h4>
                            <p>${post.description || 'Veja este conteúdo no Instagram'}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="embed-footer enhanced-footer">
                <div class="post-actions">
                    <button class="action-btn like-btn" onclick="this.classList.toggle('active')">
                        <span class="heart">♡</span>
                        <span class="heart-filled">♥</span>
                    </button>
                    <button class="action-btn comment-btn">
                        <span>💬</span>
                    </button>
                    <button class="action-btn share-btn">
                        <span>📤</span>
                    </button>
                </div>
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
    addPost(url, fallbackImage, type = 'image', title = '', description = '') {
        this.posts.push({ url, fallbackImage, type, title, description });
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
        const fallbackPosts = container.querySelectorAll('.enhanced-fallback-post').length;
        const errorPosts = container.querySelectorAll('.error').length;

        return {
            total: this.posts.length,
            realPosts,
            fallbackPosts,
            errorPosts,
            mode: this.useRealEmbeds ? 'embeds' : 'fallback',
            successRate: this.posts.length > 0 ? ((realPosts / this.posts.length) * 100).toFixed(1) + '%' : '0%'
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

// Função para forçar modo embed (para teste)
window.forceEmbedMode = () => {
    instagramRealPosts.toggleEmbedMode(true);
    console.log('Modo embed forçado - testando embeds reais');
};

// Log de inicialização
console.log('Instagram Real Posts (Produção) carregado com sucesso!');

