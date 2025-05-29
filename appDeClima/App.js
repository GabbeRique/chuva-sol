import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Keyboard
} from 'react-native';
import axios from 'axios';

export default function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [cityInput, setCityInput] = useState('');
  const [cityName, setCityName] = useState('São Paulo');
  const [showCities, setShowCities] = useState(false);

  const API_KEY = 'ee50e040';
  const uso24Horas = true;

  const fetchWeatherByCity = async (city) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://api.hgbrasil.com/weather?key=${API_KEY}&city_name=${encodeURIComponent(city)}`
      );
      setWeather(res.data.results);
    } catch (error) {
      console.error('Erro ao buscar clima:', error);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherByCity(cityName);
  }, [cityName]);

  const handleSearch = () => {
    if (cityInput.trim()) {
      setCityName(cityInput.trim());
      Keyboard.dismiss();
    }
  };

  const formatarHora = (horario) => {
    if (!uso24Horas || !horario) return horario;
    const [horaMin, sufixo] = horario.split(' ');
    let [h, m] = horaMin.split(':').map(Number);
    if (sufixo?.toLowerCase() === 'pm' && h < 12) h += 12;
    if (sufixo?.toLowerCase() === 'am' && h === 12) h = 0;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

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
          {darkMode ? '🌕' : '☀️'}
        </Text>
      </TouchableOpacity>

      <View style={themeStyles.inputContainer}>
        <TextInput
          placeholder="Digite a cidade"
          placeholderTextColor={darkMode ? '#aaa' : '#666'}
          value={cityInput}
          onChangeText={setCityInput}
          onSubmitEditing={handleSearch}
          style={themeStyles.input}
        />
        <TouchableOpacity onPress={handleSearch} style={themeStyles.searchButton}>
          <Text style={themeStyles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => setShowCities(!showCities)} style={{ marginBottom: 10 }}>
        <Text style={{
          backgroundColor: darkMode ? '#444' : '#ddd',
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 20,
          margin: 4,
          color: darkMode ? '#fff' : '#000'
        }}>{showCities ? 'Esconder Cidades 🔼' : 'Mostrar Cidades 🔽'}</Text>
      </TouchableOpacity>

      {showCities && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
          {['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Recife', 'Jaboatão Dos Guararapes'].map((city) => (
            <TouchableOpacity
              key={city}
              onPress={() => setCityName(city)}
              style={{
                backgroundColor: darkMode ? '#444' : '#ddd',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
                margin: 4
              }}
            >
              <Text style={{ color: darkMode ? '#fff' : '#000' }}>{city}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={themeStyles.card}>
        <Text style={themeStyles.city}>{weather.city}</Text>
        <Image
          source={{ uri: weather.img_id ? `https://assets.hgbrasil.com/weather/images/${weather.img_id}.png` : weather.image }}
          style={themeStyles.weatherIcon}
        />
        <Text style={themeStyles.temperature}>{weather.temp}°</Text>
        <Text style={themeStyles.description}>{weather.description}</Text>

        <View style={themeStyles.row}>
          <Text style={themeStyles.info}>🌅 Nascer do sol: {formatarHora(weather.sunrise)}</Text>
          <Text style={themeStyles.info}>🌇 Pôr do sol: {formatarHora(weather.sunset)}</Text>
        </View>

        <View style={themeStyles.row}>
          <Text style={themeStyles.info}>💨 Velocidade do vento:                                {weather.wind_speedy}</Text>
          <Text style={themeStyles.info}>💧 Umidade:                               {weather.humidity}%</Text>
        </View>
      </View>
    </View>
  );
}

// Os estilos (lightStyles e darkStyles) permanecem os mesmos que você já tinha definido.



// 🟡 Tema Claro
const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#48C6EF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 100,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    color: '#000',
  },
  searchButton: {
    backgroundColor: '#217CAF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 6,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    margin: 90,
    paddingBottom: 20,
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
  inputContainer: {
    flexDirection: 'row',
    marginTop: 100,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#666',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#333',
    color: '#fff',
  },
  searchButton: {
    backgroundColor: '#217CAF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 25,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
    elevation: 10,
    shadowColor: '#fff',
    shadowOffset: {
      width: 2,
      height: 6,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    margin: 90,
    paddingBottom: 20,
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
