# Organização das Imagens - Samba Vest

## Estrutura de Pastas

### `/images/logos/`
- `logo.jpg` - Logo principal da Samba Vest (13KB)
- `logo-alt.jpg` - Logo alternativo (13KB)

### `/images/products/`
- `camisa-beija-flor-frente.jpg` - Camisa Beija-Flor Enredo 2025 (frente) - 58KB
- `camisa-salgueiro-frente.jpg` - Camisa Salgueiro Enredo 2025 (frente) - 30KB  
- `camisa-salgueiro-costas.jpg` - Camisa Salgueiro Enredo 2025 (costas) - 30KB
- `camisa-viradouro-frente.jpg` - Camisa Viradouro Enredo 2025 (frente) - 47KB
- `camisa-viradouro-costas.jpg` - Camisa Viradouro Enredo 2025 (costas) - 44KB

### `/images/banners/`
- `promocao-campeas.jpg` - Banner promocional das campeãs (134KB)
- `image.png` - Imagem adicional (4KB)

## Uso nos Componentes

### Header
```html
<img src="images/logos/logo.jpg" alt="Samba Vest - Camisas Oficiais e Licenciadas do Carnaval Carioca">
```

### Cards de Produtos
```html
<!-- Beija-Flor -->
<img src="images/products/camisa-beija-flor-frente.jpg" alt="Camisa Beija-Flor Enredo 2025">

<!-- Salgueiro -->
<img src="images/products/camisa-salgueiro-frente.jpg" alt="Camisa Salgueiro Enredo 2025 - Frente">
<img src="images/products/camisa-salgueiro-costas.jpg" alt="Camisa Salgueiro Enredo 2025 - Costas">

<!-- Viradouro -->
<img src="images/products/camisa-viradouro-frente.jpg" alt="Camisa Viradouro Enredo 2025 - Frente">
<img src="images/products/camisa-viradouro-costas.jpg" alt="Camisa Viradouro Enredo 2025 - Costas">
```

### Banners
```html
<img src="images/banners/promocao-campeas.jpg" alt="Promoção das Campeãs">
```

## Otimizações Recomendadas

1. **Compressão**: As imagens podem ser otimizadas para web (WebP, compressão)
2. **Responsive**: Criar versões em diferentes tamanhos (thumbnail, medium, large)
3. **Lazy Loading**: Implementar carregamento sob demanda
4. **Alt Text**: Textos alternativos otimizados para SEO com palavras-chave

## Palavras-chave para Alt Text
- "Camisa oficial [escola] enredo 2025"
- "Roupa carnaval carioca licenciada"
- "Samba vest [escola de samba]"
- "Camisa licenciada carnaval rio"

