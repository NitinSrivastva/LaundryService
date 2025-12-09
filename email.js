
const EMAILJS_PUBLIC_KEY = "2pQBfNq9VLrkU97sO"; 
const EMAILJS_SERVICE_ID = "service_zq1q0lq"; 
const EMAILJS_TEMPLATE_ID = "template_nfcjilg"; 


function loadEmailJS(callback) {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js";
    script.onload = callback;
    document.body.appendChild(script);
}

loadEmailJS(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    console.log("EmailJS Loaded Successfully");
});

document.getElementById("book-service-today").addEventListener("click", function() {
  document.getElementById("OurServices").scrollIntoView({ behavior: 'smooth' });
});

const cartItems = [];

function addItem(button) {
  const serviceDiv = button.parentElement;
  const serviceName = serviceDiv.querySelector(".name").textContent;
  const priceText = serviceDiv.querySelector(".price").textContent;
  const price = parseFloat(priceText.replace(/[^\d.]/g, ""));

  if (cartItems.find(item => item.name === serviceName)) {
    alert(serviceName + " is already added.");
    return;
  }

  cartItems.push({ name: serviceName, price: price });
  updateCartTable();
}

function updateCartTable() {
  const table = document.querySelector("#added-item table");

  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

  let total = 0;

  cartItems.forEach((item, index) => {
    const row = table.insertRow(-1);

    row.insertCell(0).textContent = index + 1;
    row.insertCell(1).textContent = item.name;
    row.insertCell(2).textContent = `₹${item.price.toFixed(2)}`;

    total += item.price;
  });

  document.querySelector("#added-item .total h3").textContent = `₹${total.toFixed(2)}`;
}



document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector(".form-box");
    const confirmationMessage = document.getElementById("confirmation-message");
    const bookBtn = document.querySelector(".book-btn");

    function validateForm() {
        const fullName = form.querySelector("input[placeholder='John Doe']").value.trim();
        const email = form.querySelector("input[placeholder='mailid@gmail.com']").value.trim();
        const phone = form.querySelector("input[placeholder='0000000000']").value.trim();

        if (fullName === "") return alert("Full Name is required.");
        if (!/^\S+@\S+\.\S+$/.test(email)) return alert("Enter a valid Email ID.");
        if (!/^\d{10}$/.test(phone)) return alert("Phone number must be 10 digits.");
        if (cartItems.length === 0) return alert("Please add at least one service before booking.");

        return true;
    }

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        if (!validateForm()) return;

        bookBtn.disabled = true;
        bookBtn.textContent = "Sending...";

        const fullName = form.querySelector("input[placeholder='John Doe']").value;
        const email = form.querySelector("input[placeholder='mailid@gmail.com']").value;
        const phone = form.querySelector("input[placeholder='0000000000']").value;

        const params = {
            full_name: fullName,
            email: email,
            phone: phone,
            services: cartItems.map(i => `<li>${i.name} — ₹${i.price}</li>`).join(""),
            total_price: cartItems.reduce((sum, item) => sum + item.price, 0)
        };

        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params)
        .then(() => {
            confirmationMessage.style.display = "block";
            form.reset();
            clearCart();
        })
        .catch(err => {
            alert("Email sending failed.");
            console.error("Error:", err);
        })
        .finally(() => {
            bookBtn.disabled = false;
            bookBtn.textContent = "Book now";
        });

    });

});

function clearCart() {
    cartItems.length = 0;

    const table = document.querySelector("#added-item table");
    while (table.rows.length > 1) table.deleteRow(1);

    document.querySelector("#added-item .total h3").textContent = "₹0.00";
}


sendEmail({
  to: user.email,
  template: "order-confirmation",
  data: {
    orderId: order.id,
    shipping: order.shipping,
    Handling_Cost: order.Handling_Cost,
    total: order.total
  }
});
