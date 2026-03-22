# CarDuty

A mobile app for tracking car expenses — insurance, taxes, inspections, vignettes, and more.

## Features

- **Dashboard** — overview of all vehicles with color-coded alerts for expiring documents
- **Car Management** — add, edit, and delete vehicles
- **Expense Categories** — comprehensive insurance (каско), liability insurance (гражданска), road tax, annual inspection, vignette
- **Alerts** — automatic warnings for upcoming expirations (green / yellow / red)
- **History** — filter and browse all past expenses
- **Local Storage** — data is persisted on-device via AsyncStorage

## Tech Stack

- React Native + Expo SDK 55
- React Navigation (stack + bottom tabs)
- AsyncStorage for persistence
- UUID for unique identifiers

## Getting Started

```bash
npm install
npx expo start
```

Then scan the QR code with Expo Go (Android/iOS) or press `w` to open the web version.

## Project Structure

```
src/
├── components/    # Reusable UI components
├── context/       # React Context for state management
├── screens/       # App screens
│   ├── DashboardScreen.js
│   ├── AddCarScreen.js
│   ├── CarDetailsScreen.js
│   ├── ExpenseListScreen.js
│   ├── AddExpenseScreen.js
│   └── HistoryScreen.js
└── utils/         # Helper functions and constants
```
