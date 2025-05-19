document.addEventListener('DOMContentLoaded', () => {
    // Animate-on-scroll
    const animatedEls = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                observerInstance.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    animatedEls.forEach(el => observer.observe(el));

    // Fix for gradient title - adding the data attribute for pseudo element
    const gradientTitle = document.querySelector('.gradient-title');
    if (gradientTitle) {
        gradientTitle.setAttribute('data-text', gradientTitle.textContent);
    }

    // Smooth scroll
    document.querySelectorAll('nav a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const id = this.getAttribute('href').substring(1);
            const target = document.getElementById(id);
            const header = document.querySelector('.header');
            let headerOffset = 0;
            if (header && window.getComputedStyle(header).position === 'fixed') {
                const isMobileBottomNav = window.innerWidth <= 600 && parseFloat(window.getComputedStyle(header).bottom) === 0;
                if (!isMobileBottomNav) {
                    headerOffset = header.offsetHeight;
                }
            }
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - headerOffset - 20,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form feedback
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            form.innerHTML = "<div style=\"padding:2em 0; text-align:center;\">Thank you! We'll be in touch soon.</div>";
        });
    }

    // Hacking Text Animation (for H1)
    function hackingTextEffect(element, finalTextLines, charCyclesPerLetter = 3, cycleSpeed = 30, lineDelay = 150) {
        return new Promise(async (resolve) => {
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{};':\",./<>?";
            element.classList.add('hacking-active'); // Uses font-weight: 700 from CSS
            element.innerHTML = finalTextLines.map(line => Array(line.length).fill('&nbsp;').join('')).join('<br>');

            for (let lineIndex = 0; lineIndex < finalTextLines.length; lineIndex++) {
                const finalText = finalTextLines[lineIndex];
                let currentLineDisplay = Array(finalText.length).fill('&nbsp;');
                let currentLineFinal = Array(finalText.length).fill(''); // Store final chars for this line

                for (let i = 0; i < finalText.length; i++) {
                    for (let cycle = 0; cycle < charCyclesPerLetter; cycle++) {
                        currentLineDisplay[i] = chars[Math.floor(Math.random() * chars.length)];
                        element.innerHTML = finalTextLines.map((txt, idx) => {
                            if (idx < lineIndex) return finalTextLines[idx]; // Use the stored final version
                            if (idx === lineIndex) return currentLineDisplay.join('');
                            return Array(txt.length).fill('&nbsp;').join('');
                        }).join('<br>');
                        await new Promise(res => setTimeout(res, cycleSpeed));
                    }
                    currentLineDisplay[i] = finalText[i];
                    currentLineFinal[i] = finalText[i]; // Store final char
                    element.innerHTML = finalTextLines.map((txt, idx) => {
                        if (idx < lineIndex) return finalTextLines[idx];
                        if (idx === lineIndex) return currentLineDisplay.join('');
                        return Array(txt.length).fill('&nbsp;').join('');
                    }).join('<br>');
                }
                finalTextLines[lineIndex] = currentLineFinal.join(''); // Store the completed line
                if (lineIndex < finalTextLines.length - 1 && lineDelay > 0) {
                    await new Promise(res => setTimeout(res, lineDelay));
                }
            }
            element.classList.remove('hacking-active');
            element.classList.add('animation-finished'); // H1 remains font-weight: 700 via base CSS
            resolve();
        });
    }

    // FIXED: Logo Intro Animation with better fallback
    const logoIntro = document.getElementById('logo-intro');
    const heroContent = document.getElementById('hero-content');
    const heroH1 = heroContent ? heroContent.querySelector('h1') : null;
    const heroP = heroContent ? heroContent.querySelector('p') : null;
    const headerLogoImg = document.querySelector('.header .logo-img');

    // Ensure the logo in header starts hidden
    if (headerLogoImg) headerLogoImg.style.opacity = "0";

    // Set a max timeout to hide the intro no matter what (failsafe)
    const maxIntroTimeout = setTimeout(() => {
        if (logoIntro) logoIntro.classList.add('hide');
        if (headerLogoImg) headerLogoImg.style.opacity = "1";
        if (heroH1) heroH1.style.opacity = '1';
        if (heroP) heroP.classList.add('fade-in-active');
    }, 5000); // 5 seconds max

    if (logoIntro && heroContent && heroH1 && heroP) {
        // Start with hero elements hidden
        heroH1.style.opacity = '0';

        setTimeout(() => {
            // Logo shrinking animation
            const introImg = logoIntro.querySelector('.intro-logo-img');
            if (introImg) {
                // Fix the transition
                introImg.style.transition = "all 0.7s cubic-bezier(.77,0,.18,1)";
                introImg.style.transform = "scale(0.25)";
                introImg.style.opacity = "0";
                introImg.style.filter = "blur(0px)"; // Re-added this line
            }

            setTimeout(() => {
                // After logo shrinks, hide the intro container
                logoIntro.classList.add('hide');
                clearTimeout(maxIntroTimeout); // Clear failsafe since we're proceeding normally

                // Show header logo and hero content
                if (headerLogoImg) headerLogoImg.style.opacity = "1";
                if (heroContent) heroContent.classList.add('visible');

                // Start the hacking text effect
                const h1OriginalHTML = heroH1.innerHTML;
                const h1Texts = h1OriginalHTML.split('<br>').map(s => s.trim());
                heroH1.style.opacity = '1'; // Make H1 visible for its animation

                hackingTextEffect(heroH1, h1Texts, 3, 30, 150)
                    .then(() => {
                        // Fade in the paragraph after animation completes
                        heroP.classList.add('fade-in-active');
                    })
                    .catch(() => {
                        // Fallback in case of error
                        heroH1.innerHTML = h1OriginalHTML;
                        heroH1.style.opacity = '1';
                        heroP.classList.add('fade-in-active');
                    });

            }, 700); // Matches your original timing
        }, 1200); // Matches your original timing
    } else {
        // Fallback if elements are missing
        if (logoIntro) logoIntro.classList.add('hide');
        if (headerLogoImg) headerLogoImg.style.opacity = "1";
        if (heroContent) heroContent.classList.add('visible');
        if (heroH1) heroH1.style.opacity = '1';
        if (heroP) heroP.classList.add('fade-in-active');

        clearTimeout(maxIntroTimeout); // Clear failsafe since we're proceeding with fallback
    }

    // Nav Underline (same as previous version)
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));
    const sectionIds = navLinks.map(link => link.getAttribute('href')).filter(href => href && href.startsWith('#')).map(href => href.slice(1));
    function updateNavUnderline() {
        const header = document.querySelector('.header');
        let headerHeight = 0;
        let isMobileBottomNav = false;
        if (header && window.getComputedStyle(header).position === 'fixed') {
            isMobileBottomNav = window.innerWidth <= 600 && parseFloat(window.getComputedStyle(header).bottom) === 0;
            if (!isMobileBottomNav) {
                headerHeight = header.offsetHeight;
            }
        }
        const refY = window.innerHeight * (isMobileBottomNav ? 0.75 : 0.25) + headerHeight;
        let index = -1;

        for (let i = 0; i < sectionIds.length; ++i) {
            const section = document.getElementById(sectionIds[i]);
            if (!section) continue;
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top + window.scrollY;
            const sectionBottom = sectionTop + rect.height;
            const scrollRefY = window.scrollY + refY - (isMobileBottomNav ? headerHeight : 0) ;

            if (scrollRefY >= sectionTop && scrollRefY < sectionBottom) {
                index = i;
                break;
            }
        }
        if (index === -1 && (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
            index = sectionIds.indexOf('contact');
            if (index === -1 && sectionIds.length > 0) {
                index = sectionIds.length -1;
            }
        }
        navLinks.forEach((l, i) => l.classList.toggle('active', i === index));
    }
    setTimeout(updateNavUnderline, 800);
    window.addEventListener('scroll', updateNavUnderline, { passive: true });
    window.addEventListener('resize', updateNavUnderline);
    navLinks.forEach(link => { link.addEventListener('click', () => setTimeout(updateNavUnderline, 550)); });

    // Dark Theme Toggle (same as previous version)
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    function applyTheme(theme) {
        body.classList.remove('light-theme', 'dark-theme');
        body.classList.add(theme + '-theme');
        if (themeToggle) themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
    function setTheme(theme) {
        applyTheme(theme);
        try { localStorage.setItem('theme', theme); } catch (e) { console.warn("localStorage not available for theme saving."); }
    }
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            let currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
            setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    }
    prefersDarkScheme.addEventListener('change', (e) => {
        try { if (!localStorage.getItem('theme')) applyTheme(e.matches ? 'dark' : 'light'); }
        catch(e) { applyTheme(e.matches ? 'dark' : 'light'); }
    });
    let initialTheme = prefersDarkScheme.matches ? 'dark' : 'light';
    try { const savedTheme = localStorage.getItem('theme'); if (savedTheme) initialTheme = savedTheme; }
    catch(e) { /* Use OS preference */ }
    applyTheme(initialTheme);

    // Update copyright year
    const footerYear = document.querySelector('.footer-content span');
    if (footerYear) {
        const yearStr = footerYear.textContent;
        const currentYear = new Date().getFullYear();
        if (yearStr.includes('2025')) {
            footerYear.textContent = yearStr.replace('2025', currentYear);
        }
    }
});