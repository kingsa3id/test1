// Default Translation Keys
const defaultTranslations = {
    fr: {
        langBtn: "العربية",
        navGallery: "Galerie",
        navAbout: "À Propos",
        navContact: "Contact",
        heroTagline: "STUDIO DE PHOTOGRAPHIE HAUT DE GAMME",
        heroTitle: "Saisir Des Moments <br><span class='text-accent'>Intemporels</span>",
        heroDesc: "Photographie d'art pour mariages, portraits de prestige et événements. Vos souvenirs immortalisés avec élégance.",
        btnBook: "Réserver une séance",
        btnCall: "Appeler maintenant",
        gallerySub: "PORTFOLIO",
        galleryTitle: "Travaux Récents",
        aboutSub: "À PROPOS DE NOUS",
        aboutTitle: "Capturer L'Émotion Avec Passion & Précision",
        aboutDesc1: "Fondé sur une passion pour l'art visuel et le storytelling, notre studio s'efforce de capturer la véritable essence de vos moments les plus précieux. Nous croyons que chaque photographie doit raconter une histoire intemporelle.",
        aboutDesc2: "Que ce soit pour votre mariage, un portrait professionnel ou un événement d'exception, nous combinons une approche artistique raffinée avec des équipements de pointe pour vous offrir une qualité irréprochable.",
        badgeYears: "Ans d'expérience",
        feat1: "Matériel Professionnel High-End",
        feat2: "Retouche Artistique Soignée",
        footerCopy: "© 2026 LENS & ART. Tous droits réservés.",
        modalTitle: "Réserver une séance photo",
        modalDesc: "Complétez le formulaire ci-dessous pour réserver votre date.",
        lblNama: "Nom complet",
        lblPhone: "Numéro de téléphone",
        lblType: "Type de séance",
        optWedding: "Photographie de mariage",
        optPortrait: "Séance Portrait",
        optEvent: "Couverture d'événement",
        btnSubmit: "Confirmer la réservation",
        alertMsg: "Merci! Votre demande de réservation a été envoyée."
    },
    ar: {
        langBtn: "Français",
        navGallery: "معرض الصور",
        navAbout: "من نحن",
        navContact: "اتصل بنا",
        heroTagline: "استوديو تصوير فوتوغرافي فاخر",
        heroTitle: "تخليد أجمـل <br><span class='text-accent'>اللحظات</span>",
        heroDesc: "تصوير احترافي للأعراس، البورتوريه الفاخر، والمناسبات. دعنا نجعل ذكرياتك تدوم للابد.",
        btnBook: "حجز جلسة تصوير",
        btnCall: "اتصل الآن",
        gallerySub: "معرض الأعمال",
        galleryTitle: "أحدث الأعمال",
        aboutSub: "من نحن",
        aboutTitle: "نلتقط المشاعر بشغف ودقة متناهية",
        aboutDesc1: "تأسس استوديونا على شغف أصيل بالفن البصري وسرد القصص المصورة، ونعمل جاهدين لتوثيق الجوهر الحقيقي لأجمل لحظات حياتك. نؤمن بأن كل صورة يجب أن تحكي قصة خالدة لا تُنسى.",
        aboutDesc2: "سواء كان ذلك لحفل زفافك، جلسة بورتوريه شخصية، أو تغطية مناسبة خاصة، فنحن نجمع بين الحس الفني الرفيع وأحدث تقنيات التصوير لنقدم لك جودة استثنائية.",
        badgeYears: "سنوات من الخبرة",
        feat1: "معدات تصوير احترافية عالية الجودة",
        feat2: "معالجة وتعديل فني دقيق للصور",
        footerCopy: "© 2026 LENS & ART. جميع الحقوق محفوظة.",
        modalTitle: "حجز جلسة تصوير جديدة",
        modalDesc: "يرجى ملء النموذج أدناه لتأكيد موعد الجلسة.",
        lblNama: "الاسم الكامل",
        lblPhone: "رقم الهاتف",
        lblType: "نوع الجلسة",
        optWedding: "تصوير أعراس",
        optPortrait: "جلسة بورتوريه",
        optEvent: "تغطية مناسبات",
        btnSubmit: "تأكيد الحجز",
        alertMsg: "شكراً لك! تم استلام طلب الحجز بنجاح."
    }
};

