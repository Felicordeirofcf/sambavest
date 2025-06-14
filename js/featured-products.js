// Featured Products Carousel Functionality
function showImage(button, imageIndex) {
    const card = button.closest('.product-card');
    const images = card.querySelectorAll('.product-image');
    const dots = card.querySelectorAll('.dot');
    
    // Remove active class from all images and dots
    images.forEach(img => img.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Add active class to selected image and dot
    images[imageIndex].classList.add('active');
    button.classList.add('active');
}

// Auto-rotate images every 4 seconds
function autoRotateImages() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const images = card.querySelectorAll('.product-image');
        const dots = card.querySelectorAll('.dot');
        
        if (images.length > 1) {
            let currentIndex = 0;
            
            setInterval(() => {
                // Remove active class from current image and dot
                images[currentIndex].classList.remove('active');
                dots[currentIndex].classList.remove('active');
                
                // Move to next image
                currentIndex = (currentIndex + 1) % images.length;
                
                // Add active class to new image and dot
                images[currentIndex].classList.add('active');
                dots[currentIndex].classList.add('active');
            }, 4000);
        }
    });
}

// CEP formatting and validation
function formatCEP(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 5) {
        value = value.substring(0, 5) + '-' + value.substring(5, 8);
    }
    input.value = value;
}

// Add event listeners for CEP inputs
document.addEventListener('DOMContentLoaded', function() {
    // Auto-rotate images
    autoRotateImages();
    
    // CEP input formatting
    const cepInputs = document.querySelectorAll('.cep-input');
    cepInputs.forEach(input => {
        input.addEventListener('input', function() {
            formatCEP(this);
        });
        
        input.addEventListener('keypress', function(e) {
            // Only allow numbers and dash
            if (!/[\d-]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter'].includes(e.key)) {
                e.preventDefault();
            }
        });
    });
    
    // Shipping calculation
    const shippingButtons = document.querySelectorAll('.calc-shipping-btn');
    shippingButtons.forEach(button => {
        button.addEventListener('click', function() {
            const calculator = this.closest('.shipping-calculator');
            const input = calculator.querySelector('.cep-input');
            const resultDiv = calculator.querySelector('.shipping-result');
            const cep = input.value.replace(/\D/g, '');
            
            if (cep.length === 8) {
                // Show loading state
                this.textContent = 'Calculando...';
                this.disabled = true;
                
                setTimeout(() => {
                    // Show result in the card
                    resultDiv.style.display = 'block';
                    this.textContent = 'Calcular Frete';
                    this.disabled = false;
                }, 1500);
            } else {
                alert('Por favor, digite um CEP válido (8 dígitos)');
                input.focus();
            }
        });
    });
});

// Smooth scroll to section
function scrollToFeaturedProducts() {
    document.querySelector('.featured-products-section').scrollIntoView({
        behavior: 'smooth'
    });
}

