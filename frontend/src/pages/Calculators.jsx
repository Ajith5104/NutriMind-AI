import React, { useState } from 'react';

const Calculators = () => {
    // BMI
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [bmi, setBmi] = useState(null);
    const [bmiStatus, setBmiStatus] = useState('');

    // BMR / TDEE (Calories)
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('Male');
    const [cWeight, setCWeight] = useState('');
    const [cHeight, setCHeight] = useState('');
    const [activity, setActivity] = useState(1.2);
    const [tdee, setTdee] = useState(null);

    const calculateBMI = (e) => {
        e.preventDefault();
        if (weight > 0 && height > 0) {
            const h = height / 100;
            const b = (weight / (h * h)).toFixed(1);
            setBmi(b);
            if (b < 18.5) setBmiStatus('Underweight');
            else if (b < 24.9) setBmiStatus('Normal Weight');
            else if (b < 29.9) setBmiStatus('Overweight');
            else setBmiStatus('Obese');
        }
    };

    const calculateCalories = (e) => {
        e.preventDefault();
        if (age && cWeight && cHeight) {
            // Mifflin-St Jeor Equation
            let bmr;
            if (gender === 'Male') {
                bmr = 10 * parseFloat(cWeight) + 6.25 * parseFloat(cHeight) - 5 * parseInt(age) + 5;
            } else {
                bmr = 10 * parseFloat(cWeight) + 6.25 * parseFloat(cHeight) - 5 * parseInt(age) - 161;
            }
            const total = Math.round(bmr * activity);
            setTdee(total);
        }
    };

    return (
        <div className="fade-in">
            <h2 className="text-center mb-4 mb-md-5" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}><span className="gradient-text">Fitness Calculators</span></h2>
            
            <div className="row g-4">
                <div className="col-lg-6">
                    <div className="glass-panel p-4 h-100">
                        <h3 className="mb-4 text-info">BMI Calculator</h3>
                        <form onSubmit={calculateBMI}>
                            <div className="mb-3">
                                <label className="form-label text-secondary">Weight (kg)</label>
                                <input type="number" className="modern-input" value={weight} onChange={(e) => setWeight(e.target.value)} required min="20" />
                            </div>
                            <div className="mb-4">
                                <label className="form-label text-secondary">Height (cm)</label>
                                <input type="number" className="modern-input" value={height} onChange={(e) => setHeight(e.target.value)} required min="50" />
                            </div>
                            <button type="submit" className="modern-btn w-100 mb-4 text-center d-block">Calculate BMI</button>
                        </form>

                        {bmi && (
                            <div className="p-3 text-center" style={{ background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                                <h4 className="mb-1">Your BMI: <span className="text-primary fs-3">{bmi}</span></h4>
                                <p className={`mb-0 fw-bold ${bmiStatus === 'Normal Weight' ? 'text-success' : 'text-warning'}`}>{bmiStatus}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="glass-panel p-4 h-100">
                        <h3 className="mb-4 text-info">Daily Calorie Calculator (TDEE)</h3>
                        <form onSubmit={calculateCalories}>
                            <div className="row">
                                <div className="col-6 mb-3">
                                    <label className="form-label text-secondary">Age</label>
                                    <input type="number" className="modern-input" value={age} onChange={(e) => setAge(e.target.value)} required min="10" />
                                </div>
                                <div className="col-6 mb-3">
                                    <label className="form-label text-secondary">Gender</label>
                                    <select className="modern-select" value={gender} onChange={(e) => setGender(e.target.value)} required>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6 mb-3">
                                    <label className="form-label text-secondary">Weight (kg)</label>
                                    <input type="number" className="modern-input" value={cWeight} onChange={(e) => setCWeight(e.target.value)} required min="20" />
                                </div>
                                <div className="col-6 mb-3">
                                    <label className="form-label text-secondary">Height (cm)</label>
                                    <input type="number" className="modern-input" value={cHeight} onChange={(e) => setCHeight(e.target.value)} required min="50" />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="form-label text-secondary">Activity Level</label>
                                <select className="modern-select" value={activity} onChange={(e) => setActivity(Number(e.target.value))} required>
                                    <option value={1.2}>Sedentary (Little/No Exercise)</option>
                                    <option value={1.375}>Light (1-3x a week)</option>
                                    <option value={1.55}>Moderate (4-5x a week)</option>
                                    <option value={1.725}>Active (Daily)</option>
                                    <option value={1.9}>Very Active (Intense)</option>
                                </select>
                            </div>
                            <button type="submit" className="modern-btn w-100 mb-4 text-center d-block">Calculate Calories</button>
                        </form>

                        {tdee && (
                            <div className="p-3 text-center" style={{ background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                                <h4 className="mb-1">Maintenance Calories: <span className="text-success fs-3">{tdee}</span></h4>
                                <p className="mb-0 text-secondary" style={{ fontSize: '0.9rem' }}>To lose weight: subtract 500 kcal | To gain weight: add 500 kcal</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calculators;
