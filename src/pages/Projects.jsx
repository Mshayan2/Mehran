import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaTools } from 'react-icons/fa';
import { usePortfolio } from '../context/PortfolioContext';

const Projects = () => {
    const { data } = usePortfolio();

    // Fallback if data hasn't loaded or projects is missing
    const projects = data?.projects || [];

    return (
        <motion.div
            className="section container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="section-title">Featured Projects</div>
            <div className="cards-grid">
                {projects.map((project, index) => (
                    <motion.div
                        key={project.id || index}
                        className="card"
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 }}
                    >
                        <div className="card-icon" style={{ background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-tech)' }}>
                            <FaTools />
                        </div>
                        <h3>{project.title}</h3>
                        <h4>{project.category}</h4>
                        <p>{project.desc}</p>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                            {project.tech.map((t, i) => (
                                <span key={i} className="badge" style={{ fontSize: '0.8rem', padding: '0.2rem 0.8rem' }}>{t}</span>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {/* Example links */}
                            <a href={project.link} className="btn secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>View Details</a>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default Projects;
