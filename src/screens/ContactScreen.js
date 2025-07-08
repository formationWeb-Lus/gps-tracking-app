import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome, Ionicons, Entypo } from '@expo/vector-icons';

export default function ContactScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📞 Contactez-nous</Text>

      {/* ✅ WhatsApp */}
      <TouchableOpacity style={styles.row} onPress={() => Linking.openURL('https://wa.me/243899864081')}>
        <FontAwesome name="whatsapp" size={24} color="#25D366" />
        <Text style={styles.text}>WhatsApp : +243 899 864 081</Text>
      </TouchableOpacity>

      {/* ✅ Appel */}
      <TouchableOpacity style={styles.row} onPress={() => Linking.openURL('tel:+243910128046')}>
        <Ionicons name="call" size={24} color="#007AFF" />
        <Text style={styles.text}>Appel : +243 910 128 046</Text>
      </TouchableOpacity>

      {/* ✅ Email */}
      <TouchableOpacity style={styles.row} onPress={() => Linking.openURL('mailto:jiresselusa127@gmail.com')}>
        <Entypo name="email" size={24} color="#EA4335" />
        <Text style={styles.text}>Email : jiresselusa127@gmail.com</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>🌍 Réseaux Sociaux :</Text>

      <TouchableOpacity style={styles.row} onPress={() => Linking.openURL('https://facebook.com/gpsrdc')}>
        <FontAwesome name="facebook" size={24} color="#3b5998" />
        <Text style={styles.text}>Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.row} onPress={() => Linking.openURL('https://instagram.com/gpsrdc')}>
        <FontAwesome name="instagram" size={24} color="#C13584" />
        <Text style={styles.text}>Instagram</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.row} onPress={() => Linking.openURL('https://tiktok.com/@gpsrdc')}>
        <FontAwesome name="music" size={24} color="#000" />
        <Text style={styles.text}>TikTok</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.row} onPress={() => Linking.openURL('https://youtube.com/@gpsrdc')}>
        <FontAwesome name="youtube-play" size={24} color="#FF0000" />
        <Text style={styles.text}>YouTube</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FF4D4D',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 30,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  text: {
    marginLeft: 12,
    fontSize: 16,
    flexShrink: 1,
  },
});
