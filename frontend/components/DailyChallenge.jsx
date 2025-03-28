"use client";
import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Award,
  Share2,
  Check,
  BarChart3,
  Sparkles,
  X,
} from "lucide-react";

// Sample data for daily challenge
const getDailyChallenge = () => {
  const today = new Date();
  const dateString = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // This would normally come from an API or database
  return {
    date: dateString,
    theme: "Astronomy",
    centerLetter: "A",
    outerLetters: ["S", "T", "R", "G", "L", "X"],
    totalWords: 40,
    pangrams: 1,
    maxScore: 180,
    ranks: [
      { name: "Beginner", threshold: 20 },
      { name: "Good Start", threshold: 40 },
      { name: "Moving Up", threshold: 80 },
      { name: "Good", threshold: 100 },
      { name: "Solid", threshold: 120 },
      { name: "Nice", threshold: 140 },
      { name: "Great", threshold: 160 },
      { name: "Amazing", threshold: 170 },
      { name: "Genius", threshold: 180 },
    ],
  };
};

export default function DailyChallenge() {
  const [challenge, setChallenge] = useState(getDailyChallenge());
  const [input, setInput] = useState("");
  const [foundWords, setFoundWords] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [currentRank, setCurrentRank] = useState({
    name: "Beginner",
    threshold: 0,
  });
  const [nextRank, setNextRank] = useState({
    name: "Good Start",
    threshold: 40,
  });

  // Calculate time until next challenge
  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const diffMs = tomorrow.getTime() - now.getTime();
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft(`${diffHrs}h ${diffMins}m`);
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Update rank based on score
  useEffect(() => {
    let current = challenge.ranks[0];
    let next = challenge.ranks[1];

    for (let i = 0; i < challenge.ranks.length; i++) {
      if (score >= challenge.ranks[i].threshold) {
        current = challenge.ranks[i];
        next = challenge.ranks[i + 1] || current;
      } else {
        break;
      }
    }

    setCurrentRank(current);
    setNextRank(next);
  }, [score, challenge.ranks]);

  const handleInputChange = (e) => {
    setInput(e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // This would normally check against an actual word list
    // For demo purposes, we'll simulate word validation
    if (input.length < 4) {
      setMessage("Words must be at least 4 letters long");
      return;
    }

    if (!input.includes(challenge.centerLetter)) {
      setMessage(
        `Words must contain the center letter (${challenge.centerLetter})`
      );
      return;
    }

    if (foundWords.includes(input)) {
      setMessage("Already found");
      return;
    }

    // Check if word is valid (simplified for demo)
    const isValid = validateWord(
      input,
      challenge.centerLetter,
      challenge.outerLetters
    );

    if (!isValid) {
      setMessage("Not in word list");
      return;
    }

    // Calculate word score (simplified)
    const wordScore = calculateWordScore(input);

    setFoundWords([...foundWords, input]);
    setScore(score + wordScore);
    setMessage(`+${wordScore} points!`);
    setInput("");
  };

  // Simplified word validation for demo
  const validateWord = (word, centerLetter, outerLetters) => {
    const allLetters = [centerLetter, ...outerLetters];
    return word.split("").every((letter) => allLetters.includes(letter));
  };

  // Simplified scoring for demo
  const calculateWordScore = (word) => {
    if (word.length === 4) return 1;

    // Check if pangram (uses all letters)
    const uniqueLetters = new Set(word.split(""));
    if (uniqueLetters.size >= 7) return word.length + 7;

    return word.length;
  };

  // Calculate progress percentage
  const progressPercent = Math.min(100, (score / challenge.maxScore) * 100);

  const clearInput = () => {
    setInput("");
  };

  // Inline Button component
  const Button = ({
    children,
    onClick,
    type = "button",
    variant = "default",
    className = "",
  }) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50";
    const variantStyles =
      variant === "default"
        ? "bg-purple-600 text-white hover:bg-purple-700"
        : "border border-gray-300 bg-white hover:bg-gray-50";

    return (
      <button
        type={type}
        className={`${baseStyles} ${variantStyles} ${className}`}
        onClick={onClick}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-3 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">Daily Challenge</h1>
          <div className="flex items-center gap-2 text-purple-100">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{challenge.date}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {/* Left column - Game controls */}
        <div className="flex flex-col">
          {/* Theme and timer */}
          <div className="flex justify-between items-center mb-3">
            <div className="bg-purple-100 px-3 py-1 rounded-full text-purple-800 text-xs">
              Theme: {challenge.theme}
            </div>
            <div className="flex items-center gap-1 text-gray-600 text-xs">
              <Clock className="w-3 h-3" />
              <span>Next: {timeLeft}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-gray-50 p-2 rounded-lg text-center">
              <div className="text-gray-500 text-xs">Words</div>
              <div className="font-bold text-sm">
                {foundWords.length}/{challenge.totalWords}
              </div>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg text-center">
              <div className="text-gray-500 text-xs">Points</div>
              <div className="font-bold text-sm">
                {score}/{challenge.maxScore}
              </div>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg text-center">
              <div className="text-gray-500 text-xs">Pangrams</div>
              <div className="font-bold text-sm">0/{challenge.pangrams}</div>
            </div>
          </div>

          {/* Message display */}
          {message && (
            <div className="text-center mb-3 p-2 rounded bg-indigo-100 text-indigo-700 text-sm">
              {message}
            </div>
          )}

          {/* Honeycomb */}
          <div className="relative w-48 h-48 mx-auto mb-3">
            {/* Outer hexagons */}
            {challenge.outerLetters.map((letter, index) => (
              <div
                key={index}
                className="absolute w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                style={{
                  top: 48 + 45 * Math.sin((index * Math.PI) / 3),
                  left: 48 + 45 * Math.cos((index * Math.PI) / 3),
                }}
                onClick={() => setInput(input + letter)}
              >
                <span className="text-lg font-bold">{letter}</span>
              </div>
            ))}

            {/* Center hexagon */}
            <div
              className="absolute top-[48px] left-[48px] w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-600 transition-colors"
              onClick={() => setInput(input + challenge.centerLetter)}
            >
              <span className="text-lg font-bold text-white">
                {challenge.centerLetter}
              </span>
            </div>
          </div>

          {/* Input form */}
          <form onSubmit={handleSubmit} className="mb-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg text-center text-lg uppercase focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Type a word..."
                />
                {input && (
                  <button
                    type="button"
                    onClick={clearInput}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <Button type="submit" className="px-4 py-2">
                Enter
              </Button>
            </div>
          </form>

          {/* Rank progress */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-1">
                <Award className="w-3 h-3 text-purple-600" />
                <span className="font-medium text-sm">{currentRank.name}</span>
              </div>
              {currentRank !== nextRank && (
                <div className="text-xs text-gray-500">
                  {nextRank.threshold - score} to {nextRank.name}
                </div>
              )}
            </div>
            {/* Inline Progress component */}
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-purple-600 transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 flex items-center justify-center gap-1 py-1 h-8"
            >
              <BarChart3 className="w-3 h-3" />
              <span className="text-xs">Stats</span>
            </Button>
            <Button
              variant="outline"
              className="flex-1 flex items-center justify-center gap-1 py-1 h-8"
            >
              <Sparkles className="w-3 h-3" />
              <span className="text-xs">Hints</span>
            </Button>
            <Button
              variant="outline"
              className="flex-1 flex items-center justify-center gap-1 py-1 h-8"
            >
              <Share2 className="w-3 h-3" />
              <span className="text-xs">Share</span>
            </Button>
          </div>
        </div>

        {/* Right column - Found words */}
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-gray-700 text-sm">Found Words</h3>
            <div className="text-xs text-gray-500">
              {foundWords.length} of {challenge.totalWords}
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg flex-1 overflow-hidden">
            {foundWords.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 max-h-[250px] overflow-auto">
                {foundWords.map((word) => (
                  <div
                    key={word}
                    className="flex items-center gap-1 bg-white p-1.5 rounded text-sm"
                  >
                    <Check className="w-3 h-3 text-green-600" />
                    <span>{word}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-gray-500 italic">
                  No words found yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
