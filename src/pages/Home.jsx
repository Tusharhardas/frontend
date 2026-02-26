import React, { useState, useEffect } from 'react';
import { Card, Badge, Row, Col, Form, InputGroup, Container, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Search, ArrowRight, Sparkles, Filter, TrendingUp, Zap, Plus } from 'lucide-react';

const Home = () => {
    const { user } = useAuth();
    const [articles, setArticles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const { data } = await API.get('/articles');
                setArticles(data);
            } catch (err) {
                console.error('Error fetching articles:', err);
            }
            setLoading(false);
        };
        fetchArticles();
    }, []);

    const filteredArticles = articles.filter((article) => {
        const matchesSearch =
            article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (article.tags && article.tags.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = categoryFilter === '' || article.category === categoryFilter;

        return matchesSearch && matchesCategory;
    });

    const categories = ['Tech', 'AI', 'Backend', 'Frontend', 'DevOps'];

    if (loading) return (
        <div className="text-center py-5 mt-5">
            <Spinner animation="grow" variant="primary" />
            <p className="mt-3 text-muted fw-bold">Curating insights for you...</p>
        </div>
    );

    return (
        <div className="pb-5 bg-light min-vh-100">
            <div className="hero-section text-center text-white mb-5 position-relative overflow-hidden">
                <div className="hero-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                </div>
                <Container className="position-relative py-5">
                    <Badge bg="primary" pill className="px-3 py-2 mb-4 text-uppercase fw-bold shadow-sm" style={{ letterSpacing: '2px', fontSize: '10px' }}>
                        <Zap size={12} className="me-1" /> AI-Powered Technical Hub
                    </Badge>
                    <h1 className="display-2 fw-bold mb-3 landing-header lh-tight mx-auto" style={{ maxWidth: '900px' }}>
                        Elevate Your <span className="text-gradient">Technical Insights</span>
                    </h1>
                    <p className="lead opacity-75 mb-5 mx-auto fs-4" style={{ maxWidth: '750px' }}>
                        The premier destination for deep-dive technical articles. Share your expertise and leverage integrated AI to polish your narrative.
                    </p>
                    <div className="d-flex justify-content-center gap-3 mb-5">
                        {user ? (
                            <>
                                <Link to="/create" className="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow fw-bold border-0 transition-all hover-translate-y">
                                    Create Article <Plus size={18} className="ms-2" />
                                </Link>
                                <Link to="/dashboard" className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill fw-bold transition-all hover-bg-white hover-text-dark">
                                    My Dashboard
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/signup" className="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow fw-bold border-0 transition-all hover-translate-y">
                                    Get Started <ArrowRight size={18} className="ms-2" />
                                </Link>
                                <Link to="/login" className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill fw-bold transition-all hover-bg-white hover-text-dark">
                                    Start Writing
                                </Link>
                            </>
                        )}
                    </div>
                    <div className="d-flex justify-content-center gap-4 small opacity-75 mt-4">
                        <span className="d-flex align-items-center"><TrendingUp size={16} className="me-2" /> 500+ Articles</span>
                        <span className="d-flex align-items-center"><Sparkles size={16} className="me-2" /> AI-Enhanced</span>
                    </div>
                </Container>
            </div>

            <Container className="mt-n5">
                {/* Search & Filter Bar */}
                <Card className="border-0 shadow-lg rounded-5 mb-5 overflow-hidden translate-middle-y mt-n5 mx-auto" style={{ maxWidth: '900px', zIndex: 10 }}>
                    <Card.Body className="p-3">
                        <Row className="g-2">
                            <Col md={7}>
                                <InputGroup className="bg-light rounded-pill overflow-hidden h-100">
                                    <InputGroup.Text className="bg-transparent border-0 ps-4">
                                        <Search size={20} className="text-muted" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        className="bg-transparent border-0 shadow-none py-3 fs-5"
                                        placeholder="Search for articles, tags, authors..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </InputGroup>
                            </Col>
                            <Col md={5}>
                                <div className="d-flex gap-2 h-100">
                                    <Form.Select
                                        className="bg-light border-0 rounded-pill px-4 fw-bold text-muted h-100 py-3"
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </Form.Select>
                                    <Button variant="primary" className="rounded-pill p-3 border-0 transition-all hover-rotate shadow-sm">
                                        <Filter size={20} />
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {/* Feed Header */}
                <div className="d-flex justify-content-between align-items-end mb-4 px-2">
                    <div>
                        <h2 className="fw-bold m-0 text-dark">Explore Latest Insights</h2>
                        <p className="text-muted m-0">Discover the best technical pieces curated by the community.</p>
                    </div>
                    <div className="d-none d-md-block">
                        <Link to="/signup" className="text-decoration-none fw-bold text-primary">
                            Follow Trends <ArrowRight size={16} className="ms-1" />
                        </Link>
                    </div>
                </div>

                {/* Articles Feed */}
                <Row className="g-4">
                    {filteredArticles.length > 0 ? (
                        filteredArticles.map((article, index) => (
                            <Col md={6} lg={4} key={article.id}>
                                <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden transition-all hover-shadow-lg hover-translate-y bg-white">
                                    <div className="article-card-accent" style={{
                                        height: '4px',
                                        background: index % 3 === 0 ? 'var(--primary)' :
                                            index % 3 === 1 ? '#10b981' : '#f59e0b'
                                    }}></div>
                                    <Card.Body className="p-4 d-flex flex-column">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <Badge bg="light" text="dark" className="border px-2 py-1 small fw-bold text-uppercase" style={{ fontSize: '10px' }}>
                                                {article.category}
                                            </Badge>
                                            <small className="text-muted d-flex align-items-center">
                                                <Clock size={12} className="me-1" /> 5m read
                                            </small>
                                        </div>
                                        <Card.Title className="h4 fw-bold mb-3 lh-sm">
                                            <Link to={`/article/${article.id}`} className="text-decoration-none text-dark hover-primary transition-all">
                                                {article.title}
                                            </Link>
                                        </Card.Title>
                                        <Card.Text className="text-muted small mb-4 flex-grow-1 line-clamp-3">
                                            {article.summary || "Dive into this comprehensive technical exploration and broaden your engineering horizons..."}
                                        </Card.Text>
                                        <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center">
                                                <div className="bg-primary rounded-circle text-white d-flex align-items-center justify-content-center me-3 shadow-sm"
                                                    style={{ width: '40px', height: '40px', fontSize: '14px', fontWeight: 'bold' }}>
                                                    {article.User?.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <strong className="d-block text-dark" style={{ fontSize: '0.9rem' }}>{article.User?.username}</strong>
                                                    <small className="text-muted" style={{ fontSize: '0.8rem' }}>Senior Engineer</small>
                                                </div>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col xs={12} className="text-center py-5">
                            <div className="bg-white p-5 rounded-5 shadow-sm">
                                <Search size={64} className="text-muted opacity-25 mb-4" />
                                <h3 className="fw-bold">No insights found</h3>
                                <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '400px' }}>We couldn't find any articles matching your search criteria. Try adjusting your filters.</p>
                                <Button onClick={() => { setSearchTerm(''); setCategoryFilter(''); }} variant="outline-primary" className="rounded-pill px-4">Clear All Filters</Button>
                            </div>
                        </Col>
                    )}
                </Row>
            </Container>

            <style>{`
                .hero-section {
                    background: #0f172a;
                    padding: 6rem 0 8rem;
                }
                .hero-shapes .shape {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                    z-index: 0;
                }
                .shape-1 {
                    width: 400px;
                    height: 400px;
                    background: rgba(37, 99, 235, 0.15);
                    top: -100px;
                    right: -100px;
                }
                .shape-2 {
                    width: 300px;
                    height: 300px;
                    background: rgba(16, 185, 129, 0.1);
                    bottom: -50px;
                    left: -50px;
                }
                .text-gradient {
                    background: linear-gradient(135deg, #3b82f6 0%, #10b981 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .hover-translate-y:hover { transform: translateY(-5px); }
                .hover-rotate:hover svg { transform: rotate(15deg); }
                .line-clamp-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .hero-zap-pulse {
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 0.3; }
                    50% { transform: scale(1.1); opacity: 0.6; }
                    100% { transform: scale(1); opacity: 0.3; }
                }
            `}</style>
        </div>
    );
};

const Clock = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);

export default Home;
