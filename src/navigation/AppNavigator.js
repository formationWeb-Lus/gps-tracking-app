import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import UserInfoScreen from '../screens/UserInfoScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import MainAppNavigator from './MainAppNavigator';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="UserInfo" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="UserInfo" component={UserInfoScreen} />
        <Stack.Screen name="Subscription" component={SubscriptionScreen} />
        <Stack.Screen name="MainApp" component={MainAppNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
