import { useReducer, useMemo, useEffect } from "react";
import { Button, HStack, Box, Image, Text, VStack } from "@chakra-ui/react";
import ModalExt from "../components/ModalExt";
import useCurrentDate from "../hooks/useCurrentDate";
import {
  initialBlackJack,
  gameOver,
  handleAddPlayer,
  handleRemovePlayer,
  defer,
  playersTurn,
  reducer,
} from "../utils/index_utils";

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
    [state.deck.length, state.currentCardValue, state.divsCardsPlayers]
  );

  const newBestPoints = useMemo(
    () =>
      Math.max(
        ...state.pointsPlayers.filter(
          (v, i) => v <= 21 && i < state.numPlayers - 1
        )
      ),
    [state.turn]
  );

  useEffect(() => {
    if (state.turn >= state.numPlayers - 1) {
      dispatch({ type: "BEST_POINTS_PLAYERS", newBestPoints });
    }
    if (newPoints[state.turn] >= 21) {
      dispatch({ type: "NEXT_TURN" });
    }
    dispatch({ type: "SUM_OF_POINTS", newPoints });
  }, [state.deck.length, state.turn]);

  useEffect(() => {
    if (state.turn >= state.numPlayers - 1) {
      if (
        newBestPoints <= 21 &&
        state.pointsPlayers[state.numPlayers - 1] >= newBestPoints
      ) {
        const { title, message } = gameOver(state);
        defer(() => dispatch({ type: "OPEN_MODAL", title, message }));
      } else if (!state.deck.length) {
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
        dispatch({ type: "SUM_OF_POINTS", newPoints });
      }
    }
  }, [
    state.pointsPlayers[state.numPlayers - 1],
    newBestPoints,
    state.currentBestPoints,
  ]);

  return (
    <Box
      as="section"
      bg="brand.1000"
      width="100%"
      minHeight="100lvh"
      height="100%"
      p="2rem"
    >
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
        p="10px"
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

      <HStack spacing="1rem" my="1rem" justifyContent="center" wrap="wrap">
        <Button
          bg="red.600"
          color="red.50"
          fontSize="smaller"
          _hover={{ bgColor: "red.500", border: "1px solid yellow.600" }}
          onClick={() => defer(() => dispatch({ type: "INIT_GAME" }))}
        >
          New Game
        </Button>
        <Button
          bg="blue.400"
          fontSize="smaller"
          _hover={{ bgColor: "blue.300", border: "1px solid yellow.600" }}
          onClick={() => playersTurn(state, dispatch)}
          _disabled={{ bgColor: "black", color: "brand.1000" }}
          isDisabled={
            state.turn >= state.numPlayers - 1 ||
            state.pointsPlayers[state.numPlayers - 1]
          }
        >
          Card
        </Button>
        <Button
          bg="yellow.400"
          fontSize="smaller"
          _hover={{ bgColor: "yellow.300", border: "1px solid yellow.600" }}
          isDisabled={
            !state.divsCardsPlayers[state.turn]?.length ||
            state.pointsPlayers[state.numPlayers - 1]
          }
          _disabled={{ bgColor: "black", color: "brand.1000" }}
          onClick={() => defer(() => dispatch({ type: "NEXT_TURN" }))}
        >
          Stop
        </Button>
        <Button
          fontSize="smaller"
          isDisabled={state.divsCardsPlayers[0].length}
          _disabled={{ bgColor: "black", color: "brand.1000" }}
          onClick={() => handleRemovePlayer(state, dispatch)}
        >
          Del. player
        </Button>
        <Button
          fontSize="smaller"
          isDisabled={state.divsCardsPlayers[0].length}
          _disabled={{ bgColor: "black", color: "brand.1000" }}
          onClick={() => handleAddPlayer(state, dispatch)}
        >
          Add player
        </Button>
      </HStack>

      <HStack wrap="wrap" justifyContent="space-around" alignItems="top" gap="1rem">
        {Array.from({ length: state.numPlayers }, (_, idx) => (
          <Box key={idx}>
            <VStack
              height="max-content"
              alignItems="center"
              position="relative"
            >
              <Text
                color="transparent"
                fontSize="medium"
                position="absolute"
                width="max-content"
                top="0"
                left="0"
                style={{
                  WebkitTextStroke: `1px ${idx == state.turn ? "#4FD1C5" : "black"}`,
                }}
              >
                {idx < state.numPlayers - 1 ? `J${idx + 1}` : "💻"} -{" "}
                <small>{state.pointsPlayers[idx]}</small>
              </Text>
              <VStack pt="30px" mb="70px">

              {state.divsCardsPlayers[idx].map((carta, i) => (
                <Image
                display="inline-block"
                key={i}
                mb="-70px"
                p="0"
                position="relative"
                height="100px"
                src={`../public/cartas/${carta}.png`}
                alt={carta}
                />
              ))}
              </VStack>
            </VStack>
          </Box>
        ))}
      </HStack>
    </Box>
  );
}

export default BlackJack;
