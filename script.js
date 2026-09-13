// Firebase Configuration
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

if (typeof firebase !== 'undefined' && firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}

const db = (typeof firebase !== 'undefined' && firebase.firestore) ? firebase.firestore() : null;

let dynamicSessionTypes = [];
let currentLang = 'fr';

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
        aboutDesc1: "Fondé sur une passion pour l'art visuel et le storytelling, notre studio s'efforce de capturer la véritable essence de vos moments les plus précieux.",
        aboutDesc2: "Que ce soit pour votre mariage, un portrait professionnel ou un événement d'exception, nous combinons une approche artistique raffinée avec des équipements de pointe.",
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
        aboutDesc1: "تأسس استوديونا على شغف بالفن البصري وسرد القصص، ونسعى للتقاط الجوهر الحقيقي لأغلى لحظاتكم.",
        aboutDesc2: "سواء كان لحفل زفافك، بورترييه احترافي، أو مناسبة خاصة، نحن نجمع بين اللمسة الفنية الراقية وأحدث المعدات.",
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
    
    if (document.getElementById('navGallery')) document.getElementById('navGallery').innerText = t.navGallery;
    if (document.getElementById('navAbout')) document.getElementById('navAbout').innerText = t.navAbout;
    if (document.getElementById('navContact')) document.getElementById('navContact').innerText = t.navContact;
    if (document.getElementById('heroTagline')) document.getElementById('heroTagline').innerText = t.heroTagline;
    if (document.getElementById('heroTitle')) document.getElementById('heroTitle').innerHTML = t.heroTitle;
    if (document.getElementById('heroDesc')) document.getElementById('heroDesc').innerText = t.heroDesc;
    if (document.getElementById('btnBook')) document.getElementById('btnBook').innerText = t.btnBook;
    if (document.getElementById('btnCall')) document.getElementById('btnCall').innerText = t.btnCall;
    if (document.getElementById('galleryTitle')) document.getElementById('galleryTitle').innerText = t.galleryTitle;
    if (document.getElementById('aboutSub')) document.getElementById('aboutSub').innerText = t.aboutSub;
    if (document.getElementById('aboutTitle')) document.getElementById('aboutTitle').innerText = t.aboutTitle;
    if (document.getElementById('aboutDesc1')) document.getElementById('aboutDesc1').innerText = t.aboutDesc1;
    if (document.getElementById('aboutDesc2')) document.getElementById('aboutDesc2').innerText = t.aboutDesc2;
    if (document.getElementById('feat1')) document.getElementById('feat1').innerHTML = t.feat1;
    if (document.getElementById('feat2')) document.getElementById('feat2').innerHTML = t.feat2;
    if (document.getElementById('langToggle')) document.getElementById('langToggle').innerHTML = t.langBtn;
    if (document.getElementById('modalTitle')) document.getElementById('modalTitle').innerText = t.modalTitle;
    if (document.getElementById('modalDesc')) document.getElementById('modalDesc').innerText = t.modalDesc;
    if (document.getElementById('lblNama')) document.getElementById('lblNama').innerText = t.lblNama;
    if (document.getElementById('lblPhone')) document.getElementById('lblPhone').innerText = t.lblPhone;
    if (document.getElementById('lblType')) document.getElementById('lblType').innerText = t.lblType;
    if (document.getElementById('lblDateTime')) document.getElementById('lblDateTime').innerText = t.lblDateTime;
    if (document.getElementById('btnSubmit')) document.getElementById('btnSubmit').innerText = t.btnSubmit;

    renderSelectTypes();
}

function loadSessionTypes() {
    dynamicSessionTypes = [];

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
            console.error("Local Storage Error:", e);
        }
    }

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
    if (document.getElementById('bookingModal')) {
        document.getElementById('bookingModal').classList.add('active');
    }
}

function closeModal() {
    if (document.getElementById('bookingModal')) {
        document.getElementById('bookingModal').classList.remove('active');
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('inputName').value;
    const phone = document.getElementById('inputPhone').value;
    const type = document.getElementById('inputType').value;
    const datetime = document.getElementById('inputDateTime').value;

    const bookingData = {
        name: name,
        phone: phone,
        type: type,
        datetime: datetime,
        createdAt: new Date().toISOString()
    };

    const localBookings = JSON.parse(localStorage.getItem('admin_bookings') || '[]');
    localBookings.push(bookingData);
    localStorage.setItem('admin_bookings', JSON.stringify(localBookings));

    if (db) {
        db.collection('bookings').add({
            ...bookingData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }).catch(err => console.error(err));
    }

    alert(currentLang === 'fr' ? 'Réservation envoyée avec succès!' : 'تم إرسال طلب الحجز بنجاح!');
    closeModal();
    e.target.reset();
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
                    <span class="category">${(item.category || ' MARIAGE ').toUpperCase()}</span>
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
