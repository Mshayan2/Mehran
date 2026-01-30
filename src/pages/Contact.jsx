import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');

        try {
            // Updated to point to backend URL
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await fetch(`${API_URL}/contact/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });
                alert('Message sent successfully!');
            } else {
                setStatus('error');
                alert('Failed to send message: ' + data.message);
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <motion.div
            className="section container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="section-title">Get In Touch</div>

            <div className="contact-container">
                {/* Contact Info */}
                <div className="contact-info">
                    <h3 style={{ marginBottom: '2rem' }}>Let's Discuss Your Safety Or Tech Needs</h3>

                    <div className="contact-info-item">
                        <div className="contact-icon"><FaPhoneAlt /></div>
                        <div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Phone</div>
                            <div>+92 347 4758571</div>
                        </div>
                    </div>

                    <div className="contact-info-item">
                        <div className="contact-icon"><FaEnvelope /></div>
                        <div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Email</div>
                            <div>contact@example.com</div>
                        </div>
                    </div>

                    <div className="contact-info-item">
                        <div className="contact-icon"><FaMapMarkerAlt /></div>
                        <div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Location</div>
                            <div>Available for Remote & On-site work</div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Your Name</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Your Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Message</label>
                        <textarea
                            name="message"
                            rows="5"
                            className="form-control"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>

                    <button type="submit" className="btn primary" style={{ width: '100%' }} disabled={status === 'sending'}>
                        {status === 'sending' ? 'Sending...' : 'Send Message'} <FaPaperPlane style={{ marginLeft: '10px' }} />
                    </button>
                </form>
            </div>
        </motion.div>
    );
};

export default Contact;
