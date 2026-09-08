# Jogo Colete Orbe

## Sobre o projeto

O **Jogo Colete Orbe** é um aplicativo mobile desenvolvido em **React Native**, utilizando **Expo** e **TypeScript**.

O objetivo do jogo é controlar uma bola vermelha utilizando o **giroscópio do celular** e coletar os orbes azuis espalhados pela tela.

O projeto utiliza os sensores do dispositivo para criar uma forma diferente de interação, permitindo que o jogador movimente a bola através da inclinação do celular.

Além da movimentação utilizando sensores, o jogo possui sistema de **pontuação, cronômetro, níveis, dificuldade progressiva, tela inicial e tela de fim de jogo**.

---

## Como funciona?

O jogador controla uma bola vermelha inclinando o celular.

A movimentação permite deslocar o jogador em diferentes direções:

* Para a direita;
* Para a esquerda;
* Para cima;
* Para baixo.

O objetivo é coletar o maior número possível de **orbes azuis** antes que o tempo termine.

Quando o jogador toca o orbe, ele é coletado, o placar aumenta e um novo orbe aparece em uma posição aleatória.

---

## Funcionalidades

O jogo possui as seguintes funcionalidades:

* Movimentação utilizando o giroscópio;
* Jogador representado por uma bola vermelha;
* Orbes gerados em posições aleatórias;
* Sistema de pontuação;
* Cronômetro regressivo;
* Barra visual do tempo;
* Sistema de níveis;
* Dificuldade progressiva;
* Orbes diminuem de tamanho conforme o jogador sobe de nível;
* Feedback visual ao coletar um orbe;
* Tela inicial;
* Tela de fim de jogo;
* Sistema para reiniciar a partida;
* Limites para impedir que o jogador saia da tela;
* Sistema de detecção de colisão;
* Geração segura do orbe dentro da área visível;
* Atualização rápida dos dados do sensor;
* Movimento contínuo.

---

## Fluxo do jogo

O funcionamento do jogo segue o seguinte fluxo:

```text
Tela Inicial
     ↓
Iniciar Jogo
     ↓
Controlar a bola com o giroscópio
     ↓
Coletar orbes
     ↓
Aumentar pontuação
     ↓
Subir de nível
     ↓
Aumentar a dificuldade
     ↓
Tempo termina
     ↓
Fim de Jogo
     ↓
Jogar novamente
```

---

## Sistema de pontuação

Cada vez que o jogador coleta um orbe, a pontuação aumenta em um ponto.

O jogo utiliza o `useState` para armazenar o placar.

Exemplo:

```typescript
const [score, setScore] = useState(0);
```

Ao coletar um orbe:

```typescript
setScore((currentScore) => currentScore + 1);
```

---

## Sistema de níveis

O jogo possui um sistema de níveis.

A cada **5 orbes coletados**, o jogador sobe de nível.

Exemplo:

```text
0 a 4 pontos  → Nível 1
5 a 9 pontos  → Nível 2
10 a 14 pontos → Nível 3
```

O nível aumenta a dificuldade do jogo.

---

## Dificuldade progressiva

Conforme o jogador sobe de nível, o orbe diminui de tamanho.

Isso aumenta a dificuldade, pois se torna necessário controlar o jogador com mais precisão.

O tamanho inicial do orbe é definido por:

```typescript
const INITIAL_ORB_SIZE = 35;
```

Existe também um tamanho mínimo para evitar que o orbe fique muito pequeno:

```typescript
const MIN_ORB_SIZE = 15;
```

---

## Cronômetro

O jogo possui um cronômetro regressivo.

O jogador possui um tempo limitado para coletar o maior número possível de orbes.

O tempo inicial é definido por:

```typescript
const INITIAL_TIME = 30;
```

O cronômetro diminui a cada segundo.

Quando o tempo chega a zero, a partida termina.

---

## Barra de tempo

Além do cronômetro numérico, o jogo possui uma barra visual que representa o tempo restante.

Conforme o tempo diminui, a barra também diminui.

A largura da barra é calculada proporcionalmente:

```typescript
width: `${(time / INITIAL_TIME) * 100}%`
```

---

## Tela inicial

Antes de iniciar o jogo, o jogador visualiza uma tela inicial.

Essa tela apresenta:

* Nome do jogo;
* Instruções;
* Objetivo;
* Informações sobre os níveis;
* Tempo disponível;
* Botão para iniciar o jogo.

O jogo só começa quando o jogador pressiona o botão.

---

## Tela de fim de jogo

Quando o tempo termina, o jogo apresenta uma tela de fim de jogo.

Nessa tela são exibidas informações como:

* Pontuação final;
* Quantidade de orbes coletados;
* Nível alcançado;
* Botão para jogar novamente.

---

## Sistema de reinício

Após o fim da partida, o jogador pode iniciar uma nova partida.

Ao reiniciar, o sistema:

* Zera a pontuação;
* Restaura o tempo inicial;
* Volta para o nível inicial;
* Restaura o tamanho original do orbe;
* Centraliza o jogador;
* Gera um novo orbe.

---

## Tecnologias utilizadas

O projeto foi desenvolvido utilizando:

* React Native;
* Expo;
* TypeScript;
* expo-sensors;
* Gyroscope API.

---

## Biblioteca utilizada

Para acessar os sensores do dispositivo, foi utilizada a biblioteca:

```bash
expo-sensors
```

Ela permite acessar informações dos sensores do celular, como:

