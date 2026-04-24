import React, { useState } from 'react';
import './IntakeForm.css';

const IntakeForm = ({ onSubmit, loading }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1: Basic
        fullName: '',
        age: '',
        gender: 'male',
        height: '',
        weight: '',
        bodyFatPercentage: '',
        
        // Step 2: Goals
        fitnessGoal: 'muscle_gain',
        targetWeight: '',
        priority: 'health',
        
        // Step 3: Activity
        workoutType: [],
        activityLevel: 'moderate',
        workoutLevel: 'intermediate',
        
        // Step 4: Medical
        healthConditions: [],
        injuries: '',
        digestiveIssues: '',
        foodAllergies: [],
        
        // Step 5: Food
        dietaryPreference: 'non-vegetarian',
        countryRegion: 'India'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleCheckbox = (field, value) => {
        setFormData(prev => {
            const current = prev[field] || [];
            const updated = current.includes(value)
                ? current.filter(item => item !== value)
                : [...current, value];
            return { ...prev, [field]: updated };
        });
    };

    const nextStep = () => {
        if (validateStep()) {
            setStep(prev => prev + 1);
        }
    };

    const prevStep = () => setStep(prev => prev - 1);

    const validateStep = () => {
        if (step === 1) {
            return formData.fullName && formData.age && formData.height && formData.weight;
        }
        if (step === 2) {
            return formData.fitnessGoal && formData.targetWeight && formData.priority;
        }
        if (step === 3) {
            return formData.activityLevel && formData.workoutLevel;
        }
        if (step === 5) {
            return formData.dietaryPreference;
        }
        return true;
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="step-content">
                        <h4 className="mb-4">Step 1: Basic Information 👤</h4>
                        <div className="mb-3">
                            <label className="form-label">Full Name</label>
                            <input type="text" name="fullName" className="modern-input" value={formData.fullName} onChange={handleInputChange} placeholder="Enter your full name" required />
                        </div>
                        <div className="grid-2">
                            <div>
                                <label className="form-label">Age</label>
                                <input type="number" name="age" className="modern-input" value={formData.age} onChange={handleInputChange} placeholder="Years" required />
                            </div>
                            <div>
                                <label className="form-label">Gender</label>
                                <select name="gender" className="modern-select" value={formData.gender} onChange={handleInputChange}>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid-2">
                            <div>
                                <label className="form-label">Height (cm)</label>
                                <input type="number" name="height" className="modern-input" value={formData.height} onChange={handleInputChange} placeholder="cm" required />
                            </div>
                            <div>
                                <label className="form-label">Weight (kg)</label>
                                <input type="number" name="weight" className="modern-input" value={formData.weight} onChange={handleInputChange} placeholder="kg" required />
                            </div>
                        </div>
                        <div>
                            <label className="form-label">Body Fat % (Optional)</label>
                            <input type="number" name="bodyFatPercentage" className="modern-input" value={formData.bodyFatPercentage} onChange={handleInputChange} placeholder="%" />
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="step-content">
                        <h4 className="mb-4">Step 2: Fitness Goals 🎯</h4>
                        <div className="mb-3">
                            <label className="form-label">Primary Goal</label>
                            <select name="fitnessGoal" className="modern-select" value={formData.fitnessGoal} onChange={handleInputChange}>
                                <option value="fat_loss">Fat Loss</option>
                                <option value="muscle_gain">Muscle Gain</option>
                                <option value="recomposition">Recomposition</option>
                                <option value="general_fitness">General Fitness</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Target Weight (kg)</label>
                            <input type="number" name="targetWeight" className="modern-input" value={formData.targetWeight} onChange={handleInputChange} placeholder="kg"/>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Priority</label>
                            <select name="priority" className="modern-select" value={formData.priority} onChange={handleInputChange}>
                                <option value="aesthetics">Aesthetics</option>
                                <option value="strength">Strength</option>
                                <option value="health">Health</option>
                                <option value="performance">Performance</option>
                            </select>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="step-content">
                        <h4 className="mb-4">Step 3: Activity & Training ⚡</h4>
                        <label className="form-label">Workout Type</label>
                        <div className="checkbox-group">
                            {['Gym', 'Home Workout', 'Sports'].map(type => (
                                <div key={type} className={`checkbox-item ${formData.workoutType.includes(type) ? 'selected' : ''}`} onClick={() => toggleCheckbox('workoutType', type)}>
                                    {type}
                                </div>
                            ))}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Workout Frequency</label>
                            <select name="activityLevel" className="modern-select" value={formData.activityLevel} onChange={handleInputChange}>
                                <option value="sedentary">3 Days/Week</option>
                                <option value="moderate">6 Days/Week</option>
                                <option value="very_active">Daily</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Workout Level</label>
                            <select name="workoutLevel" className="modern-select" value={formData.workoutLevel} onChange={handleInputChange}>
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="step-content">
                        <h4 className="mb-4">Step 4: Medical Information 🏥</h4>
                        <label className="form-label">Existing Conditions</label>
                        <div className="checkbox-group">
                            {['Diabetes', 'Thyroid', 'PCOS/PCOD', 'Hypertension', 'None'].map(cond => (
                                <div key={cond} className={`checkbox-item ${formData.healthConditions.includes(cond) ? 'selected' : ''}`} onClick={() => toggleCheckbox('healthConditions', cond)}>
                                    {cond}
                                </div>
                            ))}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Injuries (Optional)</label>
                            <input type="text" name="injuries" className="modern-input" value={formData.injuries} onChange={handleInputChange} placeholder="Any current injuries?" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Digestive Issues (Optional)</label>
                            <input type="text" name="digestiveIssues" className="modern-input" value={formData.digestiveIssues} onChange={handleInputChange} placeholder="Bloating, acid reflux, etc." />
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="step-content">
                        <h4 className="mb-4">Step 5: Food Preferences 🥗</h4>
                        <div className="mb-3">
                            <label className="form-label">Diet Type</label>
                            <select name="dietaryPreference" className="modern-select" value={formData.dietaryPreference} onChange={handleInputChange}>
                                <option value="vegetarian">Vegetarian</option>
                                <option value="non-vegetarian">Non-Vegetarian</option>
                                <option value="vegan">Vegan</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Country</label>
                            <input type="text" name="countryRegion" className="modern-input" value={formData.countryRegion} onChange={handleInputChange} placeholder="Enter your country" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Food Allergies (Optional)</label>
                            <input type="text" name="foodAllergies" className="modern-input" value={formData.foodAllergies} onChange={handleInputChange} placeholder="e.g. Nuts, Dairy" />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="intake-container">
            <div className="intake-wizard-card">
                <div className="step-indicator">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className={`step-dot ${step === i ? 'active' : ''} ${step > i ? 'completed' : ''}`}>
                            {step > i ? '✓' : i}
                        </div>
                    ))}
                </div>

                <div className="wizard-body">
                    {renderStep()}
                </div>

                <div className="wizard-footer">
                    {step > 1 ? (
                        <button className="nav-btn-back" onClick={prevStep}>Back</button>
                    ) : (
                        <div />
                    )}
                    {step < 5 ? (
                        <button className="nav-btn-next" onClick={nextStep} disabled={!validateStep()}>Next</button>
                    ) : (
                        <button className="nav-btn-next" onClick={() => onSubmit(formData)} disabled={loading || !validateStep()}>
                            {loading ? 'Generating...' : 'Generate My Plan'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IntakeForm;
