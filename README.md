# 💰 Expense Tracker CLI

A simple **command-line tool** to track your expenses efficiently.  
Easily **add, delete, list, and summarize** your expenses.

🔗 **Project URL:** [Expense Tracker on Roadmap.sh](https://roadmap.sh/projects/expense-tracker)

## 🚀 Features

✅ Add, update, and delete expenses  
✅ View all expenses in a **table format**  
✅ Get **total expenses summary**  
✅ Filter expenses by **month**  
✅ Data stored in a JSON file (no database needed)

---

## 🛠️ Installation

### **1️⃣ Clone the repository**

```sh
git clone https://github.com/zeeshan2423/expense-tracker.git
cd expense-tracker
```

### **2️⃣ Install Node.js (if not installed)**

Download from [nodejs.org](https://nodejs.org/).

### **3️⃣ Link the CLI**

```sh
npm link
```

Now you can use `expense-tracker` directly from the terminal!

---

## 🖥️ Usage

### **Add an Expense**

```sh
expense-tracker add --description "Lunch" --amount 20
```

📌 **Output:** `Expense added successfully (ID: 1)`

### **List All Expenses**

```sh
expense-tracker list
```

📌 **Output:**

```
 ID  Date       Description  Amount
 1   2024-08-06  Lunch        $20
```

### **View Summary**

```sh
expense-tracker summary
```

📌 **Output:** `Total expenses: $20`

### **Delete an Expense**

```sh
expense-tracker delete --id 1
```

📌 **Output:** `Expense deleted successfully.`

---

## 📫 Contact

📩 **Email:** [zeeshan2423@gmail.com](mailto:zeeshan2423@gmail.com)  
💼 **GitHub:** [zeeshan2423](https://github.com/zeeshan2423)

---

⭐ **Feel free to contribute! Happy tracking!** 🚀
