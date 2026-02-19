const BASE_URL = "http://localhost:3000/contacts";
let allContacts = [];
let sortOrder = "asc";

document.addEventListener("DOMContentLoaded", fetchContacts);

function fetchContacts() {
    fetch(BASE_URL)
        .then(res => res.json())
        .then(data => {
            allContacts = data;
            applySort();
            updateCount();
        });
}

function updateCount() {
    document.getElementById("contactCount").innerText =
        `${allContacts.length} Contact(s)`;
}

function renderContacts(contacts) {
    const list = document.getElementById("contactList");
    list.innerHTML = "";

    contacts.forEach(c => {
        const initial = c.name.charAt(0).toUpperCase();

        list.innerHTML += `
            <div class="contact-card">
                <div class="avatar">${initial}</div>
                <h3>${c.name}</h3>
                <p>📞 ${c.phone}</p>
                <p>✉️ ${c.email}</p>
                <p>📍 ${c.address}</p>
                <div class="card-actions">
                    <button class="action-btn edit-btn"
                        onclick="editContact(${c.id}, '${c.name}', '${c.phone}', '${c.email}', '${c.address}')">
                        Edit
                    </button>
                    <button class="action-btn delete-btn"
                        onclick="deleteContact(${c.id})">
                        Delete
                    </button>
                </div>
            </div>
        `;
    });
}

function toggleSort() {
    sortOrder = sortOrder === "asc" ? "desc" : "asc";
    document.getElementById("sortLabel").innerText =
        sortOrder === "asc" ? "A–Z" : "Z–A";
    applySort();
}

function applySort() {
    const sorted = [...allContacts].sort((a, b) =>
        sortOrder === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name)
    );
    renderContacts(sorted);
}

function filterContacts() {
    const value = document.getElementById("searchInput").value.toLowerCase();

    const filtered = allContacts.filter(c =>
        c.name.toLowerCase().includes(value)
    );

    const sorted = filtered.sort((a, b) =>
        sortOrder === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name)
    );

    renderContacts(sorted);
}

function openModal() {
    document.getElementById("contactModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("contactModal").style.display = "none";
    resetForm();
}

function saveContact() {
    const id = document.getElementById("contactId").value;
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const address = document.getElementById("address").value.trim();

    if (!name || !phone || !email || !address) {
        showToast("All fields are required");
        return;
    }

    const contact = { name, phone, email, address };
    const method = id ? "PUT" : "POST";
    const url = id ? `${BASE_URL}/${id}` : BASE_URL;

    fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact)
    }).then(() => {
        fetchContacts();
        closeModal();
        showToast("Contact saved successfully");
    });
}

function editContact(id, name, phone, email, address) {
    document.getElementById("contactId").value = id;
    document.getElementById("name").value = name;
    document.getElementById("phone").value = phone;
    document.getElementById("email").value = email;
    document.getElementById("address").value = address;
    openModal();
}

function deleteContact(id) {
    if (confirm("Delete this contact?")) {
        fetch(`${BASE_URL}/${id}`, { method: "DELETE" })
            .then(() => {
                fetchContacts();
                showToast("Contact deleted");
            });
    }
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.style.display = "block";
    setTimeout(() => toast.style.display = "none", 2000);
}

function resetForm() {
    document.getElementById("contactId").value = "";
    document.querySelectorAll(".modal-content input").forEach(i => i.value = "");
}
