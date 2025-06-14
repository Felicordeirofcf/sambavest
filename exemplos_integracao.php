<?php
/**
 * Exemplos de Integração - Samba Vest
 * Códigos prontos para implementação
 */

// ========================================
// WOOCOMMERCE - Loop de Produtos
// ========================================

function sambavest_produtos_loop() {
    $products = wc_get_products(array(
        'limit' => 6,
        'status' => 'publish',
        'featured' => true // Apenas produtos em destaque
    ));
    
    if (!empty($products)) {
        echo '<div class="products-grid">';
        
        foreach ($products as $product) {
            $image = wp_get_attachment_image_src(get_post_thumbnail_id($product->get_id()), 'medium');
            $image_url = $image ? $image[0] : 'https://via.placeholder.com/300x250';
            
            echo '<div class="product-card" data-product-id="' . $product->get_id() . '">';
            echo '<div class="product-image">';
            echo '<img src="' . $image_url . '" alt="' . $product->get_name() . '" style="width: 100%; height: 100%; object-fit: cover;">';
            echo '</div>';
            echo '<div class="product-info">';
            echo '<h3 class="product-name">' . $product->get_name() . '</h3>';
            echo '<div class="product-price">' . $product->get_price_html() . '</div>';
            echo '<p class="product-description">' . wp_trim_words($product->get_short_description(), 15) . '</p>';
            echo '<a href="' . $product->get_permalink() . '" class="buy-button" data-wc-product="' . $product->get_slug() . '">Comprar Agora</a>';
            echo '</div>';
            echo '</div>';
        }
        
        echo '</div>';
    }
}

// ========================================
// MELHOR ENVIO - Cálculo de Frete
// ========================================

function sambavest_calcular_frete() {
    // Verificar nonce de segurança
    if (!wp_verify_nonce($_POST['nonce'], 'calcular_frete_nonce')) {
        wp_die('Acesso negado');
    }
    
    $cep_origem = '20040-020'; // CEP da loja (Rio de Janeiro)
    $cep_destino = sanitize_text_field($_POST['cep_destino']);
    
    // Validar CEP
    if (!preg_match('/^\d{5}-?\d{3}$/', $cep_destino)) {
        wp_send_json_error('CEP inválido');
    }
    
    // Remover hífen do CEP
    $cep_destino = preg_replace('/[^0-9]/', '', $cep_destino);
    
    // Dados do produto (exemplo)
    $data = array(
        'from' => array('postal_code' => $cep_origem),
        'to' => array('postal_code' => $cep_destino),
        'products' => array(
            array(
                'id' => 'fantasia-carnaval',
                'width' => 30,
                'height' => 10,
                'length' => 40,
                'weight' => 0.8,
                'insurance_value' => 200,
                'quantity' => 1
            )
        )
    );
    
    // Fazer requisição para API Melhor Envio
    $response = wp_remote_post('https://melhorenvio.com.br/api/v2/me/shipment/calculate', array(
        'headers' => array(
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . get_option('melhor_envio_token'),
            'User-Agent' => 'SambaVest/1.0'
        ),
        'body' => json_encode($data),
        'timeout' => 30
    ));
    
    if (is_wp_error($response)) {
        wp_send_json_error('Erro ao conectar com o serviço de frete');
    }
    
    $body = wp_remote_retrieve_body($response);
    $frete_data = json_decode($body, true);
    
    if (empty($frete_data)) {
        wp_send_json_error('Nenhuma opção de frete encontrada');
    }
    
    // Formatar resposta
    $opcoes_frete = array();
    foreach ($frete_data as $opcao) {
        $opcoes_frete[] = array(
            'name' => $opcao['name'],
            'price' => number_format($opcao['price'], 2, ',', '.'),
            'delivery_time' => $opcao['delivery_time'],
            'company' => $opcao['company']['name']
        );
    }
    
    wp_send_json_success($opcoes_frete);
}

