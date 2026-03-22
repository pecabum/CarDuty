import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../context/DataContext';
import { CATEGORY_MAP } from '../utils/constants';

const MONTH_NAMES = [
  'Януари', 'Февруари', 'Март', 'Април', 'Май', 'Юни',
  'Юли', 'Август', 'Септември', 'Октомври', 'Ноември', 'Декември',
];

export default function ExpenseSummaryScreen() {
  const { cars, expenses } = useData();
  const [view, setView] = useState('month'); // 'month' or 'year'
  const [filterCar, setFilterCar] = useState(null);

  const filtered = useMemo(() => {
    if (!filterCar) return expenses;
    return expenses.filter((e) => e.carId === filterCar);
  }, [expenses, filterCar]);

  const monthlyData = useMemo(() => {
    const map = {};
    filtered.forEach((e) => {
      const date = new Date(e.startDate || e.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!map[key]) map[key] = { total: 0, byCategory: {} };
      const amount = parseFloat(e.amount) || 0;
      map[key].total += amount;
      map[key].byCategory[e.category] = (map[key].byCategory[e.category] || 0) + amount;
    });
    return Object.entries(map)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([key, data]) => {
        const [year, month] = key.split('-');
        return {
          key,
          label: `${MONTH_NAMES[parseInt(month, 10) - 1]} ${year}`,
          ...data,
        };
      });
  }, [filtered]);

  const yearlyData = useMemo(() => {
    const map = {};
    filtered.forEach((e) => {
      const date = new Date(e.startDate || e.createdAt);
      const year = String(date.getFullYear());
      if (!map[year]) map[year] = { total: 0, byCategory: {} };
      const amount = parseFloat(e.amount) || 0;
      map[year].total += amount;
      map[year].byCategory[e.category] = (map[year].byCategory[e.category] || 0) + amount;
    });
    return Object.entries(map)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([year, data]) => ({
        key: year,
        label: `${year} г.`,
        ...data,
      }));
  }, [filtered]);

  const data = view === 'month' ? monthlyData : yearlyData;
  const grandTotal = filtered.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Обобщение</Text>

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

      {/* View Toggle */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, view === 'month' && styles.toggleBtnActive]}
          onPress={() => setView('month')}
        >
          <Text style={[styles.toggleText, view === 'month' && styles.toggleTextActive]}>
            По месец
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, view === 'year' && styles.toggleBtnActive]}
          onPress={() => setView('year')}
        >
          <Text style={[styles.toggleText, view === 'year' && styles.toggleTextActive]}>
            По година
          </Text>
        </TouchableOpacity>
      </View>

      {/* Grand Total */}
      <View style={styles.grandTotal}>
        <Text style={styles.grandTotalLabel}>Общо разходи:</Text>
        <Text style={styles.grandTotalAmount}>{grandTotal.toFixed(2)} лв.</Text>
      </View>

      {/* Data */}
      {data.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="bar-chart-outline" size={48} color="#ccc" />
          <Text style={styles.emptyText}>Няма записи</Text>
        </View>
      ) : (
        data.map((item) => (
          <View key={item.key} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.label}</Text>
              <Text style={styles.cardTotal}>{item.total.toFixed(2)} лв.</Text>
            </View>
            {Object.entries(item.byCategory)
              .sort(([, a], [, b]) => b - a)
              .map(([catKey, amount]) => {
                const cat = CATEGORY_MAP[catKey];
                return (
                  <View key={catKey} style={styles.catRow}>
                    <View style={[styles.catDot, { backgroundColor: cat?.color || '#999' }]} />
                    <Text style={styles.catLabel}>{cat?.label || catKey}</Text>
                    <Text style={styles.catAmount}>{amount.toFixed(2)} лв.</Text>
                  </View>
                );
              })}
          </View>
        ))
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
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
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 12,
    gap: 8,
  },
  toggleBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  toggleBtnActive: { backgroundColor: '#4A90D9', borderColor: '#4A90D9' },
  toggleText: { fontSize: 14, color: '#555', fontWeight: '500' },
  toggleTextActive: { color: '#fff' },
  grandTotal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    gap: 8,
  },
  grandTotalLabel: { fontSize: 15, color: '#777' },
  grandTotalAmount: { fontSize: 18, fontWeight: 'bold', color: '#2C3E50' },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 16, color: '#999', marginTop: 12 },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#2C3E50' },
  cardTotal: { fontSize: 16, fontWeight: 'bold', color: '#4A90D9' },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  catDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  catLabel: { flex: 1, fontSize: 13, color: '#555' },
  catAmount: { fontSize: 13, fontWeight: '500', color: '#2C3E50' },
});
