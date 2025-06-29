import React from 'react';
import { View, Text, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ padding: 20 }}>
      <Text>Bienvenue dans l'app GPS Tracking</Text>
      <Button title="Voir véhicules" onPress={() => navigation.navigate('Véhicules')} />
      <Button title="Voir historique" onPress={() => navigation.navigate('Historique')} />
    </View>
  );
}
