import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';

const Navbar = () => {
    return (
        <BootstrapNavbar collapseOnSelect expand="lg" className="navbar-glass sticky-top" variant="dark">
            <Container>
                <BootstrapNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
                    <span className="fs-4 fw-bold gradient-text">NutriMind</span>
                    <span className="fs-6 ms-1 text-secondary fw-normal">AI</span>
                </BootstrapNavbar.Brand>
                <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
                <BootstrapNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        <Nav.Link as={Link} to="/" className="px-3">Home</Nav.Link>
                        <Nav.Link as={Link} to="/dashboard" className="px-3">Diet Planner</Nav.Link>
                        <Nav.Link as={Link} to="/calculators" className="px-3">Calculators</Nav.Link>
                        <Nav.Link as={Link} to="/dashboard" state={{ openForm: true }} className="modern-btn modern-btn-sm ms-lg-3 mt-3 mt-lg-0 text-white shadow-accent">
                            Generate Plan
                        </Nav.Link>
                    </Nav>
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    );
};

export default Navbar;

