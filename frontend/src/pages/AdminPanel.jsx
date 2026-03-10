import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.js';
import axios from 'axios';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [diets, setDiets] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
                const [userRes, dietRes] = await Promise.all([
                    axios.get(`${API_URL}/api/admin/users`, config),
                    axios.get(`${API_URL}/api/admin/diets`, config)
                ]);
                setUsers(userRes.data);
                setDiets(dietRes.data);
            } catch (error) {
                console.error('Failed to fetch admin data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, [user.token]);

    if (loading) return <div className="text-center mt-5 text-secondary">Loading Admin Dashboard...</div>;

    return (
        <div className="fade-in">
            <h2 className="mb-4">Admin <span className="gradient-text">Dashboard</span></h2>
            
            <div className="row g-3 g-md-4 mb-4 mb-md-5">
                <div className="col-md-6">
                    <div className="glass-panel text-center p-3 p-md-4">
                        <h3 className="text-secondary mb-2" style={{ fontSize: '1.25rem' }}>Total Users</h3>
                        <p className="fw-bold text-primary mb-0" style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)' }}>{users.length}</p>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="glass-panel text-center p-3 p-md-4">
                        <h3 className="text-secondary mb-2" style={{ fontSize: '1.25rem' }}>Plans Generated</h3>
                        <p className="fw-bold text-success mb-0" style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)' }}>{diets.length}</p>
                    </div>
                </div>
            </div>

            <div className="glass-panel p-4 mb-5">
                <h3 className="mb-4">Recent Users</h3>
                <div className="table-responsive">
                    <table className="table table-dark table-hover" style={{ backgroundColor: 'transparent' }}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Goal</th>
                                <th>Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.slice(0, 10).map((u) => (
                                <tr key={u._id}>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td><span className={`badge ${u.role === 'admin' ? 'bg-warning text-dark' : 'bg-secondary'}`}>{u.role}</span></td>
                                    <td>{u.fitnessGoal || 'Not Set'}</td>
                                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
        </div>
    );
};

export default AdminPanel;
