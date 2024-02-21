import {useEffect, useState} from "react";

const GRID_SIZE = 8;
const MATCHES = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const MATRIX = Array.from({length: GRID_SIZE}, () =>
  Array.from({length: GRID_SIZE}, () => 0 as number | string),
);

for (let count = GRID_SIZE; count > 0; count--) {
  const rowRandom = Math.floor(Math.random() * GRID_SIZE);
  const cellRandom = Math.floor(Math.random() * GRID_SIZE);

  MATRIX[rowRandom][cellRandom] = "B";
}

for (let rowIndex = 0; rowIndex < MATRIX.length; rowIndex++) {
  for (let cellIndex = 0; cellIndex < MATRIX[rowIndex].length; cellIndex++) {
    if (MATRIX[rowIndex][cellIndex] === "B") continue;

    let bombCount = 0;

    for (const match of MATCHES) {
      if (MATRIX[rowIndex + match[0]]?.[cellIndex + match[1]] === "B") {
        bombCount++;
      }
    }
    MATRIX[rowIndex][cellIndex] = bombCount;
  }
}

type CellProps = {
  value: number | string;
  onClick: () => void;
  clicked: boolean;
};

const Cell: React.FC<CellProps> = ({value, onClick, clicked}) => {
  return (
    <div
      className={`h-8 w-8 border flex items-center justify-center rounded-sm shadow-sm ${
        clicked ? "bg-gray-300 text-black font-bold shadow-lg" : "bg-gray-400"
      }`}
      onClick={onClick}
    >
      {clicked ? (value === "B" ? "💣" : value === 0 ? "" : value) : ""}
    </div>
  );
};

function App() {
  const [clicked, setClicked] = useState<string[]>([]);
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");
  const [seconds, setSeconds] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (status === "playing") {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  function handleClick(rowIndex: number, cellIndex: number) {
    setClicked((clicked) => clicked.concat(`${rowIndex}-${cellIndex}`));

    if (clicked.length + 1 === GRID_SIZE ** 2 - GRID_SIZE) {
      setStatus("won");
    } else if (MATRIX[rowIndex][cellIndex] === "B") {
      setStatus("lost");
    }
  }

  return (
    <main className="container m-auto grid min-h-screen grid-rows-[auto,1fr,auto] px-4">
      <header className="text-xl font-bold leading-[4rem] flex items-center justify-center mt-8">
        Booscaminas Romi 2.6
      </header>
      <section className="flex items-center justify-center flex-col gap-12 text-center mx-auto ">
        <p className="text-4xl font-bold text-center">Play now! </p>
        <div className="text-2xl font-bold">Time: {seconds} seconds</div>
        <section className="py-8">
          <div className="grid rounded-lg" id="tablero">
            {MATRIX.map((row, rowIndex) =>
              row.map((cell, cellIndex) => (
                <Cell
                  key={`${rowIndex}-${cellIndex}`}
                  clicked={clicked.includes(`${rowIndex}-${cellIndex}`)}
                  value={cell}
                  onClick={() => status === "playing" && handleClick(rowIndex, cellIndex)}
                />
              )),
            )}
          </div>
        </section>
        {status === "won" && (
          <div className="text-green-600">
            <p className="text-2xl font-bold mb-4">You won 🙌</p>
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => window.location.reload()}
            >
              Play again
            </button>
          </div>
        )}

        {status === "lost" && (
          <div className="text-red-600">
            <p className="text-2xl font-bold mb-8">You lost 😢</p>
            <button
              className="bg-white hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
              onClick={() => window.location.reload()}
            >
              Play again
            </button>
          </div>
        )}
      </section>

      <footer className="text-center leading-[3rem] opacity-70">
        © {new Date().getFullYear()} booscaminas
      </footer>
    </main>
  );
}

export default App;