add_action('wp_ajax_calcular_frete', 'sambavest_calcular_frete');
add_action('wp_ajax_nopriv_calcular_frete', 'sambavest_calcular_frete');

// ========================================
// APPMAX - Integração de Checkout
// ========================================

function sambavest_appmax_checkout($product_id, $quantity = 1) {
    $product = wc_get_product($product_id);
    
    if (!$product) {
        return false;
    }
    
    // Dados para enviar ao Appmax
    $checkout_data = array(
        'merchant_id' => get_option('appmax_merchant_id'),
        'product_id' => $product->get_id(),
        'product_name' => $product->get_name(),
        'product_price' => $product->get_price(),
        'quantity' => $quantity,
        'success_url' => home_url('/checkout-sucesso/'),
        'cancel_url' => home_url('/checkout-cancelado/'),
        'notification_url' => home_url('/webhook-appmax/')
    );
    
    // Gerar URL de checkout
    $checkout_url = 'https://appmax.com/checkout/' . $checkout_data['merchant_id'] . '?' . http_build_query($checkout_data);
    
    return $checkout_url;
}

// Webhook para receber notificações do Appmax
function sambavest_appmax_webhook() {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    // Verificar assinatura (implementar conforme documentação Appmax)
    
    if ($data['status'] === 'approved') {
        // Processar pagamento aprovado
        $order_id = $data['external_reference'];
        $order = wc_get_order($order_id);
        
        if ($order) {
            $order->payment_complete();
            $order->add_order_note('Pagamento aprovado via Appmax');
        }
    }
    
    http_response_code(200);
    echo 'OK';
    exit;
}

add_action('init', function() {
    if (isset($_GET['webhook']) && $_GET['webhook'] === 'appmax') {
        sambavest_appmax_webhook();
    }
});

// ========================================
// PIXELS - Eventos de Conversão
// ========================================

function sambavest_facebook_pixel_purchase($order_id) {
    $order = wc_get_order($order_id);
    
    if (!$order) return;
    
    $pixel_code = "
    <script>
    fbq('track', 'Purchase', {
        value: " . $order->get_total() . ",
        currency: 'BRL',
        content_ids: ['" . implode("','", array_map(function($item) {
            return $item->get_product_id();
        }, $order->get_items())) . "'],
        content_type: 'product',
        num_items: " . $order->get_item_count() . "
    });
    </script>
    ";
    
    echo $pixel_code;
}

add_action('woocommerce_thankyou', 'sambavest_facebook_pixel_purchase');

// ========================================
// CONFIGURAÇÕES ADMINISTRATIVAS
// ========================================

// Adicionar página de configurações no admin
function sambavest_admin_menu() {
    add_options_page(
        'Configurações Samba Vest',
        'Samba Vest',
        'manage_options',
        'sambavest-config',
        'sambavest_admin_page'
    );
}

add_action('admin_menu', 'sambavest_admin_menu');

function sambavest_admin_page() {
    if (isset($_POST['submit'])) {
        update_option('melhor_envio_token', sanitize_text_field($_POST['melhor_envio_token']));
        update_option('appmax_merchant_id', sanitize_text_field($_POST['appmax_merchant_id']));
        update_option('facebook_pixel_id', sanitize_text_field($_POST['facebook_pixel_id']));
        update_option('tiktok_pixel_id', sanitize_text_field($_POST['tiktok_pixel_id']));
        
        echo '<div class="notice notice-success"><p>Configurações salvas!</p></div>';
    }
    
    $melhor_envio_token = get_option('melhor_envio_token', '');
    $appmax_merchant_id = get_option('appmax_merchant_id', '');
    $facebook_pixel_id = get_option('facebook_pixel_id', '');
    $tiktok_pixel_id = get_option('tiktok_pixel_id', '');
    
    ?>
    <div class="wrap">
        <h1>Configurações Samba Vest</h1>
        <form method="post">
            <table class="form-table">
                <tr>
                    <th scope="row">Token Melhor Envio</th>
                    <td><input type="text" name="melhor_envio_token" value="<?php echo esc_attr($melhor_envio_token); ?>" class="regular-text" /></td>
                </tr>
                <tr>
                    <th scope="row">Merchant ID Appmax</th>
                    <td><input type="text" name="appmax_merchant_id" value="<?php echo esc_attr($appmax_merchant_id); ?>" class="regular-text" /></td>
                </tr>
                <tr>
                    <th scope="row">Facebook Pixel ID</th>
                    <td><input type="text" name="facebook_pixel_id" value="<?php echo esc_attr($facebook_pixel_id); ?>" class="regular-text" /></td>
                </tr>
                <tr>
                    <th scope="row">TikTok Pixel ID</th>
                    <td><input type="text" name="tiktok_pixel_id" value="<?php echo esc_attr($tiktok_pixel_id); ?>" class="regular-text" /></td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}

