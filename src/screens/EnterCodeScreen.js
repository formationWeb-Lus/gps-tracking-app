import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';

export default function EnterCodeScreen({ route, navigation }) {
  const { phone } = route.params;
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyCode = async () => {
    if (!code) return Alert.alert('Erreur', 'Entrez le code reçu');

    setLoading(true);
    try {
      const res = await fetch('https://gps-database.onrender.com/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      });

      const data = await res.json();

      if (res.ok) {
        navigation.navigate('Home', { user: data.user });
      } else {
        Alert.alert('Erreur', data.message);
      }
    } catch (err) {
      Alert.alert('Erreur', 'Connexion impossible');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrez le code reçu par SMS</Text>
      <TextInput
        style={styles.input}
        placeholder="Code"
        keyboardType="number-pad"
        value={code}
        onChangeText={setCode}
      />
      <Button title={loading ? 'Vérification...' : 'Vérifier'} onPress={handleVerifyCode} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
});
