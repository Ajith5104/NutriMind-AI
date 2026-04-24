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
        <div className="reveal">
            <div className="bg-mesh"></div>
            
            <div className="container-custom py-5">
                <div className="text-center mb-5">
                    <h1 className="hero-title mb-2">Fitness <span className="gradient-text">Tools</span></h1>
                    <p className="text-secondary">Scientific calculators to track your physiological markers</p>
                </div>
                
                <div className="row g-4">
                    <div className="col-lg-6 reveal reveal-delay-1">
                        <div className="glass-card p-4 h-100">
                            <h3 className="mb-4 text-primary">BMI Calculator</h3>
                            <form onSubmit={calculateBMI}>
                                <div className="mb-3">
                                    <label className="form-label text-secondary small">Weight (kg)</label>
                                    <input type="number" className="modern-input" value={weight} onChange={(e) => setWeight(e.target.value)} required min="20" />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label text-secondary small">Height (cm)</label>
                                    <input type="number" className="modern-input" value={height} onChange={(e) => setHeight(e.target.value)} required min="50" />
                                </div>
                                <button type="submit" className="modern-btn w-100 mb-4 justify-content-center">Calculate BMI</button>
                            </form>

                            {bmi && (
                                <div className="p-3 text-center rounded-4 border border-primary bg-mesh">
                                    <h4 className="mb-1">Your BMI: <span className="gradient-text fs-3">{bmi}</span></h4>
                                    <p className={`mb-0 fw-bold ${bmiStatus === 'Normal Weight' ? 'text-success' : 'text-warning'}`}>{bmiStatus}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-lg-6 reveal reveal-delay-2">
                        <div className="glass-card p-4 h-100">
                            <h3 className="mb-4 text-primary">Calorie Calculator (TDEE)</h3>
                            <form onSubmit={calculateCalories}>
                                <div className="row">
                                    <div className="col-6 mb-3">
                                        <label className="form-label text-secondary small">Age</label>
                                        <input type="number" className="modern-input" value={age} onChange={(e) => setAge(e.target.value)} required min="10" />
                                    </div>
                                    <div className="col-6 mb-3">
                                        <label className="form-label text-secondary small">Gender</label>
                                        <select className="modern-select" value={gender} onChange={(e) => setGender(e.target.value)} required>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6 mb-3">
                                        <label className="form-label text-secondary small">Weight (kg)</label>
                                        <input type="number" className="modern-input" value={cWeight} onChange={(e) => setCWeight(e.target.value)} required min="20" />
                                    </div>
                                    <div className="col-6 mb-3">
                                        <label className="form-label text-secondary small">Height (cm)</label>
                                        <input type="number" className="modern-input" value={cHeight} onChange={(e) => setCHeight(e.target.value)} required min="50" />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label text-secondary small">Activity Level</label>
                                    <select className="modern-select" value={activity} onChange={(e) => setActivity(Number(e.target.value))} required>
                                        <option value={1.2}>Sedentary (Little Exercise)</option>
                                        <option value={1.375}>Light (1-3x week)</option>
                                        <option value={1.55}>Moderate (4-5x week)</option>
                                        <option value={1.725}>Active (Daily)</option>
                                        <option value={1.9}>Very Active (Athlete)</option>
                                    </select>
                                </div>
                                <button type="submit" className="modern-btn w-100 mb-4 justify-content-center">Calculate Calories</button>
                            </form>

                            {tdee && (
                                <div className="p-3 text-center rounded-4 border border-success bg-mesh">
                                    <h4 className="mb-1">Maintenance: <span className="text-success fs-3">{tdee} KCAL</span></h4>
                                    <p className="mb-0 text-secondary small">To lose weight: subtract 500 kcal | To gain: add 500 kcal</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calculators;

