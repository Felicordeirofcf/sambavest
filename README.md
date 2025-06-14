# 🎭 Samba Vest - Site Modular

Site modular da Samba Vest para venda de camisas oficiais do carnaval carioca, otimizado para SEO, conversões e performance.

## 🚀 Deploy no Railway

### Pré-requisitos
- Conta no [Railway](https://railway.app)
- Repositório Git (GitHub, GitLab, etc.)

### Passos para Deploy

1. **Preparar o repositório:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Samba Vest modular"
   git remote add origin [SEU_REPOSITORIO]
   git push -u origin main
   ```

2. **Deploy no Railway:**
   - Acesse [Railway](https://railway.app)
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Escolha o repositório do projeto
   - Railway detectará automaticamente o Node.js

3. **Configurar variáveis de ambiente:**
   ```
   NODE_ENV=production
   PORT=$PORT
   ```

4. **Configurar domínio personalizado (opcional):**
   - Vá em Settings > Domains
   - Adicione seu domínio personalizado
   - Configure DNS conforme instruções

### 🔧 Configurações de Marketing

Após o deploy, configure os IDs dos pixels e analytics:

#### Facebook Pixel
- Substitua `YOUR_FACEBOOK_PIXEL_ID` pelo seu Pixel ID
- Arquivo: `includes/marketing-pixels.html`

#### Google Analytics
- Substitua `GA_MEASUREMENT_ID` pelo seu ID do GA4
- Arquivo: `includes/marketing-pixels.html`

#### Google Ads
- Substitua `AW-CONVERSION_ID` pelo seu ID de conversão
- Arquivo: `includes/marketing-pixels.html`

#### TikTok Pixel
- Substitua `YOUR_TIKTOK_PIXEL_ID` pelo seu Pixel ID
- Arquivo: `includes/marketing-pixels.html`

## 📁 Estrutura do Projeto

```
sambavest-modular/
├── 📄 index.html              # Página principal
├── 📄 server.js               # Servidor Express.js
├── 📄 package.json            # Dependências Node.js
├── 📄 railway.toml            # Configuração Railway
├── 📁 css/                    # Estilos modulares
│   ├── base.css              # Reset e utilitários
│   ├── header.css            # Cabeçalho
│   ├── hero.css              # Seção principal
│   ├── products.css          # Produtos
│   ├── about.css             # Sobre nós
│   ├── contact.css           # Contato
│   └── footer.css            # Rodapé
├── 📁 js/                     # JavaScript modular
│   ├── image-optimization-config.js  # Config otimizações
│   ├── responsive-images.js   # Sistema de imagens
│   ├── marketing-tracker.js   # Rastreamento conversões
│   ├── header.js             # Funcionalidades header
│   ├── products.js           # Funcionalidades produtos
│   ├── contact.js            # Funcionalidades contato
│   └── main.js               # Funcionalidades gerais
├── 📁 components/             # Componentes HTML
│   ├── header-optimized.html
│   └── products-optimized.html
├── 📁 includes/               # Includes para SEO/Marketing
│   ├── meta-seo.html         # Meta tags SEO
│   ├── meta-social.html      # Meta tags sociais
│   └── marketing-pixels.html # Pixels de conversão
└── 📁 images/                 # Imagens organizadas
    ├── 📁 logos/             # Logotipos
    ├── 📁 products/          # Produtos
    ├── 📁 banners/           # Banners
    └── 📁 optimized/         # Versões otimizadas
        ├── 📁 logos/
        ├── 📁 products/
        └── 📁 banners/
```

## 🎯 Funcionalidades Implementadas

### ✅ SEO e Marketing
- Meta tags otimizadas com palavras-chave
- Structured Data (JSON-LD)
- Facebook Pixel configurado
- Google Analytics 4
- Google Ads conversion tracking
- TikTok Pixel
- Sitemap.xml automático
- Robots.txt configurado

### ✅ Otimizações de Imagem
- Conversão automática para WebP
- Versões responsivas (thumbnail, medium, large)
- Lazy loading avançado
- Alt text otimizado para SEO
- Compressão inteligente

### ✅ Performance
- Compressão Gzip
- Cache otimizado
- CSS e JS modulares
- Imagens otimizadas
- Lazy loading

### ✅ Funcionalidades
- Carrinho de compras
- Sistema de busca
- Filtros de produtos
- Formulário de contato
- Integração WhatsApp
- Rastreamento de conversões

## 🔑 Palavras-chave SEO

### Principais:
- camisas carnaval
- roupas carnaval
- carnaval carioca
- camisas oficiais
- samba vest
- carnaval rio de janeiro
- camisas licenciadas
- escolas de samba

### Por Escola:
- **Beija-Flor:** beija-flor, nilópolis, beija flor de nilópolis
- **Salgueiro:** salgueiro, acadêmicos, acadêmicos do salgueiro
- **Viradouro:** viradouro, unidos, unidos do viradouro

## 📊 Monitoramento

### Métricas Importantes:
- Conversões (AddToCart, Purchase)
- Visualizações de produto
- Tempo de carregamento
- Taxa de rejeição
- Origem do tráfego

### Eventos Rastreados:
- `view_item` - Visualização de produto
- `add_to_cart` - Adição ao carrinho
- `begin_checkout` - Início do checkout
- `purchase` - Compra finalizada
- `generate_lead` - Lead gerado
- `search` - Busca realizada

## 🛠️ Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Executar em produção
npm start

# Otimizar imagens
npm run optimize-images
```

## 🔧 Configurações Adicionais

### Domínio Personalizado
1. Configure DNS para apontar para Railway
2. Adicione domínio nas configurações do projeto
3. Atualize URLs canônicas nos meta tags

### SSL/HTTPS
- Railway fornece SSL automático
- Certifique-se de usar HTTPS em todas as URLs

### Backup
- Configure backup automático do Railway
- Mantenha repositório Git atualizado

## 📞 Suporte

Para dúvidas sobre implementação ou configuração:
- Documentação Railway: https://docs.railway.app
- Suporte técnico: [contato]

## 📝 Licença

Este projeto está sob licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

**🎉 Projeto pronto para deploy no Railway!**

Desenvolvido com foco em performance, SEO e conversões para maximizar o sucesso das campanhas de marketing digital da Samba Vest.

