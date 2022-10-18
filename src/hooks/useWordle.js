import { useEffect, useState } from "react";

const useWordle = () => {
  const [turn, setTurn] = useState(0);
  const [type, setType] = useState("Daily");
  const [currentGuess, setCurrentGuess] = useState("");
  const [guesses, setGuesses] = useState([...Array(6)]); // each guess is an array
  const [history, setHistory] = useState([]); // each guess is a string
  const [isCorrect, setIsCorrect] = useState(false);
  const [usedKeys, setUsedKeys] = useState({}); // {a: 'grey', b: 'green', c: 'yellow'} etc
  const [seed, setSeed] = useState(0);
  const reset = () => {
    setTurn(0);
    setCurrentGuess("");
    setGuesses([...Array(6)]);
    setHistory([]);
    setIsCorrect(false);
    setUsedKeys({});
  };
  const changeType = (type) => {
    setType(type);
  };
  useEffect(() => {
    reset();
  }, [type]);
  const addSeed = () => {
    setSeed(seed + 1);
  };
  const setCurrentSeed = () => {
    const currentSeed = localStorage.setItem("seed", seed);
    if (currentSeed) {
      setSeed(currentSeed);
    }
  };
  setCurrentSeed();
  // format a guess into an array of letter objects
  // e.g. [{key: 'a', color: 'yellow'}]
  useEffect(() => {
    console.log({ seed });
    if (seed !== 0) {
      localStorage.setItem("seed", seed);
    }
  }, seed);
  const formatGuess = async () => {
    let url;
    if (type == "Daily") {
      url = "https://wordle.votee.dev:8000/daily?guess=" + currentGuess;
    } else if (type == "Random") {
      url =
        "https://wordle.votee.dev:8000/random?guess=" +
        currentGuess +
        "&seed=" +
        (isNaN(localStorage.getItem("seed"))
          ? 0
          : localStorage.getItem("seed"));
    }
    console.log(url);
    let formattedGuess = await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        data = data.map((i) => {
          return {
            key: i.guess,
            color:
              i.result === "absent"
                ? "grey"
                : i.result === "correct"
                ? "green"
                : "yellow",
          };
        });
        return data;
      });

    return formattedGuess;
  };

  const addNewGuess = (formattedGuess) => {
    if (formattedGuess.every((i) => i.color === "green")) {
      if (type == "Random") addSeed();
      setIsCorrect(true);
    }
    setGuesses((prevGuesses) => {
      let newGuesses = [...prevGuesses];
      newGuesses[turn] = formattedGuess;
      return newGuesses;
    });
    setHistory((prevHistory) => {
      return [...prevHistory, currentGuess];
    });
    setTurn((prevTurn) => {
      return prevTurn + 1;
    });
    setUsedKeys((prevUsedKeys) => {
      formattedGuess.forEach((l) => {
        const currentColor = prevUsedKeys[l.key];
        if (l.color === "green") {
          prevUsedKeys[l.key] = "green";
          return;
        }
        if (l.color === "yellow" && currentColor !== "green") {
          prevUsedKeys[l.key] = "yellow";
          return;
        }
        if (l.color === "grey" && currentColor !== ("green" || "yellow")) {
          prevUsedKeys[l.key] = "grey";
          return;
        }
      });
      return prevUsedKeys;
    });
    setCurrentGuess("");
  };

  // handle keyup event & track current guess
  // if user presses enter, add the new guess
  const handleKeyup = async ({ key }) => {
    if (key === "Enter") {
      // only add guess if turn is less than 5
      if (turn > 5) {
        console.log("you used all your guesses!");
        return;
      }
      // do not allow duplicate words
      if (history.includes(currentGuess)) {
        console.log("you already tried that word.");
        return;
      }
      // check word is 5 chars
      if (currentGuess.length !== 5) {
        console.log("word must be 5 chars.");
        return;
      }
      const formatted = await formatGuess();
      addNewGuess(formatted);
    }
    if (key === "Backspace") {
      setCurrentGuess((prev) => prev.slice(0, -1));
      return;
    }
    if (/^[A-Za-z]$/.test(key)) {
      if (currentGuess.length < 5) {
        setCurrentGuess((prev) => prev + key);
      }
    }
  };

  return {
    reset,
    type,
    changeType,
    turn,
    currentGuess,
    guesses,
    isCorrect,
    usedKeys,
    handleKeyup,
    seed,
  };
};

export default useWordle;
