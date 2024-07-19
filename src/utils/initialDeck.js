import _ from "lodash";

export default () =>
    _.shuffle(
      ["C", "D", "H", "S"]
        .map((tipo) =>
          "123456789AJQK".split("").map((v) => (Number(v) + 1 || v) + tipo)
        )
        .reduce((p, n) => p.concat(n), [])
    );