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
            <tr>
                <td>${contact.name}</td>
                <td>${contact.phone}</td>
                <td>${contact.email}</td>
                <td>${contact.address}</td>
                <td>
                    <button class="action-btn edit-btn"
                        onclick="editContact(${contact.id}, '${contact.name}', '${contact.phone}', '${contact.email}', '${contact.address}')">
                        Edit
                    </button>
                    <button class="action-btn delete-btn"
                        onclick="deleteContact(${contact.id})">
                        Delete
                    </button>
                </td>
            </tr>
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
            hideForm();
            fetchContacts();
        });
    } else {
        fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(contact)
        }).then(() => {
            resetForm();
            hideForm();
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
    showForm();
}

function deleteContact(id) {
    fetch(`${BASE_URL}/${id}`, {
        method: "DELETE"
    }).then(() => fetchContacts());
}

function showForm() {
    document.getElementById("formSection").style.display = "block";
}

function hideForm() {
    document.getElementById("formSection").style.display = "none";
    resetForm();
}

function resetForm() {
    document.getElementById("contactId").value = "";
    document.getElementById("name").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("email").value = "";
    document.getElementById("address").value = "";
}
