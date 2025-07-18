import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from '../components/Footer';

export default function UserInfoScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone || phone.trim().length < 8) {
      Alert.alert('Erreur', 'Veuillez entrer un numéro de téléphone valide');
      return;
    }

    setLoading(true);

    try {
      // 1. Requête pour récupérer l'utilisateur
      const response = await fetch('https://gps-device-server.onrender.com/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const result = await response.json();
      console.log('✅ Réponse API:', result);

      if (!response.ok || !result?.user) {
        Alert.alert('Erreur', result?.message || 'Utilisateur non trouvé');
        return;
      }

      const user = result.user;

      if (!user.vehiculeid) {
        Alert.alert('Erreur', '⛔ Aucun vehiculeId trouvé pour cet utilisateur');
        return;
      }

      // 2. Suppression de l'ancien token
      await AsyncStorage.removeItem('vehiculeToken');

      // 3. Requête pour générer un nouveau token JWT basé sur vehiculeId
      const tokenRes = await fetch('https://gps-device-server.onrender.com/api/vehicule-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehiculeId: user.vehiculeid }),
      });

      const tokenData = await tokenRes.json();

      if (!tokenRes.ok || !tokenData?.token) {
        console.error('❌ Token non généré:', tokenData);
        Alert.alert('Erreur', 'Impossible de générer le token');
        return;
      }

      // 4. Stockage du token
      await AsyncStorage.setItem('vehiculeToken', tokenData.token);
      console.log('✅ Token JWT sauvegardé');

      // 5. Navigation vers la page Home avec les infos utilisateur
      navigation.navigate('Home', { user });
    } catch (error) {
      console.error('❌ Erreur serveur :', error);
      Alert.alert('Erreur', 'Une erreur s\'est produite lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Connexion</Text>

        <TextInput
          style={styles.input}
          placeholder="Téléphone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          maxLength={15}
        />

        <View style={styles.buttonWrapper}>
          {loading ? (
            <ActivityIndicator size="large" color="red" />
          ) : (
            <Button title="Se connecter" onPress={handleLogin} color="red" />
          )}
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Créer un compte</Text>
        </TouchableOpacity>
      </View>

      <Footer navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  buttonWrapper: { marginTop: 12, marginBottom: 20 },
  link: {
    textAlign: 'center',
    color: 'blue',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
});
