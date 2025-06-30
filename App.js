import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

export default function App() {
  const [statusText, setStatusText] = useState('Initialisation...');
  const lastPosition = useRef(null);
  const stopCounter = useRef(0); // en secondes

  useEffect(() => {
    const startTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setStatusText('Permission de localisation refusée');
        return;
      }

      setStatusText('Suivi activé 🚗');

      setInterval(async () => {
        try {
          const location = await Location.getCurrentPositionAsync({});
          const { latitude, longitude, speed } = location.coords;
          const vitesse = speed !== null ? speed * 3.6 : 0; // convertir m/s en km/h

          const position = {
            vehiculeId: 'Toyota',
            latitude,
            longitude,
            vitesse,
            timestamp: new Date().toISOString(),
          };

          // Vérifier arrêt prolongé
          if (
            lastPosition.current &&
            vitesse < 1 &&
            distanceBetween(
              latitude,
              longitude,
              lastPosition.current.latitude,
              lastPosition.current.longitude
            ) < 0.01
          ) {
            stopCounter.current += 10;
          } else {
            stopCounter.current = 0;
            lastPosition.current = { latitude, longitude };
          }

          if (stopCounter.current >= 10) {
            console.log('⛔️ Véhicule arrêté depuis 10s');
          }

          // Envoi au backend
          await axios.post('https://backend-ojdz.onrender.com/api/positions', position);
          console.log('✅ Envoyé :', position);
        } catch (err) {
          console.error('❌ Erreur envoi position :', err.message);
        }
      }, 10000); // toutes les 10 secondes
    };

    startTracking();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🚙 Application GPS Tracking</Text>
      <Text style={styles.status}>{statusText}</Text>
      <Text style={styles.note}>L'application envoie automatiquement la position toutes les 10 secondes.</Text>
      <Text style={styles.note}>Quand le véhicule reste au même endroit pendant 10 secondes, l'arrêt est détecté.</Text>
    </ScrollView>
  );
}

// Fonction simple pour calculer la distance (en km)
function distanceBetween(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 60,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  status: {
    fontSize: 18,
    marginBottom: 10,
    color: 'green',
  },
  note: {
    fontSize: 14,
    color: '#444',
    marginBottom: 10,
  },
});
