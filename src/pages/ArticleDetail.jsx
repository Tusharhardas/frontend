import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Badge, Button, Spinner, Alert, Row, Col, Card } from 'react-bootstrap';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Edit, Trash, ArrowLeft, Clock, Share2, Printer, Bookmark } from 'lucide-react';

const ArticleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const { data } = await API.get(`/articles/${id}`);
                setArticle(data);
            } catch (err) {
                setError('Article not found or server error');
            }
            setLoading(false);
        };
        fetchArticle();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to permanently delete this insight?')) {
            try {
                await API.delete(`/articles/${id}`);
                navigate('/dashboard');
            } catch (err) {
                alert('Failed to delete article');
            }
        }
    };

    if (loading) return <div className="text-center mt-5 py-5"><Spinner animation="border" variant="primary" /></div>;
    if (error) return <Container className="mt-5"><Alert variant="danger" className="rounded-4">{error}</Alert></Container>;

    const isAuthor = user && article && user.id === article.authorId;

    return (
        <div className="bg-white min-vh-100">
            {/* Top Navigation Bar */}
            <div className="border-bottom sticky-top bg-white bg-opacity-75" style={{ backdropFilter: 'blur(10px)', zIndex: 1000 }}>
                <Container className="py-2">
                    <div className="d-flex justify-content-between align-items-center">
                        <Button variant="link" className="p-0 text-decoration-none text-dark d-flex align-items-center fw-medium small" onClick={() => navigate(-1)}>
                            <ArrowLeft size={16} className="me-2 text-primary" /> Back to Library
                        </Button>
                        <div className="d-flex gap-2">
                            <Button variant="link" className="text-muted p-2 hover-bg-light rounded-circle"><Share2 size={18} /></Button>
                            <Button variant="link" className="text-muted p-2 hover-bg-light rounded-circle"><Bookmark size={18} /></Button>
                            {isAuthor && (
                                <>
                                    <div className="vr mx-2"></div>
                                    <Button variant="outline-primary" size="sm" className="rounded-pill px-3 border-2 fw-bold" as={Link} to={`/edit/${id}`}>
                                        <Edit size={14} className="me-1" /> Edit
                                    </Button>
                                    <Button variant="outline-danger" size="sm" className="rounded-pill px-3 border-2 fw-bold" onClick={handleDelete}>
                                        <Trash size={14} className="me-1" /> Delete
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </Container>
            </div>

            <Container className="py-5" style={{ maxWidth: '850px' }}>
                {/* Meta Header */}
                <div className="mb-4 d-flex justify-content-center">
                    <Badge bg="primary" pill className="px-3 py-2 text-uppercase mb-3 shadow-sm" style={{ letterSpacing: '1px', fontSize: '10px' }}>
                        {article.category}
                    </Badge>
                </div>

                <header className="text-center mb-5">
                    <h1 className="display-3 fw-bold mb-4 text-dark lh-tight" style={{ letterSpacing: '-1px' }}>
                        {article.title}
                    </h1>

                    {article.summary && (
                        <p className="lead text-muted mx-auto mb-5 italic border-start border-4 border-primary ps-4 py-1 bg-light text-start" style={{ maxWidth: '750px' }}>
                            {article.summary}
                        </p>
                    )}

                    <div className="d-flex align-items-center justify-content-center py-4 border-top">
                        <div className="d-flex align-items-center text-start">
                            <div className="bg-primary bg-gradient rounded-circle text-white d-flex align-items-center justify-content-center me-3 shadow-sm"
                                style={{ width: '56px', height: '56px', fontSize: '20px', fontWeight: 'bold' }}>
                                {article.User?.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h6 className="mb-0 fw-bold">{article.User?.username}</h6>
                                <div className="text-muted small d-flex align-items-center gap-3">
                                    <span className="d-flex align-items-center"><Clock size={12} className="me-1" /> 5 min read</span>
                                    <span>{new Date(article.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Article Content */}
                <article className="article-content fs-5 mb-5 lh-lg" style={{ color: '#1a202c', fontFamily: 'Inter, system-ui' }}>
                    <div dangerouslySetInnerHTML={{ __html: article.content }} className="rich-content" />
                </article>

                {/* Footer Meta */}
                <footer className="mt-5 pt-5 border-top">
                    {article.tags && (
                        <div className="mb-5 text-center">
                            <div className="d-flex flex-wrap gap-2 justify-content-center">
                                {article.tags.split(',').map(tag => (
                                    <Badge key={tag} bg="light" text="dark" className="border px-3 py-2 fw-medium rounded-pill shadow-sm">
                                        #{tag.trim()}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    <Card className="border-0 bg-light rounded-4 overflow-hidden mb-5">
                        <Card.Body className="p-4 d-flex align-items-center">
                            <div className="bg-white p-3 rounded-4 me-4 shadow-sm text-primary">
                                <Printer size={24} />
                            </div>
                            <div>
                                <h5 className="fw-bold mb-1 text-dark">Technical Insight Collection</h5>
                                <p className="text-muted small mb-0">You are reading a community-contributed technical piece. Consider sharing your own insights to helper others.</p>
                            </div>
                            <Button variant="primary" as={Link} to="/create" className="ms-auto rounded-pill px-4 fw-bold shadow-sm">Write Yours</Button>
                        </Card.Body>
                    </Card>
                </footer>
            </Container>

            <style>{`
                .rich-content img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 12px;
                    margin: 2rem 0;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                }
                .rich-content h2 { margin-top: 2.5rem; margin-bottom: 1rem; font-weight: 700; color: #1a202c; }
                .rich-content p { margin-bottom: 1.5rem; }
                .rich-content pre { background: #f8fafc; padding: 1.5rem; border-radius: 8px; font-size: 0.9rem; margin: 1.5rem 0; }
                .rich-content blockquote { border-left: 4px solid var(--primary); padding-left: 1.5rem; color: #475569; font-style: italic; margin: 2rem 0; }
            `}</style>
        </div>
    );
};

export default ArticleDetail;
