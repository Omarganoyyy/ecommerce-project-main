import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthPages.css';
import { NavBar } from '../Components/NavBar';

export function SignupPage({ onLogin }) {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
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
            const response = await axios.post('http://localhost:3000/api/auth/signup', form);
            const user = response.data.user;
            const token = response.data.token;

            localStorage.setItem('luraUser', JSON.stringify(user));
            localStorage.setItem('luraToken', token);
            onLogin(user);
            navigate('/profile');
        } catch (err) {
            setError(err.response?.data?.error || 'Signup failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
        <NavBar/>
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-visual">
                    <div className="auth-brand">
                        <span className="auth-brand-mark">L</span>
                        <span>LURA</span>
                    </div>

                    <div className="auth-visual-copy">
                        <h1>Create your account.</h1>
                        <p>
                            Get access to saved orders, your order history, profile details, and a faster checkout experience.
                        </p>
                    </div>

                    <div className="auth-visual-panel">
                        <div className="auth-mini-stat">
                            <strong>Fast</strong>
                            <span>Checkout</span>
                        </div>
                        <div className="auth-mini-stat">
                            <strong>Saved</strong>
                            <span>Profile</span>
                        </div>
                    </div>
                </div>

                <div className="auth-form-panel">
                    <div className="auth-form-wrap">
                        <div className="auth-form-header">
                            <h2>Sign up</h2>
                            <p>Start your Lura account today.</p>
                        </div>

                        <form className="auth-form" onSubmit={handleSubmit}>
                            {error && <div className="auth-alert">{error}</div>}

                            <div className="auth-row">
                                <div className="auth-field">
                                    <label htmlFor="firstName">First name</label>
                                    <input
                                        id="firstName"
                                        type="text"
                                        name="firstName"
                                        value={form.firstName}
                                        onChange={handleChange}
                                        placeholder="Jane"
                                        required
                                    />
                                </div>

                                <div className="auth-field">
                                    <label htmlFor="lastName">Last name</label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        name="lastName"
                                        value={form.lastName}
                                        onChange={handleChange}
                                        placeholder="Smith"
                                        required
                                    />
                                </div>
                            </div>

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
                                    placeholder="Minimum 6 characters"
                                    required
                                />
                            </div>

                            <button type="submit" className="auth-button primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Creating account...' : 'Create account'}
                            </button>
                        </form>

                        <div className="auth-footer">
                            Already have an account? <Link to="/login">Log in</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}
