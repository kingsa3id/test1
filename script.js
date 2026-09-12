// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyD0uoL6QS40S8Am8WYdLoFfxEsQuhqQPLQ",
    authDomain: "photoshop-e8266.firebaseapp.com",
    projectId: "photoshop-e8266",
    storageBucket: "photoshop-e8266.firebasestorage.app",
    messagingSenderId: "703007614918",
    appId: "1:703007614918:web:31241b0b4830ec3681f4c7",
    measurementId: "G-J1XE0B32HN"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Language & Site Translations
const defaultTranslations = {
    fr: {
        langBtn: "العربية",
        navGallery: "Galerie",
        navAbout: "À Propos",
        navContact: "Contact",
        heroTagline: "STUDIO DE PHOTOGRAPHIE HAUT DE GAMME",
        heroTitle: "Saisir Des Moments <br><span class='text-accent'>Intemporels</span>",
        heroDesc: "Photographie d'art pour mariages, portraits de prestige et événements.",
        btnBook: "Réserver une séance",
        btnCall: "Appeler maintenant",
        gallerySub: "PORTFOLIO",
        galleryTitle: "Travaux Récents",
        aboutSub: "À PROPOS DE NOUS",
        aboutTitle: "Capturer L'Émotion Avec Passion & Précision",
        aboutDesc1: "Notre studio s'efforce de capturer la véritable essence de vos moments les plus précieux.",
        aboutDesc2: "Nous combinons une approche artistique raffinée avec des équipements de pointe.",
        badgeYears: "Ans d'expérience",
        feat1: "Matériel Professionnel High-End",
        feat2: "Retouche Artistique Soignée",
        footerCopy: "© 2026 LENS & ART. Tous droits réservés.",
        modalTitle: "Réserver une séance photo",
        modalDesc: "Complétez le formulaire ci-dessous pour réserver votre date.",
        lblNama: "Nom complet",
        lblPhone: "Numéro de téléphone",
        lblType: "Type de séance",
        lblDateTime: "Date et Heure de la séance",
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
        heroDesc: "تصوير احترافي للأعراس، البورتوريه الفاخر، والمناسبات.",
        btnBook: "حجز جلسة تصوير",
        btnCall: "اتصل الآن",
        gallerySub: "معرض الأعمال",
        galleryTitle: "أحدث الأعمال",
        aboutSub: "من نحن",
        aboutTitle: "نلتقط المشاعر بشغف ودقة متناهية",
        aboutDesc1: "نعمل جاهدين لتوثيق الجوهر الحقيقي لأجمل لحظات حياتك.",
        aboutDesc2: "نجمع بين الحس الفني الرفيع وأحدث تقنيات التصوير لنقدم لك جودة استثنائية.",
        badgeYears: "سنوات من الخبرة",
        feat1: "معدات تصوير احترافية عالية الجودة",
        feat2: "معالجة وتعديل فني دقيق للصور",
        footerCopy: "© 2026 LENS & ART. جميع الحقوق محفوظة.",
        modalTitle: "حجز جلسة تصوير جديدة",
        modalDesc: "يرجى ملء النموذج أدناه لتأكيد موعد الجلسة.",
        lblNama: "الاسم الكامل",
        lblPhone: "رقم الهاتف",
        lblType: "نوع الجلسة",
        lblDateTime: "تاريخ ووقت الجلسة",
        btnSubmit: "تأكيد الحجز",
        alertMsg: "شكراً لك! تم استلام طلب الحجز بنجاح."
    }
};

let currentLang = 'fr';
let cachedSessionTypes = [];
let cachedCategories = [];

// Initialize Page
document.addEventListener("DOMContentLoaded", () => {
    applyLanguage(currentLang);
    listenToSessionTypes();
    listenToCategories();

    const langBtn = document.getElementById('langToggle');
    if (langBtn) {
        langBtn.onclick = toggleLanguage;
    }
});

