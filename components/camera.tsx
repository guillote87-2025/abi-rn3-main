import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import React, { useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

export default function CameraReact({ onPicture, setShowCamera }:{onPicture: (uri: string) => void; setShowCamera: (value: boolean) => void;})
{
    const [permission, requestPermission] = useCameraPermissions();
    const [camType, setCameraType] = useState<'front' | 'back'>('front');
    const cameraRef = useRef<CameraView>(null);

    async function takePicture()
    {
      if(!cameraRef.current) return;
      try {
        // Tomamos la foto e intentamos obtener base64 directamente
        const photo = await cameraRef.current.takePictureAsync({ base64: true });
  
        let base64Data = photo.base64;
  
        // Si por algún motivo no viene en base64, la convertimos manualmente
        if(!base64Data && photo.uri) {
          const fileData = await FileSystem.readAsStringAsync(photo.uri, {
            encoding: 'base64',
          });
          base64Data = fileData;
        }
  
        if (base64Data) {
          // Enviamos la imagen como base64
          onPicture(`data:image/jpeg;base64,${base64Data}`);
        } else {
          console.warn('No se pudo obtener la imagen en base64.');
        }
      } catch (error) {
        console.error('Error al tomar la foto:', error);
      }
    };

    if (!permission?.granted) {
      return (
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            Se requiere permiso para usar la cámara
          </Text>
          <Pressable onPress={requestPermission} style={styles.boton}>
            <Text style={styles.subtitulo}>Conceder permiso</Text>
          </Pressable>
        </View>
      );
    }
  
    return (
      <View style={styles.overlay}>
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            ref={cameraRef}
            ratio="1:1"
            facing={camType}
          />
        </View>
  
        <View style={styles.cameraButtons}>
          <Pressable
            style={styles.camButton}
            onPress={() => setCameraType(camType === 'front' ? 'back' : 'front')}
          >
            <Text style={styles.subtitulo}>Cambiar cámara</Text>
          </Pressable>
  
          <Pressable style={styles.camButton} onPress={takePicture}>
            <Text style={styles.subtitulo}>Tomar foto</Text>
          </Pressable>
  
          <Pressable style={styles.camButton} onPress={() => setShowCamera(false)}>
            <Text style={styles.subtitulo}>Cancelar</Text>
          </Pressable>
        </View>
      </View>
    );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)', // Fondo semitransparente
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  cameraContainer: {
    width: Platform.OS === 'web' ? 400 : '90%',
    aspectRatio: 1,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#4f94ca',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  cameraButtons: {
    marginTop: 25,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
  },
  camButton: {
    backgroundColor: '#4f94ca',
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'black',
    minWidth: 100,
  },
  boton: {
    backgroundColor: '#4f94ca',
    marginTop: 10,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 5,
    padding: 8,
    width: 200,
  },
  subtitulo: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
});