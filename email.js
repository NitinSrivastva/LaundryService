document.getElementById("book-service-today").addEventListener("click", function() {
  document.getElementById("OurServices").scrollIntoView({ behavior: 'smooth' });
});

// Global array to keep track of added items
const cartItems = [];

function addItem(button) {
  // Get the parent service-item div of the clicked button
  const serviceDiv = button.parentElement;

  // Get service name and price from the div
  const serviceName = serviceDiv.querySelector(".name").textContent;
  const priceText = serviceDiv.querySelector(".price").textContent; // e.g. ₹200.00

  // Parse price number (remove currency symbol and commas)
  const price = parseFloat(priceText.replace(/[^\d.]/g, ""));

  // Check if item is already in cart
  if (cartItems.find(item => item.name === serviceName)) {
    alert(serviceName + " is already added.");
    return;
  }

  // Add to cart array
  cartItems.push({ name: serviceName, price: price });

  // Update the table
  updateCartTable();
}

function updateCartTable() {
  const table = document.querySelector("#added-item table");

  // Clear all rows except the header row (index 0)
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

  let total = 0;

  // Add each cart item as a new row
  cartItems.forEach((item, index) => {
    const row = table.insertRow(-1);

    const cell1 = row.insertCell(0);
    cell1.textContent = index + 1;

    const cell2 = row.insertCell(1);
    cell2.textContent = item.name;

    const cell3 = row.insertCell(2);
    cell3.textContent = `₹${item.price.toFixed(2)}`;

    total += item.price;
  });

  // Update total amount display
  const totalAmountElement = document.querySelector("#added-item .total h3");
  totalAmountElement.textContent = `₹${total.toFixed(2)}`;
}