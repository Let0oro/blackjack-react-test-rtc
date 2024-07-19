export default (card) =>
    isNaN(card.slice(0, -1))
      ? card.slice(0, -1) === "A"
        ? 11
        : 10
      : parseInt(card.slice(0, -1));
  