import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ArticleDetail from './pages/ArticleDetail';
import CreateEditArticle from './pages/CreateEditArticle';
import Dashboard from './pages/Dashboard';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <div className="min-vh-100 d-flex flex-column">
                <Navbar />
                <main className="flex-grow-1">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route
                            path="/create"
                            element={
                                <ProtectedRoute>
                                    <CreateEditArticle />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/edit/:id"
                            element={
                                <ProtectedRoute>
                                    <CreateEditArticle />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/article/:id" element={<ArticleDetail />} />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
