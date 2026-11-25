
/* =========================================
   STUDENT EXPENSE TRACKER
   Dashboard JavaScript
========================================= */


/* =========================================
   1. SAMPLE TRANSACTION DATA
========================================= */

let transactions = [
    {
        id: 1,
        date: "2026-01-26",
        type: "income",
        category: "Allowance",
        description: "Monthly pocket money",
        payment: "Bank Transfer",
        amount: 5000
    },

    {
        id: 2,
        date: "2026-01-25",
        type: "expense",
        category: "Food",
        description: "Lunch at college",
        payment: "UPI",
        amount: 180
    },

    {
        id: 3,
        date: "2026-01-24",
        type: "expense",
        category: "Stationery",
        description: "Notebook and pens",
        payment: "Cash",
        amount: 260
    },

    {
        id: 4,
        date: "2026-01-23",
        type: "expense",
        category: "Travel",
        description: "Metro recharge",
        payment: "UPI",
        amount: 300
    },

    {
        id: 5,
        date: "2026-01-22",
        type: "income",
        category: "Cashback",
        description: "Credit card cashback",
        payment: "Credit Card",
        amount: 320
    },

    {
        id: 6,
        date: "2026-01-21",
        type: "expense",
        category: "Food",
        description: "Snacks",
        payment: "Cash",
        amount: 90
    },

    {
        id: 7,
        date: "2026-01-19",
        type: "expense",
        category: "College Stuff",
        description: "Lab printouts",
        payment: "UPI",
        amount: 160
    },

    {
        id: 8,
        date: "2026-01-18",
        type: "expense",
        category: "Investment",
        description: "Savings deposit",
        payment: "UPI",
        amount: 500
    }
];


/* =========================================
   2. CONSTANTS
========================================= */

const categoryColors = [
    "#6b35d9",
    "#8750e9",
    "#4f91fa",
    "#45c2d1",
    "#4ad17f",
    "#d8db58",
    "#ffc36c",
    "#f47c9a"
];

const incomeCategories = [
    "Allowance",
    "Scholarship",
    "Salary",
    "Cashback",
    "Other Income"
];

const expenseCategories = [
    "Food",
    "Snacks",
    "Travel",
    "Stationery",
    "College Stuff",
    "Clothes",
    "Friends / Family",
    "Investment",
    "Robotics Components",
    "Subscription",
    "Miscellaneous"
];

const paymentMethods = [
    "UPI",
    "Cash",
    "Debit Card",
    "Credit Card",
    "Bank Transfer",
    "Other"
];

const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];


/* =========================================
   3. DOM ELEMENTS
========================================= */

const yearSelect = document.getElementById("yearSelect");
const monthSelect = document.getElementById("monthSelect");

const allYearBtn = document.getElementById("allYearBtn");

const transactionRows = document.getElementById("transactionRows");

const transactionModal = document.getElementById("transactionModal");
const transactionForm = document.getElementById("transactionForm");

const amountInput = document.getElementById("amountInput");
const categoryInput = document.getElementById("categoryInput");
const dateInput = document.getElementById("dateInput");
const descriptionInput = document.getElementById("descriptionInput");
const paymentInput = document.getElementById("paymentInput");
const transactionTypeInput = document.getElementById("transactionType");

const addTransactionBtn = document.getElementById("addTransactionBtn");
const emptyAddBtn = document.getElementById("emptyAddBtn");

const closeModalBtn = document.getElementById("closeModal");
const cancelModalBtn = document.getElementById("cancelModal");

const emptyState = document.getElementById("emptyState");

const sidebar = document.getElementById("sidebar");
const mobileMenu = document.getElementById("mobileMenu");


/* =========================================
   4. VARIABLES
========================================= */

let categoryChart = null;
let incomeExpenseChart = null;

let currentType = "expense";
let editingTransactionId = null;


/* =========================================
   5. HELPER FUNCTIONS
========================================= */


/* Currency formatting */

function formatCurrency(amount) {
    return "₹ " + Number(amount || 0).toLocaleString("en-IN");
}


/* Date formatting */

function formatDate(dateString) {
    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}


/* Safe HTML output */

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
        const replacements = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return replacements[character];
    });
}


/* =========================================
   6. INITIALIZE YEAR SELECTOR
========================================= */

