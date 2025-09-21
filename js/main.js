$(document).ready(function() {
    gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(TextPlugin); 

    // --- LOGIKA NOWEGO MENU ---
    const menuToggle = $(".menu-toggle");
    const navLinksWrapper = $(".nav-links-wrapper");
    const navLinks = $(".nav-links-wrapper li");
    let isMenuOpen = false;
    let isAnimating = false;

    // Funkcja otwierania menu
    function openMenu() {
        if (isAnimating) return;
        isAnimating = true;

        const tl = gsap.timeline({ onComplete: () => { isAnimating = false; isMenuOpen = true; } });
        
        tl.to(menuToggle, { 
            y: 30,
            autoAlpha: 0, 
            duration: 0.4, 
            ease: "power2.in" 
        })
        .set(navLinksWrapper, { visibility: 'visible' })
        .to(navLinks, { 
            y: 0,
            opacity: 1, 
            duration: 0.6,
            ease: "bounce.out",
            stagger: 0.03
        }, "-=0.2");
    }

    // Funkcja zamykania menu (NOWA, DEDYKOWANA ANIMACJA)
function closeMenu() {
    if (isAnimating) return;
    isAnimating = true;

    const tl = gsap.timeline({ onComplete: () => { isAnimating = false; isMenuOpen = false; } });

    // 1. Linki "spadają w dół"
    tl.to(navLinks, {
        y: 80,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        stagger: 0.03
    })
    // KLUCZOWA POPRAWKA: Resetujemy pozycję linków do stanu początkowego
    .set(navLinks, { y: -80 }) 
    
    // 2. Przycisk "MENU" spada z góry z odbiciem
    .fromTo(menuToggle, 
        { y: -80, autoAlpha: 1 },
        { y: 0, ease: "bounce.out", duration: 1 },
        "-=0.1"
    )
    .set(navLinksWrapper, { visibility: 'hidden' });
}
    
    // Główny przełącznik
    function toggleMenu() {
        if (!isMenuOpen) {
            openMenu();
        } else {
            closeMenu();
        }
    }

    menuToggle.on('click', toggleMenu);

    // Zamykanie menu przy scrollowaniu
    $(window).on('scroll', function() {
        if (isMenuOpen) {
            closeMenu();
        }
    });

    // --- Płynne przewijanie dla linków nawigacyjnych ---
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        
        if (isMenuOpen) {
            // Dajemy animacji zamknięcia wystarczająco dużo czasu
            closeMenu(); 
            setTimeout(() => {
                const target = this.hash;
                 if (target) {
                    $('html, body').animate({ scrollTop: $(target).offset().top - 80 }, 800);
                }
            }, 500); // Czekamy 0.5s
        } else {
            const target = this.hash;
            if (target) {
                $('html, body').animate({ scrollTop: $(target).offset().top - 80 }, 800);
            }
        }
    });

    // --- Animacje przy załadowaniu strony (bez zmian) ---
    gsap.from("#hero .hero-headline-static, #hero .hero-headline-dynamic", {
        opacity: 0, y: 50, duration: 1, stagger: 0.2, delay: 0.5, ease: "expo.out"
    });

    // --- Animacje przy przewijaniu strony (bez zmian) ---
    const offerElements = document.querySelectorAll("#oferta .section-header, #oferta .class-item");
    gsap.from(offerElements, {
        scrollTrigger: { trigger: "#oferta", start: "top 80%", toggleActions: "play none none none" },
        opacity: 0, y: 50, duration: 0.8, stagger: 0.1, ease: "power3.out"
    });

        // Animacja dla sekcji Motywacja (nowa wersja)
    gsap.from(".quote-line", {
        scrollTrigger: {
            trigger: "#motywacja",
            start: "top 70%",
            toggleActions: "play none none none",
        },
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        stagger: 0.4, // Opóźnienie dla każdej kolejnej linii
    });

    // --- ANIMACJA SEKCJI HERO ---
    const phrases = [
    "Pewność siebie",
    "Wolność w wodzie",
    "Zdrowie i radość",
    "Relaks i energia",
    "Nowa pasja",
    "Bezpieczeństwo",
    "Przygoda"
];

let currentPhraseIndex = 0;
// Selektor jest poprawny dla Twojej struktury
const dynamicTextElement = document.querySelector('.dynamic-text');

// --- ANIMACJA "DRYFUJĄCEGO" NAPISU "Pływanie to" (NOWA WERSJA) ---
const staticHeadline = document.querySelector(".hero-headline-static");

function randomDrift() {
    gsap.to(staticHeadline, {
        // Losowe wartości dla pozycji i rotacji
        x: gsap.utils.random(-10, 10), // Ruch w poziomie o max 10px
        y: gsap.utils.random(-8, 8),   // Ruch w pionie o max 8px
        rotation: gsap.utils.random(-1.5, 1.5), // Lekki obrót o max 1.5 stopnia

        // Losowy czas trwania dla naturalności
        duration: gsap.utils.random(3, 5), 
        ease: "sine.inOut",
        // Po zakończeniu animacji, uruchom ją od nowa z nowymi losowymi wartościami
        onComplete: randomDrift 
    });
}

// Uruchomienie pierwszej animacji
randomDrift();

// Funkcja do pętli animacji
function animateText() {
    gsap.to(dynamicTextElement, {
        duration: 1.2,
        text: {
            value: phrases[currentPhraseIndex],
            ease: "none"
        },
        onComplete: () => {
            gsap.to(dynamicTextElement, {
                duration: 1.2,
                delay: 2, // Czas, przez jaki fraza jest widoczna
                text: {
                    value: "",
                    ease: "none"
                },
                onComplete: () => {
                    currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
                    animateText(); // Uruchom pętlę od nowa
                }
            });
        }
    });
}

// Uruchamiamy animację na początku, wewnątrz $(document).ready() lub window.onload
if (dynamicTextElement) {
    animateText();
}

    // --- LOGIKA AKORDEONU W SEKCJI OFERTA ---
    $('.accordion-header').on('click', function() {
        const item = $(this).parent('.accordion-item');
        const content = item.find('.accordion-content');

        // Sprawdź, czy kliknięty element jest już aktywny
        const isActive = item.hasClass('active');

        // Zamknij wszystkie otwarte elementy
        $('.accordion-item').removeClass('active');
        $('.accordion-content').slideUp(400);

        // Jeśli kliknięty element NIE był aktywny, otwórz go
        if (!isActive) {
            item.addClass('active');
            // Zmieniamy flexbox dla rozwiniętego kontenera
            content.css('display', 'grid').hide().slideDown(400);
        }
    });

        // Animacja dla sekcji "Startuj z Nami"
    gsap.from("#start .coach-column, #start .info-box", {
        scrollTrigger: {
            trigger: "#start",
            start: "top 80%",
            toggleActions: "play none none none",
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.2
    });

    gsap.from("#cennik .pricing-card", {
        scrollTrigger: {
            trigger: "#cennik",
            start: "top 80%",
            toggleActions: "play none none none",
        },
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.2
    });

        // Animacja dla sekcji Opinie
    gsap.from("#opinie .testimonial-card", {
        scrollTrigger: {
            trigger: "#opinie",
            start: "top 80%",
            toggleActions: "play none none none",
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.2
    });


        // Animacja dla sekcji Kontakt
    gsap.from("#kontakt .contact-form-wrapper, #kontakt .contact-details", {
        scrollTrigger: {
            trigger: "#kontakt",
            start: "top 80%",
            toggleActions: "play none none none",
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.2
    });
});