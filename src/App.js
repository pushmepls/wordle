import { useEffect, useState } from "react";
import Wordle from "./components/Wordle";
import useWordle from "./hooks/useWordle";

function App() {
  const [solution, setSolution] = useState(null);
  const { type } = useWordle();
  useEffect(() => {
    setSolution(randomSolution.word);
  }, [setSolution]);

  return (
    <div className="App">
      <h1>Wordle ({type})</h1>

      {solution && <Wordle />}
    </div>
  );
}

export default App;
