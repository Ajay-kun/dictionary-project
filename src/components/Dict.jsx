import React, { useState } from "react";
import "./Dict.css";

const Dictionary = () => {
  const [word, setWord] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const sound = new Audio();

  const fetchWordData = async () => {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (!response.ok) throw new Error("Word not found");
      const data = await response.json();
      setResult(data[0]);
      setError(null);
      if (data[0].phonetics[0]?.audio) {
        sound.src = `https:${data[0].phonetics[0].audio}`;
      }
    } catch (err) {
      setError("Couldn't Find The Word");
      setResult(null);
    }
  };

  const playSound = () => {
    sound.play();
  };

  return (
    <div className={`container ${isFocused ? "container-expanded" : "container-small"}`}>
      <div className="search-box">
        <input
          id="search-input"
          type="text"
          placeholder="Type the word here.."
          value={word}
          onFocus={() => setIsFocused(true)}
          onChange={(e) => setWord(e.target.value)}
        />
        <button onClick={fetchWordData}>Ask</button>
      </div>

      {error && <h3 className="error">{error}</h3>}

      {result && (
        <div className="result">
          <div className="word">
            <h3>{word}</h3>
            {result.phonetics[0]?.audio && (
              <button onClick={playSound}>
                <i className="fas fa-volume-up"></i>
              </button>
            )}
          </div>
          <div className="details">
            <p>{result.meanings[0]?.partOfSpeech}</p>
            <p>/{result.phonetic || ""}/</p>
          </div>
          <p className="word-meaning">
            {result.meanings[0]?.definitions[0]?.definition}
          </p>
          <p className="word-example">
            {result.meanings[0]?.definitions[0]?.example || ""}
          </p>
        </div>
      )}
    </div>
  );
};

export default Dictionary;
