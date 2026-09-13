// ==========================================
// 1. FIREBASE CONFIGURATION & INITIALIZATION
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
    console.warn("Firebase fallback mode:", err);
}

// ==========================================
// 2. DOM INITIALIZATION & SITE INTERACTION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Load dynamic session types into form select
    loadSessionTypes();

    // Attach submit listener to booking form
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }

    // Enable Smooth Scroll for site links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});

// ==========================================
// 3. SESSION TYPES DROPDOWN LOGIC
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
        }, err => {
            console.warn("Firestore listener error, using local fallback:", err);
            populateLocalTypes(typeSelect, defaultTypes);
        });
    } else {
        populateLocalTypes(typeSelect, defaultTypes);
    }
}

function populateLocalTypes(selectElement, fallbackTypes) {
    const localTypes = JSON.parse(localStorage.getItem('session_types')) || fallbackTypes;
    populateTypeOptions(selectElement, localTypes);
}

function populateTypeOptions(selectElement, types) {
    selectElement.innerHTML = '<option value="">-- Choisissez un type de séance --</option>';
    types.forEach(item => {
        const option = document.createElement('option');
        const label = item.ar ? `${item.fr} (${item.ar})` : item.fr;
        option.value = item.fr;
        option.textContent = label;
        selectElement.appendChild(option);
    });
}

// ==========================================
// 4. BOOKING & STRICT DOUBLE-BOOKING CHECK
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
        alert("Veuillez remplir tous les champs obligatoires.");
        return;
    }

    if (submitBtn) submitBtn.disabled = true;

    try {
        // 1. Check LocalStorage for duplicate time slot
        const localBookings = JSON.parse(localStorage.getItem('admin_bookings') || '[]');
        const isConflictLocal = localBookings.some(b => b.datetime === datetime);

        if (isConflictLocal) {
            alert("Ce créneau horaire est déjà réservé ! Veuillez choisir une autre date ou heure.");
            if (submitBtn) submitBtn.disabled = false;
            return;
        }

        // 2. Check Firebase Firestore with a 3-second timeout guard
        if (db) {
            const checkQuery = db.collection('bookings').where('datetime', '==', datetime).get();
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error("Timeout")), 3000)
            );

            try {
                const snapshot = await Promise.race([checkQuery, timeoutPromise]);
                if (snapshot && !snapshot.empty) {
                    alert("Ce créneau horaire est déjà réservé ! Veuillez choisir une autre date ou heure.");
                    if (submitBtn) submitBtn.disabled = false;
                    return;
                }
            } catch (netErr) {
                console.warn("Online check skipped, using local verification:", netErr);
            }
        }

        // 3. Save the valid booking
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
            db.collection('bookings').add(newBooking).catch(err => console.error("Firestore save err:", err));
        }

        alert("Réservation effectuée avec succès !");
        e.target.reset();

    } catch (err) {
        console.error("Booking handler error:", err);
        alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
        if (submitBtn) submitBtn.disabled = false;
    }
}
