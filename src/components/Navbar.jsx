import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
    const { user, logout } = useAuth();

    return (
        <Navbar variant="dark" expand="lg" sticky="top" className="py-3">
            <Container>
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
                    <div className="bg-primary rounded-circle p-1 d-flex">
                        <Sparkles size={16} color="white" />
                    </div>
                    <span>KnowledgePlatform</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto ms-lg-4">
                        <Nav.Link as={Link} to="/" className="px-3">Home</Nav.Link>
                        {user && (
                            <>
                                <Nav.Link as={Link} to="/create" className="px-3">New Article</Nav.Link>
                                <Nav.Link as={Link} to="/dashboard" className="px-3">My Articles</Nav.Link>
                            </>
                        )}
                    </Nav>
                    <Nav className="gap-2 align-items-center">
                        {user ? (
                            <>
                                <div className="text-light opacity-75 small d-none d-lg-block">Signed in as <strong>{user.username}</strong></div>
                                <Button variant="outline-danger" size="sm" onClick={logout} className="rounded-pill px-3">Logout</Button>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Link to="/signup" className="btn btn-primary btn-sm rounded-pill px-4">Join Now</Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
