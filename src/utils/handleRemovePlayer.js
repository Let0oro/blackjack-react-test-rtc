export default (state, dispatch) => {
  if (state.numPlayers >= 5) {
    dispatch({
      type: "MODAL_ERROR",
      title: "Error getting a card",
      message: "The deck is empty",
    });
    return;
  }
  dispatch({
    type: "NEW_PLAYER",
  });
};
