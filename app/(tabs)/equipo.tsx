import HeaderReact from '@/components/header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Equipo() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [imageurl, setImageurl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      if (await AsyncStorage.getItem('tipousuario') != '2') router.push("/");
    })();
  }, []);

  function validar() {
    setError('');
    let valido = true;
    let textRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s']+$/;
    if (!textRegex.test(nombre) || nombre.length < 3) {
      valido = false;
      setError('Nombre Invalido');
    }
    if (imageurl.length < 1) {
      valido = false;
      setError('Ingresar Foto de Perfil');
    }
    return valido;
  }

  async function pickimage() {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const base64Img = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setImageurl(base64Img);
    }
  }

  async function send() {
    if (!validar()) return;
    const formData = new FormData();
    formData.append('escudo', imageurl);
    formData.append('nombre', nombre);
    formData.append('email', await AsyncStorage.getItem('email') || '');

    let respuesta = await fetch('http://localhost:3031/addEquipo', {
      method: 'POST',
      body: formData,
    });
    router.push("/");
  }

  return (
    <View style={styles.screen}>
      <HeaderReact />
      <View style={styles.container}>
        <Text style={styles.titulo}>Crear Equipo</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre"
          placeholderTextColor="#ccc"
          onChangeText={setNombre}
          value={nombre}
        />

        <Pressable onPress={pickimage} style={styles.botonmin}>
          <Text style={[styles.subtitulo, { color: '#E53935' }]}>📁 Galería</Text>
        </Pressable>

        {imageurl ? (
          <Image source={{ uri: imageurl }} style={styles.imagen} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={{ color: '#999', fontSize: 15 }}>🖼️ Sin imagen</Text>
          </View>
        )}

        <Pressable onPress={send} style={styles.boton}>
          <Text style={styles.subtitulo}>Crear Equipo</Text>
        </Pressable>

        {error.length > 0 && <Text style={styles.error}>{error}</Text>}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    paddingTop: 20,
  },
  container: {
    backgroundColor: '#ffffff',
    width: '90%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E53935',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f9f9f9',
    width: '100%',
    height: 50,
    borderColor: '#e0e0e0',
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: '#333',
    fontSize: 16,
  },
  boton: {
    backgroundColor: '#E53935',
    marginTop: 20,
    borderRadius: 12,
    padding: 14,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  botonmin: {
    backgroundColor: '#ffffff',
    marginTop: 15,
    borderColor: '#E53935',
    borderWidth: 2,
    borderRadius: 12,
    padding: 12,
    width: 140,
    alignItems: 'center',
  },
  subtitulo: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  imagen: {
    borderRadius: 12,
    width: 200,
    height: 200,
    marginVertical: 20,
    borderWidth: 3,
    borderColor: '#E53935',
  },
  placeholder: {
    width: 200,
    height: 200,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    marginVertical: 20,
  },
  error: {
    color: '#E53935',
    fontSize: 15,
    marginTop: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
});