export default (state, dispatch) => {
  if (state.numPlayers < 3) {
    dispatch({
      type: "OPEN_MODAL",
      title: "Failed to remove other player",
      message: "Impossible to remove other player, min: 1",
    });
    return;
  }
  dispatch({
    type: "REMOVE_PLAYER",
  });
};