function initializeYearSelector() {

    const currentYear = new Date().getFullYear();

    for (let year = currentYear - 2; year <= currentYear + 5; year++) {

        const option = document.createElement("option");

        option.value = year;
        option.textContent = year;

        yearSelect.appendChild(option);
    }

    yearSelect.value = 2026;
}


/* =========================================
   7. INITIALIZE MONTH SELECTOR
========================================= */

function initializeMonthSelector() {

    monthNames.forEach(function (month, index) {

        const option = document.createElement("option");

        option.value = index;
        option.textContent = month;

        monthSelect.appendChild(option);
    });

    monthSelect.value = 0;
}


/* =========================================
   8. FILTER TRANSACTIONS
========================================= */

function getFilteredTransactions() {

    const selectedYear = Number(yearSelect.value);
    const selectedMonth = Number(monthSelect.value);

    const isAllYear = allYearBtn.classList.contains("active");

    if (isAllYear) {

        return transactions.filter(function (transaction) {

            const transactionYear = Number(
                transaction.date.substring(0, 4)
            );

            return transactionYear === selectedYear;

        });

    }

    return transactions.filter(function (transaction) {

        const transactionYear = Number(
            transaction.date.substring(0, 4)
        );

        const transactionMonth = Number(
            transaction.date.substring(5, 7)
        ) - 1;

        return (
            transactionYear === selectedYear &&
            transactionMonth === selectedMonth
        );

    });

}


/* =========================================
   9. DASHBOARD CALCULATIONS
========================================= */

function calculateDashboardData(list) {

    const incomeTransactions = list.filter(function (transaction) {
        return transaction.type === "income";
    });

    const expenseTransactions = list.filter(function (transaction) {
        return transaction.type === "expense";
    });

    const totalIncome = incomeTransactions.reduce(function (total, transaction) {
        return total + transaction.amount;
    }, 0);

    const totalExpense = expenseTransactions.reduce(function (total, transaction) {
        return total + transaction.amount;
    }, 0);

    const cashback = incomeTransactions
        .filter(function (transaction) {
            return transaction.category === "Cashback";
        })
        .reduce(function (total, transaction) {
            return total + transaction.amount;
        }, 0);

    const savings = totalIncome - totalExpense;

    return {
        totalIncome,
        totalExpense,
        cashback,
        savings,
        incomeTransactions,
        expenseTransactions
    };

}


/* =========================================
   10. UPDATE SUMMARY CARDS
========================================= */

function updateSummaryCards(list) {

    const data = calculateDashboardData(list);

    const selectedYear = Number(yearSelect.value);
    const selectedMonth = Number(monthSelect.value);

    const isAllYear = allYearBtn.classList.contains("active");

    let days;

    if (isAllYear) {

        const currentDate = new Date();

        if (selectedYear === currentDate.getFullYear()) {
            days = getDayOfYear(currentDate);
        } else {
            days = 365;
        }

    } else {

        days = new Date(
            selectedYear,
            selectedMonth + 1,
            0
        ).getDate();

    }

    days = Math.max(days, 1);

    const dailyAverage = Math.round(
        data.totalExpense / days
    );

    document.getElementById("totalIncome").textContent =
        formatCurrency(data.totalIncome);

    document.getElementById("totalExpense").textContent =
        formatCurrency(data.totalExpense);

    document.getElementById("cashback").textContent =
        formatCurrency(data.cashback);

    document.getElementById("balance").textContent =
        formatCurrency(data.savings);

    document.getElementById("dailyAverage").textContent =
        formatCurrency(dailyAverage);

    document.getElementById("savings").textContent =
        formatCurrency(data.savings);

    document.getElementById("donutTotal").textContent =
        formatCurrency(data.totalExpense);

    document.getElementById("transactionCount").textContent =
        list.length;

}


/* Day of year helper */

function getDayOfYear(date) {

    const start = new Date(date.getFullYear(), 0, 0);

    const difference = date - start;

    const oneDay = 1000 * 60 * 60 * 24;

    return Math.floor(difference / oneDay);

}


/* =========================================
   11. CATEGORY CHART
========================================= */

