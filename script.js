const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const date = document.getElementById("date");
const breakdownList = document.getElementById("category-breakdown");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function saveAndUpdate() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
    updateUI();
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function addTransactionDOM(transaction) {
    const li = document.createElement("li");

    // Set class based on income or expense
    li.classList.add(transaction.amount < 0 ? "expense" : "income");

    // Calculate sign and absolute value
    const sign = transaction.amount < 0 ? "-" : "+";
    const absAmount = Math.abs(transaction.amount).toFixed(2);
    const displayDate = formatDate(transaction.date);

    li.innerHTML = `
    <strong>${transaction.text}</strong> (${transaction.category})<br>
    <strong>${sign} ₹${absAmount}</strong>
    <span>${displayDate}</span>
    <button onclick="removeTransaction(${transaction.id})">x</button>
  `;

    list.appendChild(li);
}



function updateBreakdown() {
    const categories = {};

    transactions.forEach((t) => {
        if (t.amount < 0) {
            categories[t.category] = (categories[t.category] || 0) + Math.abs(t.amount);
        }
    });

    breakdownList.innerHTML = "";

    for (let cat in categories) {
        const li = document.createElement("li");
        li.textContent = `${cat}: ₹${categories[cat].toFixed(2)}`;
        breakdownList.appendChild(li);
    }

    if (Object.keys(categories).length === 0) {
        breakdownList.innerHTML = "<li>No expenses yet</li>";
    }
}

function updateUI() {
    list.innerHTML = "";
    let total = 0,
        inc = 0,
        exp = 0;

    transactions.forEach((tran) => {
        addTransactionDOM(tran);
        total += tran.amount;
        if (tran.amount > 0) inc += tran.amount;
        else exp += tran.amount;
    });

    balance.innerText = `₹${total.toFixed(2)}`;
    income.innerText = `₹${inc.toFixed(2)}`;
    expense.innerText = `₹${Math.abs(exp).toFixed(2)}`;
    updateBreakdown();
}

function removeTransaction(id) {
    transactions = transactions.filter((t) => t.id !== id);
    saveAndUpdate();
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (
        text.value.trim() === "" ||
        amount.value.trim() === "" ||
        category.value.trim() === "" ||
        date.value.trim() === ""
    ) {
        alert("Please fill all fields");
        return;
    }

    const transaction = {
        id: Date.now(),
        text: text.value,
        amount: +amount.value,
        category: category.value,
        date: date.value,
    };

    transactions.push(transaction);
    saveAndUpdate();
    form.reset();
});

// INIT
updateUI();
