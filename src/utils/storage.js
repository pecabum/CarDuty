import AsyncStorage from '@react-native-async-storage/async-storage';

const CARS_KEY = 'carduty_cars';
const EXPENSES_KEY = 'carduty_expenses';

// Car CRUD
export async function getCars() {
  const data = await AsyncStorage.getItem(CARS_KEY);
  return data ? JSON.parse(data) : [];
}

export async function saveCars(cars) {
  await AsyncStorage.setItem(CARS_KEY, JSON.stringify(cars));
}

export async function addCar(car) {
  const cars = await getCars();
  cars.push(car);
  await saveCars(cars);
  return cars;
}

export async function updateCar(id, updates) {
  const cars = await getCars();
  const idx = cars.findIndex((c) => c.id === id);
  if (idx !== -1) {
    cars[idx] = { ...cars[idx], ...updates };
    await saveCars(cars);
  }
  return cars;
}

export async function deleteCar(id) {
  let cars = await getCars();
  cars = cars.filter((c) => c.id !== id);
  await saveCars(cars);
  // Also delete related expenses
  let expenses = await getExpenses();
  expenses = expenses.filter((e) => e.carId !== id);
  await saveExpenses(expenses);
  return cars;
}

// Expense CRUD
export async function getExpenses() {
  const data = await AsyncStorage.getItem(EXPENSES_KEY);
  return data ? JSON.parse(data) : [];
}

export async function saveExpenses(expenses) {
  await AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
}

export async function addExpense(expense) {
  const expenses = await getExpenses();
  expenses.push(expense);
  await saveExpenses(expenses);
  return expenses;
}

export async function updateExpense(id, updates) {
  const expenses = await getExpenses();
  const idx = expenses.findIndex((e) => e.id === id);
  if (idx !== -1) {
    expenses[idx] = { ...expenses[idx], ...updates };
    await saveExpenses(expenses);
  }
  return expenses;
}

export async function deleteExpense(id) {
  let expenses = await getExpenses();
  expenses = expenses.filter((e) => e.id !== id);
  await saveExpenses(expenses);
  return expenses;
}

export async function getExpensesForCar(carId) {
  const expenses = await getExpenses();
  return expenses.filter((e) => e.carId === carId);
}
