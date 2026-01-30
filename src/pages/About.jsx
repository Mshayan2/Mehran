import React from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaUserShield, FaLaptopCode, FaCheckCircle } from 'react-icons/fa';

const About = () => {
    return (
        <motion.div
            className="section container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
        >
            <div className="section-title">About Me</div>

            <div className="about-content" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>

                <div className="about-text">
                    <h3 style={{ marginBottom: '1rem', color: 'var(--accent-tech)' }}>Professional Profile</h3>
                    <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                        As a multi-disciplinary professional, I uniquely bridge the gap between <strong>Occupational Health & Safety</strong> and <strong>Information Technology</strong>.
                        With a solid foundation in Computer Science (BS CS) and extensive certification in safety protocols (NEBOSH, IOSH, OSH), I bring a modern, data-driven approach to safety supervision.
                    </p>
                    <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                        My dual expertise allows me to not only oversee physical site safety but also implement digital solutions such as <strong>Safety Management Systems</strong>,
                        digital auditing tools, and SEO-optimized compliance reporting. I believe in a future where technology enhances human safety.
                    </p>
                </div>

                <div className="about-stats">
                    <div className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            <FaGraduationCap style={{ color: 'var(--accent-safety)', fontSize: '1.5rem' }} />
                            <h3>Education</h3>
                        </div>
                        <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
                            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FaCheckCircle style={{ color: 'var(--accent-tech)' }} /> BS Computer Science
                            </li>
                            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FaCheckCircle style={{ color: 'var(--accent-tech)' }} /> FSc Pre-Engineering/CS
                            </li>
                        </ul>
                    </div>

                    <div className="card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            <FaUserShield style={{ color: 'var(--accent-safety)', fontSize: '1.5rem' }} />
                            <h3>Key Roles</h3>
                        </div>
                        <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
                            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FaCheckCircle style={{ color: 'var(--accent-tech)' }} /> Safety Supervisor
                            </li>
                            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FaCheckCircle style={{ color: 'var(--accent-tech)' }} /> Digital Marketing Specialist
                            </li>
                            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FaCheckCircle style={{ color: 'var(--accent-tech)' }} /> SEO Expert
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </motion.div>
    );
};

export default About;
