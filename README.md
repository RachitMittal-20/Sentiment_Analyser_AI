# Sentiment Analyser AI

Unlock the power of sentiment analytics with **Sentiment_Analyser_AI** – a web-based application that utilizes machine learning and state-of-the-art Natural Language Processing (NLP) to determine sentiment from text.

---

🔴 **Live Demo** → https://sentimentapi-frontend.onrender.com  
📖 **API Docs**  → https://sentimentapi-backend.onrender.com/docs  
🤗 **Model**     → https://huggingface.co/RachitMittal-20/sentimentapi-distilbert-sst2

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
