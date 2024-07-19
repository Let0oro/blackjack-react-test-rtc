export default (state) => {
    const computerPoints = state.pointsPlayers[state.numPlayers - 1];
    if (state.currentBestPoints === computerPoints) {
      return {
        title: "Nobody wins",
        message: "More luck the following time",
      };
    } else if (
      state.pointsPlayers.every((point) => point > 21) ||
      (computerPoints <= 21 && state.currentBestPoints < computerPoints)
    ) {
      return {
        title: "Sorry, you lost",
        message: "More luck the following time",
      };
    } else {
      const playersWon = state.pointsPlayers
        .map((points, idx) =>
          points == state.currentBestPoints ? idx + 1 : 0
        )
        .filter((points) => !!points)
        .join(" & ");
      return {
        title: `P${playersWon} win!`,
        message:
          "Congratulations! Try the multiplayer local mode by adding new players",
      };
    }
}