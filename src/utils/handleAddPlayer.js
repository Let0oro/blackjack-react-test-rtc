export default (state, dispatch) => {
    if (state.numPlayers < 3) {
        
      dispatch({
        type: "MODAL_ERROR",
        title: "Failed to remove other player",
        message: "Impossible to remove other player, min: 1",
      });
      return;
    }
    dispatch({
      type: "NEW_PLAYER"
    });
  };