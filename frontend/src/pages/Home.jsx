import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="landing-page">
            <div className="bg-mesh"></div>
            
            {/* Hero Section */}
            <section className="hero-section text-center pt-5 mt-5">
                <div className="container-custom">
                    <div className="reveal">
                        <span className="badge-primary-soft px-3 py-2 rounded-pill mb-4 d-inline-block">
                            🚀 AI-Powered Nutrition is Here
                        </span>
                        <h1 className="hero-title fw-bold mb-4">
                            Your Personal <span className="gradient-text">AI Nutritionist</span> <br /> Available 24/7
                        </h1>
                        <p className="lead text-secondary mb-5 mx-auto" style={{ maxWidth: '700px', fontSize: '1.2rem' }}>
                            Stop guessing your macros. NutriMind uses advanced AI to craft precise, 7-day diet plans tailored to your metabolism, goals, and lifestyle.
                        </p>
                        <div className="d-flex gap-3 justify-content-center flex-wrap">
                            <Link to="/dashboard" state={{ openForm: true }} className="modern-btn">
                                Start Free Generation 
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ms-2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                            </Link>
                            <Link to="/tools" className="modern-btn modern-btn-outline">
                                Explore Calculators
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="bg-dark-soft">
                <div className="container-custom">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-6 reveal">
                            <h2 className="display-5 fw-bold mb-5">How It <span className="gradient-text">Works</span></h2>
                            <div className="d-flex gap-4 mb-4">
                                <div className="feature-icon flex-shrink-0">1</div>
                                <div>
                                    <h5 className="mb-2">Input Your Metrics</h5>
                                    <p className="text-secondary small">Share your age, weight, goal, and preferences through our professional intake form.</p>
                                </div>
                            </div>
                            <div className="d-flex gap-4 mb-4">
                                <div className="feature-icon flex-shrink-0">2</div>
                                <div>
                                    <h5 className="mb-2">AI Analysis</h5>
                                    <p className="text-secondary small">Our neural network processes your data against thousands of nutritional guidelines.</p>
                                </div>
                            </div>
                            <div className="d-flex gap-4">
                                <div className="feature-icon flex-shrink-0">3</div>
                                <div>
                                    <h5 className="mb-2">Get Your Plan</h5>
                                    <p className="text-secondary small">Receive a detailed 7-day plan with specific timings, portions, and macros.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 reveal reveal-delay-2">
                            <div className="glass-card p-2 shadow-accent" style={{ animation: 'float 6s ease-in-out infinite' }}>
                                <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800" alt="Healthy Food" className="img-fluid rounded-4" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="text-center">
                <div className="container-custom">
                    <div className="glass-card p-5 reveal">
                        <h2 className="display-4 fw-bold mb-4">Ready to Transform Your Life?</h2>
                        <p className="text-secondary mb-5">Join thousands of users who have optimized their nutrition with NutriMind-AI.</p>
                        <Link to="/dashboard" state={{ openForm: true }} className="modern-btn px-5 py-3 fs-5">
                            Generate My Plan Now
                        </Link>
                    </div>
                </div>
            </section>

            <footer className="py-5 text-center text-secondary border-top border-secondary">
                <div className="container-custom">
                    <p className="mb-0 small">© 2026 NutriMind-AI. Built with Intelligence for your Health.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;

