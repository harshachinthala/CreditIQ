// ===== Utility Functions =====
function scrollToCalculator() {
    document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' });
}

// ===== Sample Data =====
function loadSampleData() {
    const sampleData = {
        'P_2_last': 0.85,
        'B_1_last': 1.12,
        'B_9_last': 7.42,
        'D_45_sum': 0.73,
        'B_2_last': 0.98,
        'R_1_last': 0.45,
        'B_2_sum': 0.74,
        'D_44_mean': 0.63,
        'D_43_sum': 0.68,
        'S_3_mean': 0.92
    };

    for (const [key, value] of Object.entries(sampleData)) {
        const input = document.getElementById(key);
        if (input) {
            input.value = value;
            // Add animation
            input.style.background = 'rgba(0, 242, 254, 0.1)';
            setTimeout(() => {
                input.style.background = 'rgba(255, 255, 255, 0.03)';
            }, 500);
        }
    }
}

// ===== Prediction Form =====
document.getElementById('prediction-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.getElementById('predict-btn');
    const btnText = btn.querySelector('.btn-text');
    const btnLoader = btn.querySelector('.btn-loader');

    // Show loading state
    btnText.style.display = 'none';
    btnLoader.style.display = 'block';
    btn.disabled = true;

    // Collect form data
    const features = {};
    const inputs = e.target.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        if (input.value) {
            features[input.id] = parseFloat(input.value);
        }
    });

    try {
        // Make API call
        const response = await fetch('/api/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ features })
        });

        const data = await response.json();

        if (data.success) {
            displayPrediction(data);
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        alert('Error making prediction: ' + error.message);
    } finally {
        // Reset button
        btnText.style.display = 'block';
        btnLoader.style.display = 'none';
        btn.disabled = false;
    }
});

// ===== Display Prediction =====
function displayPrediction(data) {
    const placeholder = document.getElementById('result-placeholder');
    const content = document.getElementById('result-content');

    // Hide placeholder, show content
    placeholder.style.display = 'none';
    content.style.display = 'block';

    // Update probability
    const probability = (data.probability * 100).toFixed(1);
    document.getElementById('probability-value').textContent = probability + '%';

    // Update progress bar
    const fill = document.getElementById('probability-fill');
    fill.style.width = probability + '%';

    // Update risk badge
    const riskBadge = document.getElementById('risk-badge');
    const riskIndicator = riskBadge.querySelector('.risk-indicator');
    const riskText = document.getElementById('risk-text');

    riskText.textContent = data.risk_level;
    riskIndicator.style.background = data.risk_color;
    riskIndicator.style.boxShadow = `0 0 12px ${data.risk_color}`;

    // Update features count
    document.getElementById('features-count').textContent = data.features_used + '+';

    // Scroll to result
    content.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ===== Feature Importance Chart =====
let featureChart = null;

async function loadFeatureImportance() {
    try {
        const response = await fetch('/api/feature-importance');
        const data = await response.json();

        if (data.success) {
            createFeatureChart(data.top_features);
        }
    } catch (error) {
        console.error('Error loading feature importance:', error);
    }
}

function createFeatureChart(features) {
    const ctx = document.getElementById('featureImportanceChart');

    // Prepare data
    const labels = features.map(f => f.feature);
    const values = features.map(f => f.importance);

    // Create gradient colors (red for increase risk, green for decrease)
    const colors = values.map((val, idx) => {
        // Top features increase risk (red), others decrease (green)
        if (idx < 5) {
            return 'rgba(239, 68, 68, 0.8)'; // Red
        } else {
            return 'rgba(16, 185, 129, 0.8)'; // Green
        }
    });

    if (featureChart) {
        featureChart.destroy();
    }

    featureChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Feature Importance',
                data: values,
                backgroundColor: colors,
                borderColor: colors.map(c => c.replace('0.8', '1')),
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleColor: '#ffffff',
                    bodyColor: '#a0a0a0',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    callbacks: {
                        label: function (context) {
                            return 'Importance: ' + (context.parsed.x * 100).toFixed(2) + '%';
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#a0a0a0',
                        callback: function (value) {
                            return (value * 100).toFixed(1) + '%';
                        }
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#ffffff',
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                }
            }
        }
    });
}

// ===== Initialize on Page Load =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 CreditIQ initialized');

    // Load feature importance chart
    loadFeatureImportance();

    // Add smooth scroll to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Add entrance animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.glass-card, .category-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus on calculator
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        scrollToCalculator();
        document.getElementById('P_2_last').focus();
    }
});
