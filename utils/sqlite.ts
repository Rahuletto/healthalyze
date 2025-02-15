import { Database } from "bun:sqlite";

const db = new Database("stroke_prediction.sqlite");

export interface StrokePrediction {
  id: string;
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
  physical_activity: string;
  prediction_result: number;
  risk_level: string;
  created_at?: string;
}

export const initializeDatabase = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS stroke_predictions (
      id TEXT PRIMARY KEY,
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
      physical_activity TEXT NOT NULL,
      prediction_result REAL NOT NULL,
      risk_level TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

export const insertPrediction = (data: Omit<StrokePrediction, 'created_at'>) => {
  initializeDatabase()
  const query = db.prepare(`
    INSERT INTO stroke_predictions (
      id, age, hypertension, heart_disease, avg_glucose_level, bmi,
      gender, smoking_status, residence, work_type, ever_married,
      physical_activity, prediction_result, risk_level
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      age = excluded.age,
      hypertension = excluded.hypertension,
      heart_disease = excluded.heart_disease,
      avg_glucose_level = excluded.avg_glucose_level,
      bmi = excluded.bmi,
      gender = excluded.gender,
      smoking_status = excluded.smoking_status,
      residence = excluded.residence,
      work_type = excluded.work_type,
      ever_married = excluded.ever_married,
      physical_activity = excluded.physical_activity,
      prediction_result = excluded.prediction_result,
      risk_level = excluded.risk_level
  `);

  return query.run(
    data.id,
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

export const getPredictionById = (id: string) => {
  return db.prepare(`
    SELECT * FROM stroke_predictions 
    WHERE id = ?
  `).get(id);
};

export const deletePrediction = (id: string) => {
  return db.prepare(`
    DELETE FROM stroke_predictions 
    WHERE id = ?
  `).run(id);
};

export const updatePrediction = (id: string, data: Partial<StrokePrediction>) => {
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