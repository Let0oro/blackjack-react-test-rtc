export default (state, dispatch) => {
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
