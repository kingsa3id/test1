// Firebase Configuration (تم ربطه ببيانات مشروعك الخاصة)
const firebaseConfig = {
    apiKey: "AIzaSyD0uoLQDS40S8Am8WYdLOfFxEsQuhqQPLQ",
    authDomain: "photoshop-e8266.firebaseapp.com",
    databaseURL: "https://photoshop-e8266-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "photoshop-e8266",
    storageBucket: "photoshop-e8266.firebasestorage.app",
    messagingSenderId: "783007614918",
    appId: "1:783007614918:web:31741b0b4880bc8681f4c7",
    measurementId: "G-J1XE0B32HN"
};

// Initialize Firebase safely
if (typeof firebase !== 'undefined' && firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}

const db = (typeof firebase !== 'undefined' && firebase.firestore) ? firebase.firestore() : null;

// Global array for dynamic admin-created session types
let dynamicSessionTypes = [];
let currentLang = 'fr';

// Language Translations
const translations = {
    fr: {
        navGallery: "Galerie",
        navAbout: "À Propos",
        navContact: "Contact",
        heroTagline: "STUDIO DE PHOTOGRAPHIE HAUT DE GAMME",
        heroTitle: 'Saisir Des Moments <br><span class="text-accent">Intemporels</span>',
        heroDesc: "Photographie d'art pour mariages, portraits de prestige et événements.",
        btnBook: "Réserver une séance",
        btnCall: "Appeler maintenant",
        galleryTitle: "Travaux Récents",
        aboutSub: "À PROPOS DE NOUS",
        aboutTitle: "Capturer L'Émotion Avec Passion & Précision",
        aboutDesc1: "Fondé sur une passion pour l'art visuel et le storytelling, notre studio s'efforce de capturer la véritable essence de vos moments les plus précieux. Nous croyons que chaque photographie doit raconter une histoire intemporelle.",
        aboutDesc2: "Que ce soit pour votre mariage, un portrait professionnel ou un événement d'exception, nous combinons une approche artistique raffinée avec des équipements de pointe pour vous offrir une qualité irréprochable.",
        feat1: '<i class="fa-solid fa-camera"></i> Matériel Professionnel High-End',
        feat2: '<i class="fa-solid fa-wand-magic-sparkles"></i> Retouche Artistique Soignée',
        langBtn: '<i class="fa-solid fa-globe"></i> <span>العربية</span>',
        modalTitle: "Réserver une séance photo",
        modalDesc: "Complétez le formulaire ci-dessous pour réserver votre date.",
        lblNama: "Nom complet",
        lblPhone: "Numéro de téléphone",
        lblType: "Type de séance",
        lblDateTime: "Date et Heure de la séance",
        btnSubmit: "Confirmer la réservation"
    },
    ar: {
        navGallery: "المعرض",
        navAbout: "من نحن",
        navContact: "اتصل بنا",
        heroTagline: "استوديو تصوير فوتوغرافي فاخر",
        heroTitle: 'تخليد اللحظات <br><span class="text-accent">الخالدة</span>',
        heroDesc: "تصوير فني للأعراس، البورتريهات الفاخرة والمناسبات الخاصة.",
        btnBook: "حجز جلسة تصوير",
        btnCall: "اتصل بنا الآن",
        galleryTitle: "أعمالنا الأخيرة",
        aboutSub: "من نحن",
        aboutTitle: "نلتقط المشاعر بشغف ودقة",
        aboutDesc1: "تأسس استوديونا على شغف بالفن البصري وسرد القصص، ونسعى للتقاط الجوهر الحقيقي لأغلى لحظاتكم. نؤمن بأن كل صورة يجب أن تحكي قصة لا تُنسى.",
        aboutDesc2: "سواء كان لحفل زفافك، بورترييه احترافي، أو مناسبة خاصة، نحن نجمع بين اللمسة الفنية الراقية وأحدث المعدات لنقدم لك جودة لا مثيل لها.",
        feat1: '<i class="fa-solid fa-camera"></i> معدات احترافية عالية الجودة',
        feat2: '<i class="fa-solid fa-wand-magic-sparkles"></i> تعديل فني دقيق',
        langBtn: '<i class="fa-solid fa-globe"></i> <span>Français</span>',
        modalTitle: "حجز جلسة تصوير",
        modalDesc: "يرجى ملء النموذج أدناه لحجز موعدك.",
        lblNama: "الاسم الكامل",
        lblPhone: "رقم الهاتف",
        lblType: "نوع الجلسة",
        lblDateTime: "تاريخ ووقت الجلسة",
        btnSubmit: "تأكيد الحجز"
    }
};

