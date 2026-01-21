import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./styles/App.css";

function App() {
  const [greeting, setGreeting] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Test connection to Rust backend
    invoke<string>("greet", { name: "Kuro-Roku" })
      .then((response) => {
        setGreeting(response);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to connect to backend:", error);
        setGreeting("Backend not connected");
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>黒録 Kuro-Roku</h1>
        <p className="subtitle">Local File Organizer</p>
      </header>

      <main className="app-main">
        {isLoading ? (
          <div className="loading">Connecting to backend...</div>
        ) : (
          <div className="status">
            <p>{greeting}</p>
          </div>
        )}

        <section className="placeholder">
          <h2>Coming Soon</h2>
          <ul>
            <li>📁 File Browser</li>
            <li>🎬 Video Analysis (Qwen3-VL)</li>
            <li>🎤 Transcription</li>
            <li>🏷️ Smart Tagging</li>
            <li>🔍 Semantic Search</li>
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
