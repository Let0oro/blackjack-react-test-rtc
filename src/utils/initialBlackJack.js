import initialDeck from "./initialDeck";

export default {
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