## Guia para Auditoria de SEO com Google Search Console

O Google Search Console (GSC) é uma ferramenta gratuita e essencial do Google que ajuda a monitorar o desempenho do seu site na pesquisa, identificar problemas e otimizar sua visibilidade. Se você ainda não o configurou, siga os passos abaixo:

### 1. Configuração e Verificação do Site no Google Search Console

a. **Acesse o Google Search Console:** Vá para [search.google.com/search-console](https://search.google.com/search-console) e faça login com sua conta Google.

b. **Adicione uma Propriedade:** Clique em 'Adicionar propriedade' no menu suspenso (geralmente no canto superior esquerdo).

c. **Escolha o Tipo de Propriedade:**
   - **Domínio (recomendado):** Se você tem acesso ao DNS do seu domínio, esta é a opção mais fácil e abrangente, pois inclui todas as variações de URL (http, https, www, não-www, subdomínios).
   - **Prefixo do URL:** Se você não tem acesso ao DNS, pode verificar um prefixo de URL específico (ex: `https://sambavest.com/`).

d. **Verifique a Propriedade:** O GSC oferecerá várias opções de verificação (DNS, arquivo HTML, tag HTML, Google Analytics, Google Tag Manager). Escolha a que for mais conveniente para você e siga as instruções.

### 2. Relatórios Essenciais para Auditoria de SEO

Após a verificação, você terá acesso a diversos relatórios importantes:

a. **Desempenho:**
   - **Consultas:** Veja quais termos de pesquisa estão trazendo tráfego para o seu site, a posição média, cliques e impressões. Isso é crucial para identificar palavras-chave de alto desempenho e oportunidades.
   - **Páginas:** Analise o desempenho de páginas individuais.
   - **Países, Dispositivos, Aparência na Pesquisa, Datas:** Filtre os dados para obter insights mais específicos.

b. **Cobertura (Indexação):**
   - Este relatório mostra quais páginas do seu site foram indexadas pelo Google e quais não foram, e por quê. É vital para identificar erros de rastreamento e indexação.
   - **Erros:** Páginas que não puderam ser indexadas (ex: erro 404, erro de servidor).
   - **Válidas com avisos:** Páginas indexadas, mas com problemas que podem ser melhorados.
   - **Válidas:** Páginas indexadas com sucesso.
   - **Excluídas:** Páginas que o Google optou por não indexar (ex: páginas duplicadas, páginas bloqueadas por `robots.txt`).

c. **Sitemaps:**
   - Envie o sitemap XML do seu site (geralmente `seusite.com/sitemap_index.xml` ou `seusite.com/sitemap.xml`) para ajudar o Google a descobrir todas as suas páginas.
   - Monitore o status do sitemap para garantir que todas as URLs estão sendo enviadas corretamente.

d. **Core Web Vitals (Métricas Essenciais da Web):**
   - Avalia a experiência do usuário em termos de velocidade de carregamento, interatividade e estabilidade visual. Um bom desempenho nessas métricas é um fator de ranqueamento.
   - **LCP (Largest Contentful Paint):** Tempo que leva para o maior elemento de conteúdo visível carregar.
   - **FID (First Input Delay):** Tempo que leva para a página responder à primeira interação do usuário.
   - **CLS (Cumulative Layout Shift):** Estabilidade visual da página (evitar mudanças inesperadas no layout).

e. **Usabilidade Móvel:**
   - Verifica se suas páginas são amigáveis para dispositivos móveis. Problemas de usabilidade móvel podem afetar negativamente seu ranqueamento.

f. **Links:**
   - **Links Externos:** Páginas que linkam para o seu site (backlinks). Importante para a autoridade do domínio.
   - **Links Internos:** Links entre as páginas do seu próprio site. Ajuda na navegação e na distribuição de autoridade de página.

### 3. Ações com Base nos Relatórios

- **Priorize Correções:** Comece pelos erros mais críticos nos relatórios de Cobertura e Core Web Vitals.
- **Otimize Conteúdo:** Use os dados de Desempenho para otimizar o conteúdo existente e criar novos conteúdos com base em palavras-chave relevantes.
- **Melhore a Experiência do Usuário:** Aborde problemas de usabilidade móvel e Core Web Vitals para garantir uma boa experiência para seus visitantes.
- **Monitore Regularmente:** O SEO é um processo contínuo. Verifique o GSC regularmente para acompanhar o progresso e identificar novos problemas ou oportunidades.

Este guia é um ponto de partida. Para uma auditoria mais aprofundada, você pode combinar o GSC com outras ferramentas como o Rank Math SEO (que você já tem), Screaming Frog (para rastreamento local) e ferramentas de análise de concorrência como SEMrush ou Ahrefs (versões pagas com mais recursos).

