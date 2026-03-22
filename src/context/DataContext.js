import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as storage from '../utils/storage';
import { generateId } from '../utils/constants';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [cars, setCars] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [c, e] = await Promise.all([storage.getCars(), storage.getExpenses()]);
    setCars(c);
    setExpenses(e);
    setLoading(false);
  }

  const addCar = useCallback(async (carData) => {
    const car = { id: generateId(), ...carData };
    const updated = await storage.addCar(car);
    setCars(updated);
    return car;
  }, []);

  const updateCar = useCallback(async (id, updates) => {
    const updated = await storage.updateCar(id, updates);
    setCars(updated);
  }, []);

  const removeCar = useCallback(async (id) => {
    const updatedCars = await storage.deleteCar(id);
    setCars(updatedCars);
    const updatedExpenses = await storage.getExpenses();
    setExpenses(updatedExpenses);
  }, []);

  const addExpense = useCallback(async (expenseData) => {
    const expense = { id: generateId(), createdAt: new Date().toISOString(), ...expenseData };
    const updated = await storage.addExpense(expense);
    setExpenses(updated);
    return expense;
  }, []);

  const updateExpense = useCallback(async (id, updates) => {
    const updated = await storage.updateExpense(id, updates);
    setExpenses(updated);
  }, []);

  const removeExpense = useCallback(async (id) => {
    const updated = await storage.deleteExpense(id);
    setExpenses(updated);
  }, []);

  const getCarExpenses = useCallback(
    (carId) => expenses.filter((e) => e.carId === carId),
    [expenses]
  );

  return (
    <DataContext.Provider
      value={{
        cars,
        expenses,
        loading,
        addCar,
        updateCar,
        removeCar,
        addExpense,
        updateExpense,
        removeExpense,
        getCarExpenses,
        reload: loadData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
