export interface DataAnalysis {
    totalPredictions: TotalPredictions
    averageAge: AverageAge
    riskLevelDistribution: RiskLevelDistribution[]
    smokingStatusDistribution: SmokingStatusDistribution[]
    data: Daum[]
  }
  
  export interface TotalPredictions {
    count: number
  }
  
  export interface AverageAge {
    avg: number
  }
  
  export interface RiskLevelDistribution {
    risk_level: string
    count: number
  }
  
  export interface SmokingStatusDistribution {
    smoking_status: string
    count: number
  }
  
  export interface Daum {
    id: string
    age: number
    hypertension: number
    heart_disease: number
    avg_glucose_level: number
    bmi: number
    gender: string
    smoking_status: string
    residence: string
    work_type: string
    ever_married: string
    physical_activity: string
    prediction_result: number
    risk_level: string
    created_at: string
  }
  