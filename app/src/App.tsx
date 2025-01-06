import { useEffect, useState } from "react";
import FileUpload from "./components/api/FileUpload.tsx";
import Analysis from "./components/analysis/Analysis.tsx";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-4 right-4 p-2 rounded-lg bg-secondary hover:bg-secondary/80"
      >
        {darkMode ? "🌞" : "🌙"}
      </button>
      <main className="flex flex-col items-center justify-center h-screen p-4">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-4">
            <FileUpload />
            <Analysis />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
