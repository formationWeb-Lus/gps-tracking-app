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
      const response = await fetch('https://gps-device-server.onrender.com/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const contentType = response.headers.get('Content-Type');
      const isJson = contentType && contentType.includes('application/json');
      const result = isJson ? await response.json() : null;

      console.log('✅ Réponse API:', result);

      if (response.ok && result?.user) {
        const user = result.user;

        // 🔐 Appel de l'API pour générer un token JWT pour le véhicule
        const tokenRes = await fetch('https://gps-device-server.onrender.com/api/vehicule-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vehiculeId: user.vehiculeid }),
        });

        const tokenData = await tokenRes.json();

        if (!tokenRes.ok || !tokenData.token) {
          throw new Error('Token non généré');
        }

        // 💾 Sauvegarde du token dans AsyncStorage
        await AsyncStorage.setItem('vehiculeToken', tokenData.token);
        console.log('✅ Token JWT sauvegardé');

        // 👣 Redirection vers l'accueil avec les infos de l'utilisateur
        navigation.navigate('Home', { user });
      } else {
        Alert.alert('Erreur', result?.message || 'Connexion impossible');
      }
    } catch (err) {
      console.error('❌ Erreur serveur :', err);
      Alert.alert('Erreur', 'Impossible de contacter le serveur');
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
