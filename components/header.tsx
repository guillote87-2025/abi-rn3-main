import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function HeaderReact()
{
    const router = useRouter();
    const [mail, setMail] = useState('');
    const [tipousuario, setTipoUsuario] = useState('');
    const [idusuario, setidusuario] = useState(2);
    
    useEffect(() => {
        (async() => {
          setMail(await AsyncStorage.getItem('email') as any || '');
          setTipoUsuario(await AsyncStorage.getItem('tipousuario') || '0');
          setidusuario(Number(await AsyncStorage.getItem('id_tablausuario')) || 2);
        })();
    })

    const isLoggedIn = mail !== '';
    const getTipoUsuarioText = () => {
        switch(tipousuario) {
            case '1': return 'Jugador';
            case '2': return 'Director Técnico';
            case '3': return 'Administrador';
            default: return 'Espectador';
        }
    };

    return(
        <View style={styles.container}>
            <View style={styles.topBar}>
                <Text style={styles.logo}>⚽ FutbolApp</Text>
                {isLoggedIn && (
                    <View style={styles.userInfo}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{getTipoUsuarioText()}</Text>
                        </View>
                        <Text style={styles.userEmail} numberOfLines={1}>{mail}</Text>
                    </View>
                )}
            </View>
            
            <View style={styles.navContainer}>
                <Pressable 
                    style={({pressed}) => [styles.navButton, pressed && styles.navButtonPressed]} 
                    onPress={() => router.push("/")}>
                    <Text style={styles.navText}>🏠 Inicio</Text>
                </Pressable>

                {tipousuario !== '0' && tipousuario !== '' && tipousuario !== '3' && (
                    <Pressable 
                        style={({pressed}) => [styles.navButton, pressed && styles.navButtonPressed]} 
                        onPress={() => router.push({
                            pathname: "/profile",
                            params: { id: idusuario, tipo: tipousuario }
                        })}>
                        <Text style={styles.navText}>👤 Mi Perfil</Text>
                    </Pressable>
                )}

                {tipousuario === '2' && (
                    <Pressable 
                        style={({pressed}) => [styles.navButton, pressed && styles.navButtonPressed]} 
                        onPress={() => router.push("/equipo")}>
                        <Text style={styles.navText}>⚽ Crear Equipo</Text>
                    </Pressable>
                )}

                {tipousuario === '3' && (
                    <Pressable 
                        style={({pressed}) => [styles.navButton, pressed && styles.navButtonPressed]} 
                        onPress={() => router.push("/partido")}>
                        <Text style={styles.navText}>🏆 Crear Partido</Text>
                    </Pressable>
                )}

                {isLoggedIn ? (
                    <Pressable
                        style={({pressed}) => [styles.logoutButton, pressed && styles.logoutButtonPressed]}
                        onPress={async () => {
                            await AsyncStorage.setItem('email', '');
                            await AsyncStorage.setItem('idusuario', '');
                            await AsyncStorage.setItem('tipousuario', '');
                            await AsyncStorage.setItem('id_tablausuario', '');
                            router.push("/");
                        }}>
                        <Text style={styles.logoutText}>🚪 Cerrar Sesión</Text>
                    </Pressable>
                ) : (
                    <Pressable 
                        style={({pressed}) => [styles.loginButton, pressed && styles.loginButtonPressed]} 
                        onPress={() => router.push("/sesion")}>
                        <Text style={styles.loginText}>🔐 Iniciar Sesión</Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingTop: 40,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 12,
    },
    logo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#E53935',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        maxWidth: '60%',
    },
    badge: {
        backgroundColor: '#E53935',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
    },
    userEmail: {
        color: '#666',
        fontSize: 14,
        flex: 1,
    },
    navContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        paddingHorizontal: 10,
        paddingBottom: 10,
        gap: 8,
    },
    navButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    navButtonPressed: {
        backgroundColor: '#e0e0e0',
        transform: [{scale: 0.97}],
    },
    navText: {
        color: '#333',
        fontSize: 14,
        fontWeight: '500',
    },
    loginButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#E53935',
        borderWidth: 1,
        borderColor: '#D32F2F',
    },
    loginButtonPressed: {
        backgroundColor: '#D32F2F',
        transform: [{scale: 0.97}],
    },
    loginText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
    logoutButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#757575',
        borderWidth: 1,
        borderColor: '#616161',
    },
    logoutButtonPressed: {
        backgroundColor: '#616161',
        transform: [{scale: 0.97}],
    },
    logoutText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
});