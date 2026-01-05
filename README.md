# CreditIQ - Credit Risk Assessment Platform 🎯

Demo Link: https://harshachinthala-creditiq.hf.space/

A premium web application for credit default prediction using machine learning. Built with Flask, XGBoost, and a stunning dark-themed UI.

![Python](https://img.shields.io/badge/Python-3.9+-blue)
![XGBoost](https://img.shields.io/badge/XGBoost-94.5%25%20AUC-brightgreen)
![TensorFlow](https://img.shields.io/badge/TensorFlow-orange?logo=tensorflow&logoColor=white)
![Neural Networks](https://img.shields.io/badge/Neural%20Networks-blue)
![Flask](https://img.shields.io/badge/Flask-black?logo=flask&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-red?logo=chart.js&logoColor=white)

## ✨ Features

- **🎯 Risk Calculator**: Interactive form to predict credit default probability
- **📊 Feature Analysis**: Visualizations of SHAP values and feature importance
- **📈 Model Performance**: Metrics dashboard comparing XGBoost vs Neural Network
- **🎨 Premium Design**: Dark theme with glassmorphism, gradients, and smooth animations
- **📱 Responsive**: Works beautifully on desktop, tablet, and mobile


## Data Access

Download the data from
https://www.kaggle.com/competitions/amex-default-prediction/data
We will work with “train_data.csv” and “train_labels.csv”. “train_labels.csv” shows default status of customers as of April 2018 (target variable). “train_data.csv” shows their activity in the last 13 months (April 2017 to April 2018). These characteristics will be used to define independent variables. 



## 🚀 Quick Start

### Prerequisites

- Python 3.9 or higher
- macOS (for Apple Silicon optimizations) or Linux/Windows

### Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd /Users/harshachinthala/Documents/ML_project
   ```

2. **Create a virtual environment** (recommended):
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

### Running Locally

1. **Start the Flask server**:
   ```bash
   python app.py
   ```

2. **Open your browser** and navigate to:
   ```
   http://localhost:5000
   ```

3. **Try the Risk Calculator**:
   - Click "Load Sample Data" to populate the form with example values
   - Or manually enter normalized feature values (ranges shown in placeholders)
   - Click "Calculate Risk" to see the prediction

## 📁 Project Structure

```
ML_project/
├── app.py                          # Flask backend application
├── templates/
│   └── index.html                  # Main HTML page
├── static/
│   ├── css/
│   │   └── style.css              # Premium dark-themed styles
│   └── js/
│       └── main.js                # JavaScript for interactivity
├── final_xgb_model.json           # Trained XGBoost model
├── feature_importance_model1.csv  # Feature importance data
├── selected_features.csv          # Selected features list
├── requirements.txt               # Python dependencies
├── Procfile                       # For deployment
└── README_WEB.md                  # This file
```

## 🎨 UI Highlights

### Dark Theme with Glassmorphism
- Deep black backgrounds (#0a0a0a, #1a1a1a)
- Semi-transparent glass cards with backdrop blur
- Vibrant gradient accents (cyan to purple)
- Smooth animations and transitions

### Interactive Components
- **Risk Calculator**: Real-time prediction with animated probability gauge
- **Feature Importance Chart**: Horizontal bar chart with Chart.js
- **Category Cards**: 5 feature categories with gradient icons
- **Responsive Design**: Mobile-first approach with breakpoints

## 🔧 API Endpoints

### `POST /api/predict`
Predict credit default probability.

**Request**:
```json
{
  "features": {
    "P_2_last": 0.85,
    "B_1_last": 1.12,
    "B_9_last": 7.42,
    ...
  }
}
```

**Response**:
```json
{
  "success": true,
  "probability": 0.234,
  "risk_level": "Low Risk",
  "risk_color": "#10b981",
  "features_used": 700
}
```

### `GET /api/feature-importance`
Get feature importance data.

**Response**:
```json
{
  "success": true,
  "top_features": [...],
  "categories": {...},
  "total_features": 974
}
```

### `GET /api/model-metrics`
Get model performance metrics.

**Response**:
```json
{
  "success": true,
  "metrics": {
    "xgboost": {
      "auc_score": 0.945,
      "algorithm": "XGBoost"
    },
    "neural_network": {
      "auc_score": 0.892,
      "algorithm": "Neural Network"
    }
  }
}
```

## 🌐 Deployment

### Deploy to Render (Free)

1. **Create a new Web Service** on [Render](https://render.com)
2. **Connect your GitHub repository**
3. **Configure**:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`
4. **Deploy!**

### Deploy to Railway (Free)

1. **Create a new project** on [Railway](https://railway.app)
2. **Deploy from GitHub**
3. Railway will auto-detect the Procfile and deploy

### Deploy to Hugging Face Spaces

1. **Create a new Space** on [Hugging Face](https://huggingface.co/spaces)
2. **Choose "Gradio" SDK** (or convert to Gradio)
3. **Upload files** and deploy

## 📊 Model Information

### XGBoost Model
- **AUC Score**: 0.945
- **Features**: 700+ engineered features
- **Approach**: 12-month temporal aggregation
- **Training Data**: Amex Kaggle dataset (anonymized)

### Neural Network Model
- **AUC Score**: 0.892
- **Architecture**: Deep learning with dropout
- **Features**: Same 700+ features as XGBoost

### Feature Categories
- **D**: Delinquency indicators
- **S**: Spend patterns
- **P**: Payment history
- **B**: Balance amounts
- **R**: Risk signals

## 🛠️ Development

### Adding New Features

1. **Backend** (`app.py`): Add new API endpoints
2. **Frontend** (`templates/index.html`): Add new sections
3. **Styling** (`static/css/style.css`): Add new styles
4. **JavaScript** (`static/js/main.js`): Add new interactivity

### Customization

- **Colors**: Edit CSS variables in `style.css`
- **Fonts**: Change Google Fonts import in `index.html`
- **Charts**: Modify Chart.js configuration in `main.js`

## 📝 License

This project is for educational purposes. The dataset is from the Amex Kaggle competition and follows their privacy guidelines.

## Acknowledgments

- **Dataset**: American Express - Default Prediction (Kaggle)
- **Design Inspiration**: Modern fintech platforms
- **Libraries**: Flask, XGBoost, Chart.js, TensorFlow

---
