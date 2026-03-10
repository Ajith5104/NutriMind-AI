import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext.js';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <BootstrapNavbar collapseOnSelect expand="lg" className="navbar-glass" variant="dark">
            <Container>
                <BootstrapNavbar.Brand as={Link} to="/">NutriMind-AI</BootstrapNavbar.Brand>
                <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
                <BootstrapNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        <Nav.Link as={Link} to="/" eventKey="1">Home</Nav.Link>
                        {user ? (
                            <>
                                <Nav.Link as={Link} to="/dashboard" eventKey="2">My Diet Plan</Nav.Link>
                                <Nav.Link as={Link} to="/calculators" eventKey="3">Tools</Nav.Link>
                                <Nav.Link as={Link} to="/profile" eventKey="4">Profile</Nav.Link>
                                {user.role === 'admin' && (
                                    <Nav.Link as={Link} to="/admin" className="text-warning" eventKey="5">Admin</Nav.Link>
                                )}
                                <Nav.Link as="div" className="p-0">
                                    <button className="modern-btn-outline ms-lg-3 mt-2 mt-lg-0" onClick={handleLogout} style={{ padding: '0.4rem 1rem', borderRadius: '4px' }}>
                                        Logout
                                    </button>
                                </Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login" eventKey="6">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register" className="modern-btn ms-lg-3 py-2 px-4 mt-2 mt-lg-0" style={{ color: 'white' }} eventKey="7">
                                    Get Started
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    );
};

export default Navbar;
