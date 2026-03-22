import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../context/DataContext';
import { EXPENSE_CATEGORIES, daysUntil, formatDate, getCategoryColor } from '../utils/constants';

export default function DashboardScreen({ navigation }) {
  const { cars, expenses, loading, reload } = useData();

  // Find the latest expense per car per category
  function getLatestExpense(carId, category) {
    const carExpenses = expenses
      .filter((e) => e.carId === carId && e.category === category)
      .sort((a, b) => new Date(b.expiryDate || 0) - new Date(a.expiryDate || 0));
    return carExpenses[0] || null;
  }

  // Collect all upcoming expirations
  const alerts = [];
  cars.forEach((car) => {
    EXPENSE_CATEGORIES.forEach((cat) => {
      const exp = getLatestExpense(car.id, cat.key);
      if (exp && exp.expiryDate) {
        const days = daysUntil(exp.expiryDate);
        if (days !== null && days <= 30) {
          alerts.push({ car, category: cat, expense: exp, days });
        }
      }
    });
  });
  alerts.sort((a, b) => a.days - b.days);

  function getAlertStyle(days) {
    if (days < 0) return { bg: '#FDEDEE', border: '#E74C3C', text: '#C0392B' };
    if (days <= 7) return { bg: '#FFF3E0', border: '#E67E22', text: '#D35400' };
    return { bg: '#FFF9E6', border: '#F1C40F', text: '#7D6608' };
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} />}
    >
      <Text style={styles.title}>CarDuty</Text>
      <Text style={styles.subtitle}>Следи разходите по колата</Text>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Предстоящи изтичания</Text>
          {alerts.map((alert, idx) => {
            const style = getAlertStyle(alert.days);
            return (
              <TouchableOpacity
                key={idx}
                style={[styles.alertCard, { backgroundColor: style.bg, borderLeftColor: style.border }]}
                onPress={() => navigation.navigate('CarDetails', { carId: alert.car.id })}
              >
                <View style={styles.alertHeader}>
                  <Ionicons name={alert.category.icon} size={20} color={style.text} />
                  <Text style={[styles.alertCategory, { color: style.text }]}>
                    {alert.category.label}
                  </Text>
                </View>
                <Text style={styles.alertCar}>{alert.car.brand} {alert.car.model} ({alert.car.plate})</Text>
                <Text style={[styles.alertDays, { color: style.text }]}>
                  {alert.days < 0
                    ? `Изтекло преди ${Math.abs(alert.days)} дни!`
                    : alert.days === 0
                    ? 'Изтича ДНЕС!'
                    : `Изтича след ${alert.days} дни (${formatDate(alert.expense.expiryDate)})`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Cars Overview */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Моите коли</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddCar')}
          >
            <Ionicons name="add-circle" size={28} color="#4A90D9" />
          </TouchableOpacity>
        </View>

        {cars.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="car-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Няма добавени коли</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('AddCar')}
            >
              <Text style={styles.emptyButtonText}>Добави кола</Text>
            </TouchableOpacity>
          </View>
        ) : (
          cars.map((car) => (
            <TouchableOpacity
              key={car.id}
              style={styles.carCard}
              onPress={() => navigation.navigate('CarDetails', { carId: car.id })}
            >
              <View style={styles.carIcon}>
                <Ionicons name="car-sport" size={32} color="#4A90D9" />
              </View>
              <View style={styles.carInfo}>
                <Text style={styles.carName}>{car.brand} {car.model}</Text>
                <Text style={styles.carPlate}>{car.plate}</Text>
                {car.year ? <Text style={styles.carYear}>{car.year} г.</Text> : null}
              </View>
              <View style={styles.carStatus}>
                {EXPENSE_CATEGORIES.map((cat) => {
                  const exp = getLatestExpense(car.id, cat.key);
                  const days = exp?.expiryDate ? daysUntil(exp.expiryDate) : null;
                  let dotColor = '#ccc';
                  if (days !== null) {
                    if (days < 0) dotColor = '#E74C3C';
                    else if (days <= 30) dotColor = '#E67E22';
                    else dotColor = '#27AE60';
                  }
                  return (
                    <View key={cat.key} style={[styles.statusDot, { backgroundColor: dotColor }]} />
                  );
                })}
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Legend */}
      {cars.length > 0 && (
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.statusDot, { backgroundColor: '#27AE60' }]} />
            <Text style={styles.legendText}>Валидно</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.statusDot, { backgroundColor: '#E67E22' }]} />
            <Text style={styles.legendText}>Изтича скоро</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.statusDot, { backgroundColor: '#E74C3C' }]} />
            <Text style={styles.legendText}>Изтекло</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.statusDot, { backgroundColor: '#ccc' }]} />
            <Text style={styles.legendText}>Няма данни</Text>
          </View>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2C3E50', textAlign: 'center', marginTop: 20 },
  subtitle: { fontSize: 14, color: '#7F8C8D', textAlign: 'center', marginBottom: 20 },
  section: { marginHorizontal: 16, marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#2C3E50', marginBottom: 12 },
  addButton: { marginBottom: 12 },
  alertCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
  },
  alertHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  alertCategory: { fontSize: 14, fontWeight: '600', marginLeft: 6 },
  alertCar: { fontSize: 13, color: '#555', marginBottom: 2 },
  alertDays: { fontSize: 13, fontWeight: '500' },
  carCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  carIcon: { marginRight: 12 },
  carInfo: { flex: 1 },
  carName: { fontSize: 16, fontWeight: '600', color: '#2C3E50' },
  carPlate: { fontSize: 14, color: '#4A90D9', fontWeight: '500', marginTop: 2 },
  carYear: { fontSize: 12, color: '#999', marginTop: 1 },
  carStatus: { flexDirection: 'row', marginRight: 8, gap: 3 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 16, color: '#999', marginTop: 12, marginBottom: 16 },
  emptyButton: { backgroundColor: '#4A90D9', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  emptyButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  legend: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 16, marginTop: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendText: { fontSize: 11, color: '#999' },
});