// Default Gallery Items
const defaultGallery = [
    {
        img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
        catFr: "Mariage",
        catAr: "أعراس",
        title: "Elegance in White"
    },
    {
        img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
        catFr: "Portrait",
        catAr: "بورتوريه",
        title: "Studio Series"
    },
    {
        img: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80",
        catFr: "Événement",
        catAr: "مناسبات",
        title: "Gala Evening"
    }
];

// Load Custom Admin Edits if available
let translations = JSON.parse(localStorage.getItem('site_translations')) || defaultTranslations;
let galleryItems = JSON.parse(localStorage.getItem('site_gallery')) || defaultGallery;

let currentLang = 'fr';

document.addEventListener("DOMContentLoaded", () => {
    renderGallery();
    applyLanguage(currentLang);
});

function applyLanguage(lang) {
    const html = document.documentElement;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    const data = translations[lang];
    
    document.getElementById('langToggle').querySelector('span').innerText = data.langBtn;
    document.getElementById('navGallery').innerText = data.navGallery;
    document.getElementById('navAbout').innerText = data.navAbout;
    document.getElementById('navContact').innerText = data.navContact;
    document.getElementById('heroTagline').innerText = data.heroTagline;
    document.getElementById('heroTitle').innerHTML = data.heroTitle;
    document.getElementById('heroDesc').innerText = data.heroDesc;
    document.getElementById('btnBook').innerText = data.btnBook;
    document.getElementById('btnCall').innerText = data.btnCall;
    document.getElementById('gallerySub').innerText = data.gallerySub;
    document.getElementById('galleryTitle').innerText = data.galleryTitle;
    
    document.getElementById('aboutSub').innerText = data.aboutSub;
    document.getElementById('aboutTitle').innerText = data.aboutTitle;
    document.getElementById('aboutDesc1').innerText = data.aboutDesc1;
    document.getElementById('aboutDesc2').innerText = data.aboutDesc2;
    document.getElementById('badgeYears').innerText = data.badgeYears;
    document.getElementById('feat1').innerText = data.feat1;
    document.getElementById('feat2').innerText = data.feat2;
    document.getElementById('footerCopy').innerText = data.footerCopy;

    document.getElementById('modalTitle').innerText = data.modalTitle;
    document.getElementById('modalDesc').innerText = data.modalDesc;
    document.getElementById('lblNama').innerText = data.lblNama;
    document.getElementById('lblPhone').innerText = data.lblPhone;
    document.getElementById('lblType').innerText = data.lblType;
    document.getElementById('optWedding').innerText = data.optWedding;
    document.getElementById('optPortrait').innerText = data.optPortrait;
    document.getElementById('optEvent').innerText = data.optEvent;
    document.getElementById('btnSubmit').innerText = data.btnSubmit;

    renderGallery();
}

function toggleLanguage() {
    currentLang = currentLang === 'fr' ? 'ar' : 'fr';
    applyLanguage(currentLang);
}

function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;
    grid.innerHTML = '';

    galleryItems.forEach(item => {
        const cat = currentLang === 'ar' ? item.catAr : item.catFr;
        const cardHtml = `
            <div class="gallery-card">
                <img src="${item.img}" alt="${item.title}">
                <div class="card-overlay">
                    <span class="category">${cat}</span>
                    <h3>${item.title}</h3>
                </div>
            </div>
        `;
        grid.innerHTML += cardHtml;
    });
}

// Modal logic
const modal = document.getElementById('bookingModal');
function openModal() { modal.classList.add('active'); }
function closeModal() { modal.classList.remove('active'); }

window.onclick = function(event) {
    if (event.target === modal) closeModal();
};

// Form submission handler -> Saves lead into LocalStorage for Admin view!
function handleFormSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('inputName').value;
    const phone = document.getElementById('inputPhone').value;
    const type = document.getElementById('inputType').value;

    const newBooking = {
        name,
        phone,
        type,
        date: new Date().toLocaleDateString('fr-FR')
    };

    let existingBookings = JSON.parse(localStorage.getItem('site_bookings')) || [];
    existingBookings.push(newBooking);
    localStorage.setItem('site_bookings', JSON.stringify(existingBookings));

    alert(translations[currentLang].alertMsg);
    closeModal();
}