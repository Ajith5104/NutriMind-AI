import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.js';
import { useToast } from '../hooks/useToast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const { login, user } = useContext(AuthContext);
    const { showToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            showToast("Welcome back! You’ve signed in successfully. Ready to hit your goals today?");
            navigate('/dashboard');
        } catch (err) {
            setError(err);
        }
    };

    return (
        <div className="fade-in d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
                <h2 className="text-center mb-4">Welcome Back</h2>
                {error && <div className="alert alert-danger" style={{ background: 'rgba(220, 53, 69, 0.2)', color: '#ff6b6b', border: 'none' }}>{error}</div>}
                
                <form onSubmit={submitHandler}>
                    <div className="mb-3">
                        <label className="form-label text-secondary">Mobile Number or Email</label>
                        <input 
                            type="text" 
                            className="modern-input" 
                            placeholder="Mobile Number or Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label text-secondary">Password</label>
                        <input 
                            type="password" 
                            className="modern-input" 
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="modern-btn w-100 mb-3 text-center d-block">
                        Sign In
                    </button>
                    
                    <div className="text-center mt-3">
                        <span className="text-secondary">Don't have an account? </span>
                        <Link to="/register" className="modern-link fw-bold">Register</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
