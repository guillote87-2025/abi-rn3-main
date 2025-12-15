import HeaderReact from '@/components/header';
import SelectorEquipo from '@/components/seleccionequipo';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function Partido()
{
    const [opcion1, setOpcion1] = useState(0);
    const [opcion2, setOpcion2] = useState(0);
    const [fecha, setFecha] = useState(new Date());
    
    return (
        <View style={styles.screen}>
            <HeaderReact />
            <View>
                <SelectorEquipo sendData={setOpcion1}/>
                <SelectorEquipo sendData={setOpcion2}/>
                <Pressable style={styles.botonmin}>
                    <Text style={styles.subtitulo}>Crear Partido</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
      },
    container: {
      top:80,
      marginTop: 20,
      textAlign: 'center',
      justifyContent: 'center',
      backgroundColor: '#3f74ca',
      width: 350,
      minHeight: '15%',
      borderRadius: 5,
      alignItems: 'center', 
    },
    containercentrado:{
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 20,
      marginRight: 20,
      marginBottom: 20,
      marginTop: 20,
    },
    bigcontainer: {
      top:40,
      marginTop: 20,
      textAlign: 'center',
      justifyContent: 'center',
      backgroundColor: '#3f74ca',
      width: 650,
      minHeight: '15%',
      borderRadius: 5,
      alignItems: 'center', 
    },
    titulo:{
      textAlign: 'center',
      fontSize: 20,
    },
    subtitulo:{
      color: "white",
      fontSize: 15,
      textAlign: 'center',
    },
    error:{
      textAlign: 'left',
      fontSize: 15,
      color: '#d9262f',
    },
    input:{
      backgroundColor: 'white',
      width: 300,
      height: 40,
      borderColor: 'black',
      borderWidth: 2,
      borderRadius: 5,
      marginTop: 5,
      marginBottom: 5,
      color: 'black',
    },
    boton:{
      backgroundColor: '#4f94ca',
      marginBottom: 5,
      borderColor: 'black',
      borderWidth: 2,
      borderRadius: 5,
      padding: 5,
      width: 200,
    },
    botonmin:{
      backgroundColor: '#4f94ca',
      marginBottom: 5,
      borderColor: 'black',
      borderWidth: 2,
      borderRadius: 5,
      padding: 5,
      width: 125,
    },
    imagen: {
      borderRadius: 10,
      width: 200, 
      height: 200, 
    }
  });
  