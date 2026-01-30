import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaShieldAlt, FaLaptop, FaChartLine, FaCheckCircle, FaQuoteLeft } from 'react-icons/fa';
import { usePortfolio } from '../context/PortfolioContext';

const Home = () => {

    const { data } = usePortfolio();

    const fadeIn = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    // Helper to get icon for expertise
    const getExpertiseIcon = (id) => {
        switch (id) {
            case 1: return <FaShieldAlt />;
            case 2: return <FaLaptop />;
            case 3: return <FaChartLine />;
            default: return <FaShieldAlt />;
        }
    };

    // Helper to get accent color for bullets based on expertise id
    const getBulletColor = (id) => {
        return id === 2 ? 'var(--accent-tech)' : 'var(--accent-safety)';
    };

    return (
        <>
            {/* Hero Section */}
            <motion.div
                className="section hero-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="hero-content">
                    <motion.span
                        className="badge"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {data.hero.badge}
                    </motion.span>
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {data.hero.titleLine1} <br /> <span className="highlight">{data.hero.titleHighlight}</span>
                    </motion.h1>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        dangerouslySetInnerHTML={{ __html: data.hero.description }}
                    ></motion.p>
                    <motion.div
                        className="cta-buttons"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Link to="/contact" className="btn primary">Hire Me <FaArrowRight style={{ marginLeft: '8px' }} /></Link>
                        <Link to="/projects" className="btn secondary">View Projects</Link>
                    </motion.div>
                </div>

                <motion.div
                    className="hero-image"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <div className="image-wrapper">
                        <img
                            src={data.hero.profileImage || "https://via.placeholder.com/350x350"}
                            alt="Mehran Khan"
                        />
                    </div>
                </motion.div>
            </motion.div>

            {/* Services / Expertise Section */}
            <motion.div
                className="section container"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeIn}
            >
                <div className="section-title">My Expertise</div>
                <div className="cards-grid">
                    {data.expertise.map((item) => (
                        <div className="card" key={item.id}>
                            <div className="card-icon">{getExpertiseIcon(item.id)}</div>
                            <h3>{item.title}</h3>
                            <p>{item.desc}</p>
                            <ul style={{ listStyle: 'none', color: 'var(--text-secondary)' }}>
                                {item.points.map((point, index) => (
                                    <li key={index} style={{ marginBottom: '8px' }}>
                                        <FaCheckCircle style={{ color: getBulletColor(item.id), marginRight: '8px' }} /> {point}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Testimonials Section */}
            <motion.div
                className="section container"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                style={{ padding: '2rem 2rem 4rem' }}
            >
                <div className="section-title">What Clients Say</div>
                <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>

                    {data.testimonials.map((t) => (
                        <div className="card" style={{ position: 'relative' }} key={t.id}>
                            <FaQuoteLeft style={{ fontSize: '2rem', color: 'var(--glass-border)', position: 'absolute', top: '1rem', right: '1rem' }} />
                            <p style={{ fontStyle: 'italic', marginBottom: '1.5rem' }}>
                                "{t.text}"
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                {t.image ? (
                                    <img src={t.image} alt={t.name} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '50px', height: '50px', background: t.id === 2 ? 'var(--accent-tech)' : (t.id === 3 ? 'gray' : 'var(--accent-safety)'), borderRadius: '50%' }}></div>
                                )}
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '1rem' }}>{t.name}</h4>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t.role}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </motion.div>

            {/* About Teaser / Unique Value */}
            <motion.div
                className="section container"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                style={{
                    background: 'var(--bg-color-alt)',
                    borderRadius: '20px',
                    padding: '4rem',
                    textAlign: 'center',
                    border: '1px solid var(--glass-border)',
                    marginBottom: '2rem'
                }}
            >
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Where Safety Meets Technology</h2>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        It's rare to find a professional who understands both the <strong>physical risks</strong> of a job site and the <strong>digital nuances</strong> of modern business.
                        With a BS in Computer Science and top-tier safety certifications, I offer a unique perspective that prioritizes precision, compliance, and innovation.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                        <div style={{ textAlign: 'center' }}>
                            <h3 style={{ fontSize: '2.5rem', color: 'var(--accent-safety)' }}>NEBOSH</h3>
                            <p>Certified</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <h3 style={{ fontSize: '2.5rem', color: 'var(--accent-tech)' }}>BS CS</h3>
                            <p>Graduate</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <h3 style={{ fontSize: '2.5rem', color: 'var(--accent-safety)' }}>100%</h3>
                            <p>Compliance</p>
                        </div>
                    </div>
                    <div style={{ marginTop: '3rem' }}>
                        <Link to="/about" className="btn secondary">Learn More About Me</Link>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default Home;
