import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProfilePage.css';
import { NavBar } from '../Components/NavBar';

export function ProfilePage({ user, onLogout }) {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        city: user?.city || '',
        state: user?.state || '',
        zipCode: user?.zipCode || ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const initials = useMemo(() => {
        if (!user) return 'U';
        return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U';
    }, [user]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async (event) => {
        event.preventDefault();
        setMessage('');
        setError('');

        try {
            const token = localStorage.getItem('luraToken');
            const response = await axios.put('http://localhost:3000/api/auth/profile', form, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const nextUser = response.data.user;
            localStorage.setItem('luraUser', JSON.stringify(nextUser));
            onLogout(nextUser);
            setMessage('Your profile details were updated successfully.');
        } catch (err) {
            setError(err.response?.data?.error || 'We could not save your profile.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('luraUser');
        localStorage.removeItem('luraToken');
        onLogout(null);
        navigate('/login');
    };

    if (!user) {
        return (
            <div className="profile-page">
                <div className="profile-grid">
                    <div className="profile-card empty-state">
                        <h2>Please sign in</h2>
                        <p>You need to be logged in to view your profile.</p>
                        <button className="profile-button primary" onClick={() => navigate('/login')}>Go to login</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
        <NavBar/>
        <div className="profile-page">
            <div className="profile-grid">
                <aside className="profile-side">
                    <div className="profile-avatar">{initials}</div>
                    <div>
                        <h2>{user.firstName} {user.lastName}</h2>
                        <p>{user.email}</p>
                    </div>

                    <div className="profile-side-stats">
                        <div className="profile-stat">
                            <strong>01</strong>
                            <span>Orders</span>
                        </div>
                        <div className="profile-stat">
                            <strong>{user.city || 'N/A'}</strong>
                            <span>Location</span>
                        </div>
                    </div>

                    <button className="profile-button secondary" onClick={handleLogout}>Log out</button>
                </aside>

                <main className="profile-main">
                    <div className="profile-topbar">
                        <h3>Account details</h3>
                        <div className="profile-actions">
                            <button type="button" className="profile-button primary" onClick={handleSave}>Save changes</button>
                        </div>
                    </div>

                    <form className="profile-form" onSubmit={handleSave}>
                        <div className="profile-field">
                            <label htmlFor="firstName">First name</label>
                            <input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} />
                        </div>

                        <div className="profile-field">
                            <label htmlFor="lastName">Last name</label>
                            <input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} />
                        </div>

                        <div className="profile-field full">
                            <label htmlFor="email">Email</label>
                            <input id="email" name="email" value={form.email} onChange={handleChange} disabled />
                        </div>

                        <div className="profile-field full">
                            <label htmlFor="address">Address</label>
                            <input id="address" name="address" value={form.address} onChange={handleChange} placeholder="Street address" />
                        </div>

                        <div className="profile-field">
                            <label htmlFor="city">City</label>
                            <input id="city" name="city" value={form.city} onChange={handleChange} placeholder="City" />
                        </div>

                        <div className="profile-field">
                            <label htmlFor="state">State</label>
                            <input id="state" name="state" value={form.state} onChange={handleChange} placeholder="State" />
                        </div>

                        <div className="profile-field">
                            <label htmlFor="zipCode">ZIP code</label>
                            <input id="zipCode" name="zipCode" value={form.zipCode} onChange={handleChange} placeholder="ZIP code" />
                        </div>

                        <div className="profile-field">
                            <label htmlFor="phone">Phone</label>
                            <input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="(555) 000-0000" />
                        </div>
                    </form>

                    {message && <div className="profile-alert">{message}</div>}
                    {error && <div className="profile-alert error">{error}</div>}
                </main>
            </div>
        </div>
        </>
    );
}
