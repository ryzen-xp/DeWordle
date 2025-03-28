"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lightbulb, Check, RefreshCw, HelpCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Sample data for practice mode
const practiceData = {
  centerLetter: "E",
  outerLetters: ["P", "L", "A", "N", "T", "S"],
  words: [
    { word: "PLANE", revealed: true, hint: "Something that flies" },
    { word: "PLANET", revealed: false, hint: "Earth is one" },
    { word: "PLATE", revealed: false, hint: "You eat from this" },
    { word: "PLEASE", revealed: false, hint: "Say this when asking nicely" },
    { word: "PETAL", revealed: true, hint: "Part of a flower" },
    { word: "STEAL", revealed: false, hint: "To take without permission" },
    { word: "SLATE", revealed: false, hint: "A type of rock or a clean start" },
    { word: "PASTE", revealed: false, hint: "Copy and ___" },
    { word: "SEAL", revealed: false, hint: "To close something." },
    { word: "LEAP", revealed: false, hint: "The action of jumping or springing,." },
    { word: "LANE", revealed: false, hint: "A narrow road, especially in a rural area." },
  ],
}

export default function PracticeMode() {
  const [gameData, setGameData] = useState(practiceData)
  const [input, setInput] = useState("")
  const [message, setMessage] = useState({ text: "Try to find words using the letters above!", type: "info" })
  const [foundWords, setFoundWords] = useState([])
  const [showHint, setShowHint] = useState(false)
  const [currentHintIndex, setCurrentHintIndex] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Filter for words that haven't been found yet and aren't revealed
  const remainingWords = gameData.words.filter((word) => !foundWords.includes(word.word) && !word.revealed)

  const handleInputChange = (e) => {
    setInput(e.target.value.toUpperCase())
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (input.length < 4) {
      setMessage({ text: "Words must be at least 4 letters long", type: "error" })
      return
    }

    if (!input.includes(gameData.centerLetter)) {
      setMessage({ text: `Words must contain the center letter (${gameData.centerLetter})`, type: "error" })
      return
    }

    const wordObj = gameData.words.find((w) => w.word === input)

    if (!wordObj) {
      setMessage({ text: "Not in word list", type: "error" })
      return
    }

    if (foundWords.includes(input)) {
      setMessage({ text: "Already found", type: "error" })
      return
    }

    setFoundWords([...foundWords, input])
    setMessage({ text: "Great job! Word found!", type: "success" })
    setInput("")

    // Check if all words are found
    if (foundWords.length + 1 >= gameData.words.filter((w) => !w.revealed).length) {
      setMessage({ text: "Amazing! You found all the words!", type: "success" })
      setIsDialogOpen(true)
    }
  }

  const getHint = () => {
    if (remainingWords.length === 0) return

    setShowHint(true)
    setTimeout(() => setShowHint(false), 5000)
  }

  const revealWord = () => {
    if (remainingWords.length === 0) return

    const updatedWords = [...gameData.words]
    const wordToReveal = remainingWords[currentHintIndex]

    const index = updatedWords.findIndex((w) => w.word === wordToReveal.word)
    updatedWords[index] = { ...updatedWords[index], revealed: true }

    setGameData({ ...gameData, words: updatedWords })
    setCurrentHintIndex((currentHintIndex + 1) % remainingWords.length)
    setMessage({ text: `Revealed: ${wordToReveal.word}`, type: "info" })
  }

  const resetGame = () => {
    setGameData({
      ...practiceData,
      words: practiceData.words.map((word) => ({
        ...word,
        revealed: word.revealed ? true : false, // Keep initially revealed words
      })),
    })
    setFoundWords([])
    setInput("")
    setMessage({ text: "Game reset! Try again", type: "info" })
    setCurrentHintIndex(0)
  }

  const clearInput = () => {
    setInput("")
  }

  return (
    <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl overflow-hidden">
      <div className="bg-indigo-500 py-3 px-6">
        <h1 className="text-xl font-bold text-white text-center">Practice Mode</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {/* Left column - Game controls */}
        <div className="flex flex-col">
          {/* Message display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={message.text}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`text-center mb-3 p-2 rounded ${
                message.type === "error"
                  ? "bg-red-100 text-red-700"
                  : message.type === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
              }`}
            >
              {message.text}
            </motion.div>
          </AnimatePresence>

          {/* Honeycomb */}
          <div className="relative w-48 h-48 mx-auto mb-4">
            {/* Outer hexagons */}
            {gameData.outerLetters.map((letter, index) => (
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
              className="absolute top-[48px] left-[48px] w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-yellow-500 transition-colors"
              onClick={() => setInput(input + gameData.centerLetter)}
            >
              <span className="text-lg font-bold">{gameData.centerLetter}</span>
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
                  className="w-full p-2 border border-gray-300 rounded-lg text-center text-lg uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              <Button type="submit" className="bg-indigo-500 hover:bg-indigo-600">
                Enter
              </Button>
            </div>
          </form>

          {/* Hint section */}
          <AnimatePresence>
            {showHint && remainingWords.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-amber-100 p-2 rounded-lg mb-3"
              >
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-amber-800 font-medium text-sm">Hint:</p>
                    <p className="text-amber-700 text-sm">{remainingWords[currentHintIndex].hint}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action buttons */}
          <div className="flex gap-2 mb-3">
            <Button
              variant="outline"
              className="flex-1 flex items-center justify-center gap-1 py-1 h-auto"
              onClick={getHint}
              disabled={remainingWords.length === 0}
            >
              <HelpCircle className="w-3 h-3" />
              <span className="text-xs">Hint</span>
            </Button>
            <Button
              variant="outline"
              className="flex-1 flex items-center justify-center gap-1 py-1 h-auto"
              onClick={revealWord}
              disabled={remainingWords.length === 0}
            >
              <Lightbulb className="w-3 h-3" />
              <span className="text-xs">Reveal</span>
            </Button>
            <Button
              variant="outline"
              className="flex-1 flex items-center justify-center gap-1 py-1 h-auto"
              onClick={resetGame}
            >
              <RefreshCw className="w-3 h-3" />
              <span className="text-xs">Reset</span>
            </Button>
          </div>
        </div>

        {/* Right column - Word lists */}
        <div className="flex flex-col h-full">
          <div className="grid grid-cols-2 gap-3 h-full">
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-medium mb-2 text-gray-700 text-sm">Found Words</h3>
              <div className="space-y-1 max-h-[180px] overflow-auto">
                {foundWords.map((word) => (
                  <div key={word} className="flex items-center gap-1 text-green-600 text-sm">
                    <Check className="w-3 h-3" />
                    <span>{word}</span>
                  </div>
                ))}
                {foundWords.length === 0 && <p className="text-xs text-gray-500 italic">No words found yet</p>}
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-medium mb-2 text-gray-700 text-sm">Revealed Words</h3>
              <div className="space-y-1 max-h-[180px] overflow-auto">
                {gameData.words
                  .filter((word) => word.revealed)
                  .map((word) => (
                    <div key={word.word} className="flex items-center gap-1 text-indigo-600 text-sm">
                      <span>{word.word}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Completion dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Practice Complete!</DialogTitle>
            <DialogDescription>Great job! You've found all the words in this practice session.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p>You found {foundWords.length} words:</p>
            <div className="grid grid-cols-2 gap-2">
              {foundWords.map((word) => (
                <div key={word} className="bg-green-100 p-2 rounded flex items-center gap-1">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>{word}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

