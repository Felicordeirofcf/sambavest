const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de segurança
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            scriptSrc: [
                "'self'", 
                "'unsafe-inline'", 
                "https://www.googletagmanager.com",
                "https://connect.facebook.net",
                "https://analytics.tiktok.com"
            ],
            imgSrc: ["'self'", "data:", "https:", "http:"],
            connectSrc: [
                "'self'", 
                "https://www.google-analytics.com",
                "https://analytics.google.com",
                "https://www.facebook.com"
            ]
        }
    }
}));

// Middleware de compressão
app.use(compression());

// CORS
app.use(cors());

// Middleware para parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar cache para assets estáticos
app.use('/images', express.static(path.join(__dirname, 'images'), {
    maxAge: '1y', // Cache de 1 ano para imagens
    etag: true,
    lastModified: true
}));

app.use('/css', express.static(path.join(__dirname, 'css'), {
    maxAge: '1y',
    etag: true
}));

app.use('/js', express.static(path.join(__dirname, 'js'), {
    maxAge: '1y',
    etag: true
}));

// Servir arquivos estáticos
app.use(express.static(__dirname, {
    maxAge: '1d' // Cache de 1 dia para outros arquivos
}));

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para página sobre
app.get("/sobre", (req, res) => {
    res.sendFile(path.join(__dirname, "about.html"));
});

// API para produtos (para futuras funcionalidades)
app.get('/api/products', (req, res) => {
    const products = [
        {
            id: 'beija-flor',
            name: 'Camisa Beija-Flor Enredo 2025',
            school: 'beija-flor',
            price: 89.90,
            image: '/images/products/camisa-beija-flor-frente.jpg',
            description: 'Camisa oficial licenciada da escola de samba Beija-Flor de Nilópolis',
            keywords: ['beija-flor', 'nilópolis', 'carnaval', 'camisa oficial'],
            inStock: true
        },
        {
            id: 'salgueiro',
            name: 'Camisa Salgueiro Enredo 2025',
            school: 'salgueiro',
            price: 89.90,
            image: '/images/products/camisa-salgueiro-frente.jpg',
            description: 'Camisa oficial licenciada da escola de samba Acadêmicos do Salgueiro',
            keywords: ['salgueiro', 'acadêmicos', 'carnaval', 'camisa oficial'],
            inStock: true
        },
        {
            id: 'viradouro',
            name: 'Camisa Viradouro Enredo 2025',
            school: 'viradouro',
            price: 89.90,
            image: '/images/products/camisa-viradouro-frente.jpg',
            description: 'Camisa oficial licenciada da escola de samba Unidos do Viradouro',
            keywords: ['viradouro', 'unidos', 'carnaval', 'camisa oficial'],
            inStock: true
        }
    ];
    
    res.json(products);
});

// API para busca de produtos
app.get('/api/search', (req, res) => {
    const { q } = req.query;
    // Implementar lógica de busca aqui
    res.json({ query: q, results: [] });
});

// Rota para sitemap.xml
app.get('/sitemap.xml', (req, res) => {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://sambavest.com/</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://sambavest.com/sobre</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
</urlset>`;
    
    res.set('Content-Type', 'text/xml');
    res.send(sitemap);
});

// Rota para robots.txt
app.get('/robots.txt', (req, res) => {
    const robots = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://sambavest.com/sitemap.xml`;
    
    res.set('Content-Type', 'text/plain');
    res.send(robots);
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado!');
});

// Rota 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor Samba Vest rodando na porta ${PORT}`);
    console.log(`🌐 Acesse: http://localhost:${PORT}`);
    console.log(`📱 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

