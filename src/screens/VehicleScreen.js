import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';

export default function VehicleScreen({ route, navigation }) {
  const { userId } = route.params;

  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  if (!userId) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 50, fontSize: 18, color: 'red' }}>
          ❌ Aucun identifiant utilisateur reçu.
        </Text>
      </View>
    );
  }

  const fetchData = async () => {
    try {
      const response = await axios.get(`https://backend-ojdz.onrender.com/api/positions?userId=${userId}`);
      setPositions(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('❌ Erreur lors du chargement :', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [userId]);

  if (loading || positions.length === 0) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#007bff" />;
  }

  const last = positions[positions.length - 1];

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: last.latitude,
          longitude: last.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {positions.map((pos, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: pos.latitude, longitude: pos.longitude }}
            pinColor="red"
            title={`🚗 ${pos.vehiculeId || 'Véhicule'}`}
            description={`Vitesse : ${pos.vitesse} km/h\nQuartier : ${pos.quartier}\nRue : ${pos.rue}`}
          />
        ))}

        <Polyline
          coordinates={positions.map(p => ({ latitude: p.latitude, longitude: p.longitude }))}
          strokeColor="#FF0000"
          strokeWidth={3}
        />
      </MapView>

      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.button} onPress={() => {/* Navigation vers position */}}>
          <Text style={styles.buttonText}>📍 Voir position véhicule</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => {/* Navigation vers historique */}}>
          <Text style={styles.buttonText}>🕘 Voir historique</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 140,
  },
  bottomButtons: {
    backgroundColor: '#fff',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 5,
    width: '90%',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});