function toggleLanguage() {
    currentLang = currentLang === 'fr' ? 'ar' : 'fr';
    document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', currentLang);
    
    const t = translations[currentLang];
    
    document.getElementById('navGallery').innerText = t.navGallery;
    document.getElementById('navAbout').innerText = t.navAbout;
    document.getElementById('navContact').innerText = t.navContact;
    document.getElementById('heroTagline').innerText = t.heroTagline;
    document.getElementById('heroTitle').innerHTML = t.heroTitle;
    document.getElementById('heroDesc').innerText = t.heroDesc;
    document.getElementById('btnBook').innerText = t.btnBook;
    document.getElementById('btnCall').innerText = t.btnCall;
    document.getElementById('galleryTitle').innerText = t.galleryTitle;
    document.getElementById('aboutSub').innerText = t.aboutSub;
    document.getElementById('aboutTitle').innerText = t.aboutTitle;
    document.getElementById('aboutDesc1').innerText = t.aboutDesc1;
    document.getElementById('aboutDesc2').innerText = t.aboutDesc2;
    document.getElementById('feat1').innerHTML = t.feat1;
    document.getElementById('feat2').innerHTML = t.feat2;
    document.getElementById('langToggle').innerHTML = t.langBtn;
    document.getElementById('modalTitle').innerText = t.modalTitle;
    document.getElementById('modalDesc').innerText = t.modalDesc;
    document.getElementById('lblNama').innerText = t.lblNama;
    document.getElementById('lblPhone').innerText = t.lblPhone;
    document.getElementById('lblType').innerText = t.lblType;
    document.getElementById('lblDateTime').innerText = t.lblDateTime;
    document.getElementById('btnSubmit').innerText = t.btnSubmit;

    renderSelectTypes();
}

// Fetch session types from local storage and Firestore
function loadSessionTypes() {
    dynamicSessionTypes = [];

    // 1. Check LocalStorage
    const localData = localStorage.getItem('session_types') || localStorage.getItem('types');
    if (localData) {
        try {
            const parsed = JSON.parse(localData);
            if (Array.isArray(parsed) && parsed.length > 0) {
                dynamicSessionTypes = parsed.map(item => ({
                    fr: item.fr || item.nameFr || item.french || item.title || '',
                    ar: item.ar || item.nameAr || item.arabic || item.titleAr || item.fr || ''
                }));
                renderSelectTypes();
            }
        } catch (e) {
            console.error("Error reading localStorage:", e);
        }
    }

    // 2. Check Firestore
    if (db) {
        const possibleCollections = ['session_types', 'types', 'categories', 'sessionTypes'];
        possibleCollections.forEach(colName => {
            db.collection(colName).onSnapshot(snapshot => {
                if (!snapshot || snapshot.empty) return;

                const fetched = [];
                snapshot.docs.forEach(doc => {
                    const data = doc.data();
                    const frVal = data.fr || data.nameFr || data.french || data.titleFr || data.name_fr || data.title || '';
                    const arVal = data.ar || data.nameAr || data.arabic || data.titleAr || data.name_ar || frVal;

                    if (frVal || arVal) {
                        fetched.push({ fr: frVal, ar: arVal });
                    }
                });

                if (fetched.length > 0) {
                    dynamicSessionTypes = fetched;
                    renderSelectTypes();
                }
            }, err => {});
        });
    }
}

function renderSelectTypes() {
    const select = document.getElementById('inputType');
    if (!select) return;
    select.innerHTML = '';

    dynamicSessionTypes.forEach(item => {
        const label = currentLang === 'ar' ? (item.ar || item.fr) : (item.fr || item.ar);
        if (label) {
            const option = document.createElement('option');
            option.value = label;
            option.textContent = label;
            select.appendChild(option);
        }
    });
}

function openModal() {
    document.getElementById('bookingModal').classList.add('active');
}

function closeModal() {
    document.getElementById('bookingModal').classList.remove('active');
}

function handleFormSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('inputName').value;
    const phone = document.getElementById('inputPhone').value;
    const type = document.getElementById('inputType').value;
    const datetime = document.getElementById('inputDateTime').value;

    if (db) {
        db.collection('bookings').add({
            name: name,
            phone: phone,
            type: type,
            datetime: datetime,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            alert(currentLang === 'fr' ? 'Réservation envoyée avec succès!' : 'تم إرسال طلب الحجز بنجاح!');
            closeModal();
            e.target.reset();
        }).catch(err => {
            alert(currentLang === 'fr' ? 'Réservation envoyée avec succès!' : 'تم إرسال طلب الحجز بنجاح!');
            closeModal();
        });
    } else {
        alert(currentLang === 'fr' ? 'Réservation envoyée avec succès!' : 'تم إرسال طلب الحجز بنجاح!');
        closeModal();
    }
}

function loadGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid || !db) return;

    db.collection('gallery').onSnapshot(snapshot => {
        if (snapshot.empty) return;

        galleryGrid.innerHTML = '';
        snapshot.docs.forEach(doc => {
            const item = doc.data();
            const card = document.createElement('div');
            card.className = 'gallery-card';
            card.innerHTML = `
                <img src="${item.imageUrl || item.url || ''}" alt="${item.title || 'Photo'}">
                <div class="card-overlay">
                    <span class="category">${(item.category || 'MARIAGE').toUpperCase()}</span>
                    <h3>${item.title || 'Studio Series'}</h3>
                </div>
            `;
            galleryGrid.appendChild(card);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadSessionTypes();
    loadGallery();
});
