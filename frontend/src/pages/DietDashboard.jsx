import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import IntakeForm from '../components/IntakeForm';

const MEALS = [
    { key: 'preWorkoutMeal',  label: 'Pre-Workout',   icon: '🌅', color: '#6366f1' },
    { key: 'postWorkoutMeal', label: 'Post-Workout',  icon: '💪', color: '#10b981' },
    { key: 'breakfast',       label: 'Breakfast',     icon: '🍳', color: '#f59e0b' },
    { key: 'midMorningSnack', label: 'Mid Snack',     icon: '🍎', color: '#ec4899' },
    { key: 'lunch',           label: 'Lunch',         icon: '🥗', color: '#06b6d4' },
    { key: 'eveningSnack',    label: 'Eve Snack',     icon: '🥜', color: '#8b5cf6' },
    { key: 'dinner',          label: 'Dinner',        icon: '🍱', color: '#f43f5e' },
];

const DietDashboard = () => {
    const location = useLocation();
    const [latestPlan, setLatestPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [pdfGenerating, setPdfGenerating] = useState(false);
    const planRef = useRef();
    const pdfDayRefs = useRef([]);

    useEffect(() => {
        if (location.state?.openForm) {
            setShowForm(true);
        }
        fetchPlanHistory();
    }, [location.state]);

    const getApiUrl = () =>
        import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '');

    const fetchPlanHistory = async () => {
        try {
            const { data } = await axios.get(`${getApiUrl()}/api/diet/history`);
            if (data && data.length > 0) setLatestPlan(data[0]);
        } catch {
            setError('Could not load plan history. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const generateNewPlan = async (metrics) => {
        setGenerating(true);
        setError(null);
        try {
            const { data } = await axios.post(`${getApiUrl()}/api/diet/generate`, metrics);
            setLatestPlan(data);
            setSelectedDayIndex(0);
            setShowForm(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Plan generation failed. Check your inputs and try again.');
        } finally {
            setGenerating(false);
        }
    };

    const downloadPDF = async () => {
        if (!latestPlan) return;
        setPdfGenerating(true);
        try {
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            const pageW = pdf.internal.pageSize.getWidth();
            const pageH = pdf.internal.pageSize.getHeight();

            for (let i = 0; i < latestPlan.plan.length; i++) {
                const el = pdfDayRefs.current[i];
                if (!el) continue;

                const canvas = await html2canvas(el, {
                    scale: 2,
                    backgroundColor: '#0f172a',
                    useCORS: true,
                    logging: false,
                });

                const imgData = canvas.toDataURL('image/png', 1.0);
                // Scale image width to A4 page width, keep aspect ratio
                const imgH = (canvas.height * pageW) / canvas.width;

                if (i > 0) pdf.addPage();

                // Always start at y=0 — no centering (prevents blank pages)
                if (imgH <= pageH) {
                    pdf.addImage(imgData, 'PNG', 0, 0, pageW, imgH);
                } else {
                    // Content taller than one page — flow across pages
                    let yPos = 0;
                    let remaining = imgH;
                    while (remaining > 0) {
                        pdf.addImage(imgData, 'PNG', 0, -yPos, pageW, imgH);
                        remaining -= pageH;
                        yPos += pageH;
                        if (remaining > 0) pdf.addPage();
                    }
                }
            }

            pdf.save(`NutriMind_AI_${latestPlan.goal?.replace(/\s+/g, '_')}_7Day_Plan.pdf`);
        } catch (err) {
            console.error('PDF error:', err);
            alert('PDF generation failed. Please try again.');
        } finally {
            setPdfGenerating(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}></div>
                    <p className="text-secondary">Loading your plans...</p>
                </div>
            </div>
        );
    }

    const currentDayPlan = latestPlan?.plan?.[selectedDayIndex];

    return (
        <div className="reveal">
            <div className="bg-mesh"></div>

            <div className="container-custom py-5">
                {/* Page Header */}
                <div className="d-flex justify-content-between align-items-end mb-5 flex-wrap gap-4">
                    <div>
                        <h1 className="hero-title mb-1">My <span className="gradient-text">Planner</span></h1>
                        <p className="text-secondary mb-0">Your personalized AI nutritional guidance</p>
                    </div>
                    <div className="d-flex gap-3 flex-wrap">
                        <button className="modern-btn" onClick={() => setShowForm(true)} disabled={generating}>
                            {generating ? (
                                <><span className="spinner-border spinner-border-sm me-2"></span>Crafting...</>
                            ) : '✨ New Plan'}
                        </button>
                        {latestPlan && (
                            <button className="modern-btn modern-btn-outline" onClick={downloadPDF} disabled={pdfGenerating}>
                                {pdfGenerating ? (
                                    <><span className="spinner-border spinner-border-sm me-2"></span>Exporting...</>
                                ) : '📄 Export PDF'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="alert-card mb-4 p-3 d-flex align-items-center gap-3">
                        <span className="fs-4">⚠️</span>
                        <span className="text-danger small">{error}</span>
                        <button className="ms-auto btn btn-sm btn-link text-secondary" onClick={() => setError(null)}>✕</button>
                    </div>
                )}

                {/* Intake Form */}
                {showForm && (
                    <div className="mb-5">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 className="mb-0">New Plan <span className="gradient-text">Setup</span></h3>
                            <button className="modern-btn modern-btn-outline px-3 py-2 small" onClick={() => setShowForm(false)}>✕ Cancel</button>
                        </div>
                        <IntakeForm onSubmit={generateNewPlan} loading={generating} />
                    </div>
                )}

                {/* AI Generating State */}
                {generating && !showForm && (
                    <div className="glass-card text-center p-5 mt-4 d-flex flex-column align-items-center">
                        <div className="generating-orb mb-4"></div>
                        <h3 className="gradient-text mb-2">AI is Analyzing Your Biometrics...</h3>
                        <p className="text-secondary mb-0">Calculating your precise macros and crafting a 7-day plan</p>
                    </div>
                )}

                {/* Empty State */}
                {!latestPlan && !generating && !showForm && (
                    <div className="glass-card text-center p-5 mt-4">
                        <div className="feature-icon mx-auto mb-4" style={{ width: '80px', height: '80px', fontSize: '32px' }}>🥗</div>
                        <h2 className="mb-3">Start Your Fitness Journey</h2>
                        <p className="text-secondary mb-5 mx-auto" style={{ maxWidth: '500px' }}>
                            Complete our professional intake form to generate a personalized 7-day diet plan
                            tailored to your biometrics and goals.
                        </p>
                        <button className="modern-btn px-5" onClick={() => setShowForm(true)}>Get Started</button>
                    </div>
                )}

                {/* Plan Display */}
                {latestPlan && !generating && !showForm && currentDayPlan && (
                    <div ref={planRef} className="reveal-delay-1">
                        {/* Plan Overview Card */}
                        <div className="glass-card p-4 mb-4 border-primary-soft">
                            <div className="row align-items-center g-4">
                                <div className="col-lg-5">
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <div className="feature-icon m-0" style={{ width: '50px', height: '50px', fontSize: '22px' }}>🎯</div>
                                        <div>
                                            <span className="badge-primary-soft px-2 py-1 rounded-pill x-small mb-1 d-inline-block">Target Goal</span>
                                            <h3 className="mb-0 text-glow text-uppercase h4">{latestPlan.goal}</h3>
                                        </div>
                                    </div>
                                    <p className="text-secondary small mb-0 pe-lg-4">
                                        Scientifically optimized for <strong>{latestPlan.goal}</strong> with precision macro-nutrient distribution.
                                    </p>
                                </div>
                                <div className="col-lg-7">
                                    <div className="row g-3">
                                        {[
                                            { label: 'Protein', value: latestPlan.macroDistribution?.protein, icon: '🥩', color: 'text-primary' },
                                            { label: 'Carbs',   value: latestPlan.macroDistribution?.carbs,   icon: '🍞', color: 'text-info' },
                                            { label: 'Fats',    value: latestPlan.macroDistribution?.fats,    icon: '🥑', color: 'text-warning' },
                                        ].map(m => (
                                            <div className="col-4" key={m.label}>
                                                <div className="macro-card p-3 text-center">
                                                    <div className={`macro-icon mb-1 ${m.color}`}>{m.icon}</div>
                                                    <div className="macro-val h5 mb-0">{m.value}</div>
                                                    <div className="macro-label x-small">{m.label}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Day Selector */}
                        <div className="d-flex align-items-center gap-3 mb-4 overflow-auto pb-2">
                            <span className="text-secondary small fw-bold text-nowrap">SELECT DAY:</span>
                            <div className="day-selector-modern">
                                {latestPlan.plan.map((day, idx) => (
                                    <button
                                        key={idx}
                                        className={`day-btn-modern ${selectedDayIndex === idx ? 'active' : ''}`}
                                        onClick={() => setSelectedDayIndex(idx)}
                                    >
                                        <span className="day-num">{idx + 1}</span>
                                        <span className="day-name">{day.day?.substring(0, 3)}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Daily Plan Content */}
                        <div className="row g-4">
                            {/* Meal Timeline */}
                            <div className="col-lg-8">
                                <div className="glass-card p-0 overflow-hidden">
                                    <div className="p-4 d-flex justify-content-between align-items-center bg-glass-dark" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                        <h2 className="h4 mb-0 d-flex align-items-center gap-3">
                                            <span className="gradient-text">{currentDayPlan.day}</span>
                                            <span className="text-secondary fs-6 opacity-50">|</span>
                                            <span className="fs-6 text-secondary fw-normal">Daily Menu</span>
                                        </h2>
                                        <span className="badge bg-primary rounded-pill px-3 py-2">{currentDayPlan.totalCalories} kcal</span>
                                    </div>

                                    <div className="meal-timeline p-4">
                                        {MEALS.map(meal => {
                                            const mealData = currentDayPlan[meal.key];
                                            if (!mealData) return null;
                                            return (
                                                <div className="timeline-item" key={meal.key}>
                                                    <div className="timeline-marker" style={{ backgroundColor: meal.color }}></div>
                                                    <div className="timeline-content glass-card-sm p-3 mb-4">
                                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                                            <div className="d-flex align-items-center gap-3">
                                                                <div className="meal-icon-circle" style={{ background: `${meal.color}20`, color: meal.color }}>
                                                                    {meal.icon}
                                                                </div>
                                                                <div>
                                                                    <h6 className="mb-0 fw-bold">{meal.label}</h6>
                                                                    <span className="text-secondary x-small">{mealData.timing}</span>
                                                                </div>
                                                            </div>
                                                            <span className="badge-secondary-soft x-small px-2 py-1">{mealData.calories} kcal</span>
                                                        </div>
                                                        <h6 className="mb-2 text-primary-light">{mealData.suggestion}</h6>
                                                        <div className="d-flex flex-wrap gap-2 mb-3">
                                                            <span className="macro-tag">P: {mealData.protein}</span>
                                                            <span className="macro-tag">C: {mealData.carbs}</span>
                                                            <span className="macro-tag">F: {mealData.fats}</span>
                                                        </div>
                                                        <div className="portion-info p-2 rounded bg-dark-soft small" style={{ borderLeft: `3px solid ${meal.color}` }}>
                                                            <span className="text-secondary">Portion: </span>
                                                            <span className="fw-bold">{mealData.portionSize}</span>
                                                        </div>
                                                        {mealData.alternatives?.length > 0 && (
                                                            <p className="text-secondary x-small mt-2 mb-0">
                                                                <span className="fw-bold">Alternatives:</span> {mealData.alternatives.join(', ')}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="col-lg-4">
                                <div className="sticky-top" style={{ top: '100px' }}>
                                    <div className="glass-card p-4 mb-4 border-info-soft">
                                        <h5 className="mb-4 d-flex align-items-center gap-2">
                                            <span className="text-info">💧</span> Hydration Guide
                                        </h5>
                                        <div className="p-3 rounded-4 mb-3 text-center bg-info-soft">
                                            <div className="h2 mb-1 text-info fw-bold">{currentDayPlan.hydrationAdvice}</div>
                                            <p className="text-secondary x-small mb-0 fw-bold" style={{ letterSpacing: '1px', textTransform: 'uppercase' }}>Daily Intake Target</p>
                                        </div>
                                        <p className="text-secondary x-small mb-0">Drink 250ml every hour for optimal metabolic performance.</p>
                                    </div>

                                    <div className="glass-card p-4 border-warning-soft">
                                        <h5 className="mb-3 d-flex align-items-center gap-2">
                                            <span className="text-warning">💡</span> Weekly Tips
                                        </h5>
                                        <ul className="list-unstyled mb-0">
                                            {latestPlan.weeklyTips?.map((tip, i) => (
                                                <li key={i} className="d-flex gap-3 mb-3 x-small text-secondary">
                                                    <span className="text-warning mt-1">●</span>
                                                    <span>{tip}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Hidden PDF Templates — one per day */}
            {latestPlan?.plan?.map((dayPlan, dIdx) => (
                <div
                    key={dIdx}
                    ref={el => pdfDayRefs.current[dIdx] = el}
                    style={{
                        position: 'absolute', left: '-9999px', top: 0,
                        width: '794px',
                        background: '#0f172a', padding: '40px',
                        fontFamily: "'Outfit', sans-serif", color: '#f8fafc',
                        boxSizing: 'border-box',
                    }}
                >
                    {/* Page Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', paddingBottom: '20px', borderBottom: '2px solid rgba(99,102,241,0.3)' }}>
                        <div>
                            <div style={{ fontSize: '24px', fontWeight: 800, background: 'linear-gradient(135deg,#818cf8,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>NutriMind AI</div>
                            <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px' }}>Personalized Nutrition Protocol</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '18px', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase' }}>{dayPlan.day}</div>
                            <div style={{ fontSize: '20px', fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase', marginTop: '2px' }}>{latestPlan.goal}</div>
                            <div style={{ color: '#94a3b8', fontSize: '11px', marginTop: '4px' }}>{new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                        </div>
                    </div>

                    {/* Macro strip */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                        {[
                            { label: 'Total Calories', val: `${dayPlan.totalCalories} kcal`, color: '#6366f1' },
                            { label: 'Protein', val: latestPlan.macroDistribution?.protein, color: '#818cf8' },
                            { label: 'Carbs',   val: latestPlan.macroDistribution?.carbs,   color: '#06b6d4' },
                            { label: 'Fats',    val: latestPlan.macroDistribution?.fats,    color: '#f59e0b' },
                        ].map(m => (
                            <div key={m.label} style={{ background: `${m.color}14`, border: `1px solid ${m.color}40`, borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                                <div style={{ fontSize: '20px', fontWeight: 800, color: m.color }}>{m.val}</div>
                                <div style={{ color: '#94a3b8', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '3px' }}>{m.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Meals */}
                    <div style={{ display: 'grid', gap: '10px' }}>
                        {MEALS.map(meal => {
                            const md = dayPlan[meal.key];
                            if (!md) return null;
                            return (
                                <div key={meal.key} style={{ display: 'grid', gridTemplateColumns: '130px 1fr 90px', gap: '14px', alignItems: 'start', padding: '14px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: `1px solid ${meal.color}20`, borderLeft: `4px solid ${meal.color}` }}>
                                    <div>
                                        <div style={{ color: meal.color, fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{meal.icon} {meal.label}</div>
                                        <div style={{ color: '#64748b', fontSize: '11px', marginTop: '3px' }}>{md.timing}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '13px', color: '#e2e8f0', marginBottom: '4px' }}>{md.suggestion}</div>
                                        <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '6px' }}>{md.portionSize}</div>
                                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                            {[`P: ${md.protein}`, `C: ${md.carbs}`, `F: ${md.fats}`].map(tag => (
                                                <span key={tag} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', padding: '2px 7px', borderRadius: '5px', fontSize: '10px', color: '#94a3b8' }}>{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>{md.calories}</div>
                                        <div style={{ fontSize: '10px', color: '#64748b' }}>kcal</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Page Footer */}
                    <div style={{ marginTop: '32px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: '10px' }}>
                        <span>NutriMind-AI • Personalized Nutrition Intelligence</span>
                        <span>Page {dIdx + 1} of {latestPlan.plan.length}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DietDashboard;
