import { useReducer, useMemo } from "react";
import _ from "lodash";
import { Button, HStack, Box, Image, Text, VStack } from "@chakra-ui/react";
import ModalExt from "../components/ModalExt";
import useCurrentDate from "../hooks/useCurrentDate";

const cardValue = (card) =>
  isNaN(card.slice(0, -1))
    ? card.slice(0, -1) === "A"
      ? 11
      : 10
    : parseInt(card.slice(0, -1));

const initialDeck = () =>
  _.shuffle(
    ["C", "D", "H", "S"]
      .map((tipo) =>
        "123456789AJQK".split("").map((v) => (Number(v) + 1 || v) + tipo)
      )
      .reduce((p, n) => p.concat(n), [])
  );

const initialBlackJack = {
  deck: initialDeck(),
  numPlayers: 2,
  turn: 0,
  pointsPlayers: Array(2).fill(0),
  divsCardsPlayers: Array(2).fill([]),
  currentCardValue: 0,
  currentBestPoints: 0,
  openModal: false,
  messageModal: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "INIT_GAME":
      return { ...initialBlackJack, deck: initialDeck() };
    case "ASK_FOR_CARD":
      if (!state.deck.length) {
        alert("The deck is empty");
        return state;
      }
      const newCardsPlayer = [...state.divsCardsPlayers].map((divCard, id) =>
        id == state.turn ? [...divCard, [...state.deck].at(-1)] : divCard
      );
      return {
        ...state,
        currentCardValue: cardValue([...state.deck].at(-1)),
        deck: state.deck.slice(0, -1),
        divsCardsPlayers: newCardsPlayer,
      };
    case "SUM_OF_POINTS":
      const newPoints = [...state.pointsPlayers].map((points, id) =>
        id == state.turn
          ? points +
            (state.currentCardValue == 11 && points > 10
              ? 1
              : state.currentCardValue)
          : points
      );
      return {
        ...state,
        pointsPlayers: newPoints,
      };
    case "NEXT_TURN":
      return {
        ...state,
        turn: state.turn + 1,
      };
    case "BEST_POINTS_PLAYERS":
      const newBestPoints = Math.max(
        ...state.pointsPlayers.filter(
          (v, i) => v <= 21 && i < state.numPlayers - 1
        )
      );
      return {
        ...state,
        currentBestPoints: newBestPoints,
      };
    case "NEW_PLAYER":
      if (state.numPlayers >= 5) {
        alert("Impossible to add other player, max: 4");
        return state;
      }
      return {
        ...state,
        numPlayers:
          state.numPlayers < 5 ? state.numPlayers + 1 : state.numPlayers,
        pointsPlayers:
          state.pointsPlayers.length < 5
            ? [...state.pointsPlayers, 0]
            : state.pointsPlayers,
        divsCardsPlayers:
          state.divsCardsPlayers.length < 5
            ? [...state.divsCardsPlayers, []]
            : state.divsCardsPlayers,
      };
    case "REMOVE_PLAYER":
      if (state.numPlayers < 3) {
        alert("Impossible to remove other player, min: 1");
        return state;
      }

      return {
        ...state,
        numPlayers:
          state.numPlayers > 2 ? state.numPlayers - 1 : state.numPlayers,
        pointsPlayers:
          state.pointsPlayers.length < 5
            ? Array(state.numPlayers - 1).fill(0)
            : state.pointsPlayers,
        divsCardsPlayers:
          state.divsCardsPlayers.length < 5
            ? Array(state.numPlayers - 1).fill([])
            : state.divsCardsPlayers,
      };
    case "WHO_IS_THE_WINNER":
      const computerPoints = state.pointsPlayers[state.numPlayers - 1];
      let newMessage = "";
      if (state.currentBestPoints === computerPoints) {
        newMessage = "Nobody wins";
      } else if (
        state.pointsPlayers.every((point) => point > 21) ||
        (computerPoints <= 21 && state.currentBestPoints < computerPoints)
      ) {
        newMessage = "Sorry, you lost";
      } else {
        const playersWon = state.pointsPlayers.map(
          (points, idx) => points == state.currentBestPoints ? idx + 1 : 0
        ).filter(points => !!points);
        newMessage = `P${playersWon.join(" & ")} win!`;
      }
      return { ...state, openModal: true, message: newMessage };
    case "CLOSE_MODAL":
      return { ...state, openModal: false };
    default:
      throw new Error(`Type ${action.type} not recognised`);
  }
};

