
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

// Initialize Firebase
if (typeof firebase !== 'undefined' && firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}

const db = (typeof firebase !== 'undefined' && firebase.firestore) ? firebase.firestore() : null;

// Initialize Page Logic
document.addEventListener('DOMContentLoaded', () => {
    loadSessionTypes();

    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }
});

// Load Session Types into Dropdown
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
                return;
            }
            populateLocalTypes(typeSelect, defaultTypes);
        }, err => {
            console.error("Firestore loading error:", err);
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

// Handle Booking Form Submission
async function handleBookingSubmit(e) {
    e.preventDefault();

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

    // 1. Check for double-booking in LocalStorage
    const localBookings = JSON.parse(localStorage.getItem('admin_bookings') || '[]');
    const isConflictLocal = localBookings.some(b => b.datetime === datetime);

    if (isConflictLocal) {
        alert("Ce créneau horaire est déjà réservé ! Veuillez choisir une autre date ou heure.");
        return;
    }

    // 2. Check for double-booking in Firebase Firestore
    if (db) {
        try {
            const snapshot = await db.collection('bookings').where('datetime', '==', datetime).get();
            if (!snapshot.empty) {
                alert("Ce créneau horaire est déjà réservé ! Veuillez choisir une autre date ou heure.");
                return;
            }
        } catch (err) {
            console.error("Erreur de vérification Firestore:", err);
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
        db.collection('bookings').add(newBooking)
          .then(() => alert("Réservation effectuée avec succès !"))
          .catch(err => console.error("Erreur de sauvegarde:", err));
    } else {
        alert("Réservation effectuée avec succès !");
    }

    e.target.reset();
}
