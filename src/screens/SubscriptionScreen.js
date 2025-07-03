import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function RegisterScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [vehicleCount, setVehicleCount] = useState(1);

  const getUnitPrice = () => {
    if (selectedPlan === 'mensuel') return 10;
    if (selectedPlan === 'annuel') return 100;
    return 0;
  };

  const total = getUnitPrice() * vehicleCount;

  const handleRegister = () => {
    if (!firstName || !lastName || !phone || !selectedPlan) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    // 🔐 Logique d’enregistrement à ajouter ici
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
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
        <Button title="S’abonner" onPress={handleRegister} color="red" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },
  planRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  planCard: {
    flex: 1,
    marginHorizontal: 5,
    padding: 12,
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
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
  },
  totalText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
    color: '#222',
    marginTop: 10,
  },
  buttonWrapper: {
    marginTop: 25,
  },
});

