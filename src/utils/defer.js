export default (funct, time = 100) => {
    const idTimeOut = setTimeout(() => {
      funct();
      clearTimeout(idTimeOut);
    }, time);
  };
  