function renderCategoryChart(list) {

    const expenses = list.filter(function (transaction) {
        return transaction.type === "expense";
    });

    const categoryTotals = {};

    expenses.forEach(function (transaction) {

        if (!categoryTotals[transaction.category]) {
            categoryTotals[transaction.category] = 0;
        }

        categoryTotals[transaction.category] += transaction.amount;

    });

    const entries = Object.entries(categoryTotals)
        .sort(function (a, b) {
            return b[1] - a[1];
        });

    const labels = entries.length
        ? entries.map(function (entry) {
            return entry[0];
        })
        : ["No expenses"];

    const values = entries.length
        ? entries.map(function (entry) {
            return entry[1];
        })
        : [1];

    const colors = entries.map(function (_, index) {
        return categoryColors[index % categoryColors.length];
    });

    if (categoryChart) {
        categoryChart.destroy();
    }

    categoryChart = new Chart(
        document.getElementById("categoryChart"),
        {
            type: "doughnut",

            data: {
                labels: labels,

                datasets: [
                    {
                        data: values,
                        backgroundColor: colors,
                        borderWidth: 0,
                        hoverOffset: 5
                    }
                ]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: "64%",

                plugins: {
                    legend: {
                        display: false
                    },

                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return (
                                    context.label +
                                    ": " +
                                    formatCurrency(context.raw)
                                );
                            }
                        }
                    }
                }
            }
        }
    );


    /* CATEGORY LEGEND */

    const categoryLegend = document.getElementById("categoryLegend");

    if (entries.length === 0) {

        categoryLegend.innerHTML =
            "<p>No expenses in this period.</p>";

    } else {

        categoryLegend.innerHTML = entries.map(function (entry, index) {

            const category = entry[0];
            const amount = entry[1];

            const percentage = expenses.reduce(function (total, transaction) {
                return total + transaction.amount;
            }, 0);

            const percent = percentage > 0
                ? ((amount / percentage) * 100).toFixed(1)
                : "0.0";

            return `
                <div class="legend-row">

                    <span
                        class="legend-swatch"
                        style="background:${colors[index]}"
                    ></span>

                    <span class="legend-name">
                        ${escapeHTML(category)}
                    </span>

                    <span class="legend-value">
                        ${formatCurrency(amount)}
                    </span>

                    <span class="legend-percent">
                        ${percent}%
                    </span>

                </div>
            `;

        }).join("");

    }


    /* HIGHEST SPENDING CATEGORY */

    const highestCategory = entries[0];

    if (highestCategory) {

        const totalExpense = expenses.reduce(function (total, transaction) {
            return total + transaction.amount;
        }, 0);

        const percentage = totalExpense > 0
            ? ((highestCategory[1] / totalExpense) * 100).toFixed(1)
            : 0;

        document.getElementById("highestCategory").textContent =
            highestCategory[0] + " (" + formatCurrency(highestCategory[1]) + ")";

        document.getElementById("highestPercent").textContent =
            percentage + "% of total expense";

    } else {

        document.getElementById("highestCategory").textContent =
            "No expenses";

        document.getElementById("highestPercent").textContent =
            "Add expenses to see insights";

    }

}


/* =========================================
   12. INCOME VS EXPENSE CHART
========================================= */

function renderIncomeExpenseChart(list) {

    const data = calculateDashboardData(list);

    if (incomeExpenseChart) {
        incomeExpenseChart.destroy();
    }

    incomeExpenseChart = new Chart(
        document.getElementById("incomeExpenseChart"),
        {
            type: "bar",

            data: {
                labels: ["Income", "Expense"],

                datasets: [
                    {
                        data: [
                            data.totalIncome,
                            data.totalExpense
                        ],

                        backgroundColor: [
                            "#7840db",
                            "#75b7fa"
                        ],

                        borderRadius: 7,
                        borderSkipped: false,
                        maxBarThickness: 65
                    }
                ]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                plugins: {
                    legend: {
                        display: false
                    },

                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return formatCurrency(context.raw);
                            }
                        }
                    }
                },

                scales: {

                    x: {
                        grid: {
                            display: false
                        },

                        ticks: {
                            color: "#222944"
                        }
                    },

                    y: {
                        beginAtZero: true,

                        ticks: {
                            color: "#222944",

                            callback: function (value) {
                                return value.toLocaleString("en-IN");
                            }
                        },

                        grid: {
                            color: "#e5e8f3"
                        }
                    }

                }
            }
        }
    );

}


/* =========================================
   13. TRANSACTION TABLE
========================================= */

