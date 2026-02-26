import React, { useState, useEffect } from 'react';
import { Button, Badge, Spinner, Container, Row, Col, Card, InputGroup, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
    Edit, Trash, Plus, BookOpen, Clock, Tag, Search,
    BarChart3, LayoutGrid, List, Sparkles, User,
    ArrowRight, MessageSquare, Bookmark, Star, Zap
} from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchMyArticles = async () => {
            if (!user?.id) {
                setLoading(false);
                return;
            }
            try {
                const { data } = await API.get('/articles');
                // Ensure ID comparison is robust (string vs number)
                setArticles(data.filter(a => String(a.authorId) === String(user.id)));
            } catch (err) {
                console.error('Failed to fetch articles:', err);
            }
            setLoading(false);
        };
        fetchMyArticles();
    }, [user?.id]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to permanently delete this insight?')) {
            try {
                await API.delete(`/articles/${id}`);
                setArticles(articles.filter(a => a.id !== id));
            } catch (err) {
                alert('Delete failed');
            }
        }
    };

    const filteredArticles = articles.filter(a =>
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Stats calculation
    const totalInsights = articles.length;
    const categoriesCount = new Set(articles.map(a => a.category)).size;
    const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
    const totalWords = articles.reduce((sum, a) => sum + (a.content ? a.content.replace(/<[^>]*>?/gm, '').split(/\s+/).length : 0), 0);
    const avgReadTime = articles.length > 0 ? Math.ceil(totalWords / (200 * articles.length)) : 0;

    const latestInsight = articles.length > 0
        ? new Date(Math.max(...articles.map(a => new Date(a.createdAt)))).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        : 'N/A';

    if (loading) return (
        <div className="text-center py-5 mt-5">
            <Spinner animation="grow" variant="primary" />
            <p className="mt-3 text-muted fw-bold">Opening your personal workspace...</p>
        </div>
    );

    return (
        <div className="bg-light min-vh-100 pb-5">
            {/* Personalized Welcome Hero */}
            <div className="bg-white border-bottom mb-5">
                <Container className="py-5">
                    <Row className="align-items-center g-4">
                        <Col lg={7}>
                            <div className="d-flex align-items-center mb-3">
                                <div className="bg-primary bg-gradient rounded-circle text-white d-flex align-items-center justify-content-center me-3 shadow-lg"
                                    style={{ width: '64px', height: '64px', fontSize: '24px', fontWeight: 'bold' }}>
                                    {user.username?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="text-muted mb-0 small text-uppercase fw-bold" style={{ letterSpacing: '1px' }}>Personal Hub</h4>
                                    <h1 className="fw-bold display-5 mb-0 text-dark">Welcome back, {user.username}!</h1>
                                </div>
                            </div>
                            <p className="text-muted lead mb-4 pe-lg-5">
                                You have published <strong>{totalInsights} technical insights</strong> across <strong>{categoriesCount} categories</strong>. Ready to share something new today?
                            </p>
                            <div className="d-flex gap-2">
                                <Button as={Link} to="/create" variant="primary" className="rounded-pill px-4 py-2 shadow-sm fw-bold border-0 transition-all hover-translate-y">
                                    <Plus size={18} className="me-1" /> New Article
                                </Button>
                                <Button variant="outline-secondary" className="rounded-pill px-4 py-2 fw-bold transition-all hover-bg-light">
                                    <User size={18} className="me-1" /> Public Profile
                                </Button>
                            </div>
                        </Col>
                        <Col lg={5} className="d-none d-lg-block">
                            <Card className="border-0 shadow-sm rounded-4 bg-primary text-white overflow-hidden hero-stats-card">
                                <Card.Body className="p-4 position-relative z-index-1">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h5 className="fw-bold mb-0">At a Glance</h5>
                                        <Zap size={20} className="text-warning hero-zap-pulse" />
                                    </div>
                                    <Row className="g-3">
                                        <Col xs={6}>
                                            <div className="bg-white bg-opacity-10 p-3 rounded-3 h-100">
                                                <small className="opacity-75 d-block text-uppercase fw-bold" style={{ fontSize: '10px' }}>Total Views</small>
                                                <h3 className="fw-bold mb-0">{totalViews > 999 ? (totalViews / 1000).toFixed(1) + 'k' : totalViews}</h3>
                                            </div>
                                        </Col>
                                        <Col xs={6}>
                                            <div className="bg-white bg-opacity-10 p-3 rounded-3 h-100">
                                                <small className="opacity-75 d-block text-uppercase fw-bold" style={{ fontSize: '10px' }}>Avg. Read Time</small>
                                                <h3 className="fw-bold mb-0">{avgReadTime}m</h3>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                                <div className="hero-stats-shape"></div>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>

            <Container>
                {/* Stats & Quick Actions Row */}
                <Row className="mb-5 g-4 mt-n5">
                    <Col lg={4} md={6}>
                        <Card className="border-0 shadow-sm rounded-4 h-100 bg-white">
                            <Card.Body className="p-4">
                                <div className="bg-primary bg-opacity-10 p-3 rounded-4 mb-3 text-primary d-inline-flex">
                                    <BookOpen size={24} />
                                </div>
                                <h3 className="fw-bold mb-0">{totalInsights}</h3>
                                <small className="text-muted text-uppercase fw-bold opacity-75" style={{ fontSize: '11px' }}>Total Insights</small>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={4} md={6}>
                        <Card className="border-0 shadow-sm rounded-4 h-100 bg-white">
                            <Card.Body className="p-4">
                                <div className="bg-success bg-opacity-10 p-3 rounded-4 mb-3 text-success d-inline-flex">
                                    <Tag size={24} />
                                </div>
                                <h3 className="fw-bold mb-0">{categoriesCount}</h3>
                                <small className="text-muted text-uppercase fw-bold opacity-75" style={{ fontSize: '11px' }}>Specialties</small>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={4} md={6}>
                        <Card className="border-0 shadow-sm rounded-4 h-100 bg-white">
                            <Card.Body className="p-4">
                                <div className="bg-warning bg-opacity-10 p-3 rounded-4 mb-3 text-warning d-inline-flex">
                                    <Clock size={24} />
                                </div>
                                <h3 className="fw-bold mb-0">{latestInsight}</h3>
                                <small className="text-muted text-uppercase fw-bold opacity-75" style={{ fontSize: '11px' }}>Last Updated</small>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Article Management Section */}
                <div className="bg-white p-4 p-md-5 rounded-5 shadow-sm border-0 mb-5">
                    <div className="d-flex flex-wrap justify-content-between align-items-center mb-5 gap-3">
                        <div>
                            <h3 className="fw-bold m-0 text-dark">Your Portfolio</h3>
                            <p className="text-muted mb-0 small">Overview of all your published technical contributions.</p>
                        </div>
                        <div className="d-flex gap-2 align-items-center">
                            <InputGroup className="bg-light rounded-pill overflow-hidden border shadow-none" style={{ width: '280px' }}>
                                <InputGroup.Text className="bg-transparent border-0 pe-0 ps-3">
                                    <Search size={16} className="text-muted" />
                                </InputGroup.Text>
                                <Form.Control
                                    className="border-0 shadow-none ps-2 py-2 bg-transparent small"
                                    placeholder="Search your insights..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </InputGroup>
                            <Badge bg="primary" pill className="px-3 py-2 ms-2 fw-bold">{filteredArticles.length}</Badge>
                        </div>
                    </div>

                    {filteredArticles.length > 0 ? (
                        <Row className="g-4">
                            {filteredArticles.map((article) => (
                                <Col lg={4} md={6} key={article.id}>
                                    <Card className="border-0 shadow-none bg-light rounded-4 h-100 hover-bg-white hover-shadow-md transition-all border article-management-card">
                                        <Card.Body className="p-4 d-flex flex-column">
                                            <div className="mb-3 d-flex justify-content-between align-items-center">
                                                <Badge bg="white" text="primary" className="border px-2 py-1 small fw-bold text-uppercase" style={{ fontSize: '10px' }}>
                                                    {article.category}
                                                </Badge>
                                                <div className="d-flex gap-1 action-buttons">
                                                    <Button variant="link" size="sm" className="p-1 text-primary hover-bg-white rounded-circle transition-all" as={Link} to={`/edit/${article.id}`} title="Edit">
                                                        <Edit size={16} />
                                                    </Button>
                                                    <Button variant="link" size="sm" className="p-1 text-danger hover-bg-white rounded-circle transition-all" onClick={() => handleDelete(article.id)} title="Delete">
                                                        <Trash size={16} />
                                                    </Button>
                                                </div>
                                            </div>
                                            <Link to={`/article/${article.id}`} className="text-decoration-none text-dark mb-3 flex-grow-1">
                                                <h5 className="fw-bold mb-2 lh-base">{article.title}</h5>
                                                <p className="text-muted small mb-0 line-clamp-2" style={{ fontSize: '0.85rem' }}>
                                                    {article.summary || "This insight is waiting for a professional abstract."}
                                                </p>
                                            </Link>
                                            <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                                                <div className="small text-muted d-flex align-items-center" style={{ fontSize: '0.75rem' }}>
                                                    <Clock size={12} className="me-1" />
                                                    {new Date(article.createdAt).toLocaleDateString()}
                                                </div>
                                                <div className="d-flex align-items-center gap-2">
                                                    {article.summary && <Badge bg="success" pill className="p-1" title="Summary Generated"><Star size={8} fill="white" /></Badge>}
                                                    <Link to={`/article/${article.id}`} className="text-primary text-decoration-none small fw-bold d-flex align-items-center">
                                                        Preview <ArrowRight size={12} className="ms-1" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <div className="text-center py-5">
                            <div className="bg-light d-inline-flex p-4 rounded-circle mb-4">
                                <BarChart3 size={48} className="text-muted opacity-50" />
                            </div>
                            <h4 className="fw-bold">No insights discovered yet</h4>
                            <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '400px' }}>
                                Your technical portfolio is empty. Let's change that and share your first piece of wisdom.
                            </p>
                            <Button as={Link} to="/create" variant="primary" className="rounded-pill px-5 py-2 fw-bold shadow-sm">
                                Start Composing
                            </Button>
                        </div>
                    )}
                </div>
            </Container>

            <style>{`
                .hero-stats-card {
                    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
                }
                .hero-stats-shape {
                    position: absolute;
                    bottom: -20px;
                    right: -20px;
                    width: 150px;
                    height: 150px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                    z-index: 0;
                }
                .article-management-card:hover {
                    border-color: #2563eb !important;
                }
                .cursor-pointer { cursor: pointer; }
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .hero-zap-pulse {
                    animation: zap-pulse 2s infinite;
                }
                @keyframes zap-pulse {
                    0% { transform: scale(1); opacity: 0.8; }
                    50% { transform: scale(1.2); opacity: 1; text-shadow: 0 0 10px rgba(255, 193, 7, 0.5); }
                    100% { transform: scale(1); opacity: 0.8; }
                }
                .action-buttons button:hover {
                    background-color: white !important;
                }
            `}</style>
        </div >
    );
};

export default Dashboard;
