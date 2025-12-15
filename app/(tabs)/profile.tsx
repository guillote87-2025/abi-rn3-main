import HeaderReact from "@/components/header";
import UserData from "@/components/userdata";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Information() {
  const { tipo, id } = useLocalSearchParams();
  const [tipousuario, setTipoUsuario] = useState('');
  const [propio, setPropio] = useState(false);
  const [editar, setEditar] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [imagen, setImage] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [posicion, setPosicion] = useState('');
  const [equipo, setEquipo] = useState('');
  const [equipoid, setEquipoid] = useState('');
  const [goles, setGoles] = useState('');
  const [victorias, setVictorias] = useState('');
  const [director, setDirector] = useState('');
  const [directorid, setDirectorid] = useState('');
  const [jugadores, setJugadores] = useState<any[]>([]);
  const router = useRouter();

  const [oldmail, setOldmail] = useState('');
  const [oldpassword, setOldpassword] = useState('');
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');

  const [formdata, setFormDatausu] = useState<FormData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setTipoUsuario(await AsyncStorage.getItem('tipousuario') || '0');
      setOldmail(await AsyncStorage.getItem('email') as any || '');
      
      if(tipo == "1") {
        const response = await fetch('http://localhost:3031/getJugador', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({id}),
        });
        const data = await response.json();
        
        setImage(data[0].imagen);
        setNombre(data[0].nombre);
        setApellido(data[0].apellido);
        setPosicion(data[0].posicion);
        setGoles(data[0].goles);
        setEquipoid(data[0].equipo);

        if(data[0].equipo) {
          const response2 = await fetch('http://localhost:3031/getEquipo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({id: data[0].equipo}),
          });
          const data2 = await response2.json();
          if(data2.length != 0) setEquipo(data2[0].nombre);
        }

        setPropio((await AsyncStorage.getItem('tipousuario') == "1" && await AsyncStorage.getItem('id_tablausuario') == id));
        
        const fullImageUrl = 'http://localhost:3031' + data[0].imagen;
        try {
          const response = await fetch(fullImageUrl);
          const blob = await response.blob();
          const reader = new FileReader();

          reader.onloadend = () => {
            if(reader.result && typeof reader.result === 'string') {
              const base64data = reader.result.split(',')[1];
              const newForm = new FormData();
              newForm.append('image', `data:image/jpeg;base64,${base64data}`);
              newForm.append('nombre', data[0].nombre);
              newForm.append('apellido', data[0].apellido);
              newForm.append('posicion', data[0].posicion);
              setFormDatausu(newForm);
            }
          };
          reader.readAsDataURL(blob);
        } catch (error) {
          console.error('Error convirtiendo imagen a base64:', error);
        }
      }
      else if(tipo == "2") {
        const response = await fetch('http://localhost:3031/getDirector', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({id}),
        });
        const data = await response.json();
        
        setImage(data[0].imagen);
        setNombre(data[0].nombre);
        setApellido(data[0].apellido);
        setVictorias(data[0].victorias);

        setPropio((await AsyncStorage.getItem('tipousuario') == "2" && await AsyncStorage.getItem('id_tablausuario') == id));
        
        const fullImageUrl = 'http://localhost:3031' + data[0].imagen;
        try {
          const response = await fetch(fullImageUrl);
          const blob = await response.blob();
          const reader = new FileReader();

          reader.onloadend = () => {
            if(reader.result && typeof reader.result === 'string') {
              const base64data = reader.result.split(',')[1];
              const newForm = new FormData();
              newForm.append('image', `data:image/jpeg;base64,${base64data}`);
              newForm.append('nombre', data[0].nombre);
              newForm.append('apellido', data[0].apellido);
              setFormDatausu(newForm);
            }
          };
          reader.readAsDataURL(blob);
        } catch (error) {
          console.error('Error convirtiendo imagen a base64:', error);
        }
      }
      else {
        const response = await fetch('http://localhost:3031/getEquipo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({id}),
        });
        const data = await response.json();
        
        setImage(data[0].escudo);
        setNombre(data[0].nombre);
        setGoles(data[0].goles);
        setVictorias(data[0].victorias);
        setDirectorid(data[0].director);
        
        if(data[0].director) {
          const response2 = await fetch('http://localhost:3031/getDirector', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({id: data[0].director}),
          });
          const data2 = await response2.json();
          if(data2.length != 0) setDirector(data2[0].nombre + " " + data2[0].apellido);
        }
        
        setPropio((await AsyncStorage.getItem('tipousuario') == "2" && await AsyncStorage.getItem('id_tablausuario') == data[0].director));

        const response3 = await fetch('http://localhost:3031/getJugadoresEquipo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({id_equipo: id}),
        });
        const jugadoresData = await response3.json();
        setJugadores(jugadoresData);
      }
      
      setLoading(false);
    };

    loadData();
  }, []);

  async function anotarse() {
    let email = await AsyncStorage.getItem('email');
    await fetch('http://localhost:3031/cambiarEquipo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({email: email, id_equipo: id}),
    });
    router.push("/");
  }

  async function sendJugador(formData: FormData) : Promise<number> {
    formData.append('email', mail);
    formData.append('oldmail', oldmail);
    formData.append('password', password);
    formData.append('oldpassword', oldpassword);
    formData.append('isGoogleUser', 'false');
    await fetch('http://localhost:3031/editJugador', {
      method: 'POST',
      body: formData,
    }).then(response => response.json())
    .then(data => {
      if(data == 0) router.push("/");
    });
    
    return 1;
  }

  async function sendDirector(formData: FormData) : Promise<number> {
    formData.append('email', mail);
    formData.append('oldmail', oldmail);
    formData.append('password', password);
    formData.append('oldpassword', oldpassword);
    formData.append('isGoogleUser', 'false');
    await fetch('http://localhost:3031/editDirector', {
      method: 'POST',
      body: formData,
    }).then(response => response.json())
    .then(data => {
      if(data == 0) router.push("/");
    });
    
    return 1;
  }

  if(loading) {
    return (
      <View style={styles.screen}>
        <HeaderReact />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E53935" />
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen}>
      <HeaderReact />
      {editar ? (
        <View style={styles.editContent}>
          <View style={styles.editHeader}>
            <Text style={styles.editTitle}>✏️ Editar Perfil</Text>
            <Pressable 
              style={({pressed}) => [styles.cancelButton, pressed && styles.cancelButtonPressed]}
              onPress={() => setEditar(false)}>
              <Text style={styles.cancelButtonText}>✕ Cancelar</Text>
            </Pressable>
          </View>

          <View style={styles.editForm}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>📧 Email Actual</Text>
              <TextInput
                style={styles.input}
                placeholder="Email actual"
                placeholderTextColor="#999"
                onChangeText={setOldmail}
                value={oldmail}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>📧 Nuevo Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Nuevo email"
                placeholderTextColor="#999"
                onChangeText={setMail}
                value={mail}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>🔒 Contraseña Actual</Text>
              <TextInput
                style={styles.input}
                placeholder="Contraseña actual"
                placeholderTextColor="#999"
                secureTextEntry
                onChangeText={setOldpassword}
                value={oldpassword}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>🔑 Nueva Contraseña</Text>
              <TextInput
                style={styles.input}
                placeholder="Nueva contraseña"
                placeholderTextColor="#999"
                secureTextEntry
                onChangeText={setPassword}
                value={password}
              />
            </View>
          </View>

          {tipo == "1" ? (
            <UserData sendData={sendJugador} inputData={formdata as FormData} tipo={1}/>
          ) : (
            <UserData sendData={sendDirector} inputData={formdata as FormData} tipo={2}/>
          )}
        </View>
      ) : (
        <View style={styles.profileContent}>
          <View style={styles.profileHeader}>
            <View style={styles.imageContainer}>
              <Image
                style={styles.profileImage}
                source={{ uri: 'http://localhost:3031' + imagen }}
              />
              {tipo == "1" && <View style={styles.roleBadge}><Text style={styles.roleBadgeText}>⚽ JUGADOR</Text></View>}
              {tipo == "2" && <View style={styles.roleBadge}><Text style={styles.roleBadgeText}>👔 DIRECTOR</Text></View>}
              {tipo == "3" && <View style={styles.roleBadge}><Text style={styles.roleBadgeText}>🏟️ EQUIPO</Text></View>}
            </View>

            <Text style={styles.profileName}>{nombre} {tipo != "3" ? apellido : ''}</Text>
            
            {tipo == "1" && posicion && (
              <View style={styles.posicionBadge}>
                <Text style={styles.posicionText}>{posicion}</Text>
              </View>
            )}
          </View>

          <View style={styles.statsGrid}>
            {tipo == "1" && (
              <>
                <View style={styles.statCard}>
                  <Text style={styles.statIcon}>⚽</Text>
                  <Text style={styles.statValue}>{goles}</Text>
                  <Text style={styles.statLabel}>Goles</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statIcon}>👕</Text>
                  <Text style={styles.statValue}>{equipo || 'Sin equipo'}</Text>
                  <Text style={styles.statLabel}>Equipo</Text>
                </View>
              </>
            )}
            {tipo == "2" && (
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>🏆</Text>
                <Text style={styles.statValue}>{victorias}</Text>
                <Text style={styles.statLabel}>Victorias</Text>
              </View>
            )}
            {tipo == "3" && (
              <>
                <View style={styles.statCard}>
                  <Text style={styles.statIcon}>👔</Text>
                  <Text style={styles.statValue}>{director || 'Sin DT'}</Text>
                  <Text style={styles.statLabel}>Director Técnico</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statIcon}>⚽</Text>
                  <Text style={styles.statValue}>{goles}</Text>
                  <Text style={styles.statLabel}>Goles del Equipo</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statIcon}>🏆</Text>
                  <Text style={styles.statValue}>{victorias || 0}</Text>
                  <Text style={styles.statLabel}>Victorias</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statIcon}>👥</Text>
                  <Text style={styles.statValue}>{jugadores.length}</Text>
                  <Text style={styles.statLabel}>Jugadores</Text>
                </View>
              </>
            )}
          </View>

          {tipo == "3" && jugadores.length > 0 && (
            <View style={styles.playersSection}>
              <Text style={styles.sectionTitle}>🔥 Plantilla del Equipo</Text>
              <View style={styles.playersList}>
                {jugadores.map((item) => (
                  <View key={item.id} style={styles.playerCard}>
                    <Image
                      style={styles.playerImage}
                      source={{ uri: 'http://localhost:3031' + item.imagen }}
                    />
                    <View style={styles.playerInfo}>
                      <Text style={styles.playerName}>{item.nombre} {item.apellido}</Text>
                      <Text style={styles.playerPosition}>{item.posicion}</Text>
                      <Text style={styles.playerGoals}>⚽ {item.goles} goles</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.actionsContainer}>
            {propio && tipo != '3' && (
              <Pressable 
                style={({pressed}) => [styles.editButton, pressed && styles.editButtonPressed]} 
                onPress={() => setEditar(true)}>
                <Text style={styles.editButtonText}>✏️ Editar Perfil</Text>
              </Pressable>
            )}
            {tipousuario == '1' && tipo == '3' && (
              <Pressable 
                style={({pressed}) => [styles.joinButton, pressed && styles.joinButtonPressed]} 
                onPress={anotarse}>
                <Text style={styles.joinButtonText}>🤝 Unirse al Equipo</Text>
              </Pressable>
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  profileContent: {
    paddingBottom: 30,
  },
  profileHeader: {
    backgroundColor: '#ffffff',
    paddingVertical: 32,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: '#E53935',
  },
  roleBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#E53935',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  roleBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  posicionBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  posicionText: {
    color: '#E65100',
    fontSize: 14,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: 150,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E53935',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
  },
  playersSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  playersList: {
    gap: 12,
  },
  playerCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 2,
  },
  playerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  playerPosition: {
    fontSize: 13,
    color: '#999',
    marginBottom: 4,
  },
  playerGoals: {
    fontSize: 13,
    color: '#E53935',
    fontWeight: '500',
  },
  actionsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  editButton: {
    backgroundColor: '#E53935',
    borderRadius: 12,
    paddingVertical: 14,
    shadowColor: '#E53935',
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 8,
    elevation: 4,
  },
  editButtonPressed: {
    backgroundColor: '#D32F2F',
    transform: [{scale: 0.98}],
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  joinButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 14,
    shadowColor: '#4CAF50',
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 8,
    elevation: 4,
  },
  joinButtonPressed: {
    backgroundColor: '#388E3C',
    transform: [{scale: 0.98}],
  },
  joinButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  editContent: {
    padding: 20,
  },
  editHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  editTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  cancelButton: {
    backgroundColor: '#757575',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cancelButtonPressed: {
    backgroundColor: '#616161',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  editForm: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
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
});