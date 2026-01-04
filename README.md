---
title: CreditIQ
emoji: 🎯
colorFrom: blue
colorTo: purple
sdk: docker
pinned: false
license: mit
---

# CreditIQ - Credit Risk Assessment Platform

A premium web application for credit default prediction using machine learning.

## Features

- 🎯 **Risk Calculator** - Interactive prediction with top financial features
- 📊 **Feature Analysis** - SHAP visualizations and feature importance
- 📈 **High Accuracy** - XGBoost model with 94.5% AUC score
- 🎨 **Premium UI** - Dark theme with glassmorphism effects
- 📱 **Responsive** - Works on all devices

## Model Details

- **Algorithm**: XGBoost
- **AUC Score**: 0.945
- **Features**: 700+ engineered features
- **Dataset**: Amex Kaggle (anonymized)
- **Training**: 12-month temporal aggregation

## How to Use

1. Navigate to the **Risk Calculator** section
2. Click "Load Sample Data" to populate the form
3. Or manually enter normalized feature values
4. Click "Calculate Risk" to get prediction
5. View default probability and risk level (Low/Medium/High)

## Technology Stack

- **Backend**: Flask + XGBoost
- **Frontend**: HTML/CSS/JavaScript + Chart.js
- **Deployment**: Docker on Hugging Face Spaces

## Links

- [GitHub Repository](https://github.com/YOUR_USERNAME/creditiq)
- [Documentation](https://github.com/YOUR_USERNAME/creditiq/blob/main/README_WEB.md)

---

Built with ❤️ using XGBoost, Flask, and premium web design
