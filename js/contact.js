// FUNCIONALIDADES DE CONTATO
class ContactManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupContactForm();
        this.setupWhatsAppIntegration();
    }

    setupContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(contactForm);
            });
        }
    }

    async handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validar dados
        if (!this.validateContactData(data)) {
            return;
        }

        // Mostrar loading
        this.showFormLoading(form);

        try {
            // Simular envio (implementar integração real)
            await this.submitContactForm(data);
            
            // Rastrear lead
            if (window.marketingTracker) {
                window.marketingTracker.trackLead();
            }

            this.showFormSuccess(form);
            form.reset();
        } catch (error) {
            this.showFormError(form, 'Erro ao enviar mensagem. Tente novamente.');
        } finally {
            this.hideFormLoading(form);
        }
    }

    validateContactData(data) {
        const required = ['name', 'email', 'message'];
        for (const field of required) {
            if (!data[field] || !data[field].trim()) {
                this.showNotification(`Campo ${field} é obrigatório`, 'error');
                return false;
            }
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            this.showNotification('Email inválido', 'error');
            return false;
        }

        return true;
    }

    async submitContactForm(data) {
        // Simular delay de envio
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Aqui você implementaria a integração real
        // Por exemplo: envio por email, webhook, etc.
        console.log('Dados do contato:', data);
        
        return { success: true };
    }

    setupWhatsAppIntegration() {
        const whatsappButtons = document.querySelectorAll('.whatsapp-btn');
        whatsappButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openWhatsApp();
            });
        });
    }

    openWhatsApp() {
        const phoneNumber = '5521999999999'; // Substitua pelo número real
        const message = encodeURIComponent('Olá! Gostaria de saber mais sobre as camisas do carnaval.');
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        
        window.open(whatsappUrl, '_blank');
        
        // Rastrear evento
        if (typeof gtag !== 'undefined') {
            gtag('event', 'whatsapp_contact', {
                'custom_parameter_1': 'contact_button'
            });
        }
    }

    showFormLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
        }
    }

    hideFormLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar Mensagem';
        }
    }

    showFormSuccess(form) {
        this.showNotification('Mensagem enviada com sucesso!', 'success');
    }

    showFormError(form, message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        // Usar o sistema de notificações do products.js
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            alert(message);
        }
    }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.contactManager = new ContactManager();
});

