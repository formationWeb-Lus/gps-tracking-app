import React, { useState } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet, SafeAreaView, TouchableOpacity, Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { registerUser } from '../services/api'; // adapte le chemin

export default function RegisterScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [vehicleCount, setVehicleCount] = useState(1);
  const [loading, setLoading] = useState(false);

  const getUnitPrice = () => {
    if (selectedPlan === 'mensuel') return 10;
    if (selectedPlan === 'annuel') return 100;
    return 0;
  };

  const total = getUnitPrice() * vehicleCount;

  const handleRegister = async () => {
    if (!firstName || !lastName || !phone || !selectedPlan) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    setLoading(true);
    try {
      const result = await registerUser(firstName, lastName, phone, selectedPlan, vehicleCount);
      if (result.user) {
        Alert.alert('Succès', 'Compte créé avec succès');
        navigation.navigate('Home', { user: result.user });
      } else {
        Alert.alert('Erreur', result.message || 'Erreur lors de la création du compte');
      }
    } catch (err) {
      Alert.alert('Erreur', 'Problème de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ... ton code existant */}
      <View style={styles.buttonWrapper}>
        <Button
          title={loading ? 'Chargement...' : 'S’abonner'}
          onPress={handleRegister}
          color="red"
          disabled={loading}
        />
      </View>
    </SafeAreaView>
  );
}
