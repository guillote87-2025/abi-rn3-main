import HeaderReact from '@/components/header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

WebBrowser.maybeCompleteAuthSession();

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = 150; // Tamaño fijo para todas las cards
const CARD_MARGIN = 12;
const SCROLL_AMOUNT = CARD_WIDTH + CARD_MARGIN;

export default function HomeScreen() {
  const router = useRouter();

  const [mail, setMail] = useState('');
  const [jugadores, setJugadores] = useState<any[]>([]);
  const [directores, setDirectores] = useState<any[]>([]);
  const [equipos, setEquipos] = useState<any[]>([]);

  const [posJugadores, setPosJugadores] = useState(0);
  const [posDirectores, setPosDirectores] = useState(0);
  const [posEquipos, setPosEquipos] = useState(0);

  // Usamos tipo específico pero sin problemas de TypeScript
  const refJugadores = useRef<any>(null);
  const refDirectores = useRef<any>(null);
  const refEquipos = useRef<any>(null);

  useEffect(() => {
    (async () => {
      setMail((await AsyncStorage.getItem('email')) || '');
    })();

    fetch('http://localhost:3031/getJugadores').then(r => r.json()).then(setJugadores);
    fetch('http://localhost:3031/getDirectores').then(r => r.json()).then(setDirectores);
    fetch('http://localhost:3031/getEquipos').then(r => r.json()).then(setEquipos);
  }, []);

  const scroll = (
    ref: React.RefObject<ScrollView>,
    current: number,
    setPos: React.Dispatch<React.SetStateAction<number>>,
    direction: 'left' | 'right',
    length: number
  ) => {
    const maxScroll = Math.max(0, length * SCROLL_AMOUNT - (SCREEN_WIDTH - 124)); // Ajustado por el tamaño de flechas
    let target = current;
    
    if (direction === 'right') {
      target = Math.min(current + SCROLL_AMOUNT * 2, maxScroll); // Scroll de 2 cards
      if (target >= maxScroll - 1) target = maxScroll;
    } else {
      target = Math.max(current - SCROLL_AMOUNT * 2, 0); // Scroll de 2 cards
      if (target <= 1) target = 0;
    }

    ref.current?.scrollTo({ x: target, animated: true });
    setPos(target);
  };

  const onScroll =
    (setPos: React.Dispatch<React.SetStateAction<number>>) =>
    (e: NativeSyntheticEvent<NativeScrollEvent>) =>
      setPos(e.nativeEvent.contentOffset.x);

  const canLeft = (p: number) => p > 5;
  const canRight = (p: number, l: number) => {
    const maxScroll = Math.max(0, l * SCROLL_AMOUNT - (SCREEN_WIDTH - 124));
    return p < maxScroll - 5;
  };

  const renderCarousel = (
    title: string,
    data: any[],
    ref: React.RefObject<ScrollView>,
    pos: number,
    setPos: React.Dispatch<React.SetStateAction<number>>,
    imageKey: string,
    name: (item: any) => string,
    tipo: number
  ) => (
    <>
      <Text style={styles.sectionTitle}>{title}</Text>

      <View style={styles.carouselContainer}>
        <View style={styles.arrowButtonContainer}>
          <Pressable
            style={[styles.arrowButton, !canLeft(pos) && styles.arrowButtonDisabled]}
            onPress={() => scroll(ref, pos, setPos, 'left', data.length)}
            disabled={!canLeft(pos) || data.length === 0}
            android_ripple={{ color: 'rgba(229, 57, 53, 0.1)', borderless: true }}
          >
            <Text 
              selectable={false} 
              style={[
                styles.arrowText, 
                !canLeft(pos) && styles.arrowTextDisabled
              ]}
            >
              ‹
            </Text>
          </Pressable>
        </View>

        <View style={styles.carouselWrapper}>
          <ScrollView
            ref={ref}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.carouselContent,
              data.length === 0 && styles.emptyCarouselContent
            ]}
            onScroll={onScroll(setPos)}
            scrollEventThrottle={16}
            decelerationRate="fast"
            snapToInterval={SCROLL_AMOUNT}
            snapToAlignment="start"
            disableIntervalMomentum={true}
            bounces={false}
            overScrollMode="never"
          >
            {data.length > 0 ? (
              data.map(item => (
                <View 
                  style={[
                    styles.card,
                    // Esta es la clave: todas las cards tienen EXACTAMENTE las mismas dimensiones
                    { width: CARD_WIDTH, height: 200 }
                  ]} 
                  key={item.id}
                >
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: '/profile',
                        params: { id: item.id, tipo },
                      })
                    }
                    style={({ pressed }) => [
                      styles.cardPressable,
                      pressed && styles.cardPressed
                    ]}
                  >
                    <View style={styles.imageContainer}>
                      <Image
                        style={styles.imagen}
                        source={{ uri: 'http://localhost:3031' + item[imageKey] }}
                        resizeMode="contain"
                      />
                    </View>
                    <Text 
                      style={styles.nombre} 
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {name(item)}
                    </Text>
                  </Pressable>
                </View>
              ))
            ) : (
              <View style={[styles.emptyCard, { width: CARD_WIDTH, height: 200 }]}>
                <Text style={styles.emptyText}>No hay datos</Text>
              </View>
            )}
          </ScrollView>
        </View>

        <View style={styles.arrowButtonContainer}>
          <Pressable
            style={[styles.arrowButton, !canRight(pos, data.length) && styles.arrowButtonDisabled]}
            onPress={() => scroll(ref, pos, setPos, 'right', data.length)}
            disabled={!canRight(pos, data.length) || data.length === 0}
            android_ripple={{ color: 'rgba(229, 57, 53, 0.1)', borderless: true }}
          >
            <Text 
              selectable={false} 
              style={[
                styles.arrowText, 
                !canRight(pos, data.length) && styles.arrowTextDisabled
              ]}
            >
              ›
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );

  return (
    <ScrollView 
      style={styles.screen} 
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <HeaderReact />

      {renderCarousel(
        '⚽ Jugadores', 
        jugadores, 
        refJugadores, 
        posJugadores, 
        setPosJugadores, 
        'imagen',
        i => `${i.nombre} ${i.apellido}`, 
        1
      )}

      {renderCarousel(
        '👔 Directores Técnicos', 
        directores, 
        refDirectores, 
        posDirectores, 
        setPosDirectores, 
        'imagen',
        i => `${i.nombre} ${i.apellido}`, 
        2
      )}

      {renderCarousel(
        '🏆 Equipos', 
        equipos, 
        refEquipos, 
        posEquipos, 
        setPosEquipos, 
        'escudo',
        i => i.nombre, 
        3
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 35,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E53935',
    marginBottom: 15,
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  carouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 8,
    paddingHorizontal: 10,
    minHeight: 220, // Altura fija para que no se mueva nada
  },
  carouselWrapper: {
    flex: 1,
    height: 220, // Altura fija
    overflow: 'hidden',
  },
  carouselContent: {
    paddingHorizontal: 0,
    gap: CARD_MARGIN,
    flexDirection: 'row',
    alignItems: 'flex-start', // Importante: alineación superior
  },
  emptyCarouselContent: {
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH - 120,
  },
  arrowButtonContainer: {
    // Contenedor fijo para que los botones no se muevan
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E53935',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    // Fijo: sin transformaciones ni animaciones
    transform: [{ scale: 1 }],
  },
  arrowButtonDisabled: {
    borderColor: '#cccccc',
    backgroundColor: '#f9f9f9',
    shadowOpacity: 0.05,
    elevation: 1,
  },
  arrowText: {
    fontSize: 28,
    color: '#E53935',
    fontWeight: '900',
    lineHeight: 28,
    marginTop: -2,
    textAlign: 'center',
    width: '100%',
  },
  arrowTextDisabled: {
    color: '#999999',
  },
  card: {
    // Dimensiones FIJAS para todas las cards
    width: CARD_WIDTH,
    height: 200, // Altura fija
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between', // Distribuye el espacio
    borderWidth: 1.5,
    borderColor: '#e8e8e8',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
    marginVertical: 4,
    // Esto previene que crezca o se encoja
    flexShrink: 0,
    flexGrow: 0,
  },
  cardPressable: {
    width: '100%',
    height: '100%', // Ocupa todo el espacio de la card
    alignItems: 'center',
    justifyContent: 'space-between', // Espacio entre imagen y texto
  },
  cardPressed: {
    opacity: 0.9,
  },
  imageContainer: {
    width: 110,
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    // Contenedor fijo para la imagen
    flexShrink: 0,
  },
  imagen: {
    width: 110,
    height: 110,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    // Asegura que la imagen mantenga proporción pero no crezca
    resizeMode: 'contain',
  },
  nombre: {
    color: '#222',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 16,
    flexWrap: 'wrap',
    maxWidth: '100%',
    minHeight: 32, // Altura mínima para que todas tengan el mismo espacio
    // Esto asegura que el texto no haga crecer la card
    flexShrink: 1,
    marginTop: 4,
  },
  emptyCard: {
    width: CARD_WIDTH,
    height: 200,
    backgroundColor: '#f9f9f9',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e8e8e8',
    borderStyle: 'dashed',
    padding: 20,
  },
  emptyText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
});