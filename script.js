// Firebase Configuration
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

// Site Translations
const defaultTranslations = {
    fr: {
        langBtn: "العربية",
        navGallery: "Galerie",
        navAbout: "À Propos",
        heroTagline: "STUDIO DE PHOTOGRAPHIE HAUT DE GAMME",
        heroTitle: "Saisir Des Moments <br><span class='text-accent'>Intemporels</span>",
        heroDesc: "Photographie d'art pour mariages, portraits de prestige et événements.",
        btnBook: "Réserver une séance",
        btnCall: "Appeler maintenant",
        gallerySub: "PORTFOLIO",
        galleryTitle: "Travaux Récents",
        modalTitle: "Réserver une séance photo",
        modalDesc: "Complétez le formulaire ci-dessous pour réserver votre date.",
        lblNama: "Nom complet",
        lblPhone: "Numéro de téléphone",
        lblType: "Type de séance",
        lblDateTime: "Date et Heure de la séance",
        btnSubmit: "Confirmer la réservation",
        footerCopy: "© 2026 LENS & ART. Tous droits réservés.",
        alertMsg: "Merci! Votre demande de réservation a été envoyée."
    },
    ar: {
        langBtn: "Français",
        navGallery: "معرض الصور",
        navAbout: "من نحن",
        heroTagline: "استوديو تصوير فوتوغرافي فاخر",
        heroTitle: "تخليد أجمـل <br><span class='text-accent'>اللحظات</span>",
        heroDesc: "تصوير احترافي للأعراس، البورتوريه الفاخر، والمناسبات.",
        btnBook: "حجز جلسة تصوير",
        btnCall: "اتصل الآن",
        gallerySub: "معرض الأعمال",
        galleryTitle: "أحدث الأعمال",
        modalTitle: "حجز جلسة تصوير جديدة",
        modalDesc: "يرجى ملء النموذج أدناه لتأكيد موعد الجلسة.",
        lblNama: "الاسم الكامل",
        lblPhone: "رقم الهاتف",
        lblType: "نوع الجلسة",
        lblDateTime: "تاريخ ووقت الجلسة",
        btnSubmit: "تأكيد الحجز",
        footerCopy: "© 2026 LENS & ART. جميع الحقوق محفوظة.",
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
});

// Toggle Language Logic
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
    if (langBtn) {
        const span = langBtn.querySelector('span');
        if (span) span.innerText = data.langBtn;
        else langBtn.innerText = data.langBtn;
    }

    const elementMap = {
        'navGallery': data.navGallery,
        'navAbout': data.navAbout,
        'heroTagline': data.heroTagline,
        'heroDesc': data.heroDesc,
        'btnBook': data.btnBook,
        'btnCall': data.btnCall,
        'gallerySub': data.gallerySub,
        'galleryTitle': data.galleryTitle,
        'modalTitle': data.modalTitle,
        'modalDesc': data.modalDesc,
        'lblNama': data.lblNama,
        'lblPhone': data.lblPhone,
        'lblType': data.lblType,
        'lblDateTime': data.lblDateTime,
        'btnSubmit': data.btnSubmit,
        'footerCopy': data.footerCopy
    };

    for (let id in elementMap) {
        const el = document.getElementById(id);
        if (el) el.innerText = elementMap[id];
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

// Real-time Session Types Listener
function listenToSessionTypes() {
    db.collection("session_types").onSnapshot((snapshot) => {
        cachedSessionTypes = [];
        snapshot.forEach((doc) => {
            cachedSessionTypes.push({ id: doc.id, ...doc.data() });
        });
        renderSessionOptions();
    }, (error) => {
        console.error("Error loading session types:", error);
    });
}

function renderSessionOptions() {
    const select = document.getElementById('inputType');
    if (!select) return;

    select.innerHTML = '';
    
    if (cachedSessionTypes.length === 0) {
        const defaultOpt = document.createElement('option');
        defaultOpt.value = "";
        defaultOpt.innerText = currentLang === 'ar' ? "لا توجد خيارات متاحة" : "Aucun type disponible";
        select.appendChild(defaultOpt);
        return;
    }

    cachedSessionTypes.forEach(session => {
        const option = document.createElement('option');
        // Store French name as value, display language dynamically
        option.value = session.fr || session.name || "";
        option.innerText = (currentLang === 'ar' ? session.ar : session.fr) || session.name || "";
        select.appendChild(option);
    });
}

// Real-time Categories Listener
function listenToCategories() {
    db.collection("categories").onSnapshot((snapshot) => {
        cachedCategories = [];
        snapshot.forEach((doc) => {
            cachedCategories.push({ id: doc.id, ...doc.data() });
        });
        renderGallery();
    }, (error) => {
        console.error("Error loading categories:", error);
    });
}

function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;
    grid.innerHTML = '';

    cachedCategories.forEach(item => {
        const catName = (currentLang === 'ar' ? item.ar : item.fr) || item.name || "";
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

// Booking Form Submit
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
