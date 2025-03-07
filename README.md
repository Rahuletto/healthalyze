# Healthalyze

Healthalyze is an AI-powered tool designed to assess your stroke risk using deep learning. With just a few inputs—such as age, blood pressure, glucose levels, and lifestyle habits—our advanced CNN model provides an accurate probability of stroke occurrence.

## Flowchart
![image](/public/screenshots/flowchart.png)



## Setup
1. Install requirements
```
pip install -r api/requirements.txt
```

2. Run frontend and backend
```
bun --bun run dev
```

> [!WARNING]
> Bun is required to run as this project uses `bun:sqlite` package from bun. So make sure you run with bun.

This concurrently starts FastAPI and NextJS server together, tho you need to run the saved CNN model first.

## Screenshots
![image](/public/screenshots/home.png)
![image](/public/screenshots/risk.png)
![image](/public/screenshots/graph.png)

## CNN Model
![image](/public/screenshots/accuracy.png)


