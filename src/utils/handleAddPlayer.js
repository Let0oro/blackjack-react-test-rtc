export default (state, dispatch) => {
    if (state.numPlayers >= 5) {
        
      dispatch({
        type: "OPEN_MODAL",
        title: "Failed to add other player",
        message: "Impossible to add  new player, max: 4",
      });
      return;
    }
    dispatch({
      type: "NEW_PLAYER"
    });
  };