// ========================================
// JAVASCRIPT ATUALIZADO
// ========================================
?>

<script>
// Função atualizada para cálculo de frete com AJAX
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
    
    // Preparar dados para envio
    const formData = new FormData();
    formData.append('action', 'calcular_frete');
    formData.append('cep_destino', cepDestino);
    formData.append('nonce', '<?php echo wp_create_nonce("calcular_frete_nonce"); ?>');
    
    // Fazer requisição AJAX
    fetch('<?php echo admin_url("admin-ajax.php"); ?>', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            let html = `<h4>Opções de Entrega para ${cepDestino}:</h4><div style="margin-top: 1rem;">`;
            
            data.data.forEach(opcao => {
                html += `
                    <div style="padding: 0.5rem; border: 1px solid #e5e7eb; border-radius: 5px; margin-bottom: 0.5rem;">
                        <strong>${opcao.name} (${opcao.company}):</strong> R$ ${opcao.price} - ${opcao.delivery_time} dias úteis
                    </div>
                `;
            });
            
            html += '</div><p style="font-size: 0.9rem; color: #6b7280; margin-top: 1rem;">* Valores calculados via API Melhor Envio</p>';
            resultsDiv.innerHTML = html;
        } else {
            resultsDiv.innerHTML = `<p style="color: red;">Erro: ${data.data}</p>`;
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        resultsDiv.innerHTML = '<p style="color: red;">Erro ao calcular frete. Tente novamente.</p>';
    });
}

// Função para redirecionar ao Appmax
function redirectToAppmax(productId) {
    // Track do evento antes do redirecionamento
    const productCard = document.querySelector(`[data-product-id="${productId}"]`);
    const productName = productCard.querySelector('.product-name').textContent;
    const productPrice = productCard.querySelector('.product-price').textContent.replace(/[^\d,]/g, '').replace(',', '.');
    
    // Track Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', 'InitiateCheckout', {
            content_ids: [productId],
            content_type: 'product',
            value: parseFloat(productPrice),
            currency: 'BRL'
        });
    }
    
    // Track TikTok Pixel
    if (typeof ttq !== 'undefined') {
        ttq.track('InitiateCheckout', {
            content_id: productId,
            content_type: 'product',
            value: parseFloat(productPrice),
            currency: 'BRL'
        });
    }
    
    // Fazer requisição para obter URL do checkout Appmax
    fetch('<?php echo admin_url("admin-ajax.php"); ?>', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `action=get_appmax_checkout&product_id=${productId}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = data.data.checkout_url;
        } else {
            alert('Erro ao processar checkout. Tente novamente.');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao processar checkout. Tente novamente.');
    });
}

// Atualizar event listeners dos botões de compra
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.buy-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product-card');
            const productId = productCard.dataset.productId;
            
            if (productId) {
                redirectToAppmax(productId);
            } else {
                // Fallback para links diretos
                window.location.href = this.href;
            }
        });
    });
});
</script>

