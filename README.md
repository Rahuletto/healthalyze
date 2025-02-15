# Healthalyze

Healthalyze is an AI-powered tool designed to assess your stroke risk using deep learning. With just a few inputs—such as age, blood pressure, glucose levels, and lifestyle habits—our advanced CNN model provides an accurate probability of stroke occurrence.

## Flowchart
![image](/public/screenshot/flowchart.png)



## Setup
1. Install requirements
```
pip install -r api/requirements.txt
```

2. Run frontend and backend
```
bun run dev
```

or 

```
npm run dev
```

This concurrently starts FastAPI and NextJS server together, tho you need to run the saved CNN model first.

## Screenshots
![image](/public/screenshots/home.png)
![image](/public/screenshot/risk.png)
![image](/public/screenshot/graph.png)

## CNN Model
![image](/public/screenshot/accuracy.png)
