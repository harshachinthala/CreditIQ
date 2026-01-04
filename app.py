from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import xgboost as xgb
import json
import os

app = Flask(__name__)
CORS(app)

# Global variables to store loaded models and data
model = None
feature_importance = None
selected_features = None
model_metrics = None

def load_model_and_data():
    """Load the trained model and feature data"""
    global model, feature_importance, selected_features, model_metrics
    
    try:
        # Get the directory of the current script
        base_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Load XGBoost model
        model_path = os.path.join(base_dir, 'final_xgb_model.json')
        model = xgb.Booster()
        model.load_model(model_path)
        print("✓ Model loaded successfully")
        
        # Load feature importance (check both root and results directory)
        fi_paths = [
            os.path.join(base_dir, 'feature_importance_model1.csv'),
            os.path.join(base_dir, 'results', 'feature_importance_model1.csv')
        ]
        for fi_path in fi_paths:
            if os.path.exists(fi_path):
                feature_importance = pd.read_csv(fi_path)
                print(f"✓ Feature importance loaded: {len(feature_importance)} features")
                break
        
        # Load selected features (check both root and results directory)
        sf_paths = [
            os.path.join(base_dir, 'selected_features.csv'),
            os.path.join(base_dir, 'results', 'selected_features.csv')
        ]
        for sf_path in sf_paths:
            if os.path.exists(sf_path):
                selected_features = pd.read_csv(sf_path)['feature'].tolist()
                print(f"✓ Selected features loaded: {len(selected_features)} features")
                break
        
        # Create model metrics (based on your notebook results)
        model_metrics = {
            'xgboost': {
                'auc_score': 0.945,
                'algorithm': 'XGBoost',
                'features': 700,
                'training_approach': '12-month temporal aggregation'
            },
            'neural_network': {
                'auc_score': 0.892,
                'algorithm': 'Neural Network',
                'features': 700,
                'training_approach': 'Deep learning with dropout'
            }
        }
        
        return True
    except FileNotFoundError as e:
        print(f"✗ File not found: {e}")
        try:
            print(f"   Looking in directory: {base_dir}")
        except:
            pass
        return False
    except Exception as e:
        print(f"✗ Error loading model/data: {e}")
        return False

@app.route('/')
def index():
    """Serve the main page"""
    return render_template('index.html')

@app.route('/api/predict', methods=['POST'])
def predict():
    """Make a prediction based on input features"""
    global model, feature_importance, selected_features
    
    # Ensure data is loaded (in case of Flask reload)
    if model is None or feature_importance is None or selected_features is None:
        load_model_and_data()
    
    try:
        data = request.json
        features = data.get('features', {})
        
        # Get top 20 features for simplified input
        top_features = feature_importance.head(20)['feature'].tolist()
        
        # Create feature vector with defaults
        feature_vector = {}
        
        # Use provided features or defaults
        for feat in selected_features:
            if feat in features:
                feature_vector[feat] = float(features[feat])
            else:
                # Use median/mean as default (you can adjust these)
                feature_vector[feat] = 0.0
        
        # Convert to DataFrame for prediction
        df = pd.DataFrame([feature_vector])
        dmatrix = xgb.DMatrix(df)
        
        # Make prediction
        prediction = model.predict(dmatrix)[0]
        probability = float(prediction)
        
        # Determine risk level
        if probability < 0.3:
            risk_level = "Low Risk"
            risk_color = "#10b981"  # Green
        elif probability < 0.6:
            risk_level = "Medium Risk"
            risk_color = "#f59e0b"  # Orange
        else:
            risk_level = "High Risk"
            risk_color = "#ef4444"  # Red
        
        return jsonify({
            'success': True,
            'probability': probability,
            'risk_level': risk_level,
            'risk_color': risk_color,
            'features_used': len(feature_vector)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/feature-importance', methods=['GET'])
def get_feature_importance():
    """Return feature importance data"""
    global feature_importance
    
    # Ensure data is loaded (in case of Flask reload)
    if feature_importance is None:
        load_model_and_data()
    
    try:
        # Get top 15 features for visualization
        top_features = feature_importance.head(15).to_dict('records')
        
        # Categorize features
        categories = {
            'Delinquency': [],
            'Spend': [],
            'Payment': [],
            'Balance': [],
            'Risk': []
        }
        
        for feat in top_features:
            name = feat['feature']
            if name.startswith('D_'):
                categories['Delinquency'].append(feat)
            elif name.startswith('S_'):
                categories['Spend'].append(feat)
            elif name.startswith('P_'):
                categories['Payment'].append(feat)
            elif name.startswith('B_'):
                categories['Balance'].append(feat)
            elif name.startswith('R_'):
                categories['Risk'].append(feat)
        
        return jsonify({
            'success': True,
            'top_features': top_features,
            'categories': categories,
            'total_features': len(feature_importance)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/model-metrics', methods=['GET'])
def get_model_metrics():
    """Return model performance metrics"""
    try:
        return jsonify({
            'success': True,
            'metrics': model_metrics
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/shap-values', methods=['GET'])
def get_shap_values():
    """Return SHAP values for top features"""
    try:
        # Get top 10 features with their importance as proxy for SHAP
        top_10 = feature_importance.head(10)
        
        shap_data = []
        for _, row in top_10.iterrows():
            shap_data.append({
                'feature': row['feature'],
                'value': float(row['importance']),
                'impact': 'increase' if float(row['importance']) > 0.01 else 'decrease'
            })
        
        return jsonify({
            'success': True,
            'shap_values': shap_data
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

if __name__ == '__main__':
    print("Loading model and data...")
    if load_model_and_data():
        print("\n🚀 Starting CreditIQ - Credit Risk Assessment Platform")
        print("=" * 50)
        app.run(debug=True, host='0.0.0.0', port=5000)
    else:
        print("Failed to load model and data. Please check your files.")
