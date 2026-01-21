import React from 'react';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import './src/i18n';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const { t, i18n, ready } = useTranslation();

  const toggleLanguage = () => {
    const currentLang = i18n.language;
    const newLang = currentLang === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#333' : '#FFF',
    flex: 1,
  };

  const textStyle = {
    color: isDarkMode ? '#FFF' : '#000',
  };

  if (!ready) {
    return (
      <View style={[backgroundStyle, styles.container]}>
        <Text style={textStyle}>Loading translations...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.container}>
        <Text style={[styles.title, textStyle]}>{t('long_term_bu_title')}</Text>
        <Text style={[styles.subtitle, textStyle]}>{t('change_access_pricing_title')}</Text>
        <Text style={[styles.subtitle, textStyle]}>{t('offer_summary_title')}</Text>

        <TouchableOpacity style={styles.button} onPress={toggleLanguage}>
          <Text style={styles.buttonText}>
            {i18n.language.startsWith('en') ? 'Cambiar a Español' : 'Switch to English'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#007AFF',
  },
  termsText: {
    marginTop: 20,
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  link: {
    color: '#007AFF',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default App;
