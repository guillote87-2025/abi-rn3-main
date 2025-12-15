import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

export default function SelectorEquipo({ sendData }:{sendData: (id: number) => void })
{
    const [equipos, setEquipos] = useState<any[]>([]);
    const [activo, setActivo] = useState(false);
    const [equipoNombre, setNombre] = useState('-- Seleccionar Equipo --');
    const [equipoId, setID] = useState(0);

    useEffect(() => {
        fetch('http://localhost:3031/getEquipos')
          .then(response => response.json())
          .then(data => setEquipos(data));
    }, []);

    async function select(id : number, nombre : string)
    {
        setID(id);
        setNombre(nombre);
        setActivo(false);
        sendData(id);
    }

    return(
        activo ? 
        <>
            {equipos.map((equipo, index) => {
                return(
                    <Pressable onPress={() => {select(equipo.id, equipo.nombre)}} style={styles.input} key={index}>
                        <Text style={styles.subtitulo}>{equipo.nombre}</Text>
                    </Pressable>)
            })}
        </>
        :
        <>
            <Pressable onPress={() => {setActivo(true)}} style={styles.input}>
                <Text style={styles.subtitulo}>{equipoNombre}</Text>
            </Pressable>
        </>
    );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#f9f9f9',
    width: '100%',
    maxWidth: 320,
    height: 50,
    borderColor: '#e0e0e0',
    borderWidth: 2,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  subtitulo: {
    color: '#333',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});