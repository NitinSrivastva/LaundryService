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

document.getElementById("book-service-today")?.addEventListener("click", function() {
  document.getElementById("OurServices").scrollIntoView({ behavior: 'smooth' });
});

const cartItems = [];

function addItem(button) {

  const serviceDiv = button.parentElement;
  const serviceName = serviceDiv.querySelector(".name").textContent;
  const priceText = serviceDiv.querySelector(".price").textContent;
  const price = parseFloat(priceText.replace(/[^\d.]/g, ""));

  const existing = cartItems.find(item => item.name === serviceName);

  if (existing) {

    /* REMOVE ITEM */

    const index = cartItems.indexOf(existing);
    cartItems.splice(index,1);

    button.textContent = "Add Item";
    button.classList.remove("remove-btn");

  } else {

    /* ADD ITEM */

    cartItems.push({ name: serviceName, price: price });

    button.textContent = "Remove Item";
    button.classList.add("remove-btn");

  }

  updateCartTable();
}

function updateCartTable() {

  const tbody = document.querySelector("#added-item tbody");
  tbody.innerHTML = "";

  let total = 0;

  if(cartItems.length === 0){

    tbody.innerHTML = `
      <tr>
        <td colspan="3" style="text-align:center;color:#999">
          No items added
        </td>
      </tr>
    `;

  }else{

    cartItems.forEach((item, index) => {

      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${index+1}</td>
        <td>${item.name}</td>
        <td>₹${item.price.toFixed(2)}</td>
      `;

      tbody.appendChild(row);

      total += item.price;

    });

  }

  document.querySelector("#added-item .total h3").textContent =
    `₹${total.toFixed(2)}`;

  const bookBtn = document.querySelector(".book-btn");

  bookBtn.disabled = cartItems.length === 0;

}

document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector(".form-box");
    const confirmationMessage = document.getElementById("confirmation-message");
    const bookBtn = document.querySelector(".book-btn");

    bookBtn.disabled = true;

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

            services: cartItems
            .map(i => `${i.name} - ₹${i.price}`)
            .join(", "),

            total_price: cartItems
            .reduce((sum,item)=>sum+item.price,0)

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

    const tbody = document.querySelector("#added-item tbody");

    tbody.innerHTML = `
      <tr>
        <td colspan="3" style="text-align:center;color:#999">
          No items added
        </td>
      </tr>
    `;

    document.querySelector("#added-item .total h3").textContent = "₹0.00";

    document.querySelectorAll(".add-btn").forEach(btn=>{
        btn.textContent="Add Item";
        btn.classList.remove("remove-btn");
    });

}

