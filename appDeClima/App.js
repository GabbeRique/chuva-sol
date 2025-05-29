import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import axios from 'axios';

export default function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false); 

  const API_KEY = '9e039949';
  const WOEID = 455824;
  

  useEffect(() => {
    axios.get(`https://cors-anywhere.herokuapp.com/https://api.hgbrasil.com/weather?key=${API_KEY}&woeid=${WOEID}`)
      .then(response => setWeather(response.data.results))
      .catch(error => console.error("Erro ao buscar clima:", error))
      .finally(() => setLoading(false));
  }, []);

  const themeStyles = darkMode ? darkStyles : lightStyles;

  if (loading) {
    return (
      <View style={themeStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#00BFFF" />
        <Text style={themeStyles.loadingText}>Carregando clima...</Text>
      </View>
    );
  }

  if (!weather) {
    return (
      <View style={themeStyles.loadingContainer}>
        <Text>Não foi possível obter as informações do clima.</Text>
      </View>
    );
  }

  return (
    <View style={themeStyles.container}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />

      
      <TouchableOpacity
        onPress={() => setDarkMode(!darkMode)}
        style={themeStyles.themeButton}
      >
        <Text style={themeStyles.themeButtonText}>
          {darkMode ? '🌞' : '🌙'}
        </Text>
      </TouchableOpacity>

      <View style={themeStyles.card}>
        <Text style={themeStyles.city}>{weather.city}</Text>
        <Image
          source={{ uri: weather.img_id ? `https://assets.hgbrasil.com/weather/images/${weather.img_id}.png` : weather.image }}
          style={themeStyles.weatherIcon}
        />
        <Text style={themeStyles.temperature}>{weather.temp}°</Text>
        <Text style={themeStyles.description}>{weather.description}</Text>

        <View style={themeStyles.row}>
          <Text style={themeStyles.info}>🌅 (Nascer Do Sol) {weather.sunrise}            (Antes Do meio Dia)</Text>
          <Text style={themeStyles.info}>🌇 (Pôr Do Sol) {weather.sunset}                  (Depois Do Meio Dia)</Text>
        </View>

        <View style={themeStyles.row}>
          <Text style={themeStyles.info}>💨 (Velocidade Do Vento)                          {weather.wind_speedy}</Text>
          <Text style={themeStyles.info}>💧 (Humidade Do Ar)                                {weather.humidity}%</Text>
        </View>
      </View>
    </View>
  );
}

// 🟡 Tema Claro
const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#48C6EF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
    elevation: 10,
  },
  city: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  temperature: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#217CAF',
    marginVertical: 12,
  },
  weatherIcon: {
    width: 100,
    height: 100,
  },
  description: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  info: {
    fontSize: 16,
    color: '#444',
    flex: 1,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0F7FA',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#217CAF',
  },
  themeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#ffffffaa',
    borderRadius: 25,
    padding: 10,
  },
  themeButtonText: {
    fontSize: 24,
  },
});

// ⚫ Tema Escuro
const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003366',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 25,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
    elevation: 10,
  },
  city: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  temperature: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#4FC3F7',
    marginVertical: 12,
  },
  weatherIcon: {
    width: 100,
    height: 100,
  },
  description: {
    fontSize: 18,
    color: '#aaa',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  info: {
    fontSize: 16,
    color: '#ccc',
    flex: 1,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#4FC3F7',
  },
  themeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#333333aa',
    borderRadius: 25,
    padding: 10,
  },
  themeButtonText: {
    fontSize: 24,
    color: '#fff',
  },
});
