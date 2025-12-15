import HeaderReact from '@/components/header';
import UserData from '@/components/userdata';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin, GoogleSigninButton, isSuccessResponse } from '@react-native-google-signin/google-signin';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export default function sesion() 
{
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "204903815937-mphcir1er2shc5125248ffvanr66r8dr.apps.googleusercontent.com",
    });
  });

  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login'); // Usamos tabs en lugar de switch
  const [error, setError] = useState('');
  const [iniciando, setIniciando] = useState(false);
  const [tipoRegistro, setTipoRegistro] = useState(0);

  const [emailusu, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmacion, setConfirmacion] = useState('');

  async function saveUsuario(altemail: string) {
    let respuesta = await fetch('http://localhost:3031/getUsuarioData', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: (emailusu == '' ? altemail : emailusu) }),
    });
    let data2 = await respuesta.json();
    await AsyncStorage.setItem('email', (emailusu == '' ? altemail : emailusu));
    await AsyncStorage.setItem('idusuario', String(data2[0].id));
    await AsyncStorage.setItem('tipousuario', String(data2[0].tipo as string));
    await AsyncStorage.setItem('id_tablausuario', String(data2[0].id_tabla as string));

    return 0;
  }

  async function handleGoogleSignIn() {
    try {
      setIsSubmitting(true);
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        const { idToken, user } = response.data;
        const { email } = user;
        setEmail(email);

        let res = await fetch('http://localhost:3031/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, password: '', isGoogleUser: 'true' }),
        });
        let data = await res.json();
        if (data == false) {
          res = await fetch('http://localhost:3031/addUsuario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: '', isGoogleUser: 'true' }),
          });
          data = await res.json();

          setIniciando(true);
        } else {
          await saveUsuario(email);
          router.push("/");
        }
      }
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
    }
  }

  function validar() {
    setError('');
    let valido = true;
    let emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    if (!emailRegex.test(emailusu)) {
      valido = false;
      setError('Email Inválido');
    }
    if (password.length < 6 || password.length > 24) {
      valido = false;
      setError('Contraseña debe ser de entre 6 y 24 caracteres');
    }
    return valido;
  }

  async function inicioSesion() {
    setError('');
    if (!validar()) return;

    let res = await fetch('http://localhost:3031/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailusu, password: password, isGoogleUser: 'false' }),
    });
    let data = await res.json();
    if (data == false) {
      setError('Usuario Inexistente');
    } else {
      await saveUsuario('');
      router.push("/");
    }
  }

  async function registro() {
    setError('');
    if (!validar()) return;
    if (confirmacion != password) {
      setError('Contraseña Incorrecta');
      return;
    }

    let res = await fetch('http://localhost:3031/addUsuario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailusu, password: password, isGoogleUser: 'false' }),
    });
    let data = await res.json();
    if (data == 1) {
      setError('Email Ocupado');
    } else setIniciando(true);
  }

  async function sendJugador(formData: FormData): Promise<number> {
    formData.append('email', emailusu);
    await fetch('http://localhost:3031/addJugador', {
      method: 'POST',
      body: formData,
    });
    await saveUsuario('');
    router.push("/");
    return 1;
  }

  async function sendDirector(formData: FormData): Promise<number> {
    formData.append('email', emailusu);
    await fetch('http://localhost:3031/addDirector', {
      method: 'POST',
      body: formData,
    });
    await saveUsuario('');
    router.push("/");
    return 1;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <HeaderReact />
        {!iniciando ? (
          <View style={styles.content}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Gestiona tu cuenta</Text>
              <Text style={styles.subtitle}>Inicia sesión o regístrate para continuar</Text>
            </View>

            {/* Pestañas para elegir Login/Registro */}
            <View style={styles.tabContainer}>
              <Pressable
                style={[styles.tab, activeTab === 'login' && styles.activeTab]}
                onPress={() => setActiveTab('login')}
              >
                <Text style={[styles.tabText, activeTab === 'login' && styles.activeTabText]}>
                  🔐 Iniciar Sesión
                </Text>
                {activeTab === 'login' && <View style={styles.tabIndicator} />}
              </Pressable>
              
              <Pressable
                style={[styles.tab, activeTab === 'register' && styles.activeTab]}
                onPress={() => setActiveTab('register')}
              >
                <Text style={[styles.tabText, activeTab === 'register' && styles.activeTabText]}>
                  ✨ Registrarse
                </Text>
                {activeTab === 'register' && <View style={styles.tabIndicator} />}
              </Pressable>
            </View>

            {/* Formulario dinámico según la pestaña activa */}
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>
                {activeTab === 'login' ? 'Accede a tu cuenta' : 'Crea tu cuenta gratuita'}
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Correo electrónico</Text>
                <TextInput
                  style={styles.input}
                  placeholder="tu@email.com"
                  placeholderTextColor="#999"
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Contraseña</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor="#999"
                  secureTextEntry
                  onChangeText={setPassword}
                />
              </View>

              {activeTab === 'register' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Confirmar contraseña</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Repite tu contraseña"
                    placeholderTextColor="#999"
                    secureTextEntry
                    onChangeText={setConfirmacion}
                  />
                </View>
              )}

              <Pressable
                onPress={() => {
                  activeTab === 'login' ? inicioSesion() : registro();
                }}
                style={({ pressed }) => [styles.boton, pressed && styles.botonPressed]}
              >
                <Text style={styles.botonText}>
                  {activeTab === 'login' ? '🔓 Iniciar Sesión' : '🚀 Crear Cuenta'}
                </Text>
              </Pressable>

              {error !== '' && (
                <View style={styles.errorContainer}>
                  <Text style={styles.error}>⚠️ {error}</Text>
                </View>
              )}
            </View>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>o continuar con</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.googleContainer}>
              <View style={styles.googleButtonWrapper}>
                <GoogleSigninButton
                  size={GoogleSigninButton.Size.Wide}
                  color={GoogleSigninButton.Color.Light}
                  onPress={handleGoogleSignIn}
                  disabled={isSubmitting}
                />
              </View>
              {isSubmitting && (
                <Text style={styles.loadingText}>Conectando con Google...</Text>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.content}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>¡Bienvenido! 🎉</Text>
              <Text style={styles.subtitle}>Selecciona cómo quieres usar la aplicación</Text>
            </View>

            <View style={styles.roleContainer}>
              <Pressable
                style={({ pressed }) => [styles.roleCard, pressed && styles.roleCardPressed]}
                onPress={() => {
                  router.push('/');
                }}>
                <Text style={styles.roleIcon}>👀</Text>
                <Text style={styles.roleTitle}>Espectador</Text>
                <Text style={styles.roleDescription}>Explora equipos y jugadores</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [styles.roleCard, pressed && styles.roleCardPressed]}
                onPress={() => {
                  setTipoRegistro(1);
                }}>
                <Text style={styles.roleIcon}>⚽</Text>
                <Text style={styles.roleTitle}>Jugador</Text>
                <Text style={styles.roleDescription}>Forma parte de un equipo</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [styles.roleCard, pressed && styles.roleCardPressed]}
                onPress={() => {
                  setTipoRegistro(2);
                }}>
                <Text style={styles.roleIcon}>👔</Text>
                <Text style={styles.roleTitle}>Director Técnico</Text>
                <Text style={styles.roleDescription}>Dirige tu propio equipo</Text>
              </Pressable>
            </View>

            {tipoRegistro == 1 ? (
              <UserData
                sendData={sendJugador}
                inputData={new FormData()}
                tipo={1}
              />
            ) : tipoRegistro == 2 ? (
              <UserData
                sendData={sendDirector}
                inputData={new FormData()}
                tipo={2}
              />
            ) : null}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: '#f5f5f5',
    minHeight: '100%',
  },
  content: {
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  titleContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  // Estilos para pestañas
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#E53935',
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: '60%',
    backgroundColor: '#E53935',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  formTitle: {
    color: '#E53935',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    height: 50,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
  },
  boton: {
    backgroundColor: '#E53935',
    marginTop: 8,
    borderRadius: 12,
    paddingVertical: 14,
    shadowColor: '#E53935',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  botonPressed: {
    backgroundColor: '#D32F2F',
    transform: [{ scale: 0.98 }],
  },
  botonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#E53935',
  },
  error: {
    color: '#C62828',
    fontSize: 14,
    textAlign: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  },
  googleContainer: {
    alignItems: 'center',
    gap: 12,
  },
  googleButtonWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    backgroundColor: '#ffffff',
    padding: 4,
  },
  loadingText: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
  },
  roleContainer: {
    gap: 16,
    marginTop: 20,
  },
  roleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  roleCardPressed: {
    borderColor: '#E53935',
    transform: [{ scale: 0.98 }],
  },
  roleIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});