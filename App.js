import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { DataProvider } from './src/context/DataContext';

import DashboardScreen from './src/screens/DashboardScreen';
import AddCarScreen from './src/screens/AddCarScreen';
import CarDetailsScreen from './src/screens/CarDetailsScreen';
import ExpenseListScreen from './src/screens/ExpenseListScreen';
import AddExpenseScreen from './src/screens/AddExpenseScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import ExpenseSummaryScreen from './src/screens/ExpenseSummaryScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#F5F6FA', elevation: 0, shadowOpacity: 0 },
        headerTintColor: '#2C3E50',
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddCar"
        component={AddCarScreen}
        options={({ route }) => ({
          title: route.params?.car ? 'Редактирай кола' : 'Добави кола',
        })}
      />
      <Stack.Screen
        name="CarDetails"
        component={CarDetailsScreen}
        options={{ title: 'Детайли' }}
      />
      <Stack.Screen
        name="ExpenseList"
        component={ExpenseListScreen}
        options={({ route }) => ({
          title: route.params?.carName || 'Записи',
        })}
      />
      <Stack.Screen
        name="AddExpense"
        component={AddExpenseScreen}
        options={({ route }) => ({
          title: route.params?.expense ? 'Редактирай' : 'Нов запис',
        })}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <DataProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Начало') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Обобщение') {
                iconName = focused ? 'stats-chart' : 'stats-chart-outline';
              } else if (route.name === 'История') {
                iconName = focused ? 'time' : 'time-outline';
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#4A90D9',
            tabBarInactiveTintColor: '#999',
            headerShown: false,
            tabBarStyle: {
              backgroundColor: '#fff',
              borderTopColor: '#eee',
              paddingBottom: 4,
            },
          })}
        >
          <Tab.Screen name="Начало" component={HomeStack} />
          <Tab.Screen
            name="Обобщение"
            component={ExpenseSummaryScreen}
            options={{
              headerShown: true,
              headerTitle: 'Обобщение на разходите',
              headerStyle: { backgroundColor: '#F5F6FA', elevation: 0, shadowOpacity: 0 },
            }}
          />
          <Tab.Screen
            name="История"
            component={HistoryScreen}
            options={{
              headerShown: true,
              headerTitle: 'История на плащанията',
              headerStyle: { backgroundColor: '#F5F6FA', elevation: 0, shadowOpacity: 0 },
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </DataProvider>
  );
}
