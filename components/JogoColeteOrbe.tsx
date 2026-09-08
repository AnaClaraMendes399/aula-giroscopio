import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  LayoutChangeEvent,
  TouchableOpacity,
} from 'react-native';

import { Gyroscope } from 'expo-sensors';

// ========================================
// CONFIGURAÇÕES DO JOGO
// ========================================

const PLAYER_SIZE = 50;

const INITIAL_ORB_SIZE = 35;
const MIN_ORB_SIZE = 15;

const INITIAL_SPEED = 18;

const TOP_SAFE_AREA = 115;

const INITIAL_TIME = 30;


// ========================================
// COMPONENTE PRINCIPAL
// ========================================

export default function JogoColeteOrbe() {

  // ========================================
  // TAMANHO DA ÁREA DO JOGO
  // ========================================

  const [gameSize, setGameSize] = useState({
    width: 0,
    height: 0,
  });


  // ========================================
  // DADOS DO GIROSCÓPIO
  // ========================================

  const [data, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });


  // ========================================
  // POSIÇÃO DO JOGADOR
  // ========================================

  const [playerPosition, setPlayerPosition] = useState({
    x: 0,
    y: TOP_SAFE_AREA,
  });


  // ========================================
  // POSIÇÃO DO ORBE
  // ========================================

  const [orbPosition, setOrbPosition] = useState({
    x: 0,
    y: TOP_SAFE_AREA,
  });


  // ========================================
  // ESTADOS DO JOGO
  // ========================================

  const [score, setScore] = useState(0);

  const [time, setTime] =
    useState(INITIAL_TIME);

  const [level, setLevel] = useState(1);

  const [gameStarted, setGameStarted] =
    useState(false);

  const [gameOver, setGameOver] =
    useState(false);


  // ========================================
  // TAMANHO DO ORBE
  // ========================================

  const [orbSize, setOrbSize] =
    useState(INITIAL_ORB_SIZE);


  // ========================================
  // MENSAGEM +1
  // ========================================

  const [showPoint, setShowPoint] =
    useState(false);


  // ========================================
  // REFERÊNCIA DA POSIÇÃO
  // ========================================

  const playerPositionRef =
    useRef(playerPosition);


  // ========================================
  // VELOCIDADE DO JOGADOR
  // ========================================

  const playerSpeed =
    INITIAL_SPEED +
    (level - 1) * 2;


  // ========================================
  // GERAR POSIÇÃO ALEATÓRIA
  // ========================================

  const generateRandomPosition = (
    currentOrbSize = orbSize
  ) => {

    if (
      gameSize.width === 0 ||
      gameSize.height === 0
    ) {

      return {
        x: 0,
        y: TOP_SAFE_AREA,
      };

    }


    const availableWidth =
      gameSize.width -
      currentOrbSize;


    const availableHeight =
      gameSize.height -
      TOP_SAFE_AREA -
      currentOrbSize;


    return {

      x:
        Math.random() *
        availableWidth,


      y:
        TOP_SAFE_AREA +
        Math.random() *
        availableHeight,

    };

  };


  // ========================================
  // PEGAR TAMANHO DA TELA
  // ========================================

  const handleLayout = (
    event: LayoutChangeEvent
  ) => {

    const { width, height } =
      event.nativeEvent.layout;


    setGameSize({
      width,
      height,
    });


    // ========================================
    // POSIÇÃO INICIAL DO JOGADOR
    // ========================================

    const initialPlayerPosition = {

      x:
        width / 2 -
        PLAYER_SIZE / 2,


      y:
        TOP_SAFE_AREA +
        (
          height -
          TOP_SAFE_AREA -
          PLAYER_SIZE
        ) / 2,

    };


    playerPositionRef.current =
      initialPlayerPosition;


    setPlayerPosition(
      initialPlayerPosition
    );


    // ========================================
    // ORBE INICIAL
    // ========================================

    const initialOrbPosition = {

      x:
        Math.random() *
        (
          width -
          INITIAL_ORB_SIZE
        ),


      y:
        TOP_SAFE_AREA +
        Math.random() *
        (
          height -
          TOP_SAFE_AREA -
          INITIAL_ORB_SIZE
        ),

    };


    setOrbPosition(
      initialOrbPosition
    );

  };


  // ========================================
  // GIROSCÓPIO
  // ========================================

  useEffect(() => {

    Gyroscope.setUpdateInterval(16);


    const subscription =
      Gyroscope.addListener(
        (gyroscopeData) => {

          setData(
            gyroscopeData
          );

        }
      );


    return () => {

      subscription.remove();

    };


  }, []);


  // ========================================
  // MOVIMENTO DO JOGADOR
  // ========================================

  useEffect(() => {

    // Não movimenta
    // antes do jogo começar

    if (
      !gameStarted ||
      gameOver
    ) {

      return;

    }


    if (
      gameSize.width === 0 ||
      gameSize.height === 0
    ) {

      return;

    }


    const currentPosition =
      playerPositionRef.current;


    // ========================================
    // NOVA POSIÇÃO
    // ========================================

    let newX =
      currentPosition.x +
      data.y *
      playerSpeed;


    let newY =
      currentPosition.y -
      data.x *
      playerSpeed;


    // ========================================
    // LIMITES HORIZONTAIS
    // ========================================

    if (newX < 0) {

      newX = 0;

    }


    if (
      newX >
      gameSize.width -
      PLAYER_SIZE
    ) {

      newX =
        gameSize.width -
        PLAYER_SIZE;

    }


    // ========================================
    // LIMITES VERTICAIS
    // ========================================

    if (
      newY <
      TOP_SAFE_AREA
    ) {

      newY =
        TOP_SAFE_AREA;

    }


    if (
      newY >
      gameSize.height -
      PLAYER_SIZE
    ) {

      newY =
        gameSize.height -
        PLAYER_SIZE;

    }


    // ========================================
    // NOVA POSIÇÃO
    // ========================================

    const newPosition = {

      x: newX,
      y: newY,

    };


    playerPositionRef.current =
      newPosition;


    setPlayerPosition(
      newPosition
    );


  }, [

    data,
    gameSize,
    gameStarted,
    gameOver,
    playerSpeed,

  ]);


  // ========================================
  // TIMER
  // ========================================

  useEffect(() => {

    if (
      !gameStarted ||
      gameOver
    ) {

      return;

    }


    const timer =
      setInterval(() => {

        setTime(
          (currentTime) => {

            if (
              currentTime <= 1
            ) {

              setGameOver(true);

              return 0;

            }


            return currentTime - 1;

          }
        );


      }, 1000);


    return () => {

      clearInterval(timer);

    };


  }, [

    gameStarted,
    gameOver,

  ]);


  // ========================================
  // COLISÃO
  // ========================================

  useEffect(() => {

    if (
      !gameStarted ||
      gameOver
    ) {

      return;

    }


    if (
      gameSize.width === 0 ||
      gameSize.height === 0
    ) {

      return;

    }


    // ========================================
    // CENTRO DO JOGADOR
    // ========================================

    const playerCenterX =
      playerPosition.x +
      PLAYER_SIZE / 2;


    const playerCenterY =
      playerPosition.y +
      PLAYER_SIZE / 2;


    // ========================================
    // CENTRO DO ORBE
    // ========================================

    const orbCenterX =
      orbPosition.x +
      orbSize / 2;


    const orbCenterY =
      orbPosition.y +
      orbSize / 2;


    // ========================================
    // DISTÂNCIA
    // ========================================

    const dx =
      playerCenterX -
      orbCenterX;


    const dy =
      playerCenterY -
      orbCenterY;


    const distance =
      Math.sqrt(
        dx * dx +
        dy * dy
      );


    // ========================================
    // RAIOS
    // ========================================

    const playerRadius =
      PLAYER_SIZE / 2;


    const orbRadius =
      orbSize / 2;


    // ========================================
    // COLISÃO
    // ========================================

    if (
      distance <=
      playerRadius +
      orbRadius
    ) {


      // ========================================
      // AUMENTAR PLACAR
      // ========================================

      setScore(
        (currentScore) => {

          const newScore =
            currentScore + 1;


          // ========================================
          // NOVO NÍVEL
          // A CADA 5 PONTOS
          // ========================================

          if (
            newScore % 5 === 0
          ) {

            setLevel(
              (currentLevel) =>
                currentLevel + 1
            );


            // ========================================
            // DIMINUIR ORBE
            // ========================================

            setOrbSize(
              (currentSize) => {

                return Math.max(
                  MIN_ORB_SIZE,
                  currentSize - 4
                );

              }
            );

          }


          return newScore;

        }
      );


      // ========================================
      // MOSTRAR +1
      // ========================================

      setShowPoint(true);


      setTimeout(() => {

        setShowPoint(false);

      }, 500);


      // ========================================
      // NOVA POSIÇÃO
      // ========================================

      setOrbPosition(
        generateRandomPosition()
      );


    }


  }, [

    playerPosition,
    orbPosition,
    orbSize,
    gameSize,
    gameStarted,
    gameOver,

  ]);


  // ========================================
  // INICIAR JOGO
  // ========================================

  const startGame = () => {

    setScore(0);

    setTime(INITIAL_TIME);

    setLevel(1);

    setOrbSize(
      INITIAL_ORB_SIZE
    );

    setGameOver(false);

    setGameStarted(true);

    setShowPoint(false);


    // ========================================
    // NOVO ORBE
    // ========================================

    setOrbPosition(
      generateRandomPosition(
        INITIAL_ORB_SIZE
      )
    );

  };


  // ========================================
  // REINICIAR JOGO
  // ========================================

  const restartGame = () => {

    setScore(0);

    setTime(INITIAL_TIME);

    setLevel(1);

    setOrbSize(
      INITIAL_ORB_SIZE
    );

    setGameOver(false);

    setGameStarted(true);

    setShowPoint(false);


    // ========================================
    // VOLTAR JOGADOR AO CENTRO
    // ========================================

    const newPlayerPosition = {

      x:
        gameSize.width / 2 -
        PLAYER_SIZE / 2,


      y:
        TOP_SAFE_AREA +
        (
          gameSize.height -
          TOP_SAFE_AREA -
          PLAYER_SIZE
        ) / 2,

    };


    playerPositionRef.current =
      newPlayerPosition;


    setPlayerPosition(
      newPlayerPosition
    );


    // ========================================
    // NOVO ORBE
    // ========================================

    setOrbPosition(
      generateRandomPosition(
        INITIAL_ORB_SIZE
      )
    );

  };


  // ========================================
  // INTERFACE
  // ========================================

  return (

    <View
      style={styles.container}
      onLayout={handleLayout}
    >


      {/* =================================
          TELA INICIAL
      ================================= */}

      {!gameStarted && (

        <View style={styles.menu}>


          <Text style={styles.gameIcon}>
            🔵
          </Text>


          <Text style={styles.title}>
            COLETOR
          </Text>


          <Text style={styles.titleBlue}>
            DE ORBES
          </Text>


          <Text style={styles.description}>

            Incline o celular para
            controlar o jogador e
            colete os orbes!

          </Text>


          <View style={styles.infoBox}>

            <Text style={styles.infoText}>
              🎯 Colete o máximo possível
            </Text>

            <Text style={styles.infoText}>
              ⭐ A cada 5 pontos sobe de nível
            </Text>

            <Text style={styles.infoText}>
              ⏱️ Você tem 30 segundos
            </Text>

          </View>


          <TouchableOpacity
            style={styles.button}
            onPress={startGame}
          >

            <Text style={styles.buttonText}>
              ▶ JOGAR
            </Text>

          </TouchableOpacity>


        </View>

      )}


      {/* =================================
          JOGO
      ================================= */}

      {gameStarted && !gameOver && (

        <>


          {/* =================================
              PAINEL SUPERIOR
          ================================= */}

          <View style={styles.hud}>


            {/* PLACAR */}

            <View style={styles.hudBox}>

              <Text style={styles.hudLabel}>
                PONTOS
              </Text>

              <Text style={styles.hudValue}>
                {score}
              </Text>

            </View>


            {/* NÍVEL */}

            <View style={styles.hudBox}>

              <Text style={styles.hudLabel}>
                NÍVEL
              </Text>

              <Text style={styles.hudValue}>
                {level}
              </Text>

            </View>


          </View>


          {/* =================================
              TIMER
          ================================= */}

          <View style={styles.timerContainer}>


            <Text style={styles.timerText}>
              ⏱ {time}s
            </Text>


            <View style={styles.timerBar}>


              <View
                style={[
                  styles.timerProgress,
                  {
                    width:
                      `${(time / INITIAL_TIME) * 100}%`,
                  },
                ]}
              />


            </View>


          </View>


          {/* =================================
              +1
          ================================= */}

          {showPoint && (

            <Text style={styles.pointText}>
              +1
            </Text>

          )}


          {/* =================================
              ORBE
          ================================= */}

          <View
            style={[
              styles.orbGlow,
              {
                width:
                  orbSize + 14,

                height:
                  orbSize + 14,

                borderRadius:
                  (orbSize + 14) / 2,

                left:
                  orbPosition.x - 7,

                top:
                  orbPosition.y - 7,

              },
            ]}
          />


          <View
            style={[
              styles.orb,
              {
                width:
                  orbSize,

                height:
                  orbSize,

                borderRadius:
                  orbSize / 2,

                left:
                  orbPosition.x,

                top:
                  orbPosition.y,

              },
            ]}
          />


          {/* =================================
              JOGADOR
          ================================= */}

          <View
            style={[
              styles.playerGlow,
              {
                left:
                  playerPosition.x - 4,

                top:
                  playerPosition.y - 4,

              },
            ]}
          />


          <View
            style={[
              styles.player,
              {
                left:
                  playerPosition.x,

                top:
                  playerPosition.y,

              },
            ]}
          />


        </>

      )}


      {/* =================================
          GAME OVER
      ================================= */}

      {gameOver && (

        <View style={styles.menu}>


          <Text style={styles.gameOverIcon}>
            🏁
          </Text>


          <Text style={styles.gameOver}>
            FIM DE JOGO!
          </Text>


          <Text style={styles.gameOverText}>
            Você coletou
          </Text>


          <Text style={styles.finalScore}>
            {score}
          </Text>


          <Text style={styles.gameOverText}>
            orbes!
          </Text>


          <View style={styles.levelResult}>

            <Text style={styles.levelText}>
              ⭐ Nível alcançado: {level}
            </Text>

          </View>


          <TouchableOpacity
            style={styles.button}
            onPress={restartGame}
          >

            <Text style={styles.buttonText}>
              🔄 JOGAR NOVAMENTE
            </Text>

          </TouchableOpacity>


        </View>

      )}


    </View>

  );

}


