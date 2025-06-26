let table = document.querySelector(".heading");
let items = document.getElementById("items");
let cost = document.getElementById("cost");
let dis = document.getElementById("dis");
let final = document.getElementById("final");
let addProductForm = document.getElementById("addProductForm");
let promo = document.getElementById("promo");

let disco = 0;
let productList = JSON.parse(localStorage.getItem("productList")) || [];

function getTotal(){
  let totalCost = 0;
  let totalItems = 0;
  document.querySelectorAll(".product-row").forEach(row=>{
    let qnt = Number(row.querySelector(".quantity").innerText);
    let ttl = Number(row.querySelector(".total").innerText);
    totalCost+=ttl;
    totalItems+=qnt;
  });
  items.innerText = totalItems;
  cost.innerText = totalCost;
  final.innerText = totalCost - disco;
}

function addNewProduct(product) {
  let tr = document.createElement("tr");
  tr.classList.add("product-row");
  tr.innerHTML = `
  <td><img src="${product.image}" alt="${product.name}" width="50"></td>
  <td>${product.name}</td>
  <td class="price">${product.price}</td>
  <td class="quantity">${product.quantity}</td>
  <td><button class="removeBtn">Remove</button></td>
  <td><button class="addBtn">[+]</button></td>
  <td><button class="deleteBtn">[-]</button></td>
  <td class="total">${product.total}</td>
  `;
  table.appendChild(tr);
  getTotal();
  let quantity = product.quantity;
  let quantityCell = tr.querySelector(".quantity");
  let totalCell = tr.querySelector(".total");
  let price = parseFloat(product.price);
  
  tr.querySelector(".addBtn").addEventListener("click", () => {
    quantity++;
    quantityCell.innerText = quantity;
    totalCell.innerText = quantity * price;
    let productList = JSON.parse(localStorage.getItem("productList")) || [];
    productList.forEach(pro => {
      if (pro.id === product.id) {
        pro.quantity = (pro.quantity || 1) + 1;
        pro.total = (pro.total || pro.price) + pro.price;
      }
    });
    localStorage.setItem("productList", JSON.stringify(productList));
    getTotal();
  });
  
  tr.querySelector(".deleteBtn").addEventListener("click", () => {
    if (quantity > 0) {
      quantity--;
      quantityCell.innerText = quantity;
      totalCell.innerText = quantity * price;
    let productList = JSON.parse(localStorage.getItem("productList")) || [];
    productList.forEach(pro => {
      if (pro.id === product.id) {
        pro.quantity = (pro.quantity || 1) - 1;
        pro.total = (pro.total || pro.price) - pro.price;
      }
    });
    localStorage.setItem("productList", JSON.stringify(productList));  
      getTotal();
    }
    if (quantity === 0){
    let productList = JSON.parse(localStorage.getItem("productList")) || [];
    let updatedProductList = productList.filter(
    (pro) => pro.id !== product.id
    );
    localStorage.setItem("productList", JSON.stringify(updatedProductList));
      tr.remove();
    }
  });
  
  tr.querySelector(".removeBtn").addEventListener("click", () => {
    quantity = 0;
    quantityCell.innerText = 0;
    totalCell.innerText = 0;
    let productList = JSON.parse(localStorage.getItem("productList")) || [];
    let updatedProductList = productList.filter(
    (pro) => pro.id !== product.id
    );
    localStorage.setItem("productList", JSON.stringify(updatedProductList));
    tr.remove();
    getTotal();
  });
}
addProductForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let name = document.getElementById("prodName").value;
  let price = parseFloat(document.getElementById("prodPrice").value);
  let quantity = 1;
  let total = price;
  let image = document.getElementById("prodImage").value;

  let newProduct = { id: Date.now().toString(), name, price, quantity, total, image };
  productList.push(newProduct);
  localStorage.setItem("productList", JSON.stringify(productList));
  addNewProduct(newProduct);
  addProductForm.reset();
});

promo.addEventListener("submit", (e) => {
  e.preventDefault();
  let total = parseFloat(cost.innerText) || 0;
  if (code.value === "SAVE15") {
    dis.innerText = (total * 0.15).toFixed(2);
    disco = parseFloat(dis.innerText);
    final.innerText = (total - disco).toFixed(2);
    document.querySelector("#msg").innerText = "Congratulations! You've cracked the promo offer!";
  } 
  else {
    dis.innerText = 0;
    disco = 0;
    final.innerText = total.toFixed(2);
    document.querySelector("#msg").innerText = "Sorry! Wrong code";
  }
    getTotal();
});

window.addEventListener("DOMContentLoaded", () => {
  productList = JSON.parse(localStorage.getItem("productList")) || [];
  productList.forEach(product => {
    addNewProduct(product);
  });
  getTotal();
});