* Giroscópio;
* Acelerômetro;
* Magnetômetro.

Neste projeto, foi utilizado o **Gyroscope**.

---

## Instalação

Clone o repositório:

```bash
git https://github.com/AnaClaraMendes399/aula-giroscopio
```

Entre na pasta do projeto:

```bash
cd aula-giroscopio
```

Instale as dependências:

```bash
npm install
```

Instale a biblioteca de sensores:

```bash
npx expo install expo-sensors
```

Inicie o projeto:

```bash
npx expo start
```

---

## Como testar

Para testar corretamente o jogo, recomenda-se utilizar um celular físico, pois o projeto depende do giroscópio do dispositivo.

1. Inicie o projeto:

```bash
npx expo start
```

2. Abra o aplicativo Expo Go no celular;

3. Escaneie o QR Code exibido;

4. Abra o aplicativo;

5. Pressione o botão para iniciar o jogo;

6. Incline o celular para movimentar a bola vermelha;

7. Colete os orbes;

8. Tente obter a maior pontuação antes que o tempo termine.

---

## Sistema de movimentação

A movimentação do jogador é baseada nos dados fornecidos pelo giroscópio.

Os dados recebidos pelo sensor são armazenados utilizando `useState`.

A velocidade do jogador é calculada utilizando:

```typescript
const playerSpeed =
  INITIAL_SPEED + (level - 1) * 2;
```

Os valores do giroscópio são utilizados para calcular uma nova posição:

```typescript
let newX =
  currentPosition.x +
  data.y * playerSpeed;

let newY =
  currentPosition.y -
  data.x * playerSpeed;
```

---

## Giroscópio

O giroscópio é utilizado para detectar a rotação e inclinação do dispositivo.

O projeto utiliza:

```typescript
Gyroscope.addListener(...)
```

A atualização dos dados do sensor é configurada com:

```typescript
Gyroscope.setUpdateInterval(16);
```

Isso permite uma atualização rápida e um movimento mais fluido.

---

## useEffect e limpeza do sensor

O `useEffect` é utilizado para iniciar a leitura do giroscópio.

Quando o componente é encerrado, a inscrição do sensor é removida:

```typescript
return () => {
  subscription.remove();
};
```

Isso evita que o sensor continue funcionando desnecessariamente.

---

## Limites da tela

O jogo utiliza o tamanho real da área disponível para impedir que o jogador ultrapasse os limites da tela.

Exemplo:

```typescript
if (newX < 0) {
  newX = 0;
}

if (
  newX >
  gameSize.width - PLAYER_SIZE
) {
  newX =
    gameSize.width - PLAYER_SIZE;
}
```

Dessa forma, o jogador permanece completamente dentro da área do jogo.

---

## Geração do orbe

O orbe é gerado em posições aleatórias.

O tamanho do orbe é considerado durante a geração da posição para impedir que ele apareça parcialmente fora da tela.

Exemplo:

```typescript
const availableWidth =
  gameSize.width -
  currentOrbSize;
```

A posição vertical também considera a área reservada para o painel superior do jogo.

---

## Sistema de colisão

A colisão entre o jogador e o orbe é calculada utilizando a distância entre os centros das duas bolas.

Primeiramente, são calculados os centros:

```typescript
const playerCenterX =
  playerPosition.x +
  PLAYER_SIZE / 2;

const playerCenterY =
  playerPosition.y +
  PLAYER_SIZE / 2;
```

Em seguida, é calculada a distância entre os objetos:

```typescript
const distance =
  Math.sqrt(
    dx * dx +
    dy * dy
  );
```

A colisão acontece quando a distância entre os centros é menor ou igual à soma dos raios:

```typescript
if (
  distance <=
  playerRadius + orbRadius
) {
  // Orbe coletado
}
```

---

## Estrutura do projeto

```text
projeto
│
├── app
│
├── components
│   ├── JogoColeteOrbe.tsx
│   └── LeituraGiroscopio.tsx
│
├── package.json
├── tsconfig.json
└── README.md
```

---

## Funcionalidades testadas

| Funcionalidade           | Status    |
| ------------------------ | --------- |
| Tela inicial             | Concluído |
| Iniciar jogo             | Concluído |
| Movimento para direita   | Concluído |
| Movimento para esquerda  | Concluído |
| Movimento para cima      | Concluído |
| Movimento para baixo     | Concluído |
| Movimento suave          | Concluído |
| Controle pelo giroscópio | Concluído |
| Jogador dentro da tela   | Concluído |
| Orbe dentro da tela      | Concluído |
| Detecção de colisão      | Concluído |
| Coleta do orbe           | Concluído |
| Sistema de pontuação     | Concluído |
| Cronômetro               | Concluído |
| Barra de tempo           | Concluído |
| Sistema de níveis        | Concluído |
| Dificuldade progressiva  | Concluído |
| Tela de fim de jogo      | Concluído |
| Reiniciar jogo           | Concluído |

---

## Possíveis melhorias futuras

Algumas melhorias que podem ser adicionadas futuramente:

* Efeitos sonoros;
* Música de fundo;
* Sistema de recordes;
* Mais de um orbe na tela;
* Diferentes tipos de orbes;
* Sistema de vidas;
* Animações;
* Efeitos de partículas;
* Novos níveis;
* Sistema de ranking.

---

## Autora

Desenvolvido por **Ana Clara Mendes**.

Projeto desenvolvido para fins educacionais utilizando **React Native, Expo, TypeScript e sensores de dispositivos móveis**.
