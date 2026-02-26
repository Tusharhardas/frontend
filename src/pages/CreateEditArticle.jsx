import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Alert, Spinner, Container, InputGroup, Badge } from 'react-bootstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import API from '../services/api';
import { Sparkles, Save, X, Settings, Image as ImageIcon, Wand2, Type, AlignLeft } from 'lucide-react';

const CreateEditArticle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Tech');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [summary, setSummary] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);

    useEffect(() => {
        if (id) {
            const fetchArticle = async () => {
                try {
                    const { data } = await API.get(`/articles/${id}`);
                    setTitle(data.title);
                    setCategory(data.category);
                    setContent(data.content);
                    setTags(data.tags);
                    setSummary(data.summary);
                } catch (err) {
                    setError('Failed to fetch article details');
                }
            };
            fetchArticle();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!content || content === '<p><br></p>') {
            setError('Content cannot be empty');
            return;
        }
        setLoading(true);
        try {
            const articleData = { title, category, content, tags, summary };
            if (id) {
                await API.put(`/articles/${id}`, articleData);
            } else {
                await API.post('/articles', articleData);
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save article');
        }
        setLoading(false);
    };

    const handleAIImprove = async (action) => {
        if (!content) return;
        setAiLoading(true);
        try {
            const { data } = await API.post('/ai/improve', { content, action });
            if (data.improved === content) {
                setSuccess('AI check complete: Your content is already excellent! No changes needed.');
            } else {
                setContent(data.improved);
                setSuccess('AI optimization applied successfully!');
            }
            setTimeout(() => setSuccess(''), 4000);
        } catch (err) {
            setError('AI assistant failed: ' + (err.response?.data?.message || err.message));
        }
        setAiLoading(false);
    };

    const handleAISummarize = async () => {
        if (!content) return;
        setAiLoading(true);
        try {
            const { data } = await API.post('/ai/summarize', { content });
            setSummary(data.summary);
        } catch (err) {
            setError('Summary failed: ' + (err.response?.data?.message || err.message));
        }
        setAiLoading(false);
    };

    const handleAISuggestTitle = async () => {
        if (!content) return;
        setAiLoading(true);
        try {
            const { data } = await API.post('/ai/suggest-title', { content });
            setTitle(data.improvedTitle);
        } catch (err) {
            setError('Title suggestion failed: ' + (err.response?.data?.message || err.message));
        }
        setAiLoading(false);
    };

    const categories = ['Tech', 'AI', 'Backend', 'Frontend', 'DevOps'];

    return (
        <Container fluid className="px-lg-5 py-4">
            <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                <div>
                    <h2 className="fw-bold m-0 text-dark">
                        {id ? 'Edit Your Insight' : 'Compose New Insight'}
                    </h2>
                    <p className="text-muted small m-0">Drafting stories that matter to the developer community.</p>
                </div>
                <div className="d-flex gap-2">
                    <Button variant="outline-secondary" className="rounded-pill px-4" onClick={() => navigate(-1)}>
                        <X size={18} className="me-1" /> Discard
                    </Button>
                    <Button variant="primary" className="rounded-pill px-4 shadow-sm fw-bold" onClick={handleSubmit} disabled={loading || aiLoading}>
                        {loading ? <Spinner size="sm" className="me-2" /> : <Save size={18} className="me-1" />}
                        {id ? 'Update Insight' : 'Publish Now'}
                    </Button>
                </div>
            </div>

            <Row className="g-4">
                {/* Main Content Area */}
                <Col lg={8}>
                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                        <Card.Body className="p-4">
                            {error && <Alert variant="danger" className="rounded-3" onClose={() => setError('')} dismissible>{error}</Alert>}
                            {success && <Alert variant="success" className="rounded-3 shadow-sm border-0 bg-success bg-opacity-10 text-success fw-medium" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

                            <Form.Group className="mb-4">
                                <InputGroup className="input-group-lg border-0 bg-light rounded-3 overflow-hidden">
                                    <InputGroup.Text className="bg-transparent border-0 pe-0 text-muted">
                                        <Type size={20} />
                                    </InputGroup.Text>
                                    <Form.Control
                                        className="bg-transparent border-0 shadow-none py-3"
                                        style={{ fontSize: '1.5rem', fontWeight: '700' }}
                                        type="text"
                                        placeholder="Enter your title here..."
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                    <Button variant="link" className="text-primary border-0" onClick={handleAISuggestTitle} disabled={aiLoading} title="AI Title Suggest">
                                        <Sparkles size={20} />
                                    </Button>
                                </InputGroup>
                            </Form.Group>

                            <div className="mb-3 d-flex justify-content-between align-items-center">
                                <span className="small fw-bold text-uppercase text-muted">Article Body</span>
                                <div className="d-flex gap-2 ai-tools-pill bg-light p-1 rounded-pill border">
                                    <Button variant="link" size="sm" className="text-decoration-none text-dark small py-1 px-3 d-flex align-items-center" onClick={() => handleAIImprove('rewrite')} disabled={aiLoading}>
                                        <Wand2 size={14} className="me-1 text-primary" /> Polish
                                    </Button>
                                    <div className="vr my-1"></div>
                                    <Button variant="link" size="sm" className="text-decoration-none text-dark small py-1 px-3" onClick={() => handleAIImprove('concise')} disabled={aiLoading}>
                                        Shorten
                                    </Button>
                                    <div className="vr my-1"></div>
                                    <Button variant="link" size="sm" className="text-decoration-none text-dark small py-1 px-3" onClick={() => handleAIImprove('grammar')} disabled={aiLoading}>
                                        Fix Grammar
                                    </Button>
                                </div>
                            </div>

                            <div className="editor-container rounded-3 border-0 bg-white">
                                <ReactQuill
                                    theme="snow"
                                    value={content}
                                    onChange={setContent}
                                    style={{ height: '500px', marginBottom: '50px' }}
                                    placeholder="Tell your story..."
                                />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Sidebar Configuration */}
                <Col lg={4}>
                    <Card className="border-0 shadow-sm rounded-4 mb-4">
                        <Card.Header className="bg-white border-0 pt-4 px-4 pb-0">
                            <h5 className="fw-bold d-flex align-items-center">
                                <Settings size={18} className="me-2 text-primary" /> Insight Settings
                            </h5>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <Form.Group className="mb-4">
                                <Form.Label className="small fw-bold text-uppercase text-muted">Broad Category</Form.Label>
                                <Form.Select
                                    className="bg-light border-0 py-2"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                >
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <Form.Label className="small fw-bold text-uppercase text-muted m-0">Brief Abstract</Form.Label>
                                    <Button variant="link" size="sm" className="text-decoration-none p-0 text-primary small" onClick={handleAISummarize} disabled={aiLoading}>
                                        <Sparkles size={12} className="me-1" /> Generate
                                    </Button>
                                </div>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    className="bg-light border-0"
                                    placeholder="Write a short summary..."
                                    value={summary}
                                    onChange={(e) => setSummary(e.target.value)}
                                />
                                <Form.Text className="text-muted small">This is what readers see first.</Form.Text>
                            </Form.Group>

                            <Form.Group className="mb-0">
                                <Form.Label className="small fw-bold text-uppercase text-muted">Keywords</Form.Label>
                                <Form.Control
                                    type="text"
                                    className="bg-light border-0"
                                    placeholder="react, api, performance"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                />
                                <Form.Text className="text-muted small">Comma separated tags.</Form.Text>
                            </Form.Group>
                        </Card.Body>
                    </Card>

                    <Card className="border-0 shadow-sm rounded-4 bg-primary text-white overflow-hidden">
                        <Card.Body className="p-4">
                            <h6 className="fw-bold mb-2">Publishing Tips</h6>
                            <ul className="small ps-3 mb-0 opacity-75">
                                <li>Use AI tools to refine your grammar.</li>
                                <li>Clear summaries increase read time.</li>
                                <li>Relevant keywords help searchability.</li>
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CreateEditArticle;
