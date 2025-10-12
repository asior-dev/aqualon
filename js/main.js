$(document).ready(function () {
    gsap.registerPlugin(ScrollTrigger, TextPlugin);

    function initMenu() {
        const menuToggle = $(".menu-toggle");
        const navLinksWrapper = $(".nav-links-wrapper");
        const menuOverlay = $(".menu-overlay");
        const body = $("body");
        const mobileBreakpoint = 992;
        let isMenuOpen = false;
        let isAnimating = false; // Zapobiega wielokrotnemu klikaniu

        // --- NOWA, DEDYKOWANA FUNKCJA DO ZAMYKANIA NA DESKTOP ---
        function closeMenuDesktop() {
            if (!isMenuOpen || isAnimating) return; // Nie zamykaj, jeśli już jest zamknięte lub w trakcie animacji
            isAnimating = true;
            isMenuOpen = false;

            const tl = gsap.timeline({ onComplete: () => isAnimating = false });
            tl.to($(".nav-links-wrapper li"), { y: 80, opacity: 0, duration: 0.3, ease: "power2.in", stagger: 0.03 })
                .set($(".nav-links-wrapper li"), { y: -80 })
                .fromTo(menuToggle, { y: -80, autoAlpha: 1 }, { y: 0, ease: "bounce.out", duration: 1 }, "-=0.1")
                .set(navLinksWrapper, { visibility: 'hidden' });
        }

        // Funkcja do zamykania menu na mobile
        function closeMenuMobile() {
            if (!isMenuOpen) return;
            isMenuOpen = false;
            body.removeClass('menu-is-open');
            menuToggle.removeClass('is-open');
            navLinksWrapper.removeClass('is-open');
            menuOverlay.removeClass('is-open');
        }

        // Główny przełącznik
        menuToggle.on('click', function () {
            if ($(window).width() <= mobileBreakpoint) {
                // Logika mobilna
                isMenuOpen = !isMenuOpen;
                body.toggleClass('menu-is-open', isMenuOpen);
                menuToggle.toggleClass('is-open', isMenuOpen);
                navLinksWrapper.toggleClass('is-open', isMenuOpen);
                menuOverlay.toggleClass('is-open', isMenuOpen);
            } else {
                // Logika desktopowa
                if (!isMenuOpen) {
                    if (isAnimating) return;
                    isAnimating = true;
                    isMenuOpen = true;
                    const tl = gsap.timeline({ onComplete: () => isAnimating = false });
                    tl.to(menuToggle, { y: 30, autoAlpha: 0, duration: 0.4, ease: "power2.in" })
                        .set(navLinksWrapper, { visibility: 'visible' })
                        .to($(".nav-links-wrapper li"), { y: 0, opacity: 1, duration: 0.6, ease: "bounce.out", stagger: 0.03 }, "-=0.2");
                } else {
                    closeMenuDesktop(); // Używamy naszej nowej funkcji
                }
            }
        });

        // Zamykanie przy scrollu (POPRAWIONE)
        $(window).on('scroll', function () {
            if ($(window).width() > mobileBreakpoint && isMenuOpen) {
                closeMenuDesktop(); // Używamy naszej nowej funkcji
            }
        });

        // Zamykanie po kliknięciu w link lub nakładkę
        $('.menu-overlay, .nav-links-wrapper a').on('click', function () {
            if ($(window).width() <= mobileBreakpoint) {
                closeMenuMobile();
            }
        });

        // Reset przy zmianie rozmiaru okna
        $(window).on('resize', function () {
            // Resetuje stan i wszystkie style inline
            gsap.set([navLinksWrapper, ".nav-links-wrapper li", menuToggle], { clearProps: "all" });
            closeMenuMobile(); // Używamy prostego zamknięcia, bo GSAP i tak resetuje style
            isMenuOpen = false;
            isAnimating = false;
        });
    }

    initMenu();

    function initSmoothScroll() {
        $('a[href^="#"]').on('click', function (e) {
            const target = this.hash;
            if (target && $(target).length) {
                e.preventDefault();
                const isMenuOpen = $("body").hasClass('menu-is-open');
                const delay = isMenuOpen ? 500 : 0;
                setTimeout(() => {
                    $('html, body').animate({ scrollTop: $(target).offset().top - 80 }, 800);
                }, delay);
            }
        });
    }

    initSmoothScroll();

    function initHeroAnimations() {
        gsap.from("#hero .hero-headline-static, #hero .hero-headline-dynamic", {
            opacity: 0, y: 50, duration: 1, stagger: 0.2, delay: 0.5, ease: "expo.out"
        });

        const phrases = ["Pewność siebie", "Wolność w wodzie", "Zdrowy kręgosłup", "Relaks i energia", "Nowa pasja", "Bezpieczeństwo", "Dobre samopoczucie"];
        let currentPhraseIndex = 0;
        const dynamicTextElement = document.querySelector('.dynamic-text');

        function animateText() {
            if (!dynamicTextElement) return;
            gsap.to(dynamicTextElement, {
                duration: 1.2,
                text: { value: phrases[currentPhraseIndex], ease: "none" },
                onComplete: () => {
                    gsap.to(dynamicTextElement, {
                        duration: 1.2,
                        delay: 2,
                        text: { value: "", ease: "none" },
                        onComplete: () => {
                            currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
                            animateText();
                        }
                    });
                }
            });
        }
        animateText();

        const staticHeadline = document.querySelector(".hero-headline-static");
        function randomDrift() {
            if (!staticHeadline) return;
            gsap.to(staticHeadline, {
                x: gsap.utils.random(-10, 10),
                y: gsap.utils.random(-8, 8),
                rotation: gsap.utils.random(-1.5, 1.5),
                duration: gsap.utils.random(3, 5),
                ease: "sine.inOut",
                onComplete: randomDrift
            });
        }
        randomDrift();
    }

    initHeroAnimations();

    function initScrollAnimations() {
        gsap.from("#oferta .section-header, #oferta .accordion-item", {
            scrollTrigger: { trigger: "#oferta", start: "top 80%", toggleActions: "play none none none" },
            opacity: 0, y: 50, duration: 0.8, stagger: 0.15, ease: "power3.out"
        });

        gsap.from(".motivation-quote", {
            scrollTrigger: { trigger: "#motywacja", start: "top 70%", toggleActions: "play none none none" },
            opacity: 0, y: 40, duration: 1, ease: "power3.out"
        });

        gsap.from("#start .coach-column, #start .info-box", {
            scrollTrigger: { trigger: "#start", start: "top 80%", toggleActions: "play none none none" },
            opacity: 0, y: 50, duration: 0.8, ease: "power3.out", stagger: 0.2
        });

        gsap.from("#cennik .pricing-card-new", {
            scrollTrigger: { trigger: "#cennik", start: "top 80%", toggleActions: "play none none none" },
            opacity: 0, scale: 0.95, duration: 0.8, ease: "power3.out", stagger: 0.2
        });

        gsap.from("#opinie .testimonial-card", {
            scrollTrigger: { trigger: "#opinie", start: "top 80%", toggleActions: "play none none none" },
            opacity: 0, y: 50, duration: 0.8, ease: "power3.out", stagger: 0.2
        });

        gsap.from("#kontakt .contact-details, #kontakt .contact-socials", {
            scrollTrigger: { trigger: "#kontakt", start: "top 80%", toggleActions: "play none none none" },
            opacity: 0, y: 50, duration: 0.8, ease: "power3.out", stagger: 0.2
        });
    }

    initScrollAnimations();

    function initAccordion() {
        $('.accordion-header').on('click', function () {
            const item = $(this).parent('.accordion-item');
            const content = item.find('.accordion-content');
            const isActive = item.hasClass('active');

            $('.accordion-item').removeClass('active');
            $('.accordion-content').slideUp(400);

            if (!isActive) {
                item.addClass('active');
                content.css('display', 'grid').hide().slideDown(400);
            }
        });
    }

    initAccordion();
});