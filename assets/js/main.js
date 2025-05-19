document.addEventListener('DOMContentLoaded', () => {
    // Animate-on-scroll for cards
    const animatedEls = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    animatedEls.forEach(el => observer.observe(el));

    // Smooth scroll for nav links
    document.querySelectorAll('nav a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const id = this.getAttribute('href').substring(1);
            const target = document.getElementById(id);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - document.querySelector('.header').offsetHeight - 12,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Simple form feedback
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            form.innerHTML = '<div style="padding:2em 0">Thank you! We’ll be in touch soon.</div>';
        });
    }

    // Logo Intro Animation
    const logoIntro = document.getElementById('logo-intro');
    const heroContent = document.getElementById('hero-content');
    const headerLogoImg = document.querySelector('.logo-img');
    if (headerLogoImg) headerLogoImg.style.opacity = "0";
    setTimeout(() => {
        const introImg = logoIntro.querySelector('.intro-logo-img');
        introImg.style.transition = "all 0.7s cubic-bezier(.77,0,.18,1)";
        introImg.style.transform = "scale(0.25)";
        introImg.style.opacity = "0";
        introImg.style.filter = "blur(0px)";
        setTimeout(() => {
            logoIntro.classList.add('hide');
            if (headerLogoImg) headerLogoImg.style.opacity = "1";
            heroContent.classList.add('visible');
        }, 700);
    }, 1200);

    // Nav Underline logic
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));
    const sectionIds = navLinks
        .map(link => link.getAttribute('href'))
        .filter(href => href && href.startsWith('#'))
        .map(href => href.slice(1));
    function updateNavUnderline() {
        // Reference position is 1/4 down the viewport (change 0.25 to 0.5 for true center)
        const refY = window.innerHeight * 0.25 + document.querySelector('.header').offsetHeight;
        let index = -1;
        for (let i = 0; i < sectionIds.length; ++i) {
            const section = document.getElementById(sectionIds[i]);
            if (!section) continue;
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top + window.scrollY;
            const sectionBottom = rect.bottom + window.scrollY;
            const refAbs = window.scrollY + refY;
            // If the reference line is within this section, it's active
            if (refAbs >= sectionTop && refAbs < sectionBottom) {
                index = i;
                break; // Only want first match!
            }
        }
        navLinks.forEach((l, i) => l.classList.toggle('active', i === index));
    }
    setTimeout(updateNavUnderline, 800);
    window.addEventListener('scroll', updateNavUnderline, { passive: true });
    window.addEventListener('resize', updateNavUnderline);
    navLinks.forEach(link => {
        link.addEventListener('click', () => setTimeout(updateNavUnderline, 500));
    });
});