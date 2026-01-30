import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHardHat, FaShieldAlt, FaFireExtinguisher, FaLaptop, FaBullhorn, FaCertificate } from 'react-icons/fa';
import { usePortfolio } from '../context/PortfolioContext';

const Certifications = () => {
    const { data, loading } = usePortfolio();

    // Map icon string to component
    const getIcon = (iconType) => {
        switch (iconType) {
            case 'hardHat': return <FaHardHat />;
            case 'shield': return <FaShieldAlt />;
            case 'fire': return <FaFireExtinguisher />;
            case 'laptop': return <FaLaptop />;
            case 'bullhorn': return <FaBullhorn />;
            default: return <FaCertificate />;
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    if (loading || !data?.certifications) return null;

    const [selectedImage, setSelectedImage] = React.useState(null);

    return (
        <>
            <motion.div
                className="section container"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
            >
                <div className="section-title">Certifications</div>
                <div className="cards-grid">
                    {data.certifications.map((cert, index) => (
                        <motion.div key={cert.id || index} className="card" variants={itemVariants} style={{ overflow: 'hidden' }}>
                            {cert.image && cert.image.trim() !== "" && (
                                <div
                                    style={{ marginBottom: '1rem', width: '100%', height: '200px', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--glass-bg)', cursor: 'pointer' }}
                                    onClick={() => setSelectedImage(cert.image)}
                                >
                                    <img
                                        src={cert.image}
                                        alt={cert.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                        }}
                                        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                    />
                                </div>
                            )}
                            <h3>{cert.title}</h3>
                            <h4>{cert.subtitle}</h4>
                            <p>{cert.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Image Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0, 0, 0, 0.9)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1000,
                            padding: '2rem',
                            cursor: 'zoom-out'
                        }}
                    >
                        <motion.img
                            src={selectedImage}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            style={{
                                maxWidth: '90%',
                                maxHeight: '90%',
                                borderRadius: '8px',
                                boxShadow: '0 0 20px rgba(0,0,0,0.5)',
                                cursor: 'default'
                            }}
                            onClick={(e) => e.stopPropagation()} // Prevent clicking image from closing
                        />
                        <button
                            onClick={() => setSelectedImage(null)}
                            style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                background: 'white',
                                color: 'black',
                                border: 'none',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                fontSize: '20px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            ×
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Certifications;
