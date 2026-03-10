import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext.js';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const DietDashboard = () => {
    const { user } = useContext(AuthContext);
    const [latestPlan, setLatestPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState(null);
    
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const planRef = useRef();

    useEffect(() => {
        fetchPlanHistory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchPlanHistory = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
            const { data } = await axios.get(`${API_URL}/api/diet/history`, config);
            if (data && data.length > 0) {
                setLatestPlan(data[0]);
            }
        } catch {
            setError('Failed to fetch diet history.');
        } finally {
            setLoading(false);
        }
    };

    const generateNewPlan = async () => {
        setGenerating(true);
        setError(null);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
            const { data } = await axios.post(`${API_URL}/api/diet/generate`, {}, config);
            setLatestPlan(data);
            setSelectedDayIndex(0);
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            if (msg.includes('Profile incomplete')) {
                setError('Your profile is incomplete. Please update it in the Profile tab first.');
            } else if (msg.includes('insufficient_quota') || msg.includes('quota')) {
                setError('OpenAI API Quota Exceeded. Please check your billing/credits on the OpenAI dashboard.');
            } else {
                setError(err.response?.data?.error || err.response?.data?.message || 'Failed to generate diet plan. Our AI might be busy, please try again.');
            }
        } finally {
            setGenerating(false);
        }
    };

    const downloadPDF = async () => {
        try {
            const element = planRef.current;
            if (!element) return;

            // Use onclone to modify the element in the virtual DOM before capture
            // This is much safer than modifying the live element on mobile.
            const canvas = await html2canvas(element, {
                scale: window.innerWidth < 768 ? 1.5 : 2, // Lower scale for mobile to save memory
                backgroundColor: '#0f172a',
                useCORS: true,
                logging: false,
                onclone: (clonedDoc) => {
                    const clonedElement = clonedDoc.querySelector('[ref-id="diet-plan-content"]');
                    if (clonedElement) {
                        clonedElement.style.width = '1200px';
                        clonedElement.style.padding = '40px';
                        clonedElement.style.background = '#0f172a';
                        clonedElement.style.borderRadius = '0';
                    }
                }
            });

            const imgData = canvas.toDataURL('image/png', 0.8); // Slightly lower quality to save memory
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
            pdf.save(`${user.name || 'My'}_Diet_Plan.pdf`);
        } catch (err) {
            console.error('PDF Generation Error:', err);
            alert('PDF Generation failed on this device. Try a desktop browser or take a screenshot.');
        }
    };

    if (loading) return <div className="text-center mt-5 p-5 text-secondary">Loading your nutrition profile...</div>;

    const currentDayPlan = latestPlan?.plan[selectedDayIndex];

    return (
        <div className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4 mb-md-5 flex-wrap gap-3">
                <div className="text-center text-sm-start w-100 w-sm-auto">
                    <h2 className="mb-1" style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>NutriMind <span className="gradient-text">Dashboard</span></h2>
                    <p className="text-secondary small mb-0">Your professional AI-driven nutritional guidance</p>
                </div>
                <div className="d-flex gap-2 w-100 w-sm-auto justify-content-center">
                    <button className="modern-btn px-3 px-md-4 flex-grow-1 flex-sm-grow-0" onClick={generateNewPlan} disabled={generating}>
                        {generating ? 'Crafting Plan...' : 'Generate New Plan'}
                    </button>
                    {latestPlan && (
                        <button className="modern-btn-outline modern-btn" onClick={downloadPDF} style={{ color: 'var(--accent-primary)', background: 'transparent' }}>
                            <span className="px-2">PDF</span>
                        </button>
                    )}
                </div>
            </div>

            {error && <div className="alert alert-danger border-0 glass-panel mb-4" style={{ color: '#ff6b6b' }}>{error}</div>}


            {generating && (
                <div className="glass-panel text-center p-5 mt-4 d-flex flex-column align-items-center justify-content-center min-vh-50">
                    <div className="spinner-border text-primary mb-4" role="status" style={{ width: '4rem', height: '4rem', borderWidth: '0.3em' }}></div>
                    <h4 className="gradient-text mb-2 animate-pulse">Analyzing your metabolism...</h4>
                    <p className="text-secondary">Our AI is acting as your certified nutritionist to build the perfect plan.</p>
                </div>
            )}

            {!latestPlan && !generating && (
                <div className="glass-panel text-center p-5 mt-4">
                    <div className="mb-4" style={{ fontSize: '4rem' }}>🥗</div>
                    <h3 className="mb-3">Start Your Fitness Journey</h3>
                    <p className="text-secondary mb-4 mx-auto" style={{ maxWidth: '500px' }}>
                        You haven't generated a personalized diet plan yet. Our AI is ready to help you reach your goals.
                    </p>
                    <button className="modern-btn" onClick={generateNewPlan}>Create My First Plan</button>
                </div>
            )}

            {latestPlan && !generating && (
                <div ref={planRef} ref-id="diet-plan-content">
                    {/* Header Summary */}
                    <div className="glass-panel p-4 mb-4 shadow-sm border-0">
                        <div className="row align-items-center g-4">
                            <div className="col-lg-4 text-center text-lg-start">
                                <h4 className="mb-1 text-glow">{user.name}'s Professional Plan</h4>
                                <p className="text-secondary mb-0 small">Focus: <span className="text-primary fw-bold text-uppercase">{latestPlan.goal}</span></p>
                                <div className="mt-3 d-flex justify-content-center justify-content-lg-start gap-2">
                                    <span className="badge bg-dark-soft">{latestPlan.durationDays} Days</span>
                                    <span className="badge bg-primary-soft">Pro Sports Nutritionist AI</span>
                                </div>
                            </div>
                            <div className="col-lg-8">
                                <div className="row g-2 g-md-3">
                                    {[
                                        { label: 'PROTEIN', val: latestPlan.macroDistribution?.protein, class: 'macro-protein' },
                                        { label: 'CARBS', val: latestPlan.macroDistribution?.carbs, class: 'macro-carbs' },
                                        { label: 'FATS', val: latestPlan.macroDistribution?.fats, class: 'macro-fats' }
                                    ].map((m, i) => (
                                        <div className="col-4 col-sm-4" key={i}>
                                            <div className={`macro-card ${m.class} p-2 p-md-3 h-100`}>
                                                <div className="text-secondary x-small fw-bold mb-1">{m.label}</div>
                                                <div className="h6 mb-0 fw-bold">{m.val}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Day Navigation */}
                    <div className="day-selector mb-4">
                        {latestPlan.plan.map((day, idx) => (
                            <div 
                                key={idx} 
                                className={`day-pill ${selectedDayIndex === idx ? 'active' : ''}`}
                                onClick={() => setSelectedDayIndex(idx)}
                            >
                                {day.day}
                            </div>
                        ))}
                    </div>

                    {/* Active Day Content */}
                    <div className="fade-in">
                        <div className="d-flex align-items-center gap-3 mb-4">
                            <h3 className="mb-0 text-primary">{currentDayPlan.day}</h3>
                            <span className="badge badge-primary-soft py-2 px-3">{currentDayPlan.totalCalories} KCAL TOTAL</span>
                        </div>

                        {currentDayPlan.hydrationAdvice && (
                            <div className="glass-panel p-3 mb-4 d-flex align-items-center gap-3" style={{ borderLeft: '4px solid #38bdf8' }}>
                                <span style={{ fontSize: '1.5rem' }}>💧</span>
                                <div>
                                    <div className="fw-bold small text-info">HYDRATION ADVICE</div>
                                    <div className="text-secondary small">{currentDayPlan.hydrationAdvice}</div>
                                </div>
                            </div>
                        )}

                        <div className="diet-section-title">Gym Nutritionist Daily Schedule</div>
                        <div className="row g-4">
                            {[
                                { key: 'preWorkoutMeal', label: 'Morning Pre-Workout', icon: '🌅', timing: '5:30 AM' },
                                { key: 'postWorkoutMeal', label: 'Morning Post-Workout', icon: '💪', timing: '7:30 AM' },
                                { key: 'breakfast', label: 'Breakfast', icon: '🍳', timing: '8:00 AM' },
                                { key: 'midMorningSnack', label: 'Mid-Morning Snack', icon: '🍎', timing: '11:00 AM' },
                                { key: 'lunch', label: 'Lunch', icon: '🥗', timing: '1:30 PM' },
                                { key: 'eveningSnack', label: 'Evening Snack', icon: '🥜', timing: '4:30 PM' },
                                { key: 'dinner', label: 'Dinner', icon: '🍱', timing: '8:00 PM' }
                            ].map(meal => currentDayPlan[meal.key] && currentDayPlan[meal.key].suggestion && (
                                <div className="col-lg-6 col-xl-4" key={meal.key}>
                                    <div className="meal-card">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="h4 mb-0">{meal.icon}</span>
                                                <h6 className="mb-0 text-info fw-bold">{meal.label}</h6>
                                            </div>
                                            <span className="meal-time-badge">{meal.timing}</span>
                                        </div>
                                        <p className="mb-1 fw-500" style={{ minHeight: '3em' }}>{currentDayPlan[meal.key].suggestion}</p>
                                        <div className="text-secondary small mb-3">
                                            <strong>Portion:</strong> {currentDayPlan[meal.key].portionSize}
                                        </div>
                                        <div className="d-flex flex-wrap gap-2 mb-3">
                                            <span className="badge bg-dark-soft">{currentDayPlan[meal.key].calories} kcal</span>
                                            <span className="badge bg-dark-soft">P: {currentDayPlan[meal.key].protein}</span>
                                            <span className="badge bg-dark-soft">C: {currentDayPlan[meal.key].carbs}</span>
                                        </div>
                                        {currentDayPlan[meal.key].alternatives?.length > 0 && (
                                            <div className="mt-auto pt-2 border-top border-secondary border-opacity-25 opacity-75">
                                                <div className="text-secondary x-small fw-bold mb-1">ALTERNATIVES</div>
                                                <div className="text-secondary x-small">{currentDayPlan[meal.key].alternatives.join(', ')}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Weekly Tips */}
                    {latestPlan.weeklyTips?.length > 0 && (
                        <div className="weekly-tips-banner mt-5 shadow-sm border-0">
                            <h5 className="text-success mb-3 d-flex align-items-center gap-2">
                                <span>🚀</span> Sports Recovery & Variation Tips
                            </h5>
                            <div className="row">
                                {latestPlan.weeklyTips.map((tip, i) => (
                                    <div className="col-md-6 mb-2" key={i}>
                                        <div className="d-flex gap-2 text-secondary small">
                                            <span className="text-success fw-bold">•</span>
                                            <span>{tip}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DietDashboard;
