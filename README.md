<!-- TECHNOLOGY BADGES (inspired by your profile design) -->
<p align="center">
  <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/Transformers-ffcc00?style=for-the-badge&logo=python&logoColor=black" alt="Transformers"/>
  <img src="https://img.shields.io/badge/HuggingFace-fcc42d?style=for-the-badge&logo=huggingface&logoColor=black" alt="HuggingFace"/>
  <img src="https://img.shields.io/badge/React-61dafb?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-646cff?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/Fine_tuning-faab00?style=for-the-badge&logo=python&logoColor=black" alt="Fine-tuning"/>
  <img src="https://img.shields.io/badge/DistilBERT-00b67a?style=for-the-badge&logo=bookstack&logoColor=white" alt="DistilBERT"/>
  <img src="https://img.shields.io/badge/NLP-0052cc?style=for-the-badge&logo=semantic-release&logoColor=white" alt="NLP"/>
  <img src="https://img.shields.io/badge/Sentiment_Analysis-0077b6?style=for-the-badge&logo=google-analytics&logoColor=white" alt="Sentiment Analysis"/>
  <img src="https://img.shields.io/badge/Full_Stack-24292e?style=for-the-badge&logo=stackshare&logoColor=white" alt="Full Stack"/>
</p>

# Sentiment Analyser AI

Unlock the power of sentiment analytics with **Sentiment_Analyser_AI** – a web-based application that utilizes machine learning and state-of-the-art Natural Language Processing (NLP) to determine sentiment of input text with high accuracy...

---

🔴 **Live Demo** → https://huggingface.co/spaces/rachitmittal20/Sentimentanalyser__

> **NOTE:** Directly copy the link and paste it in the address bar as it won’t open directly.

---

## 🚀 Why You'll Love This Project

- **Interactive web interface** for fast and easy text analysis.
- **Custom-trained AI model** for accurate sentiment detection.
- **Modern, full-stack technologies**.
- **Quick setup** – analyze your data in just a few clicks.
- **Open and extensible** – tweak the model or front end for your needs.

## 🛠️ Tech Stack

| Layer      | Tech                                         |
|------------|----------------------------------------------|
| Model      | HuggingFace Transformers + PyTorch           |
| Backend    | Python 3.10 · FastAPI · Uvicorn              |
| Frontend   | React · Vite · Tailwind CSS                  |
| Deploy     | Hugging Face Spaces or custom web service    |

> **Original legacy stack:** Flask, Scikit-learn, Pandas (used earlier / for reference)

## ⚡ API Endpoints

| Method | Route        | Description                        |
|--------|--------------|------------------------------------|
| GET    | /            | Health check + model name          |
| POST   | /predict     | Single text → label + score        |
| POST   | /batch       | Up to 10 texts → results[]         |
| GET    | /model-info  | Model metadata                     |

## ✨ Model Details

| Property    | Value                        |
|-------------|------------------------------|
| Base        | distilbert-base-uncased      |
| Dataset     | SST-2 (67,349 train samples) |
| Accuracy    | ~92% on validation set       |
| Epochs      | 2 · Seed: 42                 |
| Max tokens  | 128                          |

---

## ⚙️ Run Locally

### Backend

```bash
cd backend
pip install -r requirements.txt
python train.py              # fine-tunes and saves to ./model/
uvicorn main:app --reload    # Starts FastAPI at http://localhost:8000/docs
```

### Frontend

```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:8000" > .env
npm run dev                  # Starts React at http://localhost:5173
```

---

## More Info

For manual and advanced setup (virtual environments, troubleshooting, legacy interface, etc.), see additional instructions below.

[Existing install/training/usage instructions from original README...]

---

## 💡 Troubleshooting

- If you see errors about a missing model, ensure you've run `python train.py` first.
- If ports conflict, change the port in your FastAPI/React configs.
- For Python dependencies, use a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows use venv\Scripts\activate
```

---

## 🤝 Contributing

Pull requests and stars are welcome! For major changes, please open an issue first to discuss what you’d like to change.

---

## 📄 License

MIT License

---

*Analyse and understand sentiments in text with ease!*

