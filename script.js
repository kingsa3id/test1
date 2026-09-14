// ==========================================
// 0. TELEGRAM & SITE CONFIGURATION
// ==========================================
const TELEGRAM_BOT_TOKEN = "8857198496:AAGy5eZcZF39ItjU3BZVsW0mrYnWPOoJ-Yo"; 
const TELEGRAM_CHAT_ID = "7206996726";     

const defaultSettings = {
    mainPhone: "0550123456",
    whatsapp: "https://wa.me/213550000000",
    instagram: "https://instagram.com/",
    telegram: "https://t.me/"
};

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
    injectAdminModalHTML();
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
// 4. FLOATING BUBBLES & ADMIN MODAL INJECTION
// ==========================================
function renderFloatingBubbles() {
    let container = document.getElementById('floatingBubbles');
    if (!container) {
        container = document.createElement('div');
        container.id = 'floatingBubbles';
        container.className = 'fixed bottom-6 left-6 z-50 flex flex-col gap-3';
        document.body.appendChild(container);
    }

    const settings = getSiteSettings();
    container.innerHTML = '';

    if (settings.whatsapp) {
        container.innerHTML += `
            <a href="${settings.whatsapp}" target="_blank" class="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl shadow-lg hover:scale-110 transition" title="WhatsApp">
                <i class="fa-brands fa-whatsapp"></i>
            </a>
        `;
    }

    if (settings.instagram) {
        container.innerHTML += `
            <a href="${settings.instagram}" target="_blank" class="w-12 h-12 bg-pink-600 text-white rounded-full flex items-center justify-center text-xl shadow-lg hover:scale-110 transition" title="Instagram">
                <i class="fa-brands fa-instagram"></i>
            </a>
        `;
    }

    if (settings.mainPhone) {
        container.innerHTML += `
            <a href="tel:${settings.mainPhone}" class="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl shadow-lg hover:scale-110 transition" title="Call Us">
                <i class="fa-solid fa-phone"></i>
            </a>
        `;
    }
}

function injectAdminModalHTML() {
    if (document.getElementById('adminModal')) return;

    // تم إضافة style="display: none;" لضمان عدم ظهورها افتراضياً
    const modalHTML = `
    <div id="adminModal" style="display: none;" class="fixed inset-0 bg-black/70 z-50 items-center justify-center p-4">
        <div class="bg-zinc-900 text-white w-full max-w-lg rounded-2xl p-6 border border-zinc-700 shadow-2xl relative">
            <button id="closeAdminBtn" class="absolute top-4 left-4 text-zinc-400 hover:text-white text-xl">&times;</button>
            <h3 class="text-xl font-bold mb-4 text-accent">لوحة تحكم الإعدادات (Admin Panel)</h3>
            
            <form id="adminSettingsForm" class="space-y-4">
                <div>
                    <label class="block text-sm mb-1">رقم الهاتف الأساسي للاستوديو:</label>
                    <input type="text" id="adminMainPhone" class="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-white" placeholder="0550123456">
                </div>
                <div>
                    <label class="block text-sm mb-1">رابط واتساب (WhatsApp Link):</label>
                    <input type="text" id="adminWhatsapp" class="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-white" placeholder="https://wa.me/213550000000">
                </div>
                <div>
                    <label class="block text-sm mb-1">رابط انستغرام (Instagram Link):</label>
                    <input type="text" id="adminInstagram" class="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-white" placeholder="https://instagram.com/yourstudio">
                </div>
                <div>
                    <label class="block text-sm mb-1">رابط تيليجرام (Telegram Link):</label>
                    <input type="text" id="adminTelegram" class="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-white" placeholder="https://t.me/yourusername">
                </div>
                <button type="submit" class="w-full bg-accent text-zinc-950 font-bold py-3 rounded-lg hover:opacity-95 transition">حفظ التغييرات</button>
            </form>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function openAdminModal() {
    const modal = document.getElementById('adminModal');
    if (!modal) return;
    
    const settings = getSiteSettings();
    document.getElementById('adminMainPhone').value = settings.mainPhone || '';
    document.getElementById('adminWhatsapp').value = settings.whatsapp || '';
    document.getElementById('adminInstagram').value = settings.instagram || '';
    document.getElementById('adminTelegram').value = settings.telegram || '';

    modal.style.display = 'flex';
}

function closeAdminModal() {
    const modal = document.getElementById('adminModal');
    if (modal) modal.style.display = 'none';
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
                        fr: data.fr || data.nameFr || data.name || '',
                        ar: data.ar || data.nameAr || data.name || ''
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
    
    if (!Array.isArray(types)) return;

    types.forEach(item => {
        const option = document.createElement('option');
        
        if (typeof item === 'string') {
            option.value = item;
            option.textContent = item;
        } else if (typeof item === 'object' && item !== null) {
            const val = item.fr || item.name || item.title || item.ar || '';
            const txt = (currentLang === 'ar' && (item.ar || item.name || item.title)) ? (item.ar || item.name || item.title) : val;
            
            option.value = val;
            option.textContent = txt;
        }

        if (option.value) {
            selectElement.appendChild(option);
        }
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
    const cleanPhone = phone.replace(/\s+/g, '');
    const dzPhoneRegex = /^(?:(?:\+|00)213|0)[1-9][0-9]{8}$/;
    return dzPhoneRegex.test(cleanPhone);
}

// Helper: Send Telegram Notification (HTML Mode)
async function sendTelegramNotification(booking) {
    if (TELEGRAM_BOT_TOKEN === "YOUR_BOT_TOKEN" || TELEGRAM_CHAT_ID === "YOUR_CHAT_ID") {
        console.warn("Telegram token or chat ID not configured.");
        return;
    }

    const escapeHTML = (str) => String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const message = `🚨 <b>حجز جديد في الاستوديو!</b>\n\n` +
                    `👤 <b>الاسم:</b> ${escapeHTML(booking.name)}\n` +
                    `📞 <b>الهاتف:</b> ${escapeHTML(booking.phone)}\n` +
                    `📸 <b>نوع الجلسة:</b> ${escapeHTML(booking.type)}\n` +
                    `📅 <b>الموعد:</b> ${escapeHTML(booking.datetime.replace('T', ' الوقت: '))}`;

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
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
        const msg = (currentLang === 'ar') ? "يرجى ملء جميع الحقول المطلوبة." : "Veuillez remplir tous les champs.";
        alert(msg);
        return;
    }

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

        // 4. Send Telegram Notification
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

