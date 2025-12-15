// Reemplazar el contenido completo de partido.tsx

import HeaderReact from '@/components/header';
import SelectorEquipo from '@/components/seleccionequipo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

export default function Partido()
{
    const router = useRouter();
    const [equipo1, setEquipo1] = useState(0);
    const [equipo2, setEquipo2] = useState(0);
    const [fecha, setFecha] = useState(new Date());
    const [error, setError] = useState('');

    useEffect(() => {
        (async () => {
            if (await AsyncStorage.getItem('tipousuario') != '3') router.push("/");
        })();
    }, []);

    async function crearPartido() {
        setError('');
        
        if (equipo1 === 0 || equipo2 === 0) {
            setError('Selecciona ambos equipos');
            return;
        }
        
        if (equipo1 === equipo2) {
            setError('Los equipos deben ser diferentes');
            return;
        }

        await fetch('http://localhost:3031/addPartido', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                equipo1,
                equipo2,
                fecha: fecha.toISOString()
            }),
        });

        router.push("/");
    }

    // Formatear fecha para el input (YYYY-MM-DDTHH:mm)
    const formatDateForInput = (date: Date) => {
        const pad = (num: number) => num.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };

    // Manejar cambio del input de fecha
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = new Date(e.target.value);
        setFecha(newDate);
    };

    return (
        <View style={styles.screen}>
            <HeaderReact />
            <View style={styles.container}>
                <Text style={styles.titulo}>⚽ Crear Partido</Text>

                <Text style={styles.label}>Equipo Local</Text>
                <SelectorEquipo sendData={setEquipo1}/>

                <Text style={styles.label}>Equipo Visitante</Text>
                <SelectorEquipo sendData={setEquipo2}/>

                <Text style={styles.label}>📅 Fecha del Partido</Text>
                
                {/* Input de fecha para web */}
                {Platform.OS === 'web' ? (
                    <input
                        type="datetime-local"
                        value={formatDateForInput(fecha)}
                        onChange={handleDateChange}
                        style={{
                            width: '100%',
                            padding: '15px',
                            fontSize: '16px',
                            border: '2px solid #e0e0e0',
                            borderRadius: '12px',
                            backgroundColor: '#f9f9f9',
                            color: '#333',
                            fontWeight: '500' as any,
                        }}
                    />
                ) : (
                    // Mantener el DateTimePicker para mobile
                    <>
                        <Pressable 
                            style={styles.dateButton} >
                            <Text style={styles.dateText}>
                                {fecha.toLocaleDateString('es-ES')} {fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </Pressable>
                    </>
                )}

                <Pressable style={styles.boton} onPress={crearPartido}>
                    <Text style={styles.subtitulo}>🏆 Crear Partido</Text>
                </Pressable>

                {error && <Text style={styles.error}>⚠️ {error}</Text>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
    },
    container: {
        backgroundColor: '#ffffff',
        marginTop: 20,
        padding: 25,
        borderRadius: 16,
        width: '90%',
        maxWidth: 400,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        gap: 12,
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#E53935',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        alignSelf: 'flex-start',
        marginTop: 10,
    },
    dateButton: {
        backgroundColor: '#f9f9f9',
        borderWidth: 2,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        padding: 15,
        width: '100%',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    boton: {
        backgroundColor: '#E53935',
        marginTop: 20,
        borderRadius: 12,
        padding: 14,
        width: '80%',
        shadowColor: '#E53935',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    subtitulo: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '600',
    },
    error: {
        color: '#E53935',
        fontSize: 14,
        marginTop: 10,
        fontWeight: '600',
    },
});