function toggleLanguage() {
    currentLang = currentLang === 'fr' ? 'ar' : 'fr';
    applyLanguage(currentLang);
}
window.toggleLanguage = toggleLanguage;

function applyLanguage(lang) {
    const html = document.documentElement;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    const data = defaultTranslations[lang];
    
    const langBtn = document.getElementById('langToggle');
    if (langBtn) langBtn.innerText = data.langBtn;

    const map = {
        'navGallery': data.navGallery,
        'navAbout': data.navAbout,
        'navContact': data.navContact,
        'heroTagline': data.heroTagline,
        'heroDesc': data.heroDesc,
        'btnBook': data.btnBook,
        'btnCall': data.btnCall,
        'gallerySub': data.gallerySub,
        'galleryTitle': data.galleryTitle,
        'aboutSub': data.aboutSub,
        'aboutTitle': data.aboutTitle,
        'aboutDesc1': data.aboutDesc1,
        'aboutDesc2': data.aboutDesc2,
        'badgeYears': data.badgeYears,
        'feat1': data.feat1,
        'feat2': data.feat2,
        'footerCopy': data.footerCopy,
        'modalTitle': data.modalTitle,
        'modalDesc': data.modalDesc,
        'lblNama': data.lblNama,
        'lblPhone': data.lblPhone,
        'lblType': data.lblType,
        'lblDateTime': data.lblDateTime,
        'btnSubmit': data.btnSubmit
    };

    for (let id in map) {
        const el = document.getElementById(id);
        if (el) el.innerText = map[id];
    }

    const heroTitle = document.getElementById('heroTitle');
    if (heroTitle) heroTitle.innerHTML = data.heroTitle;

    renderSessionOptions();
    renderGallery();
}

// Modal Controls
function openModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) modal.classList.add('active');
}
window.openModal = openModal;

function closeModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) modal.classList.remove('active');
}
window.closeModal = closeModal;

window.onclick = function(event) {
    const modal = document.getElementById('bookingModal');
    if (event.target === modal) closeModal();
};

// Real-Time Listeners
function listenToSessionTypes() {
    db.collection("session_types").onSnapshot((snapshot) => {
        cachedSessionTypes = [];
        snapshot.forEach((doc) => cachedSessionTypes.push(doc.data()));
        renderSessionOptions();
    });
}

function renderSessionOptions() {
    const select = document.getElementById('inputType');
    if (!select) return;

    select.innerHTML = '';
    cachedSessionTypes.forEach(session => {
        const option = document.createElement('option');
        option.value = session.fr;
        option.innerText = currentLang === 'ar' ? session.ar : session.fr;
        select.appendChild(option);
    });
}

function listenToCategories() {
    db.collection("categories").onSnapshot((snapshot) => {
        cachedCategories = [];
        snapshot.forEach((doc) => cachedCategories.push(doc.data()));
        renderGallery();
    });
}

function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;
    grid.innerHTML = '';

    cachedCategories.forEach(item => {
        const catName = currentLang === 'ar' ? item.ar : item.fr;
        grid.innerHTML += `
            <div class="gallery-card">
                <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80" alt="${catName}">
                <div class="card-overlay">
                    <span class="category">${catName}</span>
                    <h3>${catName}</h3>
                </div>
            </div>
        `;
    });
}

// Booking Form
async function handleFormSubmit(event) {
    event.preventDefault();
    const nameInput = document.getElementById('inputName').value.trim();
    const phoneInput = document.getElementById('inputPhone').value.trim();
    const typeSelect = document.getElementById('inputType');
    const dateTimeInput = document.getElementById('inputDateTime').value;

    try {
        await db.collection("bookings").add({
            name: nameInput,
            phone: phoneInput,
            type: typeSelect ? typeSelect.value : "",
            bookedDateTime: dateTimeInput,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        alert(defaultTranslations[currentLang].alertMsg);
        closeModal();
        event.target.reset();
    } catch (error) {
        alert("Erreur: " + error.message);
    }
}
window.handleFormSubmit = handleFormSubmit;
