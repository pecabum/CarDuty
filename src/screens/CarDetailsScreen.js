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
import {
  EXPENSE_CATEGORIES,
  daysUntil,
  formatDate,
  getCategoryColor,
} from '../utils/constants';

export default function CarDetailsScreen({ navigation, route }) {
  const { carId } = route.params;
  const { cars, expenses, removeCar } = useData();

  const car = cars.find((c) => c.id === carId);
  if (!car) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Колата не е намерена</Text>
      </View>
    );
  }

  const carExpenses = expenses.filter((e) => e.carId === carId);

  function getLatestExpense(category) {
    return carExpenses
      .filter((e) => e.category === category)
      .sort((a, b) => new Date(b.expiryDate || 0) - new Date(a.expiryDate || 0))[0];
  }

  function handleDelete() {
    Alert.alert(
      'Изтриване',
      `Сигурни ли сте, че искате да изтриете ${car.brand} ${car.model} (${car.plate})?\n\nВсички данни за тази кола ще бъдат загубени.`,
      [
        { text: 'Отказ', style: 'cancel' },
        {
          text: 'Изтрий',
          style: 'destructive',
          onPress: async () => {
            await removeCar(carId);
            navigation.goBack();
          },
        },
      ]
    );
  }

  function getStatusInfo(days) {
    if (days === null) return { label: 'Няма данни', color: '#999', bg: '#F0F0F0' };
    if (days < 0) return { label: `Изтекло (${Math.abs(days)} дни)`, color: '#E74C3C', bg: '#FDEDEE' };
    if (days === 0) return { label: 'Изтича ДНЕС!', color: '#E67E22', bg: '#FFF3E0' };
    if (days <= 30) return { label: `${days} дни`, color: '#E67E22', bg: '#FFF3E0' };
    return { label: `${days} дни`, color: '#27AE60', bg: '#E8F8F0' };
  }

  return (
    <ScrollView style={styles.container}>
      {/* Car Header */}
      <View style={styles.header}>
        <Ionicons name="car-sport" size={48} color="#4A90D9" />
        <Text style={styles.carName}>{car.brand} {car.model}</Text>
        <Text style={styles.carPlate}>{car.plate}</Text>
        <View style={styles.carDetails}>
          {car.year ? <Text style={styles.detailText}>Година: {car.year}</Text> : null}
          {car.color ? <Text style={styles.detailText}>Цвят: {car.color}</Text> : null}
          {car.vin ? <Text style={styles.detailText}>VIN: {car.vin}</Text> : null}
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate('AddCar', { car })}
          >
            <Ionicons name="pencil" size={16} color="#4A90D9" />
            <Text style={styles.editBtnText}>Редактирай</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Ionicons name="trash" size={16} color="#E74C3C" />
            <Text style={styles.deleteBtnText}>Изтрий</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
      <Text style={styles.sectionTitle}>Плащания и документи</Text>

      {EXPENSE_CATEGORIES.map((cat) => {
        const latest = getLatestExpense(cat.key);
        const days = latest?.expiryDate ? daysUntil(latest.expiryDate) : null;
        const status = getStatusInfo(days);

        return (
          <TouchableOpacity
            key={cat.key}
            style={styles.categoryCard}
            onPress={() =>
              navigation.navigate('ExpenseList', {
                carId,
                category: cat.key,
                carName: `${car.brand} ${car.model}`,
              })
            }
          >
            <View style={[styles.catIconWrap, { backgroundColor: cat.color + '15' }]}>
              <Ionicons name={cat.icon} size={24} color={cat.color} />
            </View>
            <View style={styles.catInfo}>
              <Text style={styles.catLabel}>{cat.label}</Text>
              {latest ? (
                <Text style={styles.catExpiry}>
                  Валидно до: {formatDate(latest.expiryDate)}
                </Text>
              ) : (
                <Text style={styles.catNoData}>Няма записи</Text>
              )}
              {latest?.amount ? (
                <Text style={styles.catAmount}>{latest.amount} лв.</Text>
              ) : null}
            </View>
            <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
              <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
            </View>
          </TouchableOpacity>
        );
      })}

      {/* Total spent */}
      {carExpenses.length > 0 && (
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Общо изразходвано</Text>
          <Text style={styles.totalAmount}>
            {carExpenses
              .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)
              .toFixed(2)}{' '}
            лв.
          </Text>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  errorText: { textAlign: 'center', marginTop: 40, fontSize: 16, color: '#999' },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  carName: { fontSize: 22, fontWeight: 'bold', color: '#2C3E50', marginTop: 8 },
  carPlate: { fontSize: 18, color: '#4A90D9', fontWeight: '600', marginTop: 4 },
  carDetails: { marginTop: 8, alignItems: 'center' },
  detailText: { fontSize: 13, color: '#777', marginTop: 2 },
  headerActions: { flexDirection: 'row', marginTop: 16, gap: 16 },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, padding: 8 },
  editBtnText: { color: '#4A90D9', fontSize: 14 },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, padding: 8 },
  deleteBtnText: { color: '#E74C3C', fontSize: 14 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  catIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  catInfo: { flex: 1 },
  catLabel: { fontSize: 16, fontWeight: '600', color: '#2C3E50' },
  catExpiry: { fontSize: 12, color: '#777', marginTop: 2 },
  catNoData: { fontSize: 12, color: '#bbb', marginTop: 2 },
  catAmount: { fontSize: 12, color: '#4A90D9', fontWeight: '500', marginTop: 1 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 11, fontWeight: '600' },
  totalCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  totalLabel: { fontSize: 14, color: '#777' },
  totalAmount: { fontSize: 28, fontWeight: 'bold', color: '#2C3E50', marginTop: 4 },
});
