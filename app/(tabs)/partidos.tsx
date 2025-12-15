import HeaderReact from '@/components/header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Partidos() {
    const router = useRouter();
    const [partidos, setPartidos] = useState<any[]>([]);
    const [equipos, setEquipos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [esAdmin, setEsAdmin] = useState(false);
    const [editando, setEditando] = useState<number | null>(null);
    const [goles1Edit, setGoles1Edit] = useState('');
    const [goles2Edit, setGoles2Edit] = useState('');

    useEffect(() => {
        cargarDatos();
    }, []);

    async function cargarDatos() {
        setLoading(true);
        const tipo = await AsyncStorage.getItem('tipousuario');
        setEsAdmin(tipo === '3');

        const [partidosRes, equiposRes] = await Promise.all([
            fetch('http://localhost:3031/getPartidos').then(r => r.json()),
            fetch('http://localhost:3031/getEquipos').then(r => r.json())
        ]);

        setPartidos(partidosRes);
        setEquipos(equiposRes);
        setLoading(false);
    }

    const getNombreEquipo = (id: number) => {
        const equipo = equipos.find(e => e.id === id);
        return equipo?.nombre || 'Equipo desconocido';
    };

    async function actualizarPartido(id: number, goles1: number, goles2: number, terminado: boolean) {
        await fetch('http://localhost:3031/updatePartido', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, goles1, goles2, terminado }),
        });

        setEditando(null);
        cargarDatos();
    }

    if (loading) {
        return (
            <View style={styles.screen}>
                <HeaderReact />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#E53935" />
                    <Text style={styles.loadingText}>Cargando partidos...</Text>
                </View>
            </View>
        );
    }

    return (
        <ScrollView style={styles.screen}>
            <HeaderReact />
            <View style={styles.container}>
                <Text style={styles.titulo}>🏆 Partidos</Text>

                {partidos.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No hay partidos programados</Text>
                    </View>
                ) : (
                    partidos.map(partido => (
                        <View key={partido.id} style={styles.partidoCard}>
                            <View style={styles.partidoHeader}>
                                <Text style={styles.fecha}>
                                    📅 {new Date(partido.fecha).toLocaleDateString('es-ES')}
                                </Text>
                                {partido.terminado && (
                                    <View style={styles.terminadoBadge}>
                                        <Text style={styles.terminadoText}>✓ Finalizado</Text>
                                    </View>
                                )}
                            </View>

                            {editando === partido.id ? (
                                <View style={styles.editContainer}>
                                    <View style={styles.equipoEdit}>
                                        <Text style={styles.equipoNombre}>{getNombreEquipo(partido.equipo1)}</Text>
                                        <TextInput
                                            style={styles.golesInput}
                                            keyboardType="number-pad"
                                            value={goles1Edit}
                                            onChangeText={setGoles1Edit}
                                            placeholder="0"
                                        />
                                    </View>
                                    
                                    <Text style={styles.vs}>VS</Text>

                                    <View style={styles.equipoEdit}>
                                        <Text style={styles.equipoNombre}>{getNombreEquipo(partido.equipo2)}</Text>
                                        <TextInput
                                            style={styles.golesInput}
                                            keyboardType="number-pad"
                                            value={goles2Edit}
                                            onChangeText={setGoles2Edit}
                                            placeholder="0"
                                        />
                                    </View>

                                    <View style={styles.editButtons}>
                                        <Pressable
                                            style={styles.saveButton}
                                            onPress={() => actualizarPartido(
                                                partido.id,
                                                parseInt(goles1Edit) || 0,
                                                parseInt(goles2Edit) || 0,
                                                true
                                            )}>
                                            <Text style={styles.saveButtonText}>✓ Guardar</Text>
                                        </Pressable>
                                        <Pressable
                                            style={styles.cancelButton}
                                            onPress={() => setEditando(null)}>
                                            <Text style={styles.cancelButtonText}>✕ Cancelar</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            ) : (
                                <View style={styles.marcadorContainer}>
                                    <View style={styles.equipoContainer}>
                                        <Text style={styles.equipoNombre}>{getNombreEquipo(partido.equipo1)}</Text>
                                        <Text style={styles.goles}>{partido.goles1}</Text>
                                    </View>

                                    <Text style={styles.vs}>VS</Text>

                                    <View style={styles.equipoContainer}>
                                        <Text style={styles.equipoNombre}>{getNombreEquipo(partido.equipo2)}</Text>
                                        <Text style={styles.goles}>{partido.goles2}</Text>
                                    </View>
                                </View>
                            )}

                            {esAdmin && !partido.terminado && editando !== partido.id && (
                                <Pressable
                                    style={styles.editButton}
                                    onPress={() => {
                                        setEditando(partido.id);
                                        setGoles1Edit(partido.goles1.toString());
                                        setGoles2Edit(partido.goles2.toString());
                                    }}>
                                    <Text style={styles.editButtonText}>✏️ Actualizar Resultado</Text>
                                </Pressable>
                            )}
                        </View>
                    ))
                )}
            </View>
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
    container: {
        padding: 20,
        gap: 16,
    },
    titulo: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#E53935',
        marginBottom: 10,
        textAlign: 'center',
    },
    emptyContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
    },
    partidoCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        gap: 12,
    },
    partidoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    fecha: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    terminadoBadge: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    terminadoText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
    },
    marcadorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    equipoContainer: {
        flex: 1,
        alignItems: 'center',
        gap: 8,
    },
    equipoNombre: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },
    goles: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#E53935',
    },
    vs: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#999',
        marginHorizontal: 20,
    },
    editContainer: {
        gap: 12,
    },
    equipoEdit: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    golesInput: {
        backgroundColor: '#f9f9f9',
        borderWidth: 2,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        width: 60,
        height: 50,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    editButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    saveButton: {
        flex: 1,
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        padding: 12,
    },
    saveButtonText: {
        color: '#ffffff',
        fontWeight: '600',
        textAlign: 'center',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#757575',
        borderRadius: 12,
        padding: 12,
    },
    cancelButtonText: {
        color: '#ffffff',
        fontWeight: '600',
        textAlign: 'center',
    },
    editButton: {
        backgroundColor: '#E53935',
        borderRadius: 12,
        padding: 12,
        marginTop: 8,
    },
    editButtonText: {
        color: '#ffffff',
        fontWeight: '600',
        textAlign: 'center',
    },
});