function renderTransactionTable(list) {

    const sortedTransactions = [...list].sort(function (a, b) {
        return b.date.localeCompare(a.date);
    });

    const recentTransactions = sortedTransactions.slice(0, 8);

    if (recentTransactions.length === 0) {

        transactionRows.innerHTML = "";

        emptyState.classList.remove("hidden");

        document.querySelector(".table-wrap").classList.add("hidden");

        return;

    }

    emptyState.classList.add("hidden");

    document.querySelector(".table-wrap").classList.remove("hidden");


    transactionRows.innerHTML = recentTransactions.map(function (transaction) {

        const typeLabel = transaction.type === "income"
            ? "↑ Income"
            : "↓ Expense";

        const amountPrefix = transaction.type === "income"
            ? "+"
            : "−";

        return `
            <tr>

                <td>
                    ${formatDate(transaction.date)}
                </td>

                <td>
                    <span class="type-pill ${transaction.type}">
                        ${typeLabel}
                    </span>
                </td>

                <td>
                    ${escapeHTML(transaction.category)}
                </td>

                <td>
                    ${escapeHTML(transaction.description)}
                </td>

                <td>
                    ${escapeHTML(transaction.payment)}
                </td>

                <td class="amount ${transaction.type}">
                    ${amountPrefix} ${formatCurrency(transaction.amount)}
                </td>

                <td>

                    <button
                        class="action-btn edit-btn"
                        data-id="${transaction.id}"
                        title="Edit transaction"
                    >
                        ✎
                    </button>

                    <button
                        class="action-btn delete-btn"
                        data-id="${transaction.id}"
                        title="Delete transaction"
                    >
                        🗑
                    </button>

                </td>

            </tr>
        `;

    }).join("");


    /* EDIT BUTTONS */

    document.querySelectorAll(".edit-btn").forEach(function (button) {

        button.addEventListener("click", function () {

            const id = Number(button.dataset.id);

            editTransaction(id);

        });

    });


    /* DELETE BUTTONS */

    document.querySelectorAll(".delete-btn").forEach(function (button) {

        button.addEventListener("click", function () {

            const id = Number(button.dataset.id);

            deleteTransaction(id);

        });

    });

}


/* =========================================
   14. RENDER DASHBOARD
========================================= */

function renderDashboard() {

    const filteredTransactions = getFilteredTransactions();

    updateSummaryCards(filteredTransactions);

    renderCategoryChart(filteredTransactions);

    renderIncomeExpenseChart(filteredTransactions);

    renderTransactionTable(filteredTransactions);

}


/* =========================================
   15. CATEGORY SELECTOR
========================================= */

function populateCategoryOptions() {

    const categories = currentType === "income"
        ? incomeCategories
        : expenseCategories;

    categoryInput.innerHTML = "";

    categories.forEach(function (category) {

        const option = document.createElement("option");

        option.value = category;
        option.textContent = category;

        categoryInput.appendChild(option);

    });

}


/* =========================================
   16. PAYMENT METHOD SELECTOR
========================================= */

function populatePaymentOptions() {

    paymentInput.innerHTML = "";

    paymentMethods.forEach(function (method) {

        const option = document.createElement("option");

        option.value = method;
        option.textContent = method;

        paymentInput.appendChild(option);

    });

}


/* =========================================
   17. OPEN TRANSACTION MODAL
========================================= */

function openTransactionModal() {

    editingTransactionId = null;

    transactionForm.reset();

    currentType = "expense";

    transactionTypeInput.value = "expense";

    document.querySelectorAll(".type-toggle button").forEach(function (button) {

        button.classList.remove("selected");

        if (button.dataset.type === "expense") {
            button.classList.add("selected");
        }

    });

    populateCategoryOptions();

    populatePaymentOptions();

    dateInput.value = new Date().toISOString().split("T")[0];

    document.querySelector(".modal-header h2").textContent =
        "Add Transaction";

    transactionForm.querySelector(
        'button[type="submit"]'
    ).textContent = "Save Transaction";

    transactionModal.classList.remove("hidden");

}


/* =========================================
   18. CLOSE MODAL
========================================= */

function closeTransactionModal() {

    transactionModal.classList.add("hidden");

    transactionForm.reset();

    editingTransactionId = null;

}


/* =========================================
   19. SWITCH INCOME / EXPENSE
========================================= */

document.querySelectorAll(".type-toggle button").forEach(function (button) {

    button.addEventListener("click", function () {

        document.querySelectorAll(".type-toggle button").forEach(function (item) {
            item.classList.remove("selected");
        });

        button.classList.add("selected");

        currentType = button.dataset.type;

        transactionTypeInput.value = currentType;

        populateCategoryOptions();

    });

});


/* =========================================
   20. ADD TRANSACTION
========================================= */

transactionForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const amount = Number(amountInput.value);

    if (!amount || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    const transaction = {

        id: editingTransactionId || Date.now(),

        date: dateInput.value,

        type: currentType,

        category: categoryInput.value,

        description: descriptionInput.value.trim(),

        payment: paymentInput.value,

        amount: amount

    };


    /* EDIT EXISTING TRANSACTION */

    if (editingTransactionId) {

        transactions = transactions.map(function (item) {

            if (item.id === editingTransactionId) {
                return transaction;
            }

            return item;

        });

    }

    /* ADD NEW TRANSACTION */

    else {

        transactions.push(transaction);

    }


    closeTransactionModal();

    renderDashboard();

});


/* =========================================
   21. EDIT TRANSACTION
========================================= */

function editTransaction(id) {

    const transaction = transactions.find(function (item) {
        return item.id === id;
    });

    if (!transaction) {
        return;
    }

    editingTransactionId = id;

    currentType = transaction.type;

    transactionTypeInput.value = transaction.type;

    document.querySelectorAll(".type-toggle button").forEach(function (button) {

        button.classList.remove("selected");

        if (button.dataset.type === transaction.type) {
            button.classList.add("selected");
        }

    });

    populateCategoryOptions();

    populatePaymentOptions();

    amountInput.value = transaction.amount;

    categoryInput.value = transaction.category;

    dateInput.value = transaction.date;

    descriptionInput.value = transaction.description;

    paymentInput.value = transaction.payment;

    document.querySelector(".modal-header h2").textContent =
        "Edit Transaction";

    transactionForm.querySelector(
        'button[type="submit"]'
    ).textContent = "Update Transaction";

    transactionModal.classList.remove("hidden");

}


/* =========================================
   22. DELETE TRANSACTION
========================================= */

function deleteTransaction(id) {

    const confirmation = confirm(
        "Are you sure you want to delete this transaction?"
    );

    if (!confirmation) {
        return;
    }

    transactions = transactions.filter(function (transaction) {
        return transaction.id !== id;
    });

    renderDashboard();

}


/* =========================================
   23. MONTH / YEAR FILTERS
========================================= */

yearSelect.addEventListener("change", function () {

    renderDashboard();

});


monthSelect.addEventListener("change", function () {

    allYearBtn.classList.remove("active");

    renderDashboard();

});


allYearBtn.addEventListener("click", function () {

    allYearBtn.classList.toggle("active");

    renderDashboard();

});


/* =========================================
   24. ADD BUTTONS
========================================= */

addTransactionBtn.addEventListener(
    "click",
    openTransactionModal
);

emptyAddBtn.addEventListener(
    "click",
    openTransactionModal
);


/* =========================================
   25. MODAL CLOSE BUTTONS
========================================= */

closeModalBtn.addEventListener(
    "click",
    closeTransactionModal
);

cancelModalBtn.addEventListener(
    "click",
    closeTransactionModal
);


/* CLOSE MODAL WHEN CLICKING OUTSIDE */

transactionModal.addEventListener("click", function (event) {

    if (event.target === transactionModal) {
        closeTransactionModal();
    }

});


/* =========================================
   26. MOBILE SIDEBAR
========================================= */

mobileMenu.addEventListener("click", function () {

    sidebar.classList.toggle("open");

});


/* =========================================
   27. NAVIGATION PLACEHOLDERS
========================================= */

document.querySelectorAll(".nav-item").forEach(function (button) {

    button.addEventListener("click", function () {

        document.querySelectorAll(".nav-item").forEach(function (item) {

            item.classList.remove("active");

        });

        button.classList.add("active");

        const page = button.dataset.page;

        if (page !== "Dashboard") {

            alert(
                page +
                " page will be developed in a later phase."
            );

        }

        if (window.innerWidth <= 760) {

            sidebar.classList.remove("open");

        }

    });

});


/* =========================================
   28. INITIALIZE APPLICATION
========================================= */

function initializeApp() {

    initializeYearSelector();

    initializeMonthSelector();

    populateCategoryOptions();

    populatePaymentOptions();

    renderDashboard();

}


/* RUN APPLICATION */

initializeApp();
