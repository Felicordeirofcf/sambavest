#!/bin/bash

# Script de Otimização de Imagens para Samba Vest
# Converte imagens para WebP e cria versões responsivas

echo "🖼️  Iniciando otimização de imagens..."

# Criar diretórios para versões otimizadas
mkdir -p optimized/{logos,products,banners}/{thumbnail,medium,large,webp}

# Função para otimizar imagem
optimize_image() {
    local input_file="$1"
    local output_dir="$2"
    local base_name="$3"
    
    echo "Processando: $input_file"
    
    # Versão thumbnail (150x150)
    convert "$input_file" -resize 150x150^ -gravity center -extent 150x150 -quality 85 "$output_dir/thumbnail/${base_name}.jpg"
    cwebp -q 85 "$output_dir/thumbnail/${base_name}.jpg" -o "$output_dir/webp/${base_name}_thumb.webp"
    
    # Versão medium (400x400)
    convert "$input_file" -resize 400x400^ -gravity center -extent 400x400 -quality 90 "$output_dir/medium/${base_name}.jpg"
    cwebp -q 90 "$output_dir/medium/${base_name}.jpg" -o "$output_dir/webp/${base_name}_medium.webp"
    
    # Versão large (800x800)
    convert "$input_file" -resize 800x800^ -gravity center -extent 800x800 -quality 95 "$output_dir/large/${base_name}.jpg"
    cwebp -q 95 "$output_dir/large/${base_name}.jpg" -o "$output_dir/webp/${base_name}_large.webp"
    
    # Versão WebP original otimizada
    cwebp -q 90 "$input_file" -o "$output_dir/webp/${base_name}.webp"
}

# Otimizar logos
echo "📱 Otimizando logos..."
for logo in logos/*.jpg; do
    if [ -f "$logo" ]; then
        base_name=$(basename "$logo" .jpg)
        optimize_image "$logo" "optimized/logos" "$base_name"
    fi
done

# Otimizar produtos
echo "👕 Otimizando produtos..."
for product in products/*.jpg; do
    if [ -f "$product" ]; then
        base_name=$(basename "$product" .jpg)
        optimize_image "$product" "optimized/products" "$base_name"
    fi
done

# Otimizar banners
echo "🎯 Otimizando banners..."
for banner in banners/*.jpg; do
    if [ -f "$banner" ]; then
        base_name=$(basename "$banner" .jpg)
        optimize_image "$banner" "optimized/banners" "$base_name"
    fi
done

# Processar PNG separadamente
for png in banners/*.png; do
    if [ -f "$png" ]; then
        base_name=$(basename "$png" .png)
        echo "Processando PNG: $png"
        
        # Converter PNG para JPG primeiro, depois otimizar
        convert "$png" -background white -flatten "temp_${base_name}.jpg"
        optimize_image "temp_${base_name}.jpg" "optimized/banners" "$base_name"
        rm "temp_${base_name}.jpg"
    fi
done

echo "✅ Otimização concluída!"
echo "📊 Relatório de tamanhos:"

# Mostrar comparação de tamanhos
echo "Original vs Otimizado:"
du -sh logos/ products/ banners/ 2>/dev/null || echo "Pastas originais"
du -sh optimized/ 2>/dev/null || echo "Pasta otimizada"

echo "🎉 Todas as imagens foram otimizadas com sucesso!"

