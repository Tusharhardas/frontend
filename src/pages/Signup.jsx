import React, { useState } from 'react';
import { Form, Button, Card, Alert, Container, Row, Col, InputGroup, Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, UserPlus, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await API.post('/users', { username, email, password });
            login(data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create account. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="bg-light min-vh-100 d-flex align-items-center py-5">
            <Container>
                <Row className="justify-content-center">
                    <Col lg={5} md={8}>
                        <div className="text-center mb-5">
                            <div className="bg-success d-inline-flex p-3 rounded-circle shadow-lg mb-4 text-white">
                                <UserPlus size={32} />
                            </div>
                            <h2 className="fw-bold display-6 mb-2 text-dark">Join the Community</h2>
                            <p className="text-muted lead px-lg-4">Start your journey as a technical contributor today.</p>
                        </div>

                        <Card className="border-0 shadow-lg rounded-5 overflow-hidden bg-white">
                            <div className="bg-success py-2 w-100" style={{ opacity: 0.1 }}></div>
                            <Card.Body className="p-4 p-md-5">
                                {error && (
                                    <Alert variant="danger" className="rounded-3 border-0 small mb-4 d-flex align-items-center">
                                        <X size={16} className="me-2" /> {error}
                                    </Alert>
                                )}

                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-4" controlId="formBasicUsername">
                                        <Form.Label className="small fw-bold text-uppercase text-muted" style={{ letterSpacing: '0.5px' }}>Username</Form.Label>
                                        <InputGroup className="bg-light rounded-3 overflow-hidden border-0">
                                            <InputGroup.Text className="bg-transparent border-0 ps-3 text-muted">
                                                <User size={18} />
                                            </InputGroup.Text>
                                            <Form.Control
                                                className="bg-transparent border-0 shadow-none py-3"
                                                type="text"
                                                placeholder="johndoe"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                required
                                            />
                                        </InputGroup>
                                    </Form.Group>

                                    <Form.Group className="mb-4" controlId="formBasicEmail">
                                        <Form.Label className="small fw-bold text-uppercase text-muted" style={{ letterSpacing: '0.5px' }}>Email Address</Form.Label>
                                        <InputGroup className="bg-light rounded-3 overflow-hidden border-0">
                                            <InputGroup.Text className="bg-transparent border-0 ps-3 text-muted">
                                                <Mail size={18} />
                                            </InputGroup.Text>
                                            <Form.Control
                                                className="bg-transparent border-0 shadow-none py-3"
                                                type="email"
                                                placeholder="name@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </InputGroup>
                                    </Form.Group>

                                    <Form.Group className="mb-4" controlId="formBasicPassword">
                                        <Form.Label className="small fw-bold text-uppercase text-muted" style={{ letterSpacing: '0.5px' }}>Password</Form.Label>
                                        <InputGroup className="bg-light rounded-3 overflow-hidden border-0">
                                            <InputGroup.Text className="bg-transparent border-0 ps-3 text-muted">
                                                <Lock size={18} />
                                            </InputGroup.Text>
                                            <Form.Control
                                                className="bg-transparent border-0 shadow-none py-3"
                                                type="password"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </InputGroup>
                                        <Form.Text className="text-muted small">Minimum 8 characters with a mix of letters and numbers.</Form.Text>
                                    </Form.Group>

                                    <Button
                                        variant="success"
                                        type="submit"
                                        className="w-100 py-3 rounded-pill fw-bold shadow-sm border-0 d-flex align-items-center justify-content-center transition-all hover-translate-y mt-2"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <><Spinner size="sm" className="me-2" /> Creating account...</>
                                        ) : (
                                            <><CheckCircle2 size={20} className="me-2" /> Create Account</>
                                        )}
                                    </Button>
                                </Form>

                                <div className="text-center mt-5">
                                    <p className="text-muted mb-0 small">
                                        Already have an account? <Link to="/login" className="text-success fw-bold text-decoration-none d-flex align-items-center justify-content-center mt-2">
                                            Sign in here <ArrowRight size={14} className="ms-1" />
                                        </Link>
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <style>{`
                .hover-translate-y:hover { transform: translateY(-3px); }
                .bg-light { background-color: #f8fafc !important; }
            `}</style>
        </div>
    );
};

const X = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

export default Signup;
