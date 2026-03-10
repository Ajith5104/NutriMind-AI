import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="fade-in d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
            <div className="text-center p-3 p-md-5 glass-panel" style={{ maxWidth: '800px', width: '100%' }}>
                <h1 className="display-5 display-md-4 fw-bold mb-4">
                    Welcome to <span className="gradient-text">NutriMind-AI</span>
                </h1>
                <p className="lead text-secondary mb-4 mb-md-5" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}>
                    Generate highly personalized, AI-driven diet plans based on your unique goals, health conditions, and preferences. Get started on your health journey today.
                </p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                    <Link to="/register" className="modern-btn fs-5 px-4 px-md-5 py-2 py-md-3 text-decoration-none">
                        Start for Free
                    </Link>
                    <Link to="/login" className="modern-btn-outline modern-btn fs-5 px-4 px-md-5 py-2 py-md-3 text-decoration-none" style={{ color: 'var(--accent-primary)', background: 'transparent' }}>
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
