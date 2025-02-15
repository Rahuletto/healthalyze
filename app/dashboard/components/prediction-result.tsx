"use client"

import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"

interface PredictionResultProps {
  probability: number
  riskLevel: string
  advice: string
}

export default function PredictionResult({ probability, riskLevel, advice }: PredictionResultProps) {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Very Low":
        return "bg-green-500"
      case "Low":
        return "bg-yellow-500"
      case "Moderate":
        return "bg-orange-500"
      case "High":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="pl-6 items-center w-screen flex gap-4 justify-between">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 p-6 pl-20 rounded-xl max-w-[700px]"
      >
        <div className="space-y-2">
          <div className="flex mb-1 justify-between items-center">
            <h3 className="text-lg font-semibold font-classy">Stroke Risk Probability</h3>
            <span className="text-4xl font-bold font-unbound">{probability}%</span>
          </div>
          <Progress value={probability} className="h-4 rounded-full" indicatorClassName={getRiskColor(riskLevel)} />
        </div>

        <div className="flex gap-3 flex-row">
          <h4 className="text-lg font-semibold">Risk Level</h4>
          <p className="text-xl font-bold text-red">{riskLevel}</p>
        </div>

        <div className="space-y-2 mt-2">
          <h4 className="text-xl font-classy font-semibold">Health Advice</h4>
          <p className="text-lg">{advice}</p>
        </div>
      </motion.div>
      <img src="/prob.svg" alt="hero" className='h-screen' />
    </div>
  )
}