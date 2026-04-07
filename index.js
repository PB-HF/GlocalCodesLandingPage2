    // Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // 1. Remove initial hidden classes if any JS fallback was needed 
    // (We use CSS animations primarily, but this ensures a clean state)
    const header = document.querySelector('.header');
    const hero = document.querySelector('.hero');
    
    if (header) header.classList.remove('hidden');
    if (hero) hero.classList.remove('hidden');

    // 2. Premium Parallax Effect on Background Blobs
    const blobs = document.querySelectorAll('.blob');
    
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        blobs.forEach((blob, index) => {
            // Different moving speed factor for each blob based on index
            const speed = (index + 1) * 15;
            
            // Calculate movement
            const moveX = (x - 0.5) * speed;
            const moveY = (y - 0.5) * speed;
            
            // Apply slight translation based on mouse, combining with the CSS animation float
            // We use transform in JS. To not override the CSS animation `transform: translateY()`, 
            // we should ideally use margin or a wrapper. 
            // Instead of inline transform, let's adjust margin for safety, or translate via `left/top` subtly
            blob.style.transform = `translate(${moveX}px, ${moveY}px)`;
            
            // Note: because the CSS animation uses transform, setting transform here WILL override it.
            // Let's use custom properties instead to blend them, or just let CSS do the floating, 
            // and maybe just tweak left/top slightly.
            // Let's do left/top just a bit to keep the CSS float intact.
        });
    });
    
    // Better Parallax: using CSS variables so we don't break the CSS float animation
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 40; // max 20px move
        const y = (e.clientY / window.innerHeight - 0.5) * 40;
        
    // Let's just apply it to the main container wrapper or individual blobs
        document.documentElement.style.setProperty('--mouse-x', `${x}px`);
        document.documentElement.style.setProperty('--mouse-y', `${y}px`);
    });

    // 3. Scroll Reveal Animations via Intersection Observer
    const revealElements = document.querySelectorAll('.reveal');
    
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Slight delay for a more native feel, or immediate trigger
                    entry.target.classList.add('is-visible');
                    // Stop observing once animated so it doesn't replay on scroll up
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0.15 // Trigger when 15% visible
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // 4. Custom scroll logic to perfectly center the savings form in the viewport
    const calcSavingsBtn = document.getElementById('calc-savings-btn');
    if (calcSavingsBtn) {
        calcSavingsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const savingsLayout = document.querySelector('.savings-layout');
            if (savingsLayout) {
                savingsLayout.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
        });
    }

    // 5. Custom scroll logic for the audit form
    const auditBtn = document.getElementById('audit-btn');
    if (auditBtn) {
        auditBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const auditLayout = document.querySelector('.audit-section .savings-layout');
            if (auditLayout) {
                auditLayout.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
        });
    }

    // 6. EmailJS Integration for Savings Form
    if (typeof emailjs !== 'undefined') {
        emailjs.init("QpkBmnT4LJ4PGyWTX");
    }

    const submitSavingsBtn = document.getElementById('submit-savings');
    const savingsMessage = document.getElementById('savings-message');

    if (submitSavingsBtn && savingsMessage) {
        submitSavingsBtn.addEventListener('click', function(e) {
            e.preventDefault();

            if (typeof emailjs === 'undefined') {
                savingsMessage.textContent = 'Email service is currently unavailable.';
                savingsMessage.style.color = '#dc3545';
                savingsMessage.style.display = 'block';
                return;
            }

            const originalText = submitSavingsBtn.innerHTML;
            submitSavingsBtn.innerHTML = 'Sending...';
            submitSavingsBtn.style.pointerEvents = 'none';
            savingsMessage.style.display = 'none';

            const templateParams = {
                developer_count: document.getElementById('developer_count').value,
                specialisation: document.getElementById('specialisation').value,
                contract_length: document.getElementById('contract_length').value,
                hourly_rate: document.getElementById('hourly_rate').value,
                time: new Date().toLocaleString()
            };

            emailjs.send("service_5ukbpwr", "template_zu2emen", templateParams)
                .then(function() {
                    submitSavingsBtn.innerHTML = 'Request Sent!';
                    // Keep pointer events none to prevent double submission
                    savingsMessage.textContent = 'We have received your details! We will be in touch shortly.';
                    savingsMessage.style.color = '#28a745';
                    savingsMessage.style.display = 'block';
                }, function(error) {
                    submitSavingsBtn.innerHTML = originalText;
                    submitSavingsBtn.style.pointerEvents = 'auto';
                    savingsMessage.textContent = 'Oops! Failed to send your request. Please try again.';
                    savingsMessage.style.color = '#dc3545';
                    savingsMessage.style.display = 'block';
                    console.error('EmailJS Error:', error);
                });
        });
    }

    // 7. EmailJS Integration for Audit Form
    const auditForm = document.getElementById('audit-form');
    const submitAuditBtn = document.getElementById('submit-audit');
    const auditMessage = document.getElementById('audit-message');

    if (auditForm && submitAuditBtn && auditMessage) {
        auditForm.addEventListener('submit', function(e) {
            e.preventDefault();

            if (typeof emailjs === 'undefined') {
                auditMessage.textContent = 'Email service is currently unavailable.';
                auditMessage.style.color = '#dc3545';
                auditMessage.style.display = 'block';
                return;
            }

            const originalText = submitAuditBtn.innerHTML;
            submitAuditBtn.innerHTML = 'Sending...';
            submitAuditBtn.style.pointerEvents = 'none';
            auditMessage.style.display = 'none';

            const templateParams = {
                full_name: document.getElementById('audit_full_name').value,
                email: document.getElementById('audit_email').value,
                company: document.getElementById('audit_company').value,
                dev_spend: document.getElementById('audit_dev_spend').value,
                time: new Date().toLocaleString()
            };

            emailjs.send("service_5ukbpwr", "template_7dnybps", templateParams)
                .then(function() {
                    submitAuditBtn.innerHTML = 'Report Requested!';
                    auditMessage.textContent = 'Awesome! We have received your request and will send the report shortly.';
                    auditMessage.style.color = '#28a745';
                    auditMessage.style.display = 'block';
                }, function(error) {
                    submitAuditBtn.innerHTML = originalText;
                    submitAuditBtn.style.pointerEvents = 'auto';
                    auditMessage.textContent = 'Oops! Failed to send your request. Please try again.';
                    auditMessage.style.color = '#dc3545';
                    auditMessage.style.display = 'block';
                    console.error('EmailJS Error:', error);
                });
        });
    }
});
