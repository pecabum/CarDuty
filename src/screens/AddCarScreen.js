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

export default function AddCarScreen({ navigation, route }) {
  const { addCar, updateCar } = useData();
  const editCar = route.params?.car;

  const [brand, setBrand] = useState(editCar?.brand || '');
  const [model, setModel] = useState(editCar?.model || '');
  const [plate, setPlate] = useState(editCar?.plate || '');
  const [year, setYear] = useState(editCar?.year || '');
  const [vin, setVin] = useState(editCar?.vin || '');
  const [color, setColor] = useState(editCar?.color || '');

  async function handleSave() {
    if (!brand.trim() || !plate.trim()) {
      Alert.alert('Грешка', 'Марката и регистрационният номер са задължителни.');
      return;
    }

    const carData = {
      brand: brand.trim(),
      model: model.trim(),
      plate: plate.trim().toUpperCase(),
      year: year.trim(),
      vin: vin.trim(),
      color: color.trim(),
    };

    if (editCar) {
      await updateCar(editCar.id, carData);
    } else {
      await addCar(carData);
    }
    navigation.goBack();
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{editCar ? 'Редактирай кола' : 'Добави кола'}</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Марка *</Text>
          <TextInput
            style={styles.input}
            value={brand}
            onChangeText={setBrand}
            placeholder="напр. Toyota"
            placeholderTextColor="#bbb"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Модел</Text>
          <TextInput
            style={styles.input}
            value={model}
            onChangeText={setModel}
            placeholder="напр. Corolla"
            placeholderTextColor="#bbb"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Регистрационен номер *</Text>
          <TextInput
            style={styles.input}
            value={plate}
            onChangeText={setPlate}
            placeholder="напр. CB1234AB"
            placeholderTextColor="#bbb"
            autoCapitalize="characters"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Година</Text>
          <TextInput
            style={styles.input}
            value={year}
            onChangeText={setYear}
            placeholder="напр. 2020"
            placeholderTextColor="#bbb"
            keyboardType="numeric"
            maxLength={4}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>VIN номер</Text>
          <TextInput
            style={styles.input}
            value={vin}
            onChangeText={setVin}
            placeholder="незадължително"
            placeholderTextColor="#bbb"
            autoCapitalize="characters"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Цвят</Text>
          <TextInput
            style={styles.input}
            value={color}
            onChangeText={setColor}
            placeholder="напр. Бял"
            placeholderTextColor="#bbb"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Ionicons name="checkmark-circle" size={22} color="#fff" />
          <Text style={styles.saveButtonText}>{editCar ? 'Запази' : 'Добави'}</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2C3E50', marginBottom: 24, textAlign: 'center' },
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
  saveButton: {
    backgroundColor: '#4A90D9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 16,
    gap: 8,
  },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
