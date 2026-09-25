import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthPages.css';

export function LoginPage({ onLogin }) {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', form);
            const user = response.data.user;
            const token = response.data.token;

            localStorage.setItem('luraUser', JSON.stringify(user));
            localStorage.setItem('luraToken', token);
            onLogin(user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-visual">
                    <div className="auth-brand">
                        <span className="auth-brand-mark">L</span>
                        <span>LURA</span>
                    </div>

                    <div className="auth-visual-copy">
                        <h1>Welcome back.</h1>
                        <p>
                            Sign in to track orders, manage your details, and continue your next purchase in the style you love.
                        </p>
                    </div>

                    <div className="auth-visual-panel">
                        <div className="auth-mini-stat">
                            <strong>24/7</strong>
                            <span>Order access</span>
                        </div>
                        <div className="auth-mini-stat">
                            <strong>3 days</strong>
                            <span>Fast shipping</span>
                        </div>
                    </div>
                </div>

                <div className="auth-form-panel">
                    <div className="auth-form-wrap">
                        <div className="auth-form-header">
                            <h2>Log in</h2>
                            <p>Access your account and profile.</p>
                        </div>

                        <form className="auth-form" onSubmit={handleSubmit}>
                            {error && <div className="auth-alert">{error}</div>}

                            <div className="auth-field">
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>

                            <div className="auth-field">
                                <label htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>

                            <button type="submit" className="auth-button primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Signing in...' : 'Sign in'}
                            </button>
                        </form>

                        <div className="auth-footer">
                            New to Lura? <Link to="/signup">Create account</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
