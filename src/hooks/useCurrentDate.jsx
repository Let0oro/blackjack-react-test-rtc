import { useEffect, useState } from "react"

const useCurrentDate = () => {
  const [time, setTime] = useState();

  useEffect(() => {
    const intervalId = setInterval(() => {
        const time = new Date().toUTCString().split(' ').slice(0, -1).join(" ");
        setTime(time);
    }, 1000);
    return () => {
        clearInterval(intervalId)
    }
  }, [time]);

  return time;
}

export default useCurrentDate