// ========================================
// ESTILOS
// ========================================

const styles = StyleSheet.create({


  // ========================================
  // CONTAINER
  // ========================================

  container: {

    flex: 1,

    backgroundColor:
      '#16213e',

    overflow:
      'hidden',

  },


  // ========================================
  // MENU
  // ========================================

  menu: {

    flex: 1,

    justifyContent:
      'center',

    alignItems:
      'center',

    padding: 30,

  },


  gameIcon: {

    fontSize: 60,

    marginBottom: 10,

  },


  title: {

    fontSize: 38,

    fontWeight:
      '900',

    color:
      '#ffffff',

    letterSpacing: 2,

  },


  titleBlue: {

    fontSize: 38,

    fontWeight:
      '900',

    color:
      '#3498db',

    letterSpacing: 2,

    marginBottom: 25,

  },


  description: {

    color:
      '#bdc3c7',

    fontSize: 17,

    textAlign:
      'center',

    lineHeight: 25,

    marginBottom: 25,

  },


  // ========================================
  // CAIXA DE INFORMAÇÕES
  // ========================================

  infoBox: {

    backgroundColor:
      '#1f4068',

    padding: 18,

    borderRadius: 15,

    width: '100%',

    marginBottom: 30,

  },


  infoText: {

    color:
      '#ffffff',

    fontSize: 14,

    marginVertical: 5,

  },


  // ========================================
  // BOTÃO
  // ========================================

  button: {

    backgroundColor:
      '#3498db',

    paddingVertical:
      16,

    paddingHorizontal:
      35,

    borderRadius:
      14,

    elevation:
      5,

  },


  buttonText: {

    color:
      '#ffffff',

    fontSize:
      17,

    fontWeight:
      'bold',

  },


  // ========================================
  // HUD
  // ========================================

  hud: {

    position:
      'absolute',

    top: 35,

    left: 20,

    right: 20,

    flexDirection:
      'row',

    justifyContent:
      'space-between',

    zIndex: 5,

  },


  hudBox: {

    backgroundColor:
      '#1f4068',

    paddingVertical:
      8,

    paddingHorizontal:
      18,

    borderRadius:
      12,

    alignItems:
      'center',

    minWidth:
      85,

  },


  hudLabel: {

    color:
      '#95a5a6',

    fontSize:
      11,

    fontWeight:
      'bold',

  },


  hudValue: {

    color:
      '#ffffff',

    fontSize:
      22,

    fontWeight:
      'bold',

  },


  // ========================================
  // TIMER
  // ========================================

  timerContainer: {

    position:
      'absolute',

    top: 100,

    left: 25,

    right: 25,

    zIndex: 5,

  },


  timerText: {

    color:
      '#ffffff',

    textAlign:
      'center',

    fontSize:
      16,

    fontWeight:
      'bold',

    marginBottom:
      6,

  },


  timerBar: {

    height:
      10,

    backgroundColor:
      '#34495e',

    borderRadius:
      10,

    overflow:
      'hidden',

  },


  timerProgress: {

    height:
      '100%',

    backgroundColor:
      '#3498db',

    borderRadius:
      10,

  },


  // ========================================
  // +1
  // ========================================

  pointText: {

    position:
      'absolute',

    top:
      145,

    alignSelf:
      'center',

    fontSize:
      30,

    fontWeight:
      'bold',

    color:
      '#2ecc71',

    zIndex:
      10,

  },


  // ========================================
  // JOGADOR
  // ========================================

  playerGlow: {

    position:
      'absolute',

    width:
      PLAYER_SIZE + 8,

    height:
      PLAYER_SIZE + 8,

    borderRadius:
      (PLAYER_SIZE + 8) / 2,

    backgroundColor:
      '#e74c3c',

    opacity:
      0.25,

  },


  player: {

    position:
      'absolute',

    width:
      PLAYER_SIZE,

    height:
      PLAYER_SIZE,

    borderRadius:
      PLAYER_SIZE / 2,

    backgroundColor:
      '#e74c3c',

    borderWidth:
      3,

    borderColor:
      '#ffffff',

  },


  // ========================================
  // ORBE
  // ========================================

  orbGlow: {

    position:
      'absolute',

    backgroundColor:
      '#3498db',

    opacity:
      0.25,

  },


  orb: {

    position:
      'absolute',

    backgroundColor:
      '#3498db',

    borderWidth:
      3,

    borderColor:
      '#ffffff',

  },


  // ========================================
  // GAME OVER
  // ========================================

  gameOverIcon: {

    fontSize:
      55,

    marginBottom:
      10,

  },


  gameOver: {

    color:
      '#ffffff',

    fontSize:
      36,

    fontWeight:
      '900',

    marginBottom:
      25,

  },


  gameOverText: {

    color:
      '#bdc3c7',

    fontSize:
      18,

  },


  finalScore: {

    color:
      '#3498db',

    fontSize:
      70,

    fontWeight:
      'bold',

  },


  levelResult: {

    marginTop:
      20,

    marginBottom:
      30,

    backgroundColor:
      '#1f4068',

    padding:
      12,

    borderRadius:
      10,

  },


  levelText: {

    color:
      '#ffffff',

    fontSize:
      16,

  },


});