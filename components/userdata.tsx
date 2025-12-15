import CameraReact from '@/components/camera';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import SelectorEquipo from './seleccionequipo';

export default function UserData({ sendData, inputData, tipo }: { sendData: (data: FormData) => Promise<number>, inputData: FormData, tipo: number }) {
  /*
  Tipo 1: Jugador
  Tipo 2: Director
  */

  const [error, setError] = useState('');
  const [showCamera, setShowCamera] = useState(false);

  const [nombre, setNombre] = useState(inputData.get('nombre') as any || '');
  const [apellido, setApellido] = useState(inputData.get('apellido') as any || '');
  const [imageurl, setImageurl] = useState(inputData.get('image') as any || '');
  const [posicion, setPosicion] = useState(inputData.get('posicion') as any || '');

  const [idequipo, setIdequipo] = useState(0);

  const register = inputData.get('nombre') == null;

  function setEquipo(id: number) {
    setIdequipo(id);
  }

  function validar() {
    setError('');
    let valido = true;
    let textRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s']+$/;
    if (!textRegex.test(nombre) || nombre.length < 3) {
      valido = false;
      setError('Nombre Invalido');
    }
    if (!textRegex.test(apellido) || apellido.length < 3) {
      valido = false;
      setError('Apellido Invalido');
    }
    if (tipo == 1 && (!textRegex.test(posicion) || posicion.length < 3)) {
      valido = false;
      setError('Posicion Invalida');
    }
    if (imageurl.length < 1) {
      valido = false;
      setError('Ingresar Foto de Perfil');
    }
    if (idequipo == 0) {
      valido = false;
      setError('Seleccionar Equipo');
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

  function savePhoto(uri: React.SetStateAction<string>) {
    setImageurl(uri);
    setShowCamera(false);
  }

  async function send() {
    if (!validar()) return;
    const formData = new FormData();
    formData.append('image', imageurl);
    formData.append('nombre', nombre);
    formData.append('apellido', apellido);
    if (tipo == 1) {
      formData.append('posicion', posicion);
      formData.append('equipo', idequipo + '');
    }
    if (tipo == 2 && register) {
      formData.append('equipo', idequipo + '');
    }

    const respuesta = await sendData(formData);
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      {showCamera ? (
        <CameraReact onPicture={savePhoto} setShowCamera={setShowCamera} />
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.titulo}>
            {register ? 'Registrarse como ' : 'Editar '}
            {tipo == 1 ? 'Jugador' : 'Director Técnico'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Nombre"
            placeholderTextColor="#999"
            onChangeText={setNombre}
            value={nombre}
          />
          <TextInput
            style={styles.input}
            placeholder="Apellido"
            placeholderTextColor="#999"
            onChangeText={setApellido}
            value={apellido}
          />
          {tipo == 1 ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Posición"
                placeholderTextColor="#999"
                onChangeText={setPosicion}
                value={posicion}
              />
              {register ? <SelectorEquipo sendData={setEquipo} /> : <></>}
            </>
          ) : tipo == 2 && register ? (
            <SelectorEquipo sendData={setEquipo} />
          ) : null}

          <Text style={styles.label}>Foto de Perfil</Text>

          <View style={styles.botonesContainer}>
            <Pressable onPress={pickimage} style={styles.botonSecundario}>
              <Text style={styles.textoBotonSec}>Galería</Text>
            </Pressable>
            <Pressable onPress={() => setShowCamera(true)} style={styles.botonSecundario}>
              <Text style={styles.textoBotonSec}>Cámara</Text>
            </Pressable>
          </View>

          {imageurl ? (
            <Image source={{ uri: imageurl }} style={styles.imagen} />
          ) : (
            <View style={styles.imagenPlaceholder}>
              <Text style={styles.placeholderTexto}>Sin imagen</Text>
            </View>
          )}

          <Pressable onPress={send} style={styles.botonPrincipal}>
            <Text style={styles.textoBotonPrin}>{register ? 'Registrarse' : 'Guardar'}</Text>
          </Pressable>

          <Text style={styles.error}>{error}</Text>
        </ScrollView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    width: '100%',
    backgroundColor: '#f5f5f5',
  },
  container: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    gap: 15,
    borderRadius: 16,
    marginHorizontal: 20,
    marginVertical: 20,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  titulo: {
    color: '#E53935',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f9f9f9',
    color: '#333',
    width: '100%',
    maxWidth: 320,
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    borderColor: '#e0e0e0',
    borderWidth: 2,
  },
  label: {
    color: '#333',
    fontSize: 17,
    fontWeight: '600',
    marginTop: 15,
    textAlign: 'center',
  },
  botonesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginTop: 10,
  },
  botonSecundario: {
    backgroundColor: '#ffffff',
    borderColor: '#E53935',
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 25,
    minWidth: 120,
  },
  textoBotonSec: {
    color: '#E53935',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
  },
  imagen: {
    borderRadius: 100,
    width: 180,
    height: 180,
    marginVertical: 20,
    borderColor: '#E53935',
    borderWidth: 3,
  },
  imagenPlaceholder: {
    width: 180,
    height: 180,
    borderRadius: 100,
    borderColor: '#e0e0e0',
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: '#f9f9f9',
  },
  placeholderTexto: {
    color: '#999',
    fontSize: 15,
  },
  botonPrincipal: {
    backgroundColor: '#E53935',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    width: '80%',
    maxWidth: 280,
    marginTop: 20,
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  textoBotonPrin: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
  error: {
    color: '#E53935',
    fontSize: 15,
    marginTop: 15,
    textAlign: 'center',
    fontWeight: '600',
  },
});