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
        btnSubmit: "Confirmer la réservation",
        types: ["Mariage", "Portrait", "Événement", "Autre"]
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
        btnSubmit: "تأكيد الحجز",
        types: ["زفاف", "بورتريه", "مناسبة", "آخر"]
    }
};

let currentLang = 'fr';

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

    populateSelectTypes();
}

function populateSelectTypes() {
    const select = document.getElementById('inputType');
    if (!select) return;
    select.innerHTML = '';
    translations[currentLang].types.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        select.appendChild(option);
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
    alert(currentLang === 'fr' ? 'Réservation envoyée avec succès!' : 'تم إرسال طلب الحجز بنجاح!');
    closeModal();
}

document.addEventListener('DOMContentLoaded', () => {
    populateSelectTypes();
});
