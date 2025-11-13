function loadGoogleFonts() {
    const links = [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Pacifico&display=swap' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;900&display=swap' }
    ];

    links.forEach(linkInfo => {
        const link = document.createElement('link');
        link.rel = linkInfo.rel;
        link.href = linkInfo.href;
        if (linkInfo.crossorigin) {
            link.crossOrigin = linkInfo.crossorigin;
        }
        document.head.appendChild(link);
    });
    console.log('Klaro: Załadowano Google Fonts.');
}

function loadGoogleMaps() {
    const iframe = document.getElementById('google-maps-iframe');
    if (iframe && iframe.dataset.src) {
        iframe.src = iframe.dataset.src;
        console.log('Klaro: Załadowano Google Maps.');
    }
}

const klaroConfig = {
    version: 1,
    elementID: 'klaro',
    styling: {
        theme: 'light',
    },
    
    mustConsent: true, 
    privacyPolicy: '/polityka-prywatnosci.html',
    translations: {
        pl: {
            consentModal: {
                title: "Używamy plików cookies",
                description: "Ta strona korzysta z zasobów zewnętrznych (np. Google Fonts, Google Maps), które mogą zapisywać pliki cookies. Wybierz, na które się zgadzasz.",
            },
            googleFonts: {
                title: "Google Fonts (Czcionki)",
                description: "Umożliwia ładowanie niestandardowych czcionek (Pacifico, Poppins) z serwerów Google.",
            },
            googleMaps: {
                title: "Google Maps (Mapa)",
                description: "Umożliwia wyświetlenie interaktywnej mapy dojazdu do basenu.",
            },
            purposes: {
                functional: "Funkcjonalne",
                necessary: "Niezbędne",
            },
            ok: "OK",
            save: "Zapisz",
            acceptSelected: "Zaakceptuj wybrane",
            acceptAll: "Zaakceptuj wszystkie",
            decline: "Odrzuć",
        },
    },

    services: [
        {
            name: 'googleFonts',
            required: false,
            default: false,
            title: 'googleFonts.title',
            description: 'googleFonts.description',
            purposes: ['functional'],
            onAccept: () => {
                loadGoogleFonts();
            },
        },
        {
            name: 'googleMaps',
            required: false,
            default: false,
            title: 'googleMaps.title',
            description: 'googleMaps.description',
            purposes: ['functional'],
            onAccept: () => {
                loadGoogleMaps();
            },
        },
        {
            name: 'necessary',
            title: 'Niezbędne cookies',
            description: 'Techniczne cookies niezbędne do działania strony (np. zapis tej zgody).',
            required: true,
            purposes: ['necessary'],
        },
    ],
};