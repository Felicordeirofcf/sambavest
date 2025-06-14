# Guia de Integração - APIs e Serviços

## 🛒 Integração WooCommerce

### Estrutura Preparada
O site já possui a estrutura necessária para integração com WooCommerce:

- **Botões de Compra**: Todos os botões possuem `data-wc-product` com o slug do produto
- **Links de Produto**: Estruturados como `/produto/nome-do-produto`
- **Loop de Produtos**: Estrutura preparada para receber dados dinâmicos

### Como Integrar:

1. **Substituir produtos estáticos por loop dinâmico:**
```php
<?php
$products = wc_get_products(array(
    'limit' => 3,
    'status' => 'publish'
));

foreach ($products as $product) {
    echo '<div class="product-card" data-product-id="' . $product->get_id() . '">';
    echo '<div class="product-image">';
    echo $product->get_image();
    echo '</div>';
    echo '<div class="product-info">';
    echo '<h3 class="product-name">' . $product->get_name() . '</h3>';
    echo '<div class="product-price">' . $product->get_price_html() . '</div>';
    echo '<p class="product-description">' . wp_trim_words($product->get_description(), 20) . '</p>';
    echo '<a href="' . $product->get_permalink() . '" class="buy-button" data-wc-product="' . $product->get_slug() . '">Comprar Agora</a>';
    echo '</div>';
    echo '</div>';
}
?>
```

2. **Converter para template WordPress:**
- Renomear `index.html` para `index.php`
- Adicionar `<?php get_header(); ?>` e `<?php get_footer(); ?>`
- Integrar com o sistema de templates do WordPress

---

## 💳 Integração Appmax

### Estrutura Preparada
- Botões de compra com tracking de eventos
- Estrutura para redirecionamento de checkout
- Pixels de rastreamento configurados

### Como Integrar:

1. **Configurar redirecionamento para checkout:**
```javascript
// Substituir no JavaScript existente
function redirectToAppmax(productId, productName, price) {
    // Track do evento antes do redirecionamento
    trackPurchase(productName, price);
    
    // Redirecionar para Appmax
    const checkoutUrl = `https://appmax.com/checkout/SEU_MERCHANT_ID?product=${productId}&price=${price}`;
    window.location.href = checkoutUrl;
}
```

2. **Implementar botão Appmax (opcional):**
```html
<!-- Adicionar no head -->
<script src="https://appmax.com/js/button.js"></script>

<script>
AppMax.init({
    merchant_id: 'SEU_MERCHANT_ID',
    button_color: '#2563eb',
    button_text: 'Comprar com Appmax',
    success_url: 'https://seusite.com/sucesso',
    cancel_url: 'https://seusite.com/cancelado'
});
</script>
```

3. **Configurações necessárias:**
- Substituir `SEU_MERCHANT_ID` pelo ID real da Appmax
- Configurar URLs de sucesso e cancelamento
- Testar em ambiente de sandbox primeiro

---

## 📦 Integração Melhor Envio

### Estrutura Preparada
- Formulário de cálculo de frete funcional
- Campos com data attributes para API
- JavaScript preparado para chamadas AJAX

### Como Integrar:

1. **Configurar API no backend (PHP):**
```php
// functions.php ou arquivo separado
function calcular_frete_melhor_envio() {
    $cep_origem = '20040-020'; // CEP da sua loja
    $cep_destino = $_POST['cep_destino'];
    
    $data = array(
        'from' => array('postal_code' => $cep_origem),
        'to' => array('postal_code' => $cep_destino),
        'products' => array(
            array(
                'id' => 'x',
                'width' => 20,
                'height' => 10,
                'length' => 30,
                'weight' => 0.5,
                'insurance_value' => 100,
                'quantity' => 1
            )
        )
    );
    
    $response = wp_remote_post('https://melhorenvio.com.br/api/v2/me/shipment/calculate', array(
        'headers' => array(
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer SEU_TOKEN_MELHOR_ENVIO'
        ),
        'body' => json_encode($data)
    ));
    
    return wp_remote_retrieve_body($response);
}

