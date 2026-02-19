const BASE_URL = "http://localhost:3000/contacts";
let allContacts = [];

document.addEventListener("DOMContentLoaded", fetchContacts);

function fetchContacts() {
    fetch(BASE_URL)
        .then(res => res.json())
        .then(data => {
            allContacts = data;
            renderContacts(data);
        });
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

/* SEARCH FUNCTION */
function filterContacts() {
    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    const filtered = allContacts.filter(contact =>
        contact.name.toLowerCase().includes(searchValue)
    );
    renderContacts(filtered);
}

/* VALIDATION */
function validateForm(name, phone, email, address) {
    let isValid = true;

    document.querySelectorAll(".error").forEach(e => e.innerText = "");

    if (!name) {
        document.getElementById("nameError").innerText = "Name is required";
        isValid = false;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
        document.getElementById("phoneError").innerText = "Phone must be 10 digits";
        isValid = false;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        document.getElementById("emailError").innerText = "Invalid email format";
        isValid = false;
    }

    if (!address) {
        document.getElementById("addressError").innerText = "Address is required";
        isValid = false;
    }

    return isValid;
}

function saveContact() {
    const id = document.getElementById("contactId").value;
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const address = document.getElementById("address").value.trim();

    if (!validateForm(name, phone, email, address)) return;

    const contact = { name, phone, email, address };

    if (id) {
        fetch(`${BASE_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(contact)
        }).then(() => {
            fetchContacts();
            hideForm();
        });
    } else {
        fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(contact)
        }).then(() => {
            fetchContacts();
            hideForm();
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
