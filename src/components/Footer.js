// src/components/Footer.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function Footer({ navigation }) {
  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity
        style={styles.footerContent}
        onPress={() => navigation.navigate('Contact')}
      >
        <FontAwesome name="question-circle" size={16} color="#fff" />
        <Text style={styles.footerText}>  Besoin d’aide ? Contactez-nous</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'android' ? 80 : 70, // ✅ Encore plus haut qu’avant
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 999,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000', // ✅ Fond noir bien ajusté
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  footerText: {
    color: '#fff',
    fontSize: 13,
  },
});
