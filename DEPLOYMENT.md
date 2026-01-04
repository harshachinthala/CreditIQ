# CreditIQ Deployment Guide

## Why Render Instead of Netlify?

**Netlify** is designed for static websites (HTML/CSS/JS only), while **CreditIQ** is a Flask application (Python backend + frontend).

**Render** is the best free alternative because:
- ✅ Supports Python/Flask applications
- ✅ Free tier available
- ✅ Auto-deploys from GitHub
- ✅ Built-in SSL certificates
- ✅ Similar to Netlify's ease of use

---

## Option 1: Deploy to Render (Recommended - FREE)

### Step 1: Create GitHub Repository

```bash
cd /Users/harshachinthala/Documents/ML_project

# Initialize git (if not already)
git init

# Create .gitignore
cat > .gitignore << 'EOF'
__pycache__/
*.pyc
.venv/
venv/
.DS_Store
*.ipynb_checkpoints/
train_data.csv
train_labels.csv
train_data_*.csv
test1_data_*.csv
test2_data_*.csv
*.keras
.env
EOF

# Add all files
git add .

# Commit
git commit -m "Initial commit - CreditIQ application"

# Create repo on GitHub and push
# (You'll need to create the repo on GitHub first)
git remote add origin https://github.com/YOUR_USERNAME/creditiq.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Render

1. **Go to** [https://render.com](https://render.com)
2. **Sign up/Login** with GitHub
3. **Click** "New +" → "Web Service"
4. **Connect** your GitHub repository
5. **Configure**:
   - **Name**: `creditiq`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Instance Type**: `Free`
6. **Click** "Create Web Service"

### Step 3: Wait for Deployment

Render will:
- Install dependencies
- Start the Flask app
- Provide a URL like: `https://creditiq.onrender.com`

**Note**: Free tier may spin down after inactivity (takes ~30s to wake up on first request)

---

## Option 2: Deploy to Railway (Also FREE)

### Steps:

1. **Go to** [https://railway.app](https://railway.app)
2. **Sign up** with GitHub
3. **Click** "New Project" → "Deploy from GitHub repo"
4. **Select** your repository
5. **Railway auto-detects** the Procfile and deploys
6. **Get URL** from the deployment dashboard

---

## Option 3: Deploy to Hugging Face Spaces (FREE)

### Convert to Gradio App:

```python
# Create app_gradio.py
import gradio as gr
import pandas as pd
import xgboost as xgb

# Load model
model = xgb.Booster()
model.load_model('final_xgb_model.json')

def predict_risk(P_2_last, B_1_last, B_9_last, D_45_sum, B_2_last, 
                 R_1_last, B_2_sum, D_44_mean, D_43_sum, S_3_mean):
    features = {
        'P_2_last': P_2_last,
        'B_1_last': B_1_last,
        # ... add all features
    }
    df = pd.DataFrame([features])
    dmatrix = xgb.DMatrix(df)
    prob = model.predict(dmatrix)[0]
    
    if prob < 0.3:
        risk = "Low Risk 🟢"
    elif prob < 0.6:
        risk = "Medium Risk 🟡"
    else:
        risk = "High Risk 🔴"
    
    return f"{prob*100:.1f}%", risk

# Create Gradio interface
demo = gr.Interface(
    fn=predict_risk,
    inputs=[
        gr.Number(label="P_2_last", value=0.85),
        gr.Number(label="B_1_last", value=1.12),
        # ... add all inputs
    ],
    outputs=[
        gr.Textbox(label="Default Probability"),
        gr.Textbox(label="Risk Level")
    ],
    title="CreditIQ - Credit Risk Assessment",
    description="Predict credit default probability using XGBoost (94.5% AUC)"
)

demo.launch()
```

Then upload to Hugging Face Spaces.

---

## Important Files for Deployment

### ✅ Already Created:
- `requirements.txt` - Python dependencies
- `Procfile` - Deployment configuration
- `app.py` - Flask application
- `README_WEB.md` - Documentation

### ⚠️ Large Files to Exclude:

The following files are too large for Git (use `.gitignore`):
- `train_data.csv` (16 GB)
- `train_labels.csv` (30 MB)
- `train_data_*.csv` (large training files)

**The model files we NEED**:
- `final_xgb_model.json` (657 KB) ✅
- `results/feature_importance_model1.csv` (21 KB) ✅
- `results/selected_features.csv` (201 bytes) ✅

---

## Testing Deployment Locally

Before deploying, test with production server:

```bash
# Install gunicorn
pip install gunicorn

# Run with gunicorn (production server)
gunicorn app:app --bind 0.0.0.0:5001

# Test at http://localhost:5001
```

---

## Post-Deployment

Once deployed, you'll get a URL like:
- **Render**: `https://creditiq.onrender.com`
- **Railway**: `https://creditiq-production.up.railway.app`
- **Hugging Face**: `https://huggingface.co/spaces/YOUR_USERNAME/creditiq`

Share this URL to let others use your credit risk assessment platform!

---

## Troubleshooting

### Issue: "Module not found"
**Solution**: Make sure `requirements.txt` includes all dependencies

### Issue: "Application failed to start"
**Solution**: Check that `Procfile` has: `web: gunicorn app:app`

### Issue: "Port already in use"
**Solution**: Render/Railway handle ports automatically, don't specify port in `app.py`

### Issue: "Files too large"
**Solution**: Use `.gitignore` to exclude training data files

---

## Next Steps

1. Create GitHub repository
2. Push code to GitHub
3. Deploy to Render (easiest)
4. Get your live URL
5. Share with the world! 🚀
