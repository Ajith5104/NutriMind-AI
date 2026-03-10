import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="fade-in d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
            <div className="text-center p-5 glass-panel" style={{ maxWidth: '800px' }}>
                <h1 className="display-4 fw-bold mb-4">
                    Welcome to <span className="gradient-text">NutriMind-AI
</span>
                </h1>
                <p className="lead text-secondary mb-5">
                    Generate highly personalized, AI-driven diet plans based on your unique goals, health conditions, and preferences. Get started on your health journey today.
                </p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                    <Link to="/register" className="modern-btn fs-5 px-5 py-3 text-decoration-none">
                        Start for Free
                    </Link>
                    <Link to="/login" className="modern-btn-outline modern-btn fs-5 px-5 py-3 text-decoration-none" style={{ color: 'var(--accent-primary)', background: 'transparent' }}>
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
