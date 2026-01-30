import React from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaGithub, FaEnvelope, FaWhatsapp, FaShieldAlt } from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer-section">
            <div className="container">
                <div className="footer-content">
                    {/* Brand / About */}
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <span className="logo-icon"><FaShieldAlt /></span> <span className="logo-text">MK</span>
                        </Link>
                        <p className="footer-desc">
                            Professional Safety Supervisor & Computer Science Expert.
                            Dedicated to building safer workplaces and robust digital solutions.
                        </p>
                        <div className="social-links">
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
                            <a href="mailto:contact@mehrankhan.com"><FaEnvelope /></a>
                            <a href="https://wa.me/923474758571"><FaWhatsapp /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-links">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About Me</Link></li>
                            <li><Link to="/skills">Skills</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                            <li><Link to="/dashboard">Dashboard</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="footer-links">
                        <h3>Services</h3>
                        <ul>
                            <li>Safety Risk Assessment</li>
                            <li>HSE Compliance</li>
                            <li>Web Development</li>
                            <li>SEO Optimization</li>
                            <li>Digital Marketing</li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="footer-contact">
                        <h3>Contact Info</h3>
                        <p>Islamabad, Pakistan</p>
                        <p>contact@mehrankhan.com</p>
                        <p>+92 347 4758571</p>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {currentYear} Mehran Khan. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
