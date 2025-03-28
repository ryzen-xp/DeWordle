"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Check, Award, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"

const steps = [
  {
    title: "Welcome to Word Hive!",
    description: "A word puzzle where you create words using the provided letters.",
    animation: "intro",
  },
  {
    title: "The Honeycomb",
    description:
      "Letters are arranged in a honeycomb pattern. The center letter (highlighted in yellow) must be used in every word.",
    animation: "honeycomb",
  },
  {
    title: "Creating Words",
    description: "Create words with 4+ letters. Each word must include the center letter.",
    animation: "creating",
  },
  {
    title: "Scoring",
    description:
      "4-letter words = 1 point. Longer words = more points. Words using all letters (Pangrams) get bonus points!",
    animation: "scoring",
  },
  {
    title: "Achievements",
    description: "Reach different ranks based on how many points you score. Try to reach 'Genius' level!",
    animation: "achievements",
  },
]

export default function HowToPlay() {
  const [currentStep, setCurrentStep] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (!autoPlay) return

    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        setAutoPlay(false)
      }
    }, 4000)

    return () => clearTimeout(timer)
  }, [currentStep, autoPlay])

  const nextStep = () => {
    setAutoPlay(false)
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    setAutoPlay(false)
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl overflow-hidden">
      <div className="bg-yellow-400 py-4 px-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center">How To Play</h1>
      </div>

      <div className="p-6">
        <div className="relative h-[400px] md:h-[450px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <div className="text-center mb-8">
                <h2 className="text-xl md:text-2xl font-bold mb-2">{steps[currentStep].title}</h2>
                <p className="text-gray-600">{steps[currentStep].description}</p>
              </div>

              <div className="flex items-center justify-center h-[250px] md:h-[300px]">
                {renderAnimation(steps[currentStep].animation)}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between mt-6">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 0} className="flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-1">
            {steps.map((_, index) => (
              <span
                key={index}
                className={`block w-2 h-2 rounded-full ${index === currentStep ? "bg-yellow-400" : "bg-gray-300"}`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
            className="flex items-center gap-1"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function renderAnimation(type) {
  switch (type) {
    case "intro":
      return <IntroAnimation />
    case "honeycomb":
      return <HoneycombAnimation />
    case "creating":
      return <CreatingAnimation />
    case "scoring":
      return <ScoringAnimation />
    case "achievements":
      return <AchievementsAnimation />
    default:
      return null
  }
}

function IntroAnimation() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mb-6">
        <Brain className="w-12 h-12 text-yellow-800" />
      </div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-center"
      >
        <h3 className="text-xl font-bold mb-2">Challenge Your Vocabulary</h3>
        <p className="text-gray-600">Create as many words as you can!</p>
      </motion.div>
    </motion.div>
  )
}

function HoneycombAnimation() {
  const letters = ["P", "L", "A", "N", "T", "E", "S"]

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-64 h-64">
        {/* Outer hexagons */}
        {letters.slice(0, 6).map((letter, index) => (
          <motion.div
            key={index}
            className="absolute w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center"
            style={{
              top: 64 + 60 * Math.sin((index * Math.PI) / 3),
              left: 64 + 60 * Math.cos((index * Math.PI) / 3),
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 * index, duration: 0.4 }}
          >
            <span className="text-2xl font-bold">{letter}</span>
          </motion.div>
        ))}

        {/* Center hexagon */}
        <motion.div
          className="absolute top-[64px] left-[64px] w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <span className="text-2xl font-bold">{letters[6]}</span>
        </motion.div>
      </div>

      <motion.p
        className="mt-4 text-center text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        The center letter must be used in every word
      </motion.p>
    </div>
  )
}

function CreatingAnimation() {
  const [currentWord, setCurrentWord] = useState("")
  const word = "PLANET"

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentWord.length < word.length) {
        setCurrentWord(word.substring(0, currentWord.length + 1))
      } else {
        setTimeout(() => setCurrentWord(""), 1000)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [currentWord])

  return (
    <div className="flex flex-col items-center">
      <div className="mb-8 flex items-center space-x-2">
        <div className="relative w-64 h-12 bg-gray-100 rounded-full flex items-center px-4">
          <span className="text-xl font-bold">{currentWord}</span>
          <motion.div
            className="absolute right-3 top-3 bottom-3 w-1 bg-gray-400"
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8 }}
          />
        </div>
        <motion.div animate={{ scale: currentWord === word ? [1, 1.2, 1] : 1 }} transition={{ duration: 0.3 }}>
          {currentWord === word ? <Check className="w-6 h-6 text-green-500" /> : null}
        </motion.div>
      </div>

      <div className="relative w-64 h-64">
        <div className="absolute top-[64px] left-[24px] w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold">P</span>
        </div>
        <div className="absolute top-[24px] left-[64px] w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold">L</span>
        </div>
        <div className="absolute top-[24px] left-[104px] w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold">A</span>
        </div>
        <div className="absolute top-[64px] left-[144px] w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold">N</span>
        </div>
        <div className="absolute top-[104px] left-[104px] w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold">T</span>
        </div>
        <div className="absolute top-[104px] left-[64px] w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold">E</span>
        </div>
      </div>
    </div>
  )
}

function ScoringAnimation() {
  const words = [
    { word: "PANE", points: 1 },
    { word: "PLANE", points: 5 },
    { word: "PLANET", points: 10 },
  ]

  return (
    <div className="flex flex-col items-center">
      <div className="w-64 space-y-4">
        {words.map((item, index) => (
          <motion.div
            key={index}
            className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.3, duration: 0.5 }}
          >
            <span className="font-medium">{item.word}</span>
            <div className="flex items-center">
              <motion.div
                className="bg-yellow-400 rounded-full px-2 py-1 text-sm font-bold"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ delay: index * 0.3 + 0.3, duration: 0.5 }}
              >
                +{item.points}
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <p className="text-sm text-gray-500">Longer words = More points!</p>
        <p className="text-sm text-gray-500 mt-1">Using all letters = Pangram bonus!</p>
      </motion.div>
    </div>
  )
}

function AchievementsAnimation() {
  const ranks = [
    { name: "Beginner", percent: 20, color: "bg-gray-400" },
    { name: "Good", percent: 40, color: "bg-blue-400" },
    { name: "Skilled", percent: 60, color: "bg-green-400" },
    { name: "Expert", percent: 80, color: "bg-purple-400" },
    { name: "Genius", percent: 100, color: "bg-yellow-400" },
  ]

  const [currentRank, setCurrentRank] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentRank((prev) => (prev < ranks.length - 1 ? prev + 1 : 0))
    }, 1200)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex flex-col items-center w-full max-w-xs">
      <motion.div
        key={currentRank}
        className="w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">{ranks[currentRank].name}</span>
          <div className="flex items-center gap-1">
            <Award className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-bold">{ranks[currentRank].percent}%</span>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-4">
          <motion.div
            className={`h-4 rounded-full ${ranks[currentRank].color}`}
            initial={{ width: "0%" }}
            animate={{ width: `${ranks[currentRank].percent}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      <motion.div
        className="mt-8 flex items-center gap-2 bg-yellow-100 p-3 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Award className="w-6 h-6 text-yellow-600" />
        <p className="text-sm text-yellow-800">Reach "Genius" level to unlock all achievements!</p>
      </motion.div>
    </div>
  )
}

