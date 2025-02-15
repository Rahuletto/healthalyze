'use client'
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataAnalysis } from "@/types/DataAnalysis";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function GraphPage({ data }: { data: DataAnalysis }) {
  return (
    <main className="container mx-auto py-8 mt-20">
      <div className="grid md:grid-cols-2 lg:grid-cols-4">
        <div className="col-span-2 flex items-start justify-center flex-col p-6 rounded-tl-lg border border-cardborder">
          <h1 className="text-xl font-semibold">Health Risk Analytics</h1>
          <p className="text-sm opacity-40 font-medium">Interactive data visualization of health metrics and risk factors</p>
        </div>
        <div className="p-6 flex flex-col gap-2 border border-cardborder">
          <h1 className="text-sm opacity-40 font-medium">Predictions</h1>
          <div className="text-3xl font-bold">{data.totalPredictions.count}</div>
        </div>
        <div className="p-6 flex flex-col gap-2 border border-cardborder rounded-tr-lg">
          <h1 className="text-sm opacity-40 font-medium">Average Age</h1>
          <div className="text-3xl font-bold">{data.averageAge.avg}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2">
        <div className="flex flex-col gap-2 p-6 border border-cardborder">
          <h2 className="text-2xl font-semibold mb-4">Age VS Smoking Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis type="number" dataKey="age" name="Age" stroke="#FFF" />
              <YAxis type="category" dataKey="smoking_status" name="Smoking Status" stroke="#FFF" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Legend />
              <Scatter name="Users" data={data.data} fill="#0088FE" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col gap-2 p-6 border border-cardborder">
          <h2 className="text-2xl font-semibold mb-4">BMI VS Risk</h2>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis type="number" dataKey="bmi" name="BMI" stroke="#FFF" />
              <YAxis type="category" dataKey="risk_level" name="Risk Level" stroke="#FFF" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter name="Users" data={data.data} fill="#FF8042" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 border border-cardborder rounded-bl-lg">
          <h2 className="text-2xl font-semibold mb-4">Risk Level Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.riskLevelDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="risk_level" stroke="#FFF" />
              <YAxis stroke="#FFF" />
              <Tooltip />
              <Bar dataKey="count" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>


        <div className="p-6 border border-cardborder rounded-br-lg">
          <h2 className="text-2xl font-semibold mb-4">Smoking Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data.smokingStatusDistribution} dataKey="count" nameKey="smoking_status" cx="50%" cy="50%" outerRadius={100} label>
                {data.smokingStatusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      <div className="flex flex-col gap-2 p-6 border border-cardborder rounded-xl mt-8">
        <h2 className="text-2xl font-semibold mb-4">Analytic data</h2>

        <Table>
          <TableRow className="bg-white/10">
            <TableHead>Index</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>BMI</TableHead>
            <TableHead>Avg Glucose</TableHead>
            <TableHead>Risk Level</TableHead>
            <TableHead>Prediction (%)</TableHead>
            <TableHead>Hypertension</TableHead>
            <TableHead>Heart Disease</TableHead>
            <TableHead>Smoking Status</TableHead>
            <TableHead>Residence</TableHead>
            <TableHead>Work Type</TableHead>
            <TableHead>Ever Married</TableHead>
            <TableHead>Physical Activity</TableHead>
          </TableRow>
          <TableBody>
            {data.data.map((user, index) => (
              <TableRow key={index}>
                <TableCell className="bg-white/5">{index}</TableCell>
                <TableCell>{user.age}</TableCell>
                <TableCell>{user.gender}</TableCell>
                <TableCell>{user.bmi.toFixed(2)}</TableCell>
                <TableCell>{user.avg_glucose_level.toFixed(2)}</TableCell>
                <TableCell>{user.risk_level}</TableCell>
                <TableCell>{(user.prediction_result * 100).toFixed(2)}%</TableCell>
                <TableCell>{user.hypertension}</TableCell>
                <TableCell>{user.heart_disease}</TableCell>
                <TableCell>{user.smoking_status}</TableCell>
                <TableCell>{user.residence}</TableCell>
                <TableCell>{user.work_type}</TableCell>
                <TableCell>{user.ever_married}</TableCell>
                <TableCell>{user.physical_activity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
