import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.js';

const ProfileSetup = () => {
    const { user, updateProfile } = useContext(AuthContext);
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        age: user?.age || '',
        gender: user?.gender || '',
        height: user?.height || '',
        weight: user?.weight || '',
        bodyFatPercentage: user?.bodyFatPercentage || '',
        activityLevel: user?.activityLevel || '',
        fitnessGoal: user?.fitnessGoal || '',
        workoutTiming: user?.workoutTiming || '',
        dietaryPreference: user?.dietaryPreference || '',
        healthConditions: user?.healthConditions?.join(', ') || '',
        foodAllergies: user?.foodAllergies?.join(', ') || '',
        countryRegion: user?.countryRegion || ''
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelect = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const submitData = {
                ...formData,
                age: Number(formData.age),
                height: Number(formData.height),
                weight: Number(formData.weight),
                bodyFatPercentage: formData.bodyFatPercentage ? Number(formData.bodyFatPercentage) : undefined,
                healthConditions: formData.healthConditions ? formData.healthConditions.split(',').map(s => s.trim()).filter(Boolean) : [],
                foodAllergies: formData.foodAllergies ? formData.foodAllergies.split(',').map(s => s.trim()).filter(Boolean) : [],
            };
            
            await updateProfile(submitData);
            setSuccess(true);
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in py-5 min-vh-100 d-flex align-items-center">
            <div className="container" style={{ maxWidth: '800px' }}>
                <div className="setup-card">
                    <div className="text-center mb-5">
                        <h2 className="text-glow mb-2">Personalize Your Plan</h2>
                        <p className="text-secondary">Step {step} of 3 — {step === 1 ? 'Core Metrics' : step === 2 ? 'Goals & Activity' : 'Diet & Health'}</p>
                        
                        <div className="step-indicator">
                            <div className={`step-dot ${step >= 1 ? 'active' : ''}`}></div>
                            <div className={`step-dot ${step >= 2 ? 'active' : ''}`}></div>
                            <div className={`step-dot ${step >= 3 ? 'active' : ''}`}></div>
                        </div>
                    </div>

                    {error && <div className="alert alert-danger border-0 glass-panel mb-4" style={{ color: '#ff6b6b' }}>{error}</div>}
                    {success && <div className="alert alert-success border-0 glass-panel mb-4 text-center" style={{ color: '#10b981' }}>Profile Updated! Getting your diet ready...</div>}

                    <form onSubmit={submitHandler}>
                        {step === 1 && (
                            <div className="fade-in">
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <label className="form-label small text-secondary fw-bold">AGE</label>
                                        <input type="number" name="age" className="modern-input" value={formData.age} onChange={handleChange} placeholder="Years" required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small text-secondary fw-bold">GENDER</label>
                                        <div className="selection-grid">
                                            {['Male', 'Female', 'Other'].map(g => (
                                                <div key={g} className={`select-card ${formData.gender === g ? 'active' : ''}`} onClick={() => handleSelect('gender', g)}>
                                                    <span className="icon">{g === 'Male' ? '👨' : g === 'Female' ? '👩' : '⚧'}</span>
                                                    <div className="small">{g}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small text-secondary fw-bold">HEIGHT (CM)</label>
                                        <input type="number" name="height" className="modern-input" value={formData.height} onChange={handleChange} placeholder="cm" required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small text-secondary fw-bold">WEIGHT (KG)</label>
                                        <input type="number" name="weight" className="modern-input" value={formData.weight} onChange={handleChange} placeholder="kg" required />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label small text-secondary fw-bold">BODY FAT % (OPTIONAL)</label>
                                        <input type="number" name="bodyFatPercentage" className="modern-input" value={formData.bodyFatPercentage} onChange={handleChange} placeholder="Approx %" />
                                    </div>
                                </div>
                                <div className="mt-5 d-flex justify-content-end">
                                    <button type="button" className="modern-btn px-5" onClick={nextStep} disabled={!formData.age || !formData.gender || !formData.height || !formData.weight}>Next</button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="fade-in">
                                <div className="mb-4">
                                    <label className="form-label small text-secondary fw-bold mb-3">ACTIVITY LEVEL</label>
                                    <div className="row g-3">
                                        {[
                                            { id: 'Sedentary', label: 'Sedentary', desc: 'Little/No exercise', icon: '🪑' },
                                            { id: 'Light', label: 'Light', desc: '1-3 days/week', icon: '🚶' },
                                            { id: 'Moderate', label: 'Moderate', desc: '4-5 days/week', icon: '🏃' },
                                            { id: 'Active', label: 'Active', desc: 'Daily intense', icon: '🏋️' }
                                        ].map(a => (
                                            <div key={a.id} className="col-sm-6">
                                                <div className={`select-card h-100 ${formData.activityLevel === a.id ? 'active' : ''}`} onClick={() => handleSelect('activityLevel', a.id)}>
                                                    <span className="icon">{a.icon}</span>
                                                    <div className="fw-bold">{a.label}</div>
                                                    <div className="x-small text-secondary">{a.desc}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label small text-secondary fw-bold mb-3">FITNESS GOAL</label>
                                    <div className="row g-3">
                                        {[
                                            { id: 'Weight Loss', label: 'Fat Loss', icon: '🔥' },
                                            { id: 'Weight Gain', label: 'Weight Gain', icon: '📈' },
                                            { id: 'Muscle Gain', label: 'Muscle Gain', icon: '💪' },
                                            { id: 'Maintenance', label: 'Maintenance', icon: '⚖️' }
                                        ].map(g => (
                                            <div key={g.id} className="col-sm-6">
                                                <div className={`select-card h-100 ${formData.fitnessGoal === g.id ? 'active' : ''}`} onClick={() => handleSelect('fitnessGoal', g.id)}>
                                                    <span className="icon">{g.icon}</span>
                                                    <div className="fw-bold">{g.label}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label small text-secondary fw-bold mb-3">WORKOUT TIMING</label>
                                    <div className="row g-3">
                                        {[
                                            { id: 'AM', label: 'Morning', desc: 'Early workout (AM)', icon: '🌅' },
                                            { id: 'PM', label: 'Evening', desc: 'Late workout (PM)', icon: '🌙' }
                                        ].map(t => (
                                            <div key={t.id} className="col-sm-6">
                                                <div className={`select-card h-100 ${formData.workoutTiming === t.id ? 'active' : ''}`} onClick={() => handleSelect('workoutTiming', t.id)}>
                                                    <span className="icon">{t.icon}</span>
                                                    <div className="fw-bold">{t.label}</div>
                                                    <div className="x-small text-secondary">{t.desc}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-5 d-flex justify-content-between">
                                    <button type="button" className="modern-btn-outline modern-btn" onClick={prevStep}>Back</button>
                                    <button type="button" className="modern-btn px-5" onClick={nextStep} disabled={!formData.activityLevel || !formData.fitnessGoal}>Next</button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="fade-in">
                                <div className="mb-4">
                                    <label className="form-label small text-secondary fw-bold mb-3">DIETARY PREFERENCE</label>
                                    <div className="selection-grid">
                                        {['Veg', 'Non-Veg', 'Vegan'].map(d => (
                                            <div key={d} className={`select-card ${formData.dietaryPreference === d ? 'active' : ''}`} onClick={() => handleSelect('dietaryPreference', d)}>
                                                <span className="icon">{d === 'Veg' ? '🥦' : d === 'Non-Veg' ? '🍗' : '🌿'}</span>
                                                <div className="small">{d}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="row g-4 mb-4">
                                    <div className="col-12">
                                        <label className="form-label small text-secondary fw-bold">COUNTRY </label>
                                        <input type="text" name="countryRegion" className="modern-input" value={formData.countryRegion} onChange={handleChange} placeholder="For local food suggestions" />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label small text-secondary fw-bold">HEALTH CONDITIONS</label>
                                        <input type="text" name="healthConditions" className="modern-input" value={formData.healthConditions} onChange={handleChange} placeholder="e.g. Diabetes, PCOS (comma separated)" />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label small text-secondary fw-bold">FOOD ALLERGIES</label>
                                        <input type="text" name="foodAllergies" className="modern-input" value={formData.foodAllergies} onChange={handleChange} placeholder="e.g. Peanuts, Dairy (comma separated)" />
                                    </div>
                                </div>

                                <div className="mt-5 d-flex justify-content-between">
                                    <button type="button" className="modern-btn-outline modern-btn" onClick={prevStep}>Back</button>
                                    <button type="submit" className="modern-btn px-5" disabled={loading || !formData.dietaryPreference}>
                                        {loading ? 'Finalizing...' : 'Save & Exit'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileSetup;
