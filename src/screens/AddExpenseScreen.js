import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../context/DataContext';
import { CATEGORY_MAP } from '../utils/constants';

export default function AddExpenseScreen({ navigation, route }) {
  const { carId, category, carName, expense: editExpense } = route.params;
  const { addExpense, updateExpense } = useData();
  const cat = CATEGORY_MAP[category];

  const [amount, setAmount] = useState(editExpense?.amount || '');
  const [startDate, setStartDate] = useState(editExpense?.startDate || '');
  const [expiryDate, setExpiryDate] = useState(editExpense?.expiryDate || '');
  const [insurer, setInsurer] = useState(editExpense?.insurer || '');
  const [policyNumber, setPolicyNumber] = useState(editExpense?.policyNumber || '');
  const [notes, setNotes] = useState(editExpense?.notes || '');

  function isValidDate(str) {
    if (!str) return true;
    const match = str.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
    if (!match) return false;
    const [, day, month, year] = match;
    const d = new Date(year, month - 1, day);
    return d.getDate() === parseInt(day) && d.getMonth() === parseInt(month) - 1;
  }

  function parseDateToISO(str) {
    if (!str) return '';
    const match = str.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
    if (!match) return str;
    const [, day, month, year] = match;
    return `${year}-${month}-${day}`;
  }

  function formatToDisplay(isoDate) {
    if (!isoDate) return '';
    const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) return isoDate;
    const [, year, month, day] = match;
    return `${day}.${month}.${year}`;
  }

  const [startDisplay, setStartDisplay] = useState(
    editExpense?.startDate ? formatToDisplay(editExpense.startDate) : ''
  );
  const [expiryDisplay, setExpiryDisplay] = useState(
    editExpense?.expiryDate ? formatToDisplay(editExpense.expiryDate) : ''
  );

  async function handleSave() {
    if (!amount.trim()) {
      Alert.alert('Грешка', 'Сумата е задължителна.');
      return;
    }
    if (!isValidDate(startDisplay)) {
      Alert.alert('Грешка', 'Невалидна начална дата. Формат: ДД.ММ.ГГГГ');
      return;
    }
    if (!isValidDate(expiryDisplay)) {
      Alert.alert('Грешка', 'Невалидна крайна дата. Формат: ДД.ММ.ГГГГ');
      return;
    }

    const expenseData = {
      carId,
      category,
      amount: amount.trim(),
      startDate: parseDateToISO(startDisplay),
      expiryDate: parseDateToISO(expiryDisplay),
      insurer: insurer.trim(),
      policyNumber: policyNumber.trim(),
      notes: notes.trim(),
    };

    if (editExpense) {
      await updateExpense(editExpense.id, expenseData);
    } else {
      await addExpense(expenseData);
    }
    navigation.goBack();
  }

  const showInsurer = category === 'kasko' || category === 'grazhdanska';

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container}>
        <View style={[styles.header, { backgroundColor: cat.color + '15' }]}>
          <Ionicons name={cat.icon} size={32} color={cat.color} />
          <Text style={[styles.headerTitle, { color: cat.color }]}>
            {editExpense ? 'Редактирай' : 'Нов запис'}: {cat.label}
          </Text>
          <Text style={styles.headerCar}>{carName}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Сума (лв.) *</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor="#bbb"
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.label}>От дата</Text>
              <TextInput
                style={styles.input}
                value={startDisplay}
                onChangeText={setStartDisplay}
                placeholder="ДД.ММ.ГГГГ"
                placeholderTextColor="#bbb"
                keyboardType="numeric"
                maxLength={10}
              />
            </View>
            <View style={{ width: 12 }} />
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.label}>До дата</Text>
              <TextInput
                style={styles.input}
                value={expiryDisplay}
                onChangeText={setExpiryDisplay}
                placeholder="ДД.ММ.ГГГГ"
                placeholderTextColor="#bbb"
                keyboardType="numeric"
                maxLength={10}
              />
            </View>
          </View>

          {showInsurer && (
            <>
              <View style={styles.field}>
                <Text style={styles.label}>Застраховател</Text>
                <TextInput
                  style={styles.input}
                  value={insurer}
                  onChangeText={setInsurer}
                  placeholder="напр. ДЗИ, Булстрад, Армеец"
                  placeholderTextColor="#bbb"
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Номер на полица</Text>
                <TextInput
                  style={styles.input}
                  value={policyNumber}
                  onChangeText={setPolicyNumber}
                  placeholder="незадължително"
                  placeholderTextColor="#bbb"
                />
              </View>
            </>
          )}

          <View style={styles.field}>
            <Text style={styles.label}>Бележки</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="допълнителна информация..."
              placeholderTextColor="#bbb"
              multiline
              numberOfLines={3}
            />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: cat.color }]}
            onPress={handleSave}
          >
            <Ionicons name="checkmark-circle" size={22} color="#fff" />
            <Text style={styles.saveButtonText}>
              {editExpense ? 'Запази промените' : 'Добави'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 8 },
  headerCar: { fontSize: 14, color: '#777', marginTop: 4 },
  form: { padding: 16 },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', color: '#555', marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#2C3E50',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  row: { flexDirection: 'row' },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 8,
    gap: 8,
  },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
