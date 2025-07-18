import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

export default function VehicleScreen({ navigation }) {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchUserLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Autorisation de localisation requise.');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      if (isMounted) {
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    };

    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('vehiculeToken');
        if (!token) throw new Error('Token manquant pour le véhicule');

        const response = await axios.get(
          'https://gps-device-server.onrender.com/api/positions',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const allData = Array.isArray(response.data) ? response.data : [];

        // Garde seulement les 4 dernières positions
        const last4Positions = allData.slice(-4);

        if (isMounted) {
          setPositions(last4Positions);
          setLoading(false);
          setError(null);
        }
      } catch (err) {
        console.error('❌ Erreur lors du chargement des positions :', err.message);
        if (isMounted) {
          setError('Impossible de charger les positions. Vérifie le token ou la connexion réseau.');
          setPositions([]);
          setLoading(false);
        }
      }
    };

    fetchUserLocation();
    fetchData();

    const interval = setInterval(fetchData, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Calcul distance en mètres entre deux points lat/lon (Haversine)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // mètres
    const toRad = (deg) => deg * (Math.PI / 180);
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#007bff" />;
  if (error)
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  if (positions.length === 0)
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>⚠️ Aucune position disponible.</Text>
      </View>
    );

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
        {positions.map((pos, index) => {
          let distanceText = 'Distance inconnue';
          if (userLocation) {
            const dist = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              pos.latitude,
              pos.longitude
            );
            distanceText = `📏 Distance : ${dist.toFixed(0)} m`;
          }
          return (
            <Marker
              key={`${pos.latitude}-${pos.longitude}-${index}`}
              coordinate={{ latitude: pos.latitude, longitude: pos.longitude }}
              pinColor="red"
              title={`🚗 Véhicule : ${pos.vehiculeid || pos.vehiculeId || 'ID inconnu'}`}
              description={`${distanceText}\n🛣️ Rue : ${pos.rue || 'N/A'}\n⚡ Vitesse : ${pos.vitesse} km/h`}
            />
          );
        })}

        <Polyline
          coordinates={positions.map((p) => ({
            latitude: p.latitude,
            longitude: p.longitude,
          }))}
          strokeColor="#FF0000"
          strokeWidth={3}
        />

        {userLocation && (
          <Marker
            coordinate={userLocation}
            pinColor="blue"
            title="🧍‍♂️ Ma position"
            description="Vous êtes ici"
          />
        )}
      </MapView>

      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Vehicle')}>
          <Text style={styles.buttonText}>📍 Voir position véhicule</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('History')}>
          <Text style={styles.buttonText}>🕘 Voir historique</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('PositionDetail', {
              positions,
              userLocation,
              lastPosition: last,
            })
          }
        >
          <Text style={styles.buttonText}>🔍 Voir les positions en détail</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 180,
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
