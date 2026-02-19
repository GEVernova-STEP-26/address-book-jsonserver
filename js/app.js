const BASE_URL = "http://localhost:3000/contacts";

document.addEventListener("DOMContentLoaded", fetchContacts);

function fetchContacts() {
    fetch(BASE_URL)
        .then(res => res.json())
        .then(data => renderContacts(data));
}

function renderContacts(contacts) {
    const list = document.getElementById("contactList");
    list.innerHTML = "";

    contacts.forEach(contact => {
        list.innerHTML += `
            <div class="contact-card">
                <h3>${contact.name}</h3>
                <p><strong>Phone:</strong> ${contact.phone}</p>
                <p><strong>Email:</strong> ${contact.email}</p>
                <p><strong>Address:</strong> ${contact.address}</p>
                <button onclick="editContact(${contact.id}, '${contact.name}', '${contact.phone}', '${contact.email}', '${contact.address}')">Edit</button>
                <button onclick="deleteContact(${contact.id})">Delete</button>
            </div>
        `;
    });
}

function saveContact() {
    const id = document.getElementById("contactId").value;
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const address = document.getElementById("address").value;

    const contact = { name, phone, email, address };

    if (id) {
        fetch(`${BASE_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(contact)
        }).then(() => {
            resetForm();
            fetchContacts();
        });
    } else {
        fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(contact)
        }).then(() => {
            resetForm();
            fetchContacts();
        });
    }
}

function editContact(id, name, phone, email, address) {
    document.getElementById("contactId").value = id;
    document.getElementById("name").value = name;
    document.getElementById("phone").value = phone;
    document.getElementById("email").value = email;
    document.getElementById("address").value = address;
}

function deleteContact(id) {
    fetch(`${BASE_URL}/${id}`, {
        method: "DELETE"
    }).then(() => fetchContacts());
}

function resetForm() {
    document.getElementById("contactId").value = "";
    document.getElementById("name").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("email").value = "";
    document.getElementById("address").value = "";
}