add_action('wp_ajax_calcular_frete', 'calcular_frete_melhor_envio');
add_action('wp_ajax_nopriv_calcular_frete', 'calcular_frete_melhor_envio');
```

2. **Atualizar JavaScript para chamada real:**
```javascript
// Substituir a função calcularFrete() existente
function calcularFrete() {
    const cepDestino = document.getElementById('cep-destino').value;
    const resultsDiv = document.getElementById('shipping-results');
    
    if (!cepDestino || cepDestino.length < 8) {
        alert('Por favor, insira um CEP válido');
        return;
    }
    
    // Mostrar loading
    resultsDiv.innerHTML = '<p>Calculando frete...</p>';
    resultsDiv.style.display = 'block';
    
    // Chamada AJAX para o backend
    fetch('/wp-admin/admin-ajax.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `action=calcular_frete&cep_destino=${cepDestino}`
    })
    .then(response => response.json())
    .then(data => {
        let html = `<h4>Opções de Entrega para ${cepDestino}:</h4><div style="margin-top: 1rem;">`;
        
        data.forEach(option => {
            html += `
                <div style="padding: 0.5rem; border: 1px solid #e5e7eb; border-radius: 5px; margin-bottom: 0.5rem;">
                    <strong>${option.name}:</strong> R$ ${option.price} - ${option.delivery_time} dias úteis
                </div>
            `;
        });
        
        html += '</div>';
        resultsDiv.innerHTML = html;
    })
    .catch(error => {
        resultsDiv.innerHTML = '<p>Erro ao calcular frete. Tente novamente.</p>';
    });
}
```

---

## 📈 Pixels e Rastreamento

### Facebook Pixel
- **ID atual**: `YOUR_FACEBOOK_PIXEL_ID` (substituir pelo real)
- **Eventos configurados**: PageView, Purchase
- **Localização**: `<head>` do HTML

### TikTok Pixel
- **ID atual**: `YOUR_TIKTOK_PIXEL_ID` (substituir pelo real)
- **Eventos configurados**: page, CompletePayment
- **Localização**: `<head>` do HTML

### Google Ads (Opcional)
- Código comentado no HTML
- Descomentar e configurar `AW-CONVERSION_ID`

### Como Configurar:

1. **Obter IDs reais dos pixels**
2. **Substituir no HTML:**
   - `YOUR_FACEBOOK_PIXEL_ID` → ID real do Facebook
   - `YOUR_TIKTOK_PIXEL_ID` → ID real do TikTok
3. **Testar eventos no Facebook Events Manager e TikTok Events Manager**

---

## 🔧 Configurações Adicionais

### SEO
- **Meta tags**: Configuradas e prontas
- **Sitemap**: Criar arquivo `sitemap.xml`
- **Robots.txt**: Criar arquivo `robots.txt`

### Performance
- **Imagens**: Otimizar e usar WebP quando possível
- **CSS/JS**: Minificar em produção
- **CDN**: Considerar uso de CDN para assets

### Segurança
- **HTTPS**: Obrigatório para pixels e checkout
- **CSP**: Configurar Content Security Policy
- **Backup**: Implementar sistema de backup

---

## 📋 Checklist de Implementação

### WooCommerce
- [ ] Converter HTML para PHP
- [ ] Integrar loop de produtos
- [ ] Configurar permalinks
- [ ] Testar carrinho e checkout

### Appmax
- [ ] Obter credenciais de produção
- [ ] Configurar URLs de retorno
- [ ] Testar pagamentos
- [ ] Implementar webhooks

### Melhor Envio
- [ ] Obter token de API
- [ ] Configurar dimensões dos produtos
- [ ] Testar cálculo de frete
- [ ] Implementar rastreamento

### Pixels
- [ ] Configurar Facebook Pixel
- [ ] Configurar TikTok Pixel
- [ ] Testar eventos
- [ ] Configurar conversões

### Deploy
- [ ] Configurar domínio
- [ ] Instalar SSL
- [ ] Configurar DNS
- [ ] Testar em produção

