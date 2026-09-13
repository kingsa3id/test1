// ==========================================
// 0. TELEGRAM NOTIFICATION CONFIGURATION
// ==========================================
const TELEGRAM_BOT_TOKEN = "8857198496:AAGy5eZcZF39ItjU3BZVsW0mrYnWPOoJ-Yo"; 
const TELEGRAM_CHAT_ID = "7206996726";     

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
// 4. LANGUAGE TOGGLE FUNCTION
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
// 5. MODAL CONTROL
// ==========================================
function openModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// ==========================================
// 6. LOAD SESSION TYPES
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

// Helper: Normalize Date-Time string (YYYY-MM-DDTHH:MM)
function normalizeDateTime(dtStr) {
    if (!dtStr) return '';
    const d = new Date(dtStr);
    if (isNaN(d.getTime())) return dtStr;
    
    const pad = (num) => String(num).padStart(2, '0');
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Helper: Validate STRICT Algerian Phone Numbers
function isValidAlgerianPhone(phone) {
    // ينظف الرقم من المسافات
    const cleanPhone = phone.replace(/\s+/g, '');
    
    // النمط يقبل:
    // 1. الرقم المحلي الجزائري: يبدأ بـ 0 ويتبعه رقم من 5 إلى 7 ثم 8 أرقام أخرى (المجموع 10 أرقام) -> مثال: 05, 06, 07, 021 إلخ.
    // 2. الرقم الدولي الجزائري: يبدأ بـ +213 أو 213 متبوعاً بـ 5, 6, 7 أو رموز الولايات ثم 8 أرقام.
    const dzPhoneRegex = /^(?:(?:\+|00)213|0)[1-9][0-9]{8}$/;
    
    return dzPhoneRegex.test(cleanPhone);
}

// Helper: Send Telegram Notification
async function sendTelegramNotification(booking) {
    if (TELEGRAM_BOT_TOKEN === "YOUR_BOT_TOKEN" || TELEGRAM_CHAT_ID === "YOUR_CHAT_ID") {
        console.warn("Telegram token or chat ID not configured.");
        return;
    }

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
// 7. HANDLE BOOKING FORM SUBMIT
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
        const msg = (currentLang === 'ar') ? "يرجى ملء جميع الحقول المطلوبة." : "Veuillez remplir tous les champs.";
        alert(msg);
        return;
    }

    // Check if phone number is a valid Algerian phone number
    if (!isValidAlgerianPhone(phone)) {
        const msgPhoneErr = (currentLang === 'ar') 
            ? "رقم الهاتف غير جزائري أو غير صحيح! يرجى إدخال رقم هاتف جزائري حقيقي يتكون من 10 أرقام (مثال: 0550123456)." 
            : "Numéro de téléphone algérien invalide ! Veuillez entrer un numéro valide à 10 chiffres (ex: 0550123456).";
        alert(msgPhoneErr);
        if (phoneInput) phoneInput.focus();
        return;
    }

    if (submitBtn) submitBtn.disabled = true;

    try {
        const msgConflict = (currentLang === 'ar') 
            ? "هذا الموعد محجوز بالفعل! يرجى اختيار تاريخ أو وقت آخر." 
            : "Ce créneau horaire est déjà réservé ! Veuillez choisir une autre date ou heure.";

        // 1. Check local storage for double booking
        const localBookings = JSON.parse(localStorage.getItem('admin_bookings') || '[]');
        const isConflictLocal = localBookings.some(b => normalizeDateTime(b.datetime) === datetime);

        if (isConflictLocal) {
            alert(msgConflict);
            if (submitBtn) submitBtn.disabled = false;
            return;
        }

        // 2. Check Firestore database for double booking
        if (db) {
            try {
                const snapshot = await db.collection('bookings').get();
                let isConflictFirebase = false;

                snapshot.forEach(doc => {
                    const data = doc.data();
                    if (normalizeDateTime(data.datetime) === datetime) {
                        isConflictFirebase = true;
                    }
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

        // 3. Save new booking
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
            await db.collection('bookings').add(newBooking);
        }

        // 4. Send Telegram Notification instantly
        await sendTelegramNotification(newBooking);

        const msgSuccess = (currentLang === 'ar') ? "تم الحجز بنجاح!" : "Réservation effectuée avec succès !";
        alert(msgSuccess);
        
        e.target.reset();
        closeModal();

    } catch (err) {
        console.error("Booking error:", err);
        const msgErr = (currentLang === 'ar') ? "حدث خطأ، يرجى المحاولة مرة أخرى." : "Une erreur est survenue. Veuillez réessayer.";
        alert(msgErr);
    } finally {
        if (submitBtn) submitBtn.disabled = false;
    }
}
