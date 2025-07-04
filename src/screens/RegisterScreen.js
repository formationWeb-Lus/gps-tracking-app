import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

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
      const response = await fetch('https://gps-database.onrender.com/api/pending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstname: firstName,
          lastname: lastName,
          phone,
          plan: selectedPlan,
          vehicleCount,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigation.navigate('ThankYou');
      } else {
        Alert.alert('Erreur', data.message || 'Une erreur est survenue');
      }
    } catch (error) {
      console.error('Erreur API:', error);
      Alert.alert('Erreur', 'Impossible de contacter le serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>📝 Créer un compte</Text>

        <TextInput
          style={styles.input}
          placeholder="Prénom"
          value={firstName}
          onChangeText={setFirstName}
          placeholderTextColor="#666"
        />
        <TextInput
          style={styles.input}
          placeholder="Nom"
          value={lastName}
          onChangeText={setLastName}
          placeholderTextColor="#666"
        />
        <TextInput
          style={styles.input}
          placeholder="Téléphone"
          value={phone}
          onChangeText={setPhone}
          placeholderTextColor="#666"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>📦 Choisissez un plan :</Text>
        <View style={styles.planRow}>
          <TouchableOpacity
            style={[styles.planCard, selectedPlan === 'mensuel' && styles.selectedCard]}
            onPress={() => setSelectedPlan('mensuel')}
          >
            <Text>📆 Mensuel - 10$/véhicule</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.planCard, selectedPlan === 'annuel' && styles.selectedCard]}
            onPress={() => setSelectedPlan('annuel')}
          >
            <Text>📅 Annuel - 100$/véhicule</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>🚗 Nombre de véhicules :</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={vehicleCount}
            onValueChange={(val) => setVehicleCount(val)}
            style={styles.picker}
          >
            {[...Array(300)].map((_, i) => (
              <Picker.Item key={i} label={`${i + 1}`} value={i + 1} />
            ))}
          </Picker>
        </View>

        {selectedPlan && (
          <Text style={styles.totalText}>
            💰 Total : {total} $ pour {vehicleCount} véhicule(s)
          </Text>
        )}

        <View style={styles.buttonWrapper}>
          <Button title={loading ? 'Chargement...' : 'S’abonner'} onPress={handleRegister} color="red" disabled={loading} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContainer: {
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 25,
    marginBottom: 10,
  },
  planRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  planCard: {
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    backgroundColor: '#eee',
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedCard: {
    backgroundColor: '#ffeaea',
    borderColor: 'red',
    borderWidth: 2,
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    height: 50,
    justifyContent: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  totalText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
    color: '#222',
    marginTop: 10,
  },
  buttonWrapper: {
    marginTop: 30,
  },
});
