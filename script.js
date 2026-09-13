// ==========================================
// 1. FIREBASE CONFIGURATION
// ==========================================
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

let db = null;
try {
    if (typeof firebase !== 'undefined') {
        if (firebase.apps.length === 0) {
            firebase.initializeApp(firebaseConfig);
        }
        if (firebase.firestore) {
            db = firebase.firestore();
        }
    }
} catch (err) {
    console.warn("Firebase mode fallback:", err);
}

// ==========================================
// 2. INITIALIZATION & UI EVENTS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Language System
    initLanguageSystem();

    // 2. Load Session Types into Dropdown
    loadSessionTypes();

    // 3. Setup Booking Buttons & Smooth Scrolling
    setupBookingButtons();

    // 4. Attach Form Submit Listener
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }
});

// ==========================================
// 3. LANGUAGE SWITCHER SYSTEM (AR / FR)
// ==========================================
let currentLang = localStorage.getItem('site_lang') || 'fr';

function initLanguageSystem() {
    applyLanguage(currentLang);

    // Find language toggle button by ID or Class
    const langBtn = document.getElementById('langToggle') || document.querySelector('.lang-btn');
    if (langBtn) {
        langBtn.addEventListener('click', (e) => {
            e.preventDefault();
            currentLang = (currentLang === 'fr') ? 'ar' : 'fr';
            localStorage.setItem('site_lang', currentLang);
            applyLanguage(currentLang);
        });
    }
}

function applyLanguage(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';

    // Translate elements with data-fr and data-ar attributes
    document.querySelectorAll('[data-fr][data-ar]').forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = text;
            } else {
                el.textContent = text;
            }
        }
    });

    // Update Language Button Text if exists
    const langBtn = document.getElementById('langToggle') || document.querySelector('.lang-btn');
    if (langBtn) {
        langBtn.textContent = (lang === 'fr') ? 'العربية' : 'Français';
    }
}

// ==========================================
// 4. BOOKING BUTTONS & NAVIGATION
// ==========================================
function setupBookingButtons() {
    // Scroll smoothly to booking section when clicking reserve buttons
    document.querySelectorAll('a[href^="#"], .btn-book, .btn-reserve').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            let targetId = href;

            if (!targetId || targetId === '#') {
                targetId = '#booking';
            }

            const targetEl = document.querySelector(targetId) || document.getElementById('bookingForm');
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ==========================================
// 5. LOAD SESSION TYPES
// ==========================================
function loadSessionTypes() {
    const typeSelect = document.getElementById('bookingType');
    if (!typeSelect) return;

    const defaultTypes = [
        { fr: "Mariage", ar: "زفاف" },
        { fr: "Portrait", ar: "بورتريه" },
        { fr: "Événement", ar: "مناسبات" }
    ];

    if (db) {
        db.collection('types').onSnapshot(snapshot => {
            if (snapshot && !snapshot.empty) {
                const fetched = [];
                snapshot.docs.forEach(doc => {
                    const data = doc.data();
                    fetched.push({
                        fr: data.fr || data.nameFr || '',
                        ar: data.ar || data.nameAr || ''
                    });
                });
                populateTypeOptions(typeSelect, fetched);
            } else {
                populateLocalTypes(typeSelect, defaultTypes);
            }
        }, () => populateLocalTypes(typeSelect, defaultTypes));
    } else {
        populateLocalTypes(typeSelect, defaultTypes);
    }
}

function populateLocalTypes(selectElement, fallbackTypes) {
    const localTypes = JSON.parse(localStorage.getItem('session_types')) || fallbackTypes;
    populateTypeOptions(selectElement, localTypes);
}

function populateTypeOptions(selectElement, types) {
    selectElement.innerHTML = `<option value="">-- ${currentLang === 'ar' ? 'اختر نوع الجلسة' : 'Choisissez un type de séance'} --</option>`;
    types.forEach(item => {
        const option = document.createElement('option');
        option.value = item.fr;
        option.textContent = (currentLang === 'ar' && item.ar) ? item.ar : item.fr;
        selectElement.appendChild(option);
    });
}

// ==========================================
// 6. SUBMIT & DOUBLE-BOOKING PREVENTION
// ==========================================
async function handleBookingSubmit(e) {
    e.preventDefault();

    const submitBtn = e.target.querySelector('button[type="submit"]');

    const nameInput = document.getElementById('bookingName');
    const phoneInput = document.getElementById('bookingPhone');
    const typeInput = document.getElementById('bookingType');
    const dateTimeInput = document.getElementById('bookingDateTime');

    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const type = typeInput ? typeInput.value : '';
    const datetime = dateTimeInput ? dateTimeInput.value : '';

    if (!name || !phone || !type || !datetime) {
        const msg = (currentLang === 'ar') ? "يرجى ملء جميع الحقول المطلوبة." : "Veuillez remplir tous les champs obligatoires.";
        alert(msg);
        return;
    }

    if (submitBtn) submitBtn.disabled = true;

    try {
        // 1. Check LocalStorage for time conflict
        const localBookings = JSON.parse(localStorage.getItem('admin_bookings') || '[]');
        const isConflictLocal = localBookings.some(b => b.datetime === datetime);

        if (isConflictLocal) {
            const msgConflict = (currentLang === 'ar') 
                ? "هذا الموعد محجوز بالفعل! يرجى اختيار تاريخ أو وقت آخر." 
                : "Ce créneau horaire est déjà réservé ! Veuillez choisir une autre date ou heure.";
            alert(msgConflict);
            if (submitBtn) submitBtn.disabled = false;
            return;
        }

        // 2. Check Firebase Firestore for time conflict
        if (db) {
            try {
                const snapshot = await db.collection('bookings').where('datetime', '==', datetime).get();
                if (!snapshot.empty) {
                    const msgConflict = (currentLang === 'ar') 
                        ? "هذا الموعد محجوز بالفعل! يرجى اختيار تاريخ أو وقت آخر." 
                        : "Ce créneau horaire est déjà réservé ! Veuillez choisir une autre date ou heure.";
                    alert(msgConflict);
                    if (submitBtn) submitBtn.disabled = false;
                    return;
                }
            } catch (netErr) {
                console.warn("Firestore check skipped:", netErr);
            }
        }

        // 3. Save new booking if available
        const newBooking = {
            name: name,
            phone: phone,
            type: type,
            datetime: datetime,
            createdAt: new Date().toISOString()
        };

        localBookings.push(newBooking);
        localStorage.setItem('admin_bookings', JSON.stringify(localBookings));

        if (db) {
            db.collection('bookings').add(newBooking).catch(err => console.error(err));
        }

        const msgSuccess = (currentLang === 'ar') ? "تم الحجز بنجاح!" : "Réservation effectuée avec succès !";
        alert(msgSuccess);
        e.target.reset();

    } catch (err) {
        console.error("Booking error:", err);
        const msgErr = (currentLang === 'ar') ? "حدث خطأ، يرجى المحاولة مرة أخرى." : "Une erreur est survenue. Veuillez réessayer.";
        alert(msgErr);
    } finally {
        if (submitBtn) submitBtn.disabled = false;
    }
}
