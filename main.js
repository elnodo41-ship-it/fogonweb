// ============================================
// FOFONWEB - Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ============================================
    // MOBILE MENU
    // ============================================
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // ============================================
    // SMOOTH SCROLL
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // ANIMATED COUNTERS
    // ============================================
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(() => animateCounter(counter), 20);
        } else {
            counter.innerText = target;
        }
    };

    // Trigger counters when in view
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // ============================================
    // SCROLL ANIMATIONS (AOS-like)
    // ============================================
    const animatedElements = document.querySelectorAll('[data-aos]');

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-aos-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, delay);
                animationObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => animationObserver.observe(el));

    // ============================================
    // TESTIMONIALS SLIDER
    // ============================================
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    let currentSlide = 0;
    let autoSlideInterval;

    const showSlide = (index) => {
        testimonialCards.forEach((card, i) => {
            card.classList.remove('active');
            dots[i].classList.remove('active');
        });
        testimonialCards[index].classList.add('active');
        dots[index].classList.add('active');
    };

    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % testimonialCards.length;
        showSlide(currentSlide);
    };

    const prevSlide = () => {
        currentSlide = (currentSlide - 1 + testimonialCards.length) % testimonialCards.length;
        showSlide(currentSlide);
    };

    const startAutoSlide = () => {
        autoSlideInterval = setInterval(nextSlide, 5000);
    };

    const stopAutoSlide = () => {
        clearInterval(autoSlideInterval);
    };

    nextBtn.addEventListener('click', () => {
        stopAutoSlide();
        nextSlide();
        startAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
        stopAutoSlide();
        prevSlide();
        startAutoSlide();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoSlide();
            currentSlide = index;
            showSlide(currentSlide);
            startAutoSlide();
        });
    });

    startAutoSlide();

    // ============================================
    // CHATBOT
    // ============================================
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');
    const quickReplies = document.querySelectorAll('.quick-reply');

    // Chatbot knowledge base
    const botResponses = {
        'tiempo': 'Nuestro tiempo de entrega estándar es de **1 semana** (7 días laborables) desde que confirmamos el proyecto. Si necesitas urgencia, consúltanos en info@fogonweb.es',
        'servicios': 'Ofrecemos tres servicios principales: 1️⃣ **Web Profesional** para tu restaurante, 2️⃣ **Menú Digital QR** interactivo, y 3️⃣ **Pack Completo** que incluye ambos. ¿Te gustaría saber más de alguno?',
        'precio': 'Para solicitar presupuesto, rellena el formulario de contacto en la web o escríbenos a **info@fogonweb.es**. Te respondemos en menos de 24 horas con un presupuesto personalizado sin compromiso.',
        'hola': '¡Hola! 👋 Bienvenido a FogonWeb. Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?',
        'adios': '¡Hasta luego! 👋 Si necesitas algo más, aquí estamos. ¡Que tengas un buen día!',
        'gracias': '¡De nada! 😊 Estamos aquí para lo que necesites.',
        'default': 'Para dudas específicas, te recomiendo escribirnos a **info@fogonweb.es** o rellenar el formulario de contacto. Te responderemos en menos de 24h. Nuestro tiempo de entrega es de 1 semana. ¿Algo más en lo que pueda ayudarte?'
    };

    const getBotResponse = (message) => {
        const lowerMsg = message.toLowerCase().trim();

        if (lowerMsg.includes('tiempo') || lowerMsg.includes('tarda') || lowerMsg.includes('dias') || lowerMsg.includes('días') || lowerMsg.includes('cuando') || lowerMsg.includes('entrega')) {
            return botResponses['tiempo'];
        }
        if (lowerMsg.includes('servicio') || lowerMsg.includes('ofrece') || lowerMsg.includes('hace') || lowerMsg.includes('que hace') || lowerMsg.includes('que hacéis')) {
            return botResponses['servicios'];
        }
        if (lowerMsg.includes('precio') || lowerMsg.includes('presupuesto') || lowerMsg.includes('cuanto cuesta') || lowerMsg.includes('cuánto cuesta') || lowerMsg.includes('coste') || lowerMsg.includes('pagar')) {
            return botResponses['precio'];
        }
        if (lowerMsg.includes('hola') || lowerMsg.includes('buenas') || lowerMsg.includes('hey')) {
            return botResponses['hola'];
        }
        if (lowerMsg.includes('adios') || lowerMsg.includes('adiós') || lowerMsg.includes('hasta luego') || lowerMsg.includes('chao')) {
            return botResponses['adios'];
        }
        if (lowerMsg.includes('gracias') || lowerMsg.includes('thank')) {
            return botResponses['gracias'];
        }
        if (lowerMsg.includes('contacto') || lowerMsg.includes('email') || lowerMsg.includes('correo') || lowerMsg.includes('escribir')) {
            return 'Puedes contactarnos en **info@fogonweb.es** o rellenar el formulario de contacto en la web. Respondemos en menos de 24 horas.';
        }
        if (lowerMsg.includes('qr') || lowerMsg.includes('menu') || lowerMsg.includes('menú')) {
            return 'Nuestro **Menú Digital QR** permite a tus clientes ver la carta escaneando un código con su móvil. Puedes actualizar precios y platos en tiempo real sin reimprimir. ¿Te gustaría más información?';
        }
        if (lowerMsg.includes('web') || lowerMsg.includes('pagina') || lowerMsg.includes('página')) {
            return 'Diseñamos **webs profesionales** para restaurantes con reservas online, galería de fotos, horarios y todo optimizado para móvil. El tiempo de entrega es de 1 semana.';
        }

        return botResponses['default'];
    };

    const addMessage = (text, isUser = false) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        messageDiv.innerHTML = `
            <div class="message-avatar"><i class="fas ${isUser ? 'fa-user' : 'fa-robot'}"></i></div>
            <div class="message-content"><p>${text}</p></div>
        `;
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    };

    const handleSend = () => {
        const message = chatbotInput.value.trim();
        if (!message) return;

        addMessage(message, true);
        chatbotInput.value = '';

        // Simulate typing delay
        setTimeout(() => {
            const response = getBotResponse(message);
            addMessage(response);
        }, 600);
    };

    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.classList.toggle('active');
        // Hide notification when opened
        const notification = chatbotToggle.querySelector('.chatbot-notification');
        if (notification) notification.style.display = 'none';
    });

    chatbotClose.addEventListener('click', () => {
        chatbotWindow.classList.remove('active');
    });

    chatbotSend.addEventListener('click', handleSend);

    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    quickReplies.forEach(btn => {
        btn.addEventListener('click', () => {
            const question = btn.getAttribute('data-question');
            let message = '';

            switch(question) {
                case 'tiempo':
                    message = '¿Cuánto tarda?';
                    break;
                case 'servicios':
                    message = '¿Qué servicios ofrecéis?';
                    break;
                case 'precio':
                    message = '¿Cómo pido presupuesto?';
                    break;
            }

            addMessage(message, true);

            setTimeout(() => {
                const response = getBotResponse(message);
                addMessage(response);
            }, 600);
        });
    });

    // ============================================
    // CONTACT FORM
    // ============================================
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Show success message
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = '<span><i class="fas fa-check"></i> ¡Mensaje Enviado!</span>';
        submitBtn.style.background = '#27ae60';

        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            contactForm.reset();
        }, 3000);

        // In a real implementation, you would send this data to a backend
        console.log('Form data:', data);
    });

    // ============================================
    // PARALLAX EFFECT FOR HERO
    // ============================================
    const heroBg = document.querySelector('.hero-bg');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (heroBg && scrolled < window.innerHeight) {
            heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // ============================================
    // PORTFOLIO HOVER EFFECT ENHANCEMENT
    // ============================================
    document.querySelectorAll('.portfolio-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        item.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });

});
