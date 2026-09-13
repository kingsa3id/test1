// ==========================================
// 0. TELEGRAM & SITE CONFIGURATION
// ==========================================
const TELEGRAM_BOT_TOKEN = "8857198496:AAGy5eZcZF39ItjU3BZVsW0mrYnWPOoJ-Yo"; 
const TELEGRAM_CHAT_ID = "7206996726";     

// إعدادات افتراضية للتواصل الاجتماعي والهاتف
const defaultSettings = {
    mainPhone: "0550123456",
    whatsapp: "https://wa.me/213550000000",
    instagram: "https://instagram.com/",
    telegram: "https://t.me/"
};

// جلب الإعدادات المخزنة أو استخدام الافتراضية
function getSiteSettings() {
    const saved = localStorage.getItem('site_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
}

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
    console.warn("Firebase fallback:", err);
}

// ==========================================
// 2. DICTIONARY FOR TRANSLATION (FR / AR)
// ==========================================
const translations = {
    fr: {
        navGallery: "Galerie",
        navAbout: "À Propos",
        navContact: "Contact",
        langBtnText: "العربية",
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
        modalTitle: "Réserver une séance photo",
        modalDesc: "Complétez le formulaire ci-dessous pour réserver votre date.",
        lblNama: "Nom complet",
        lblPhone: "Numéro de téléphone",
        lblType: "Type de séance",
        lblDateTime: "Date et Heure de la séance",
        btnSubmit: "Confirmer la réservation",
        footerCopy: "© 2026 LENS & ART. Tous droits réservés."
    },
    ar: {
        navGallery: "المعرض",
        navAbout: "من نحن",
        navContact: "اتصل بنا",
        langBtnText: "Français",
        heroTagline: "استوديو تصوير فوتوغرافي فاخر",
        heroTitle: 'تخليد اللحظات <br><span class="text-accent">الأبدية</span>',
        heroDesc: "تصوير فني احترافي للأعراس، البورتريه، والمناسبات الخاصة.",
        btnBook: "حجز جلسة تصوير",
        btnCall: "اتصل بنا الآن",
        galleryTitle: "أحدث الأعمال",
        aboutSub: "من نحن",
        aboutTitle: "نلتقط المشاعر بشغف ودقة",
        aboutDesc1: "تأسس استوديونا على الشغف بالفن البصري وسرد القصص، ونسعى لجعل كل صورة تحفة فنية تحافظ على جمال أثمن لحظاتكم.",
        aboutDesc2: "سواء كان لحفل زفافك، أو جلسة بورتريه احترافية، ندمج بين الرؤية الفنية والتقنيات الحديثة لنضمن لك جودة استثنائية.",
        feat1: '<i class="fa-solid fa-camera"></i> معدات تصوير عالمية واحترافية',
        feat2: '<i class="fa-solid fa-wand-magic-sparkles"></i> تعديل ومعالجة فنية دقيقة',
        modalTitle: "حجز جلسة تصوير",
        modalDesc: "يرجى ملء الاستمارة أدناه لتأكيد حجز موعدك.",
        lblNama: "الاسم الكامل",
        lblPhone: "رقم الهاتف",
        lblType: "نوع الجلسة",
        lblDateTime: "تاريخ ووقت الجلسة",
        btnSubmit: "تأكيد الحجز",
        footerCopy: "© 2026 LENS & ART. جميع الحقوق محفوظة."
    }
};

let currentLang = localStorage.getItem('site_lang') || 'fr';

// ==========================================
// 3. INITIALIZATION & EVENT LISTENERS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    applyLanguage(currentLang);
    loadSessionTypes();
    renderFloatingBubbles();
    setupAdminModalEvents();

    const langBtn = document.getElementById('langToggle');
    if (langBtn) {
        langBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleLanguage();
        });
    }

    const btnBook = document.getElementById('btnBook');
    if (btnBook) {
        btnBook.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    }

    const closeModalBtn = document.getElementById('closeModalBtn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    window.addEventListener('click', (e) => {
        const modal = document.getElementById('bookingModal');
        if (e.target === modal) {
            closeModal();
        }
        const adminModal = document.getElementById('adminModal');
        if (e.target === adminModal) {
            closeAdminModal();
        }
    });

    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleFormSubmit);
    }

    const dtInput = document.getElementById('inputDateTime');
    if (dtInput) {
        dtInput.addEventListener('click', () => {
            if (typeof dtInput.showPicker === 'function') {
                dtInput.showPicker();
            }
        });
    }
});

