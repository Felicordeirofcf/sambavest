// Featured Products Carousel Functionality - Fixed Version
function showImage(button, imageIndex) {
    const card = button.closest(".product-card");
    const images = card.querySelectorAll(".product-image");
    const dots = card.querySelectorAll(".dot");
    
    console.log("showImage called for card:", card);
    console.log("Images found:", images.length);
    console.log("Dots found:", dots.length);
    console.log("Activating image index:", imageIndex);

    // Remove active class from all images and dots
    images.forEach(img => img.classList.remove("active"));
    dots.forEach(dot => dot.classList.remove("active"));
    
    // Add active class to selected image and dot
    if (images[imageIndex]) {
        images[imageIndex].classList.add("active");
    } else {
        console.error("Image at index", imageIndex, "not found for card:", card);
    }
    if (button) {
        button.classList.add("active");
    }
}

// Setup event listeners for carousel dots
function setupCarouselEventListeners() {
    const productCards = document.querySelectorAll(".product-card");
    
    productCards.forEach((card, cardIndex) => {
        const dots = card.querySelectorAll(".dot");
        
        dots.forEach((dot, dotIndex) => {
            dot.addEventListener('click', function() {
                showImage(this, dotIndex);
            });
        });
    });
}

// Auto-rotate images every 4 seconds
function autoRotateImages() {
    const productCards = document.querySelectorAll(".product-card");
    
    console.log("autoRotateImages called. Found product cards:", productCards.length);

    productCards.forEach((card, cardIndex) => {
        const images = card.querySelectorAll(".product-image");
        const dots = card.querySelectorAll(".dot");
        
        console.log(`Card ${cardIndex}: Images found: ${images.length}, Dots found: ${dots.length}`);

        if (images.length > 1) {
            let currentIndex = 0;
            
            setInterval(() => {
                // Remove active class from current image and dot
                if (images[currentIndex]) {
                    images[currentIndex].classList.remove("active");
                }
                if (dots[currentIndex]) {
                    dots[currentIndex].classList.remove("active");
                }
                
                // Move to next image
                currentIndex = (currentIndex + 1) % images.length;
                
                // Add active class to new image and dot
                if (images[currentIndex]) {
                    images[currentIndex].classList.add("active");
                } else {
                    console.error("Image at index", currentIndex, "not found during auto-rotation for card:", cardIndex);
                }
                if (dots[currentIndex]) {
                    dots[currentIndex].classList.add("active");
                }
            }, 4000);
        }
    });
}

// CEP formatting and validation
function formatCEP(input) {
    let value = input.value.replace(/\D/g, "");
    if (value.length > 5) {
        value = value.substring(0, 5) + "-" + value.substring(5, 8);
    }
    input.value = value;
}

// Setup shipping calculator
function setupShippingCalculator() {
    // CEP input formatting
    const cepInputs = document.querySelectorAll(".cep-input");
    cepInputs.forEach(input => {
        input.addEventListener("input", function() {
            formatCEP(this);
        });
        
        input.addEventListener("keypress", function(e) {
            // Only allow numbers and dash
            if (!/\d/.test(e.key) && !["Backspace", "Delete", "Tab", "Enter"].includes(e.key)) {
                e.preventDefault();
            }
        });
    });
    
    // Shipping calculation
    const shippingButtons = document.querySelectorAll(".calc-shipping-btn");
    shippingButtons.forEach(button => {
        button.addEventListener("click", function() {
            const calculator = this.closest(".shipping-calculator");
            const input = calculator.querySelector(".cep-input");
            const resultDiv = calculator.querySelector(".shipping-result");
            const cep = input.value.replace(/\D/g, "");
            
            if (cep.length === 8) {
                // Show loading state
                this.textContent = "Calculando...";
                this.disabled = true;
                
                setTimeout(() => {
                    // Show result in the card
                    resultDiv.style.display = "block";
                    this.textContent = "Calcular Frete";
                    this.disabled = false;
                }, 1500);
            } else {
                alert("Por favor, digite um CEP válido (8 dígitos)");
                input.focus();
            }
        });
    });
}

// Add event listeners for CEP inputs
document.addEventListener("DOMContentLoaded", function() {
    console.log("Featured products script loaded");
    
    // Setup carousel event listeners
    setupCarouselEventListeners();
    
    // Auto-rotate images
    autoRotateImages();
    
    // Setup shipping calculator
    setupShippingCalculator();
});

// Smooth scroll to section
function scrollToFeaturedProducts() {
    document.querySelector(".featured-products-section").scrollIntoView({
        behavior: "smooth"
    });
}

