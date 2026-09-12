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
        lblDateTime: "تاريخ ووقت الجلسة",
        btnSubmit: "تأكيد الحجز",
        alertMsg: "شكراً لك! تم استلام طلب الحجز بنجاح."
    }
};

let translations = JSON.parse(localStorage.getItem('site_translations')) || defaultTranslations;
let currentLang = 'fr';
let cachedSessionTypes = [];
let cachedCategories = [];

// Initialize Page
document.addEventListener("DOMContentLoaded", () => {
    applyLanguage(currentLang);
    listenToSessionTypes();
    listenToCategories();
});

// Dynamic Language Switching
function applyLanguage(lang) {
    const html = document.documentElement;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    const data = translations[lang];
    if (document.getElementById('langToggle')) document.getElementById('langToggle').querySelector('span').innerText = data.langBtn;
    if (document.getElementById('navGallery')) document.getElementById('navGallery').innerText = data.navGallery;
    if (document.getElementById('navAbout')) document.getElementById('navAbout').innerText = data.navAbout;
    if (document.getElementById('navContact')) document.getElementById('navContact').innerText = data.navContact;
    if (document.getElementById('heroTagline')) document.getElementById('heroTagline').innerText = data.heroTagline;
    if (document.getElementById('heroTitle')) document.getElementById('heroTitle').innerHTML = data.heroTitle;
    if (document.getElementById('heroDesc')) document.getElementById('heroDesc').innerText = data.heroDesc;
    if (document.getElementById('btnBook')) document.getElementById('btnBook').innerText = data.btnBook;
    if (document.getElementById('btnCall')) document.getElementById('btnCall').innerText = data.btnCall;
    if (document.getElementById('gallerySub')) document.getElementById('gallerySub').innerText = data.gallerySub;
    if (document.getElementById('galleryTitle')) document.getElementById('galleryTitle').innerText = data.galleryTitle;
    if (document.getElementById('aboutSub')) document.getElementById('aboutSub').innerText = data.aboutSub;
    if (document.getElementById('aboutTitle')) document.getElementById('aboutTitle').innerText = data.aboutTitle;
    if (document.getElementById('aboutDesc1')) document.getElementById('aboutDesc1').innerText = data.aboutDesc1;
    if (document.getElementById('aboutDesc2')) document.getElementById('aboutDesc2').innerText = data.aboutDesc2;
    if (document.getElementById('badgeYears')) document.getElementById('badgeYears').innerText = data.badgeYears;
    if (document.getElementById('feat1')) document.getElementById('feat1').innerText = data.feat1;
    if (document.getElementById('feat2')) document.getElementById('feat2').innerText = data.feat2;
    if (document.getElementById('footerCopy')) document.getElementById('footerCopy').innerText = data.footerCopy;
    if (document.getElementById('modalTitle')) document.getElementById('modalTitle').innerText = data.modalTitle;
    if (document.getElementById('modalDesc')) document.getElementById('modalDesc').innerText = data.modalDesc;
    if (document.getElementById('lblNama')) document.getElementById('lblNama').innerText = data.lblNama;
    if (document.getElementById('lblPhone')) document.getElementById('lblPhone').innerText = data.lblPhone;
    if (document.getElementById('lblType')) document.getElementById('lblType').innerText = data.lblType;
    if (document.getElementById('lblDateTime')) document.getElementById('lblDateTime').innerText = data.lblDateTime;
    if (document.getElementById('btnSubmit')) document.getElementById('btnSubmit').innerText = data.btnSubmit;

    renderSessionOptions();
    renderGallery();
}

function toggleLanguage() {
    currentLang = currentLang === 'fr' ? 'ar' : 'fr';
    applyLanguage(currentLang);
}

// Modal Controls
function openModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) modal.classList.remove('active');
}

window.onclick = function(event) {
    const modal = document.getElementById('bookingModal');
    if (event.target === modal) closeModal();
};

// Real-Time Session Types Listener
function listenToSessionTypes() {
    db.collection("session_types").onSnapshot((snapshot) => {
        cachedSessionTypes = [];
        snapshot.forEach((doc) => {
            cachedSessionTypes.push(doc.data());
        });
        renderSessionOptions();
    }, (error) => {
        console.error("Session types sync error:", error);
    });
}