// ==========================================
// 4. FLOATING BUBBLES & ADMIN SETTINGS
// ==========================================
function renderFloatingBubbles() {
    const container = document.getElementById('floatingBubbles');
    if (!container) return;

    const settings = getSiteSettings();
    container.innerHTML = '';

    // زر واتساب العائم
    if (settings.whatsapp) {
        container.innerHTML += `
            <a href="${settings.whatsapp}" target="_blank" class="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl shadow-lg hover:scale-110 transition">
                <i class="fa-brands fa-whatsapp"></i>
            </a>
        `;
    }

    // زر انستغرام العائم
    if (settings.instagram) {
        container.innerHTML += `
            <a href="${settings.instagram}" target="_blank" class="w-12 h-12 bg-pink-600 text-white rounded-full flex items-center justify-center text-xl shadow-lg hover:scale-110 transition">
                <i class="fa-brands fa-instagram"></i>
            </a>
        `;
    }

    // زر اتصال سريع برقم الهاتف
    if (settings.mainPhone) {
        container.innerHTML += `
            <a href="tel:${settings.mainPhone}" class="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl shadow-lg hover:scale-110 transition" title="اتصل بنا">
                <i class="fa-solid fa-phone"></i>
            </a>
        `;
    }
}

function openAdminModal() {
    const modal = document.getElementById('adminModal');
    if (!modal) return;
    
    const settings = getSiteSettings();
    document.getElementById('adminMainPhone').value = settings.mainPhone || '';
    document.getElementById('adminWhatsapp').value = settings.whatsapp || '';
    document.getElementById('adminInstagram').value = settings.instagram || '';
    document.getElementById('adminTelegram').value = settings.telegram || '';

    modal.classList.remove('hidden');
}

function closeAdminModal() {
    const modal = document.getElementById('adminModal');
    if (modal) modal.classList.add('hidden');
}

function setupAdminModalEvents() {
    const closeBtn = document.getElementById('closeAdminBtn');
    if (closeBtn) closeBtn.addEventListener('click', closeAdminModal);

    const form = document.getElementById('adminSettingsForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const newSettings = {
                mainPhone: document.getElementById('adminMainPhone').value.trim(),
                whatsapp: document.getElementById('adminWhatsapp').value.trim(),
                instagram: document.getElementById('adminInstagram').value.trim(),
                telegram: document.getElementById('adminTelegram').value.trim()
            };

            localStorage.setItem('site_settings', JSON.stringify(newSettings));
            renderFloatingBubbles();
            closeAdminModal();
            alert("تم حفظ إعدادات الموقع وتحديث الفقاعات العائمة بنجاح!");
        });
    }
}

// ==========================================
// 5. LANGUAGE TOGGLE FUNCTION
// ==========================================
function toggleLanguage() {
    currentLang = (currentLang === 'fr') ? 'ar' : 'fr';
    localStorage.setItem('site_lang', currentLang);
    applyLanguage(currentLang);
    loadSessionTypes();
}

function applyLanguage(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';

    const t = translations[lang];

    for (const key in t) {
        const el = document.getElementById(key);
        if (el) {
            if (key === 'heroTitle' || key === 'feat1' || key === 'feat2') {
                el.innerHTML = t[key];
            } else {
                el.textContent = t[key];
            }
        }
    }

    const langBtn = document.getElementById('langToggle');
    if (langBtn) {
        langBtn.innerHTML = `<i class="fa-solid fa-globe"></i> <span>${t.langBtnText}</span>`;
    }
}

// ==========================================
// 6. MODAL CONTROL
// ==========================================
function openModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) modal.classList.remove('active');
}

