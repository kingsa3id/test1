// Creates default master login on first load
(function initAdminSystem() {
    const defaultAdmins = [
        { email: "admin@studio.com", password: "admin123" }
    ];
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
        errorElement.style.display = 'block';
    }
}

// Security Shield to protect admin pages
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

// Add New Admin
function handleCreateUser(e) {
    e.preventDefault();
    const email = document.getElementById('newEmail').value.trim().toLowerCase();
    const password = document.getElementById('newPassword').value;

    let users = JSON.parse(localStorage.getItem('admin_users')) || [];

    if (users.some(u => u.email === email)) {
        alert('Cet email existe déjà!');
        return;
    }

    users.push({ email, password });
    localStorage.setItem('admin_users', JSON.stringify(users));
    alert(`Compte créé avec succès pour: ${email}`);
    
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
                : '<em>(Vous)</em>'}
        `;
        listContainer.appendChild(li);
    });
}

// Delete Admin Account
function deleteAdmin(email) {
    if (!confirm(`Supprimer l'accès pour ${email} ?`)) return;

    let users = JSON.parse(localStorage.getItem('admin_users')) || [];
    users = users.filter(u => u.email !== email);
    localStorage.setItem('admin_users', JSON.stringify(users));
    renderAdminList();
}

// Logout
function logoutAdmin() {
    sessionStorage.removeItem('current_admin');
    window.location.href = 'login.html';
}
