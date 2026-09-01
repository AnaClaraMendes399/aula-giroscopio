# Jogo Colete Orbe

## Sobre o projeto

O **Jogo Colete Orbe** é um aplicativo desenvolvido em **React Native** utilizando **Expo**. O objetivo do jogo é controlar uma bola vermelha por meio dos sensores do celular e coletar o orbe azul espalhado pela tela.

O projeto utiliza o **giroscópio** do dispositivo para identificar os movimentos e inclinações do celular, permitindo uma interação baseada em sensores.

---

## Como funciona?

O jogador controla uma bola vermelha inclinando o celular.

A movimentação permite que o jogador se desloque:

* Para a direita;
* Para a esquerda;
* Para cima;
* Para baixo.

O objetivo é movimentar a bola vermelha até tocar o orbe azul.

Quando o jogador toca ou sobrepõe o orbe, ele é coletado e aparece novamente em uma nova posição aleatória.

---

## Funcionalidades

* Movimentação utilizando o giroscópio;
* Jogador representado por uma bola vermelha;
* Orbe azul gerado em posições aleatórias;
* Movimento suave e contínuo;
* Atualização rápida dos dados do sensor;
* Limites para impedir que o jogador saia da tela;
* Sistema de detecção de colisão;
* Geração segura do orbe dentro da área visível;
* Reposicionamento automático do orbe após a coleta.

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
git clone URL_DO_SEU_REPOSITORIO
```

Entre na pasta do projeto:

```bash
cd NOME_DO_PROJETO
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

4. Abra o jogo;

5. Incline o celular para movimentar a bola vermelha;

6. Colete o orbe azul.

---

## Sistema de movimentação

A movimentação do jogador é baseada nos dados fornecidos pelo giroscópio.

A velocidade é controlada pela constante:

```typescript
const SPEED = 18;
```

Os valores do giroscópio são utilizados para calcular uma nova posição para o jogador.

Exemplo:

```typescript
let newX = currentPosition.x + data.y * SPEED;

let newY = currentPosition.y - data.x * SPEED;
```

---

## Limites da tela

O jogo utiliza os tamanhos reais da área disponível para impedir que as bolinhas ultrapassem os limites da tela.

A bola vermelha possui limites horizontais e verticais.

Exemplo:

```typescript
if (newX < 0) {
  newX = 0;
}

if (newX > gameSize.width - PLAYER_SIZE) {
  newX = gameSize.width - PLAYER_SIZE;
}
```

Dessa forma, o jogador permanece completamente dentro da área do jogo.

---

## Geração do orbe

O orbe azul é gerado em posições aleatórias.

O tamanho do orbe é considerado durante a geração da posição para impedir que qualquer parte fique fora da tela.

```typescript
x: Math.random() * (gameSize.width - ORB_SIZE)
```

A posição vertical também respeita o espaço reservado para as instruções do jogo.

---

## Sistema de colisão

A colisão entre o jogador e o orbe é calculada utilizando a distância entre os centros das duas bolas.

Primeiramente, são calculados os centros:

```typescript
const playerCenterX =
  playerPosition.x + PLAYER_SIZE / 2;

const playerCenterY =
  playerPosition.y + PLAYER_SIZE / 2;
```

Depois, é calculada a distância entre os objetos.

Quando a distância entre os centros é menor ou igual à soma dos raios, o orbe é coletado.

```typescript
if (
  distance <=
  playerRadius + orbRadius
) {
  setOrbPosition(
    generateRandomPosition()
  );
}
```

---

## Estrutura do projeto

```text
projeto
│
├── app
│   └── JogoColeteOrbe.tsx
│
├── package.json
├── tsconfig.json
└── README.md
```

---

## Funcionalidades testadas

| Funcionalidade           | Status    |
| ------------------------ | --------- |
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
| Nova posição aleatória   | Concluído |

---

## Possíveis melhorias futuras

Algumas melhorias que podem ser adicionadas futuramente:

* Sistema de pontuação;
* Cronômetro;
* Efeitos sonoros;
* Música de fundo;
* Sistema de vidas;
* Aumento de dificuldade;
* Mais de um orbe na tela;
* Sistema de recordes;
* Melhorias visuais.

---

## Autora

Desenvolvido por **Ana Clara Mendes**.

Projeto desenvolvido para fins educacionais utilizando **React Native, Expo e sensores de dispositivos móveis**.
