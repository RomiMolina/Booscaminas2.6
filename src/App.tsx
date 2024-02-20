import {useState} from "react";

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
function App() {
  const [clicked, setClicked] = useState<string[]>([]);
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");

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
      <header className="text-xl font-bold leading-[3rem]">Booscaminas Romi 2.6</header>
      <section className="flex items-center justify-center flex-col gap-4 text-center">
        <section className="py-8">
          {MATRIX.map((row, rowIndex) => (
            <article key={String(rowIndex)} className="flex">
              {row.map((cell, cellIndex) => (
                <div
                  key={`${rowIndex}-${cellIndex}`}
                  className={`h-8 w-8 border flex items center justi  fy-center ${clicked.includes(`${rowIndex}-${cellIndex}`) ? "bg-white/20" : "bg-red"}`}
                >
                  {clicked.includes(`${rowIndex}-${cellIndex}`) ? (
                    <span>{cell === "B" ? "❤" : cell === 0 ? null : cell}</span>
                  ) : (
                    <button
                      className="h-full w-full"
                      type="button"
                      onClick={() => status === "playing" && handleClick(rowIndex, cellIndex)}
                    />
                  )}
                </div>
              ))}
            </article>
          ))}
        </section>
        {status === "won" && (
          <div>
            <p>You won</p>
            <button onClick={() => window.location.reload()}>Play again</button>
          </div>
        )}
        {status === "lost" && (
          <div>
            <p>You lost</p>
            <button onClick={() => window.location.reload()}>Play again</button>
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
