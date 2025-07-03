import React, { useState } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert,
} from 'react-native';
import { loginUser } from '../services/api'; // adapte le chemin

export default function UserInfoScreen({ navigation }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!name || !phone) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    setLoading(true);
    try {
      const result = await loginUser(name, phone);
      if (result.user) {
        navigation.navigate('Home', { user: result.user });
      } else {
        Alert.alert('Erreur', result.message || 'Informations incorrectes');
      }
    } catch (err) {
      Alert.alert('Erreur', 'Problème de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* ... ton code existant */}
      <View style={styles.buttonWrapper}>
        <Button
          title={loading ? 'Chargement...' : 'Suivant'}
          onPress={handleLogin}
          color="red"
          disabled={loading}
        />
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Créer un compte</Text>
      </TouchableOpacity>
    </View>
  );
}
