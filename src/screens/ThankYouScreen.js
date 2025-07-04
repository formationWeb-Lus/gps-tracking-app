import React from 'react';
import { View, Text, StyleSheet, Button, SafeAreaView } from 'react-native';

export default function ThankYouScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>🙏 Merci pour votre inscription !</Text>
        <Text style={styles.message}>
          « Attendez-vous à être contacté par l’un de nos conseillers dans les prochaines heures pour valider votre souscription. »
        </Text>
        <Text style={styles.message}>
          « Une fois votre inscription finalisée, vous aurez accès ensuite à notre solution intelligente pour suivre vos véhicules en temps réel, partout et à tout moment. »
        </Text>

        <View style={styles.buttonWrapper}>
          <Button
            title="Retour à la connexion"
            color="red"
            onPress={() => navigation.navigate('UserInfo')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
    width: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonWrapper: {
    marginTop: 30,
  },
});
