import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import VehicleScreen from '../screens/VehicleScreen';
import HistoryScreen from '../screens/HistoryScreen';
import { ROUTES } from '../routes'; // ← import des routes

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={ROUTES.HOME}>
        <Stack.Screen name={ROUTES.HOME} component={HomeScreen} />
        <Stack.Screen name={ROUTES.VEHICLES} component={VehicleScreen} />
        <Stack.Screen name={ROUTES.HISTORY} component={HistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    
  );
}
