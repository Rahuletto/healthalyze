import { Database } from "bun:sqlite";

const db = new Database("stroke_prediction.sqlite");

export interface StrokePrediction {
  id?: number;
  age: number;
  hypertension: number;
  heart_disease: number;
  avg_glucose_level: number;
  bmi: number;
  gender: string;
  smoking_status: string;
  residence: string;
  work_type: string;
  ever_married: string;
  education_level: string;
  physical_activity: string;
  prediction_result: number;
  risk_level: string;
  created_at?: string;
}

export const initializeDatabase = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS stroke_predictions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      age REAL NOT NULL,
      hypertension INTEGER NOT NULL,
      heart_disease INTEGER NOT NULL,
      avg_glucose_level REAL NOT NULL,
      bmi REAL NOT NULL,
      gender TEXT NOT NULL,
      smoking_status TEXT NOT NULL,
      residence TEXT NOT NULL,
      work_type TEXT NOT NULL,
      ever_married TEXT NOT NULL,
      education_level TEXT NOT NULL,
      physical_activity TEXT NOT NULL,
      prediction_result REAL NOT NULL,
      risk_level TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

export const insertPrediction = (data: Omit<StrokePrediction, 'id' | 'created_at'>) => {
  const query = db.prepare(`
    INSERT INTO stroke_predictions (
      age, hypertension, heart_disease, avg_glucose_level, bmi,
      gender, smoking_status, residence, work_type, ever_married,
      education_level, physical_activity, prediction_result, risk_level
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  return query.run(
    data.age,
    data.hypertension,
    data.heart_disease,
    data.avg_glucose_level,
    data.bmi,
    data.gender,
    data.smoking_status,
    data.residence,
    data.work_type,
    data.ever_married,
    data.education_level,
    data.physical_activity,
    data.prediction_result,
    data.risk_level
  );
};

export const getPredictions = (limit: number = 10) => {
  return db.prepare(`
    SELECT * FROM stroke_predictions 
    ORDER BY created_at DESC 
    LIMIT ?
  `).all(limit);
};

export const getPredictionById = (id: number) => {
  return db.prepare(`
    SELECT * FROM stroke_predictions 
    WHERE id = ?
  `).get(id);
};

export const deletePrediction = (id: number) => {
  return db.prepare(`
    DELETE FROM stroke_predictions 
    WHERE id = ?
  `).run(id);
};

export const updatePrediction = (id: number, data: Partial<StrokePrediction>) => {
  const fields = Object.keys(data)
    .filter(key => key !== 'id' && key !== 'created_at')
    .map(key => `${key} = ?`)
    .join(', ');

  const values = [...Object.values(data), id];

  const query = db.prepare(`
    UPDATE stroke_predictions 
    SET ${fields}
    WHERE id = ?
  `);

  return query.run(...values);
};

export const getStatistics = () => {
  return {
    totalPredictions: db.prepare('SELECT COUNT(*) as count FROM stroke_predictions').get(),
    averageAge: db.prepare('SELECT AVG(age) as avg FROM stroke_predictions').get(),
    riskLevelDistribution: db.prepare(`
      SELECT risk_level, COUNT(*) as count 
      FROM stroke_predictions 
      GROUP BY risk_level
    `).all(),
  };
};