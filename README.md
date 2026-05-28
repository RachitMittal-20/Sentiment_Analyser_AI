# Sentiment Analyser AI

Unlock the power of sentiment analytics with **Sentiment_Analyser_AI** – a web-based application that utilizes machine learning and state-of-the-art Natural Language Processing (NLP) to determine the sentiment of textual data. Instantly classify text as positive, negative, or neutral, making it perfect for analyzing reviews, user feedback, social media, and more!

## 🚀 Why You'll Love This Project

- **Interactive web interface** for fast and easy text analysis.
- **Custom-trained AI model** for accurate sentiment detection.
- **Modern, full-stack technologies**.
- **Quick setup** – analyze your data in just a few clicks.
- **Open and extensible** – tweak the model or front end for your needs.

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript (70%+ code in JS)
- **Backend / ML:** Python, Flask (or relevant Python framework)
- **ML/Data Science:** Scikit-learn, Pandas, Numpy (within `train.py`)
- **Styling:** CSS
- **Model Serialization:** Pickle or Joblib

## ⚙️ How It Works

1. **Training the Model:**  
   The model is trained on a labeled dataset of text samples with known sentiments.  
   - `train.py` is used to:
     - Import and preprocess the dataset.
     - Convert text to features using techniques like TF-IDF or CountVectorizer.
     - Train a classifier (e.g., Logistic Regression, SVM, or similar) using scikit-learn.
     - Save the trained model for use in the main application.
   - Fine-tuning ensures good generalization and accuracy over a variety of input texts.

2. **Web Application:**
   - Users can input a sentence or paragraph.
   - The app loads the trained model and predicts the sentiment in real-time, displaying the result on the web page.

## ✨ How to Train the Model

> The fine-tuned model is not included in the repo.
>
> **To train locally, run:**
>
> ```bash
> python train.py
> ```
> This will generate the trained model file locally in about 15 minutes (time may vary based on system performance).

## 🏁 How to Run the Project

### 1. Clone the Repository

```bash
git clone https://github.com/RachitMittal-20/Sentiment_Analyser_AI.git
cd Sentiment_Analyser_AI
```

### 2. Install the Dependencies

You should have **Python 3.x** and **Node.js** (if using npm for any JS build steps) installed.

#### For Python back-end (run in your project directory):

```bash
pip install -r requirements.txt
```
Or manually install (if requirements.txt is missing):
```bash
pip install flask scikit-learn pandas numpy
```

#### For JavaScript dependencies:

If you use npm or yarn (optional):

```bash
npm install
# or
yarn install
```

### 3. Train the Sentiment Analysis Model

```bash
python train.py
```

This step produces a serialized model (e.g., `model.pkl`).

### 4. Start the Backend Server

The exact command may depend on your backend framework (e.g., Flask):

```bash
python app.py
# or
flask run
```

### 5. Run the Frontend

Usually, open `index.html` in your browser directly.

Or if a build step is needed (in case of advanced JS setup):

```bash
npm start
```
(or describe here if a custom script is used)

### Alternate Ways to Start

- **Single-click:** Run everything via a launch script if provided (e.g. `run.sh` or `start.bat`).
- **Docker (if supported):** (describe Docker usage here if you have a Dockerfile)

---

## 💡 Troubleshooting

- If you see errors about a missing model, ensure you've run `python train.py` first.
- If ports conflict, change the port in `app.py` or your server config.
- For Python dependencies, use a virtual environment:
  ```bash
  python -m venv venv
  source venv/bin/activate  # On Windows use venv\Scripts\activate
  ```

## 🤝 Contributing

Pull requests and stars are welcome! For major changes, please open an issue first to discuss what you’d like to change.

---

## 📄 License

MIT License

---

*Analyse and understand sentiments in text with ease!*
