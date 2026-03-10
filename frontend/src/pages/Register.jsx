import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.js';
import { useToast } from '../hooks/useToast';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    
    const { register, user } = useContext(AuthContext);
    const { showToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/profile'); // Redirect to profile setup after registration
        }
    }, [user, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            await register(name, email, password);
            showToast("Welcome to NutriMind-AI ! Your account is ready. Let’s start your fitness journey.");
            navigate('/profile');
        } catch (err) {
            setError(err);
        }
    };

    return (
        <div className="fade-in d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}>
                <h2 className="text-center mb-4">Create Account</h2>
                {error && <div className="alert alert-danger" style={{ background: 'rgba(220, 53, 69, 0.2)', color: '#ff6b6b', border: 'none' }}>{error}</div>}
                
                <form onSubmit={submitHandler}>
                    <div className="mb-3">
                        <label className="form-label text-secondary">Full Name</label>
                        <input 
                            type="text" 
                            className="modern-input" 
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label text-secondary">Mobile No or Email address</label>
                        <input 
                            type="text" 
                            className="modern-input" 
                            placeholder="Mobile No or Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label text-secondary">Password</label>
                        <input 
                            type="password" 
                            className="modern-input" 
                            placeholder="Create password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength="6"
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="form-label text-secondary">Confirm Password</label>
                        <input 
                            type="password" 
                            className="modern-input" 
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength="6"
                        />
                    </div>

                    <button type="submit" className="modern-btn w-100 mb-3 text-center d-block">
                        Register
                    </button>
                    
                    <div className="text-center mt-3">
                        <span className="text-secondary">Already have an account? </span>
                        <Link to="/login" className="modern-link fw-bold">Sign In</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
