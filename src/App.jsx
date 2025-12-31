import { useState } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = async () => {
    if (!text || text.trim().length === 0) {
      setError("Please enter some text to analyze");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setAnalysis(null);
      const url = "http://localhost:8000/api/analyze";
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.success) {
        setAnalysis(data.analysis);
      } else {
        setError(data.error || "something went wrong");
      }
    } catch (error) {
      setError(
        "Failed to connect to server. Make sure your backend is running on port 8000."
      );
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleClear = () => {
    setText("");
    setError("");
    setAnalysis(null);
  };

  return (
    <>
      <div className='container'>
        <header>
          <h1>Text Analyzer</h1>
          <p>Analyze your text instantly with AI-powered insights</p>
        </header>
        <div className='input-section'>
          <textarea
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder='Enter or paste your text here'
          ></textarea>
        </div>
        <div className='button-group'>
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className='btn-primary'
          >
            {loading ? "Analyzing" : "Analyze Text"}
          </button>
          <button onClick={handleClear} className='btn-secondary'>
            Clear
          </button>
        </div>
        {error && <div className='error-message'>⚠️ {error}</div>}
        {analysis && (
          <div className='results-section'>
            <h2>Analysis Results</h2>
            <div className='stats-grid'>
              <div className='stat-card'>
                <div className='stat-value'>{analysis.wordCount}</div>
                <div className='stat-label'>Words</div>
              </div>

              <div className='stat-card'>
                <div className='stat-value'>{analysis.charCount}</div>
                <div className='stat-label'>Characters</div>
              </div>

              <div className='stat-card'>
                <div className='stat-value'>{analysis.charCountNoSpaces}</div>
                <div className='stat-label'>Characters (no spaces)</div>
              </div>

              <div className='stat-card'>
                <div className='stat-value'>{analysis.sentenceCount}</div>
                <div className='stat-label'>Sentences</div>
              </div>

              <div className='stat-card'>
                <div className='stat-value'>{analysis.paragraphCount}</div>
                <div className='stat-label'>Paragraphs</div>
              </div>

              <div className='stat-card'>
                <div className='stat-value'>{analysis.averageWordLength}</div>
                <div className='stat-label'>Avg Word Length</div>
              </div>

              <div className='stat-card'>
                <div className='stat-value'>
                  {analysis.estimatedReadingTimeMinutes} min
                </div>
                <div className='stat-label'>Reading Time</div>
              </div>
            </div>
          </div>
        )}

        <footer>
          <p>Built by you on Day 3 of 90 🚀</p>
        </footer>
      </div>
    </>
  );
}

export default App;
