import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../context/DataContext';
import { CATEGORY_MAP, formatDate, daysUntil } from '../utils/constants';

export default function ExpenseListScreen({ navigation, route }) {
  const { carId, category, carName } = route.params;
  const { expenses, removeExpense } = useData();

  const cat = CATEGORY_MAP[category];
  const catExpenses = expenses
    .filter((e) => e.carId === carId && e.category === category)
    .sort((a, b) => new Date(b.expiryDate || b.createdAt) - new Date(a.expiryDate || a.createdAt));

  function handleDelete(expense) {
    Alert.alert('Изтриване', `Изтриване на запис за ${cat.label}?`, [
      { text: 'Отказ', style: 'cancel' },
      {
        text: 'Изтрий',
        style: 'destructive',
        onPress: () => removeExpense(expense.id),
      },
    ]);
  }

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.header, { backgroundColor: cat.color + '15' }]}>
        <Ionicons name={cat.icon} size={36} color={cat.color} />
        <Text style={[styles.headerTitle, { color: cat.color }]}>{cat.label}</Text>
        <Text style={styles.headerCar}>{carName}</Text>
      </View>

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: cat.color }]}
        onPress={() =>
          navigation.navigate('AddExpense', { carId, category, carName })
        }
      >
        <Ionicons name="add-circle-outline" size={22} color="#fff" />
        <Text style={styles.addButtonText}>Добави нов запис</Text>
      </TouchableOpacity>

      {catExpenses.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="document-outline" size={48} color="#ccc" />
          <Text style={styles.emptyText}>Няма записи за {cat.label}</Text>
        </View>
      ) : (
        catExpenses.map((expense) => {
          const days = expense.expiryDate ? daysUntil(expense.expiryDate) : null;
          let statusColor = '#27AE60';
          if (days !== null && days < 0) statusColor = '#E74C3C';
          else if (days !== null && days <= 30) statusColor = '#E67E22';

          return (
            <View key={expense.id} style={styles.card}>
              <View style={[styles.cardBar, { backgroundColor: statusColor }]} />
              <View style={styles.cardContent}>
                <View style={styles.cardRow}>
                  <Text style={styles.cardLabel}>Сума:</Text>
                  <Text style={styles.cardValue}>{expense.amount} лв.</Text>
                </View>
                {expense.startDate && (
                  <View style={styles.cardRow}>
                    <Text style={styles.cardLabel}>От:</Text>
                    <Text style={styles.cardValue}>{formatDate(expense.startDate)}</Text>
                  </View>
                )}
                {expense.expiryDate && (
                  <View style={styles.cardRow}>
                    <Text style={styles.cardLabel}>До:</Text>
                    <Text style={[styles.cardValue, { color: statusColor }]}>
                      {formatDate(expense.expiryDate)}
                    </Text>
                  </View>
                )}
                {days !== null && (
                  <Text style={[styles.daysLeft, { color: statusColor }]}>
                    {days < 0
                      ? `Изтекло преди ${Math.abs(days)} дни`
                      : days === 0
                      ? 'Изтича ДНЕС'
                      : `Остават ${days} дни`}
                  </Text>
                )}
                {expense.insurer && (
                  <View style={styles.cardRow}>
                    <Text style={styles.cardLabel}>Застраховател:</Text>
                    <Text style={styles.cardValue}>{expense.insurer}</Text>
                  </View>
                )}
                {expense.policyNumber && (
                  <View style={styles.cardRow}>
                    <Text style={styles.cardLabel}>Полица №:</Text>
                    <Text style={styles.cardValue}>{expense.policyNumber}</Text>
                  </View>
                )}
                {expense.notes && (
                  <Text style={styles.notes}>{expense.notes}</Text>
                )}
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('AddExpense', {
                      carId,
                      category,
                      carName,
                      expense,
                    })
                  }
                >
                  <Ionicons name="pencil-outline" size={20} color="#4A90D9" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(expense)}>
                  <Ionicons name="trash-outline" size={20} color="#E74C3C" />
                </TouchableOpacity>
              </View>
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
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', marginTop: 8 },
  headerCar: { fontSize: 14, color: '#777', marginTop: 4 },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginVertical: 16,
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 16, color: '#999', marginTop: 12 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  cardBar: { width: 4 },
  cardContent: { flex: 1, padding: 14 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  cardLabel: { fontSize: 13, color: '#777' },
  cardValue: { fontSize: 13, fontWeight: '500', color: '#2C3E50' },
  daysLeft: { fontSize: 13, fontWeight: '600', marginTop: 4 },
  notes: { fontSize: 12, color: '#999', marginTop: 6, fontStyle: 'italic' },
  cardActions: {
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
});
