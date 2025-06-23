import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Button } from "@/components/ui/button";

function App() {
  const [prompt, setPrompt] = useState("");
  const [variations, setVariations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Define backend URL (adjust if your backend runs elsewhere)
  const BACKEND_URL = "https://477h9ikc7x36.manus.space"; // Public backend URL

  const handleGenerateCopy = async () => {
    setLoading(true);
    setError(null);
    setVariations([]);

    try {
      const response = await fetch(`${BACKEND_URL}/api/generate-copy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt, num_variations: 3 }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      setVariations(data.variations || []);
    } catch (err: any) {
      console.error("Error generating copy:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>NeonAdsAi (Frontend POC)</h1>
      <div className="card">
        <h2>Generate Ad Copy</h2>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter ad prompt (e.g., Product, Target Audience, Key Selling Points)"
          rows={4}
          style={{ width: "80%", marginBottom: "10px" }}
        />
        <br />
        <Button onClick={handleGenerateCopy} disabled={loading}>
          {loading ? "Generating..." : "Generate Copy"}
        </Button>

        {error && (
          <div style={{ color: "red", marginTop: "10px" }}>Error: {error}</div>
        )}

        {variations.length > 0 && (
          <div style={{ marginTop: "20px", textAlign: "left" }}>
            <h3>Generated Variations:</h3>
            <ul>
              {variations.map((variation, index) => (
                <li key={index} style={{ marginBottom: "10px", whiteSpace: "pre-wrap" }}>
                  {variation}
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
      <p className="read-the-docs">
        This is a basic proof-of-concept frontend. Full functionality requires backend API integration and OAuth handling.
      </p>
    </>
  );
}

export default App;

