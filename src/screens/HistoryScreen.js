import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../context/DataContext';
import { EXPENSE_CATEGORIES, CATEGORY_MAP, formatDate } from '../utils/constants';

export default function HistoryScreen() {
  const { cars, expenses } = useData();
  const [filterCar, setFilterCar] = useState(null);
  const [filterCategory, setFilterCategory] = useState(null);

  let filtered = [...expenses];
  if (filterCar) filtered = filtered.filter((e) => e.carId === filterCar);
  if (filterCategory) filtered = filtered.filter((e) => e.category === filterCategory);
  filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  const totalAmount = filtered.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

  function getCarName(carId) {
    const car = cars.find((c) => c.id === carId);
    return car ? `${car.brand} ${car.model}` : 'Непозната кола';
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>История</Text>

      {/* Car Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterChip, !filterCar && styles.filterChipActive]}
          onPress={() => setFilterCar(null)}
        >
          <Text style={[styles.filterChipText, !filterCar && styles.filterChipTextActive]}>
            Всички коли
          </Text>
        </TouchableOpacity>
        {cars.map((car) => (
          <TouchableOpacity
            key={car.id}
            style={[styles.filterChip, filterCar === car.id && styles.filterChipActive]}
            onPress={() => setFilterCar(filterCar === car.id ? null : car.id)}
          >
            <Text
              style={[
                styles.filterChipText,
                filterCar === car.id && styles.filterChipTextActive,
              ]}
            >
              {car.brand} {car.plate}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Category Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterChip, !filterCategory && styles.filterChipActive]}
          onPress={() => setFilterCategory(null)}
        >
          <Text style={[styles.filterChipText, !filterCategory && styles.filterChipTextActive]}>
            Всички
          </Text>
        </TouchableOpacity>
        {EXPENSE_CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[
              styles.filterChip,
              filterCategory === cat.key && { backgroundColor: cat.color },
            ]}
            onPress={() => setFilterCategory(filterCategory === cat.key ? null : cat.key)}
          >
            <Text
              style={[
                styles.filterChipText,
                filterCategory === cat.key && { color: '#fff' },
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Summary */}
      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>
          {filtered.length} записа • Общо:
        </Text>
        <Text style={styles.summaryAmount}>{totalAmount.toFixed(2)} лв.</Text>
      </View>

      {/* List */}
      {filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={48} color="#ccc" />
          <Text style={styles.emptyText}>Няма записи</Text>
        </View>
      ) : (
        filtered.map((expense) => {
          const cat = CATEGORY_MAP[expense.category];
          return (
            <View key={expense.id} style={styles.card}>
              <View style={[styles.catDot, { backgroundColor: cat?.color || '#999' }]} />
              <View style={styles.cardInfo}>
                <Text style={styles.cardCategory}>{cat?.label || expense.category}</Text>
                <Text style={styles.cardCar}>{getCarName(expense.carId)}</Text>
                {expense.expiryDate && (
                  <Text style={styles.cardDate}>
                    {formatDate(expense.startDate)} — {formatDate(expense.expiryDate)}
                  </Text>
                )}
              </View>
              <Text style={styles.cardAmount}>{expense.amount} лв.</Text>
            </View>
          );
        })
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2C3E50', textAlign: 'center', marginTop: 20, marginBottom: 12 },
  filterRow: { paddingHorizontal: 16, marginBottom: 8 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  filterChipActive: { backgroundColor: '#4A90D9', borderColor: '#4A90D9' },
  filterChipText: { fontSize: 13, color: '#555' },
  filterChipTextActive: { color: '#fff' },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  summaryLabel: { fontSize: 14, color: '#777' },
  summaryAmount: { fontSize: 16, fontWeight: 'bold', color: '#2C3E50' },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 16, color: '#999', marginTop: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 14,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  catDot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  cardInfo: { flex: 1 },
  cardCategory: { fontSize: 15, fontWeight: '600', color: '#2C3E50' },
  cardCar: { fontSize: 12, color: '#777', marginTop: 1 },
  cardDate: { fontSize: 11, color: '#aaa', marginTop: 2 },
  cardAmount: { fontSize: 16, fontWeight: '600', color: '#2C3E50' },
});
