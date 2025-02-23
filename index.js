#!/usr/bin/env node
const { Command } = require('commander');
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, './expenses.json');

// Read expense data from JSON file
function readData() {
  try {
    const data = fs.readFileSync(DATA_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Write expense data to JSON file
function writeData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

// Generate next expense ID
function generateNextId(expenses) {
  return expenses.reduce((max, exp) => Math.max(max, exp.id), 0) + 1;
}

// Format currency display
function formatCurrency(amount) {
  return amount % 1 === 0 ? `$${amount}` : `$${amount.toFixed(2)}`;
}

const program = new Command();

program
  .name('expense-tracker')
  .description('CLI Expense Tracker for managing personal finances')
  .version('1.0.0');

// Add Expense Command
program.command('add')
  .description('Add a new expense')
  .requiredOption('--description <string>', 'Expense description')
  .requiredOption('--amount <number>', 'Expense amount', parseFloat)
  .action((options) => {
    if (options.amount <= 0) {
      console.error('Error: Amount must be a positive number');
      process.exit(1);
    }

    const expenses = readData();
    const newExpense = {
      id: generateNextId(expenses),
      date: new Date().toISOString().split('T')[0],
      description: options.description,
      amount: options.amount
    };

    expenses.push(newExpense);
    writeData(expenses);
    console.log(`Expense added successfully (ID: ${newExpense.id})`);
  });

// Delete Expense Command
program.command('delete')
  .description('Delete an expense by ID')
  .requiredOption('--id <number>', 'Expense ID', parseInt)
  .action((options) => {
    const expenses = readData();
    const initialLength = expenses.length;
    const filtered = expenses.filter(exp => exp.id !== options.id);

    if (filtered.length === initialLength) {
      console.error(`Error: Expense with ID ${options.id} not found`);
      process.exit(1);
    }

    writeData(filtered);
    console.log('Expense deleted successfully');
  });

// Update Expense Command
program.command('update')
  .description('Update an existing expense')
  .requiredOption('--id <number>', 'Expense ID', parseInt)
  .option('--description <string>', 'New description')
  .option('--amount <number>', 'New amount', parseFloat)
  .option('--date <string>', 'New date (YYYY-MM-DD)')
  .action((options) => {
    const expenses = readData();
    const expense = expenses.find(exp => exp.id === options.id);

    if (!expense) {
      console.error(`Error: Expense with ID ${options.id} not found`);
      process.exit(1);
    }

    if (options.amount !== undefined) {
      if (options.amount <= 0) {
        console.error('Error: Amount must be a positive number');
        process.exit(1);
      }
      expense.amount = options.amount;
    }

    if (options.description) expense.description = options.description;
    if (options.date) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(options.date)) {
        console.error('Error: Invalid date format. Use YYYY-MM-DD');
        process.exit(1);
      }
      expense.date = options.date;
    }

    writeData(expenses);
    console.log('Expense updated successfully');
  });

// List Expenses Command
program.command('list')
  .description('List all expenses')
  .action(() => {
    const expenses = readData();
    
    if (expenses.length === 0) {
      console.log('No expenses found');
      return;
    }

    console.log('ID  Date       Description  Amount');
    expenses.forEach(exp => {
      console.log(
        `${exp.id.toString().padEnd(3)} ` +
        `${exp.date.padEnd(10)} ` +
        `${exp.description.padEnd(12)} ` +
        `${formatCurrency(exp.amount).padStart(8)}`
      );
    });
  });

// Summary Command
program.command('summary')
  .description('Show expense summary')
  .option('--month <number>', 'Month number (1-12)')
  .action((options) => {
    const expenses = readData();
    let total = 0;
    let message = 'Total expenses';

    if (options.month) {
      const month = parseInt(options.month);
      if (month < 1 || month > 12) {
        console.error('Error: Month must be between 1 and 12');
        process.exit(1);
      }

      const currentYear = new Date().getFullYear();
      const filtered = expenses.filter(exp => {
        const [year, expMonth] = exp.date.split('-');
        return parseInt(year) === currentYear && parseInt(expMonth) === month;
      });

      total = filtered.reduce((sum, exp) => sum + exp.amount, 0);
      const monthName = new Date(currentYear, month - 1)
        .toLocaleString('default', { month: 'long' });
      message = `Total expenses for ${monthName}`;
    } else {
      total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    }

    console.log(`${message}: ${formatCurrency(total)}`);
  });

program.parse(process.argv);