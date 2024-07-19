import { useReducer, useMemo, useEffect, useCallback } from "react";
import { Button, HStack, Box, Image, Text } from "@chakra-ui/react";
import ModalExt from "../components/ModalExt";
import useCurrentDate from "../hooks/useCurrentDate";
import cardValue from "../utils/cardValue";
import initialDeck from "../utils/initialDeck";
import gameOver from "../utils/gameOver";
import handleAddPlayer from "../utils/handleAddPlayer";
import handleRemovePlayer from "../utils/handleRemovePlayer";
import defer from "../utils/defer";

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
  titleModal: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "INIT_GAME":
      return { ...initialBlackJack, deck: initialDeck() };
    case "ASK_FOR_CARD":
      return {
        ...state,
        currentCardValue: cardValue([...state.deck].at(-1)),
        deck: state.deck.slice(0, -1),
        divsCardsPlayers: action.newCardsPlayer,
      };
    case "SUM_OF_POINTS":
      return {
        ...state,
        pointsPlayers: action.newPoints,
      };
    case "NEXT_TURN":
      return {
        ...state,
        turn: state.turn + 1,
      };
    case "BEST_POINTS_PLAYERS":
      return {
        ...state,
        currentBestPoints: action.newBestPoints,
      };
    case "NEW_PLAYER":
      return {
        ...state,
        numPlayers: state.numPlayers + 1,
        pointsPlayers: [...state.pointsPlayers, 0],
        divsCardsPlayers: [...state.divsCardsPlayers, []],
      };
    case "REMOVE_PLAYER":
      return {
        ...state,
        numPlayers: state.numPlayers - 1,
        pointsPlayers: Array(state.numPlayers - 1).fill(0),
        divsCardsPlayers: Array(state.numPlayers - 1).fill([]),
      };
    case "CLOSE_MODAL":
      return { ...state, openModal: false };
    case "OPEN_MODAL":
      return {
        ...state,
        openModal: true,
        titleModal: action.title,
        messageModal: action.message,
      };
    default:
      throw new Error(`Type ${action.type} not recognised`);
  }
};

function BlackJack() {
  const date = useCurrentDate();
  const [state, dispatch] = useReducer(reducer, initialBlackJack);

  const newPoints = useMemo(
    () =>
      [...state.pointsPlayers].map((points, id) =>
        id == state.turn
          ? points +
            (state.currentCardValue == 11 && points > 10
              ? 1
              : state.currentCardValue)
          : points
      ),
    [state.currentCardValue, state.deck.length]
  );

  useEffect(() => {
    if (newPoints[state.turn] >= 21) {
      dispatch({ type: "NEXT_TURN" });
    }
    dispatch({ type: "SUM_OF_POINTS", newPoints });
  }, [state.currentCardValue, state.deck.length])

  const playersTurn = () => {
    if (!state.deck.length) {
      dispatch({
        type: "OPEN_MODAL",
        title: "Error getting a card",
        message: "The deck is empty",
      });
    } else {
      const newCardsPlayer = [...state.divsCardsPlayers].map((divCard, id) =>
        id == state.turn ? [...divCard, [...state.deck].at(-1)] : divCard
      );
      dispatch({ type: "ASK_FOR_CARD", newCardsPlayer });
    }
  };

  useEffect(() => {
    if (state.turn >= state.numPlayers - 1) {
      const newBestPoints = Math.max(
        ...state.pointsPlayers.filter(
          (v, i) => v <= 21 && i < state.numPlayers - 1
        )
      );
      dispatch({ type: "BEST_POINTS_PLAYERS", newBestPoints });
    }
  }, [state.turn]);

  useEffect(() => {
    if (state.turn >= state.numPlayers - 1) {
      if (
        state.currentBestPoints <= 21 &&
        state.pointsPlayers[state.numPlayers - 1] >= state.currentBestPoints
      ) {
        const { title, message } = gameOver(state);
        defer(() => dispatch({ type: "OPEN_MODAL", title, message }));
      }
      if (!state.deck.length) {
        dispatch({
          type: "OPEN_MODAL",
          title: "Error getting a card",
          message: "The deck is empty",
        });
      } else {
        const newCardsPlayer = [...state.divsCardsPlayers].map((divCard, id) =>
          id == state.turn ? [...divCard, [...state.deck].at(-1)] : divCard
        );
        dispatch({ type: "ASK_FOR_CARD", newCardsPlayer });
        const newPoints = [...state.pointsPlayers].map((points, id) =>
          id == state.turn
            ? points +
              (state.currentCardValue == 11 && points > 10
                ? 1
                : state.currentCardValue)
            : points
        );
        dispatch({ type: "SUM_OF_POINTS", newPoints });
      }
    }
  }, [state.currentBestPoints, state.pointsPlayers[state.numPlayers - 1]]);

  return (
    <Box as="section" bg="brand.1000" width="100lvw" height="100lvh" p="2rem">
      <Text
        position="absolute"
        bottom=".5rem"
        right=".5rem"
        color="whiteAlpha.600"
        fontSize=".9rem"
      >
        {date}
      </Text>
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
        title={state.titleModal}
        message={state.messageModal}
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
          onClick={() => handleRemovePlayer(state, dispatch)}
        >
          Eliminar Jugador
        </Button>
        <Button
          display={!state.divsCardsPlayers[0].length ? "inline-block" : "none"}
          onClick={() => handleAddPlayer(state, dispatch)}
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
                style={{
                  WebkitTextStroke: `1px ${idx == state.turn ? "#4FD1C5" : "black"}`,
                }}
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