// ==========================================
// 7. LOAD SESSION TYPES
// ==========================================
function loadSessionTypes() {
    const typeSelect = document.getElementById('inputType');
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

// Helper: Normalize Date-Time string
function normalizeDateTime(dtStr) {
    if (!dtStr) return '';
    const d = new Date(dtStr);
    if (isNaN(d.getTime())) return dtStr;
    
    const pad = (num) => String(num).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Helper: Validate Algerian Phone Numbers
function isValidAlgerianPhone(phone) {
    const cleanPhone = phone.replace(/\s+/g, '');
    const dzPhoneRegex = /^(?:(?:\+|00)213|0)[1-9][0-9]{8}$/;
    return dzPhoneRegex.test(cleanPhone);
}

// Helper: Send Telegram Notification
async function sendTelegramNotification(booking) {
    if (TELEGRAM_BOT_TOKEN === "YOUR_BOT_TOKEN" || TELEGRAM_CHAT_ID === "YOUR_CHAT_ID") return;

    const message = `🚨 *حجز جديد في الاستوديو!*\n\n` +
                    `👤 *الاسم:* ${booking.name}\n` +
                    `📞 *الهاتف:* ${booking.phone}\n` +
                    `📸 *نوع الجلسة:* ${booking.type}\n` +
                    `📅 *الموعد:* ${booking.datetime.replace('T', ' الوقت: ')}`;

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });
    } catch (err) {
        console.error("Failed to send telegram notification:", err);
    }
}

// ==========================================
// 8. HANDLE BOOKING FORM SUBMIT
// ==========================================
async function handleFormSubmit(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('btnSubmit');
    const nameInput = document.getElementById('inputName');
    const phoneInput = document.getElementById('inputPhone');
    const typeInput = document.getElementById('inputType');
    const dateTimeInput = document.getElementById('inputDateTime');

    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const type = typeInput ? typeInput.value : '';
    const rawDatetime = dateTimeInput ? dateTimeInput.value : '';
    const datetime = normalizeDateTime(rawDatetime);

    if (!name || !phone || !type || !datetime) {
        alert(currentLang === 'ar' ? "يرجى ملء جميع الحقول المطلوبة." : "Veuillez remplir tous les champs.");
        return;
    }

    if (!isValidAlgerianPhone(phone)) {
        alert(currentLang === 'ar' ? "رقم الهاتف غير جزائري أو غير صحيح! (مثال: 0550123456)." : "Numéro de téléphone algérien invalide !");
        if (phoneInput) phoneInput.focus();
        return;
    }

    if (submitBtn) submitBtn.disabled = true;

    try {
        const msgConflict = currentLang === 'ar' ? "هذا الموعد محجوز بالفعل!" : "Ce créneau horaire est déjà réservé !";

        const localBookings = JSON.parse(localStorage.getItem('admin_bookings') || '[]');
        if (localBookings.some(b => normalizeDateTime(b.datetime) === datetime)) {
            alert(msgConflict);
            if (submitBtn) submitBtn.disabled = false;
            return;
        }

        if (db) {
            try {
                const snapshot = await db.collection('bookings').get();
                let isConflictFirebase = false;
                snapshot.forEach(doc => {
                    if (normalizeDateTime(doc.data().datetime) === datetime) isConflictFirebase = true;
                });
                if (isConflictFirebase) {
                    alert(msgConflict);
                    if (submitBtn) submitBtn.disabled = false;
                    return;
                }
            } catch (netErr) {
                console.warn("Firestore check skipped:", netErr);
            }
        }

        const newBooking = { name, phone, type, datetime, createdAt: new Date().toISOString() };
        localBookings.push(newBooking);
        localStorage.setItem('admin_bookings', JSON.stringify(localBookings));

        if (db) await db.collection('bookings').add(newBooking);

        await sendTelegramNotification(newBooking);

        alert(currentLang === 'ar' ? "تم الحجز بنجاح!" : "Réservation effectuée avec succès !");
        e.target.reset();
        closeModal();

    } catch (err) {
        console.error("Booking error:", err);
        alert(currentLang === 'ar' ? "حدث خطأ، يرجى المحاولة مرة أخرى." : "Une erreur est survenue.");
    } finally {
        if (submitBtn) submitBtn.disabled = false;
    }
}
