// Immediate Security Guard (Runs before DOM renders)
(function enforceAuthGuard() {
    const isLoginPage = window.location.pathname.endsWith('login.html');
    const isDashboard = window.location.pathname.endsWith('admin-dashboard.html');
    const currentAdmin = sessionStorage.getItem('current_admin');

    // 1. If trying to view dashboard without being logged in -> Kick to login.html
    if (isDashboard && !currentAdmin) {
        window.location.replace('login.html');
    }

    // 2. If already logged in and trying to view login page -> Redirect to dashboard
    if (isLoginPage && currentAdmin) {
        window.location.replace('admin-dashboard.html');
    }
})();
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

// Initialize Default Admin on First Launch
(function initAdminSystem() {
    const defaultAdmins = [{ email: "admin@studio.com", password: "admin123" }];
    if (!localStorage.getItem('admin_users')) {
        localStorage.setItem('admin_users', JSON.stringify(defaultAdmins));
    }
})();

// Login Logic
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;
    const errorElement = document.getElementById('errorMessage');

    const users = JSON.parse(localStorage.getItem('admin_users')) || [];
    const match = users.find(u => u.email === email && u.password === password);

    if (match) {
        sessionStorage.setItem('current_admin', JSON.stringify({ email: match.email }));
        window.location.href = 'admin-dashboard.html';
    } else {
        if (errorElement) errorElement.style.display = 'block';
    }
}

// Security Shield Protect Dashboard
function protectPage() {
    const currentAdmin = sessionStorage.getItem('current_admin');
    if (!currentAdmin) {
        window.location.href = 'login.html';
        return;
    }
    const user = JSON.parse(currentAdmin);
    const emailSpan = document.getElementById('currentUserEmail');
    if (emailSpan) emailSpan.textContent = user.email;
}

// Create New Admin Account
function handleCreateUser(e) {
    e.preventDefault();
    const email = document.getElementById('newEmail').value.trim().toLowerCase();
    const password = document.getElementById('newPassword').value;

    let users = JSON.parse(localStorage.getItem('admin_users')) || [];

    if (users.some(u => u.email === email)) {
        alert('Cet email administrateur existe déjà!');
        return;
    }

    users.push({ email, password });
    localStorage.setItem('admin_users', JSON.stringify(users));
    alert(`Compte Administrateur créé avec succès pour: ${email}`);
    
    e.target.reset();
    renderAdminList();
}

// Render Admin Accounts List
function renderAdminList() {
    const listContainer = document.getElementById('adminList');
    if (!listContainer) return;

    const users = JSON.parse(localStorage.getItem('admin_users')) || [];
    const currentAdmin = JSON.parse(sessionStorage.getItem('current_admin') || '{}');

    listContainer.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${user.email}</span>
            ${user.email !== currentAdmin.email 
                ? `<button class="btn-danger" onclick="deleteAdmin('${user.email}')">Supprimer</button>` 
                : '<em style="color:#d4af37;">(Vous)</em>'}
        `;
        listContainer.appendChild(li);
    });
}

// Delete Admin Account
function deleteAdmin(email) {
    if (!confirm(`Voulez-vous vraiment supprimer l'accès admin pour ${email} ?`)) return;

    let users = JSON.parse(localStorage.getItem('admin_users')) || [];
    users = users.filter(u => u.email !== email);
    localStorage.setItem('admin_users', JSON.stringify(users));
    renderAdminList();
}

// Add New Session Type (Dual sync: LocalStorage + Firestore)
function handleAddSessionType(e) {
    e.preventDefault();
    const fr = document.getElementById('typeFr').value.trim();
    const ar = document.getElementById('typeAr').value.trim();

    let types = JSON.parse(localStorage.getItem('session_types')) || [];
    types.push({ fr, ar });
    localStorage.setItem('session_types', JSON.stringify(types));

    if (db) {
        db.collection('types').add({ fr, ar, nameFr: fr, nameAr: ar })
          .catch(err => console.error("Firestore type save error:", err));
    }

    e.target.reset();
    renderAdminSessionTypes();
    alert('Nouveau type de séance ajouté!');
}

// Render Session Types List
function renderAdminSessionTypes() {
    const listContainer = document.getElementById('sessionTypeList');
    if (!listContainer) return;

    let types = JSON.parse(localStorage.getItem('session_types')) || [];

    if (db) {
        db.collection('types').onSnapshot(snapshot => {
            if (snapshot && !snapshot.empty) {
                const fetched = [];
                snapshot.docs.forEach(doc => {
                    const data = doc.data();
                    fetched.push({
                        id: doc.id,
                        fr: data.fr || data.nameFr || data.french || '',
                        ar: data.ar || data.nameAr || data.arabic || ''
                    });
                });
                renderTypesUI(fetched);
                return;
            }
            renderTypesUI(types);
        });
    } else {
        renderTypesUI(types);
    }
}

function renderTypesUI(types) {
    const listContainer = document.getElementById('sessionTypeList');
    if (!listContainer) return;

    listContainer.innerHTML = '';
    types.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span><strong>FR:</strong> ${item.fr} | <strong>AR:</strong> ${item.ar}</span>
            <button class="btn-danger" onclick="deleteSessionType(${index}, '${item.id || ''}')">Supprimer</button>
        `;
        listContainer.appendChild(li);
    });
}

// Delete Session Type
function deleteSessionType(index, firestoreId) {
    let types = JSON.parse(localStorage.getItem('session_types')) || [];
    types.splice(index, 1);
    localStorage.setItem('session_types', JSON.stringify(types));

    if (db && firestoreId) {
        db.collection('types').doc(firestoreId).delete().catch(err => console.error(err));
    }

    renderAdminSessionTypes();
}

// Render Bookings List
function renderBookings() {
    const listContainer = document.getElementById('bookingList');
    if (!listContainer) return;

    if (db) {
        db.collection('bookings').onSnapshot(snapshot => {
            if (snapshot && !snapshot.empty) {
                listContainer.innerHTML = '';
                snapshot.docs.forEach(doc => {
                    const b = doc.data();
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <div>
                            <strong>${b.name}</strong> (${b.phone})<br>
                            <small style="color:#aaa;">Type: ${b.type} | Date: ${b.datetime}</small>
                        </div>
                    `;
                    listContainer.appendChild(li);
                });
                return;
            }
            loadLocalBookings(listContainer);
        });
    } else {
        loadLocalBookings(listContainer);
    }
}

function loadLocalBookings(container) {
    const localBookings = JSON.parse(localStorage.getItem('admin_bookings') || '[]');
    container.innerHTML = '';
    if (localBookings.length === 0) {
        container.innerHTML = '<li style="color:#888;">Aucune réservation pour le moment.</li>';
        return;
    }
    localBookings.forEach(b => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <strong>${b.name}</strong> (${b.phone})<br>
                <small style="color:#aaa;">Type: ${b.type} | Date: ${b.datetime}</small>
            </div>
        `;
        container.appendChild(li);
    });
}

// Logout
function logoutAdmin() {
    sessionStorage.removeItem('current_admin');
    window.location.href = 'login.html';
}
