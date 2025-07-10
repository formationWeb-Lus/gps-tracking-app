import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

// 🔐 Fonction pour récupérer le token JWT depuis AsyncStorage
const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    return token;
  } catch (error) {
    console.error('Erreur récupération token:', error);
    return null;
  }
};

export default function VehicleScreen({ navigation }) {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const token = await getToken();
        if (!token) {
          if (isMounted) {
            setError('❌ Utilisateur non authentifié');
            setPositions([]);
            setLoading(false);
          }
          return;
        }

        // 🔍 Extraction du userId depuis le token JWT
        const decoded = jwtDecode(token);
        const userId = decoded.id || decoded.userId;

        if (!userId) {
          setError('❌ Identifiant utilisateur introuvable dans le token.');
          return;
        }

        const response = await axios.get(`https://backend-ojdz.onrender.com/api/positions`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const allData = Array.isArray(response.data) ? response.data : [];
        const filtered = allData.filter(pos => pos.userid === userId || pos.userId === userId);

        if (isMounted) {
          setPositions(filtered);
          setLoading(false);
          setError(null);
        }
      } catch (err) {
        console.error('❌ Erreur lors du chargement des positions :', err.message);
        if (isMounted) {
          setError('Erreur lors du chargement des positions');
          setPositions([]);
          setLoading(false);
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#007bff" />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (positions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>⚠️ Aucune position disponible pour cet utilisateur.</Text>
      </View>
    );
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
            key={`${pos.latitude}-${pos.longitude}-${index}`}
            coordinate={{ latitude: pos.latitude, longitude: pos.longitude }}
            pinColor="red"
            title={`🚗 ${pos.vehiculeid || pos.vehiculeId || 'Véhicule'}`}
            description={`Vitesse : ${pos.vitesse} km/h\nQuartier : ${pos.quartier}\nRue : ${pos.rue}`}
          />
        ))}

        <Polyline
          coordinates={positions.map(p => ({
            latitude: p.latitude,
            longitude: p.longitude,
          }))}
          strokeColor="#FF0000"
          strokeWidth={3}
        />
      </MapView>

      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Vehicle')}
        >
          <Text style={styles.buttonText}>📍 Voir position véhicule</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('History')}
        >
          <Text style={styles.buttonText}>🕘 Voir historique</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  errorText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: 'red',
  },
});