function renderSessionOptions() {
    const select = document.getElementById('inputType');
    if (!select) return;

    const currentSelection = select.value;
    select.innerHTML = '';

    if (cachedSessionTypes.length === 0) {
        select.innerHTML = `
            <option value="Photographie de mariage">${currentLang === 'ar' ? 'تصوير أعراس' : 'Photographie de mariage'}</option>
            <option value="Séance Portrait">${currentLang === 'ar' ? 'جلسة بورتوريه' : 'Séance Portrait'}</option>
            <option value="Couverture d'événement">${currentLang === 'ar' ? 'تغطية مناسبات' : 'Couverture d\'événement'}</option>
        `;
        return;
    }

    cachedSessionTypes.forEach(session => {
        const option = document.createElement('option');
        option.value = session.fr;
        option.innerText = currentLang === 'ar' ? session.ar : session.fr;
        select.appendChild(option);
    });

    if (currentSelection) select.value = currentSelection;
}

// Real-Time Categories Listener
function listenToCategories() {
    db.collection("categories").onSnapshot((snapshot) => {
        cachedCategories = [];
        snapshot.forEach((doc) => {
            cachedCategories.push(doc.data());
        });
        renderGallery();
    }, (error) => {
        console.error("Categories sync error:", error);
    });
}

// Gallery & Categories Renderer
function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const displayList = cachedCategories.length > 0 
        ? cachedCategories.map(c => ({
            img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
            catFr: c.fr,
            catAr: c.ar,
            title: c.fr
        }))
        : [
            { img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80", catFr: "Mariage", catAr: "أعراس", title: "Elegance in White" },
            { img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80", catFr: "Portrait", catAr: "بورتوريه", title: "Studio Series" },
            { img: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80", catFr: "Événement", catAr: "مناسبات", title: "Gala Evening" }
        ];

    displayList.forEach(item => {
        const cat = currentLang === 'ar' ? item.catAr : item.catFr;
        grid.innerHTML += `
            <div class="gallery-card">
                <img src="${item.img}" alt="${item.title}">
                <div class="card-overlay">
                    <span class="category">${cat}</span>
                    <h3>${item.title}</h3>
                </div>
            </div>
        `;
    });
}

// Booking Form Submission
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const submitBtn = document.getElementById('btnSubmit');
    const nameInput = document.getElementById('inputName').value.trim();
    const phoneInput = document.getElementById('inputPhone').value.trim();
    const typeSelect = document.getElementById('inputType');
    const typeInput = typeSelect ? typeSelect.value : "";
    const dateTimeInput = document.getElementById('inputDateTime').value;

    if (nameInput.length < 3) {
        alert(currentLang === 'fr' ? "Veuillez entrer un nom valide." : "الرجاء إدخال اسم صحيح.");
        return;
    }

    const phoneRegex = /^[0-9+\s-]{9,15}$/;
    if (!phoneRegex.test(phoneInput)) {
        alert(currentLang === 'fr' ? "Veuillez entrer un numéro de téléphone valide." : "الرجاء إدخال رقم هاتف صحيح.");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerText = currentLang === 'fr' ? "Vérification..." : "جاري التحقق...";

    try {
        const snapshot = await db.collection("bookings")
            .where("bookedDateTime", "==", dateTimeInput)
            .get();

        if (!snapshot.empty) {
            alert(currentLang === 'fr' 
                ? "Ce créneau est déjà réservé. Veuillez choisir une autre date/heure." 
                : "هذا الموعد محجوز مسبقاً. الرجاء اختيار وقت آخر.");
            submitBtn.disabled = false;
            submitBtn.innerText = translations[currentLang].btnSubmit;
            return;
        }

        await db.collection("bookings").add({
            name: nameInput,
            phone: phoneInput,
            type: typeInput,
            bookedDateTime: dateTimeInput,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        alert(translations[currentLang].alertMsg);
        closeModal();
        event.target.reset();
    } catch (error) {
        console.error("Booking Error:", error);
        alert(currentLang === 'fr' 
            ? "Une erreur est survenue lors de l'enregistrement. Veuillez réessayer." 
            : "حدث خطأ أثناء الحفظ. يرجى المحاولة مرة أخرى.");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = translations[currentLang].btnSubmit;
    }
}