const defer = (funct, time = 100) => {
  const idTimeOut = setTimeout(() => {
    funct();
    clearTimeout(idTimeOut);
  }, time);
};

function BlackJack() {
    const date = useCurrentDate();
  const [state, dispatch] = useReducer(reducer, initialBlackJack);

  const playersTurn = () => {
    dispatch({ type: "ASK_FOR_CARD" });
    dispatch({ type: "SUM_OF_POINTS" });
  };

  useMemo(() => {
    if (state.pointsPlayers[state.turn] >= 21) {
      return dispatch({ type: "NEXT_TURN" });
    }
  }, [state.deck.length]);

  useMemo(() => {
    if (state.turn >= state.numPlayers - 1) {
      return dispatch({ type: "BEST_POINTS_PLAYERS" });
    }
  }, [state.turn]);

  useMemo(() => {
    if (state.turn >= state.numPlayers - 1) {
      if (
        state.currentBestPoints <= 21 &&
        state.pointsPlayers[state.numPlayers - 1] >= state.currentBestPoints
      ) {
        defer(() => dispatch({ type: "WHO_IS_THE_WINNER" }));
      }
      dispatch({ type: "ASK_FOR_CARD" });
      dispatch({ type: "SUM_OF_POINTS" });
    }
  }, [state.currentBestPoints, state.pointsPlayers[state.numPlayers - 1]]);

  return (
    <Box as="section" bg="brand.1000" width="100lvw" height="100lvh" p="2rem">
        <Text color="whiteAlpha.600">{date}</Text>
      <Box
        bg="tomato"
        color="white"
        p="20px"
        maxW="sm"
        mx="auto"
        borderRadius="8px"
      >
        Blackjack
      </Box>

      <ModalExt
        openModal={state.openModal}
        message={state.message}
        closeModal={() => dispatch({ type: "CLOSE_MODAL" })}
      />

      <HStack spacing="1rem" my="1rem" justifyContent="center">
        <Button
          bg="red.600"
          color="red.50"
          _hover={{ bgColor: "red.500", border: "1px solid yellow.600" }}
          onClick={() => defer(() => dispatch({ type: "INIT_GAME" }))}
        >
          Nuevo Juego
        </Button>
        <Button
          bg="blue.400"
          _hover={{ bgColor: "blue.300", border: "1px solid yellow.600" }}
          onClick={playersTurn}
          disabled={state.turn >= state.numPlayers - 1}
        >
          Pedir carta
        </Button>
        <Button
          bg="yellow.400"
          _hover={{ bgColor: "yellow.300", border: "1px solid yellow.600" }}
          display={!!state.divsCardsPlayers[0].length ? "inline-block" : "none"}
          onClick={() => defer(() => dispatch({ type: "NEXT_TURN" }))}
        >
          Detener
        </Button>
        <Button
          display={!state.divsCardsPlayers[0].length ? "inline-block" : "none"}
          onClick={() => defer(() => dispatch({ type: "REMOVE_PLAYER" }))}
          disabled="disabled"
        >
          Eliminar Jugador
        </Button>
        <Button
          display={!state.divsCardsPlayers[0].length ? "inline-block" : "none"}
          onClick={() => defer(() => dispatch({ type: "NEW_PLAYER" }))}
        >
          Nuevo Jugador
        </Button>
      </HStack>

      <HStack wrap="wrap" justifyContent="space-around">
        {Array.from({ length: state.numPlayers }, (_, idx) => (
          <Box key={idx}>
            <HStack
              minHeight="240px"
              justifyContent="center"
              position="relative"
            >
              <Text
                color="transparent"
                fontSize="x-large"
                style={{ WebkitTextStroke: `1px ${idx == state.turn ? "#4FD1C5" : "black"}` }}
                mr="85px"
              >
                {idx < state.numPlayers - 1 ? `J${idx + 1}` : "💻"} -{" "}
                <small>{state.pointsPlayers[idx]}</small>
              </Text>
              {state.divsCardsPlayers[idx].map((carta, i) => (
                <Image
                  display="inline-block"
                  key={i}
                  ml="-85px"
                  left="0"
                  p="0"
                  position="relative"
                  width="150px"
                  src={`../public/cartas/${carta}.png`}
                  alt={carta}
                />
              ))}
            </HStack>
          </Box>
        ))}
      </HStack>
    </Box>
  );
}

export default BlackJack;
