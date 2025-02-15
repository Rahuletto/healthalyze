"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { FaArrowRight } from "react-icons/fa6";

import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"
import PredictionResult from "./prediction-result"
import { useUser } from "@clerk/nextjs"

const formSchema = z.object({
  age: z.number().int().positive().max(120),
  hypertension: z.enum(["Yes", "No"]),
  heart_disease: z.enum(["Yes", "No"]),
  avg_glucose_level: z.number().positive().max(300),
  height: z.number().positive().max(250), 
  weight: z.number().positive().max(300), 
  gender: z.enum(["Male", "Female", "Other"]),
  smoking_status: z.enum(["Never smoked", "Formerly smoked", "Smokes"]),
  residence: z.enum(["Urban", "Rural"]),
  work_type: z.enum(["Private", "Self-employed", "Govt_job", "children", "Never_worked"]),
  ever_married: z.enum(["Yes", "No"]),
  physical_activity: z.enum(["Low", "Moderate", "High"]),
})

const encouragingMessages = [
  "Hello! Let's learn more about you.",
  "I want to learn more..",
  "Halfway there! Your input is valuable.",
  "Almost done! Just a few more questions.",
  "Last stretch! You're providing crucial information.",
]

const formFields = [
  { name: "gender", label: "Let's start with your gender.", title: "Gender", type: "select", options: ["Male", "Female", "Other"] },
  { name: "age", label: "What's your age?", type: "number", title: "Age" },
  { name: "hypertension", label: "Do you have hypertension?", title: "Hypertension", type: "select", options: ["No", "Yes"] },
  { name: "heart_disease", label: "What about Heart Disease", type: "select", options: ["No", "Yes"], title: "Heart Disease" },
  { name: "avg_glucose_level", label: "Okay! Let's check your Average Glucose Level", type: "number", title: "Average Glucose Level" },
  { name: "height", label: "What's your height? (in cm)", type: "number", title: "Height" },
  { name: "weight", label: "What's your weight? (in kg)", type: "number", title: "Weight" },
  { name: "smoking_status", label: "Do you smoke?", type: "select", options: ["Never smoked", "Formerly smoked", "Smokes"], title: "Smoking Status" },
  { name: "residence", label: "And.. Where do you live?", type: "select", options: ["Urban", "Rural"], title: "Residence" },
  {
    name: "work_type",
    label: "But what's your work related",
    type: "select",
    title: "Work Type",
    options: ["Private", "Self-employed", "Govt_job", "children", "Never_worked"],
  },
  { name: "ever_married", label: "Are you Married?", type: "select", options: ["Yes", "No"], title: "Ever Married" },
  { name: "physical_activity", label: "Ok final one, Do you do any physical activity regularly?", type: "select", options: ["Low", "Moderate", "High"], title: "Physical Activity" },
]

interface PredictionResponse {
  stroke_probability: number
  risk_level: string
  advice: string
}

export default function AnimatedStrokePredictionForm({ data }: { data: any }) {
  const user = useUser();
  const [step, setStep] = useState(0)
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)


  const totalSteps = formFields.length

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: data ? {
      age: data.age,
      hypertension: data.hypertension === 1 ? "Yes" : "No",
      heart_disease: data.heart_disease === 1 ? "Yes" : "No",
      avg_glucose_level: data.avg_glucose_level,
      height: data.height,
      weight: data.weight,
      gender: data.gender,
      smoking_status: data.smoking_status,
      residence: data.residence,
      work_type: data.work_type,
      ever_married: data.ever_married,
      physical_activity: data.physical_activity,
    } : undefined
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)

      const heightInMeters = values.height / 100
      const bmi = values.weight / (heightInMeters * heightInMeters)

      const response = await fetch("http://localhost:8000/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          bmi: parseFloat(bmi.toFixed(2)),
          hypertension: values.hypertension == "Yes" ? 1 : 0,
          heart_disease: values.heart_disease == "Yes" ? 1 : 0,
        }),
      })

      if (!response.ok) {
        throw new Error("Prediction failed")
      }

      const result = await response.json()
      setPrediction(result)

      await fetch("/api/predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user.user?.id,
          ...values,
          bmi: parseFloat(bmi.toFixed(2)),
          hypertension: values.hypertension == "Yes" ? 1 : 0,
          heart_disease: values.heart_disease == "Yes" ? 1 : 0,
          prediction_result: result.stroke_probability / 100,
          risk_level: result.risk_level,
        }),
      })

      toast({
        title: "Prediction Complete",
        description: "Your stroke risk assessment is ready.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get prediction. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const currentField = formFields[step]

  return (
    prediction ? <PredictionResult
      probability={prediction.stroke_probability}
      riskLevel={prediction.risk_level}
      advice={prediction.advice}
    /> : isLoading ? (
      <div className="flex items-center justify-center h-screen">
        <div className="flex items-center justify-center space-x-4 gap-5">
          <div className="w-10 h-10 border-4 border-dashed border-red rounded-full animate-spin"></div>
          <p className="text-lg font-semibold">Loading...</p>
        </div>
      </div>
    ) :
      <div className="flex justify-between w-screen pl-24 items-center">
        <div className="container p-4 max-w-[620px] mx-3">

          <div className="absolute bottom-32 w-screen left- 12 flex items-start justify-start p-4">
            <motion.div
              className="bg-light-red/10 rounded-full w-full max-w-md"
              initial={{ width: 0 }}
              animate={{ width: `100%` }}
              transition={{ duration: 0.5 }}
            >
              <Progress value={((step + 1) / totalSteps) * 100} className="w-full bg-light-red/10" />
            </motion.div>
          </div>

          <p className="text-4xl font-medium mb-1 text-left font-classy">{encouragingMessages[Math.floor(step / 3)]}</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name={currentField.name as any}
                    render={({ field }: { field: { onChange: (value: any) => void; value: any } }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-classy text-lg opacity-60 mb-6">{currentField.label}</FormLabel>
                        <FormControl>
                          {currentField.type === "number" ? (
                            <Input
                              type="number"
                              {...field}
                              onChange={(e: any) => field.onChange(Number.parseFloat(e.target.value))}
                              className="text-lg p-6 rounded-full bg-foreground/5"
                            />
                          ) : (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="text-lg p-6 rounded-full bg-foreground/5">
                                  <SelectValue placeholder={`Select ${currentField.title.toLowerCase()}`} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="border-0 bg-light-bg">
                                {currentField.options?.map((option) => (
                                  <SelectItem className="capitalize" key={option} value={option}>
                                    {option.replaceAll("_", " ")}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </FormControl>
                        {/* <FormMessage /> */}
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-between mt-6">
                    <button type="button" onClick={prevStep} disabled={step === 0} className="px-5 py-2 rounded-full font-semibold text-foreground border border-foreground">
                      Previous
                    </button>
                    {step === totalSteps - 1 ? (
                      <button onClick={() => onSubmit(form.getValues())} type="submit" className="px-7 py-2 rounded-full text-xl font-semibold text-background bg-red">Submit</button>
                    ) : (
                      <button type="button" className="px-7 py-2 rounded-full text-xl font-semibold text-background bg-red" onClick={nextStep}>
                        <FaArrowRight />
                      </button>
                    )}
                  </div>
                </form>
              </Form>
            </motion.div>
          </AnimatePresence>

        </div>
        <img src="/dashboard.svg" alt="hero" className='h-screen' />
      </div>
  )
}

