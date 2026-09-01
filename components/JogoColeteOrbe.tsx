import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  LayoutChangeEvent,
} from 'react-native';

import { Gyroscope } from 'expo-sensors';

// Tamanhos
const PLAYER_SIZE = 50;
const ORB_SIZE = 30;

// Velocidade do jogador
const SPEED = 18;

// Espaço reservado para o texto
const TOP_SAFE_AREA = 100;

export default function JogoColeteOrbe() {
  // Tamanho real da área disponível do jogo
  const [gameSize, setGameSize] = useState({
    width: 0,
    height: 0,
  });

  // Dados do giroscópio
  const [data, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  // Posição do jogador
  const [playerPosition, setPlayerPosition] = useState({
    x: 0,
    y: TOP_SAFE_AREA,
  });

  // Posição do orbe
  const [orbPosition, setOrbPosition] = useState({
    x: 0,
    y: TOP_SAFE_AREA,
  });

  // Referência da posição do jogador
  const playerPositionRef = useRef(playerPosition);

  // =========================
  // FUNÇÃO PARA GERAR O ORBE
  // =========================
  const generateRandomPosition = () => {
    if (gameSize.width === 0 || gameSize.height === 0) {
      return {
        x: 0,
        y: TOP_SAFE_AREA,
      };
    }

    return {
      // Garante que o orbe não passe pela lateral
      x: Math.random() * (gameSize.width - ORB_SIZE),

      // Garante que o orbe não passe pelo topo
      // e nem pela parte inferior
      y:
        TOP_SAFE_AREA +
        Math.random() *
          (gameSize.height -
            TOP_SAFE_AREA -
            ORB_SIZE),
    };
  };

  // =========================
  // PEGA O TAMANHO REAL DA TELA
  // =========================
  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;

    setGameSize({
      width,
      height,
    });

    // Coloca o jogador no centro
    const initialPlayerPosition = {
      x: width / 2 - PLAYER_SIZE / 2,
      y:
        TOP_SAFE_AREA +
        (height -
          TOP_SAFE_AREA -
          PLAYER_SIZE) /
          2,
    };

    playerPositionRef.current =
      initialPlayerPosition;

    setPlayerPosition(
      initialPlayerPosition
    );

    // Cria uma posição inicial segura para o orbe
    const initialOrbPosition = {
      x:
        Math.random() *
        (width - ORB_SIZE),

      y:
        TOP_SAFE_AREA +
        Math.random() *
          (height -
            TOP_SAFE_AREA -
            ORB_SIZE),
    };

    setOrbPosition(initialOrbPosition);
  };

  // =========================
  // GIROSCÓPIO
  // =========================
  useEffect(() => {
    // Atualização rápida para movimento suave
    Gyroscope.setUpdateInterval(16);

    const subscription =
      Gyroscope.addListener(
        (gyroscopeData) => {
          setData(gyroscopeData);
        }
      );

    return () => {
      subscription.remove();
    };
  }, []);

  // =========================
  // MOVIMENTO DO JOGADOR
  // =========================
  useEffect(() => {
    // Só movimenta depois de saber
    // o tamanho da área do jogo
    if (
      gameSize.width === 0 ||
      gameSize.height === 0
    ) {
      return;
    }

    const currentPosition =
      playerPositionRef.current;

    // Calcula a nova posição
    let newX =
      currentPosition.x +
      data.y * SPEED;

    let newY =
      currentPosition.y -
      data.x * SPEED;

    // =========================
    // LIMITES HORIZONTAIS
    // =========================

    // Esquerda
    if (newX < 0) {
      newX = 0;
    }

    // Direita
    if (
      newX >
      gameSize.width - PLAYER_SIZE
    ) {
      newX =
        gameSize.width -
        PLAYER_SIZE;
    }

    // =========================
    // LIMITES VERTICAIS
    // =========================

    // Topo
    if (newY < TOP_SAFE_AREA) {
      newY = TOP_SAFE_AREA;
    }

    // Parte inferior
    if (
      newY >
      gameSize.height - PLAYER_SIZE
    ) {
      newY =
        gameSize.height -
        PLAYER_SIZE;
    }

    const newPosition = {
      x: newX,
      y: newY,
    };

    // Atualiza a referência
    playerPositionRef.current =
      newPosition;

    // Atualiza a tela
    setPlayerPosition(
      newPosition
    );
  }, [data, gameSize]);

  // =========================
  // DETECÇÃO DE COLISÃO
  // =========================
  useEffect(() => {
    // Não verifica antes da tela carregar
    if (
      gameSize.width === 0 ||
      gameSize.height === 0
    ) {
      return;
    }

    // Centro do jogador
    const playerCenterX =
      playerPosition.x +
      PLAYER_SIZE / 2;

    const playerCenterY =
      playerPosition.y +
      PLAYER_SIZE / 2;

    // Centro do orbe
    const orbCenterX =
      orbPosition.x +
      ORB_SIZE / 2;

    const orbCenterY =
      orbPosition.y +
      ORB_SIZE / 2;

    // Distâncias
    const dx =
      playerCenterX -
      orbCenterX;

    const dy =
      playerCenterY -
      orbCenterY;

    // Distância entre os centros
    const distance =
      Math.sqrt(
        dx * dx + dy * dy
      );

    // Raios
    const playerRadius =
      PLAYER_SIZE / 2;

    const orbRadius =
      ORB_SIZE / 2;

    // Se as bolas se tocarem
    if (
      distance <=
      playerRadius + orbRadius
    ) {
      setOrbPosition(
        generateRandomPosition()
      );
    }
  }, [
    playerPosition,
    orbPosition,
    gameSize,
  ]);

  return (
    <View
      style={styles.container}
      onLayout={handleLayout}
    >
      {/* TEXTO */}
      <Text style={styles.instructions}>
        Colete o orbe azul!
      </Text>

      {/* ORBE AZUL */}
      <View
        style={[
          styles.orb,
          {
            left: orbPosition.x,
            top: orbPosition.y,
          },
        ]}
      />

      {/* JOGADOR VERMELHO */}
      <View
        style={[
          styles.player,
          {
            left: playerPosition.x,
            top: playerPosition.y,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e50',
    overflow: 'hidden',
  },

  instructions: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,

    textAlign: 'center',

    fontSize: 20,

    color: '#fff',

    zIndex: 1,
  },

  player: {
    position: 'absolute',

    width: PLAYER_SIZE,
    height: PLAYER_SIZE,

    borderRadius:
      PLAYER_SIZE / 2,

    backgroundColor: 'red',

    borderWidth: 2,
    borderColor: '#fff',
  },

  orb: {
    position: 'absolute',

    width: ORB_SIZE,
    height: ORB_SIZE,

    borderRadius:
      ORB_SIZE / 2,

    backgroundColor: '#3498db',

    borderWidth: 2,
    borderColor: '#fff',
  },
});

