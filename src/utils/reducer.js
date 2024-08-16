import { initialDeck, initialBlackJack, cardValue } from "./index_utils";

export default (state, action) => {
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