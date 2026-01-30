import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    FaSave,
    FaUndo,
    FaLayerGroup,
    FaProjectDiagram,
    FaUserTie,
    FaComment,
    FaSignOutAlt,
    FaPlus,
    FaTrash,
    FaGraduationCap
} from 'react-icons/fa';

const TabButton = ({ active, onClick, icon: Icon, children }) => (
    <button
        onClick={onClick}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
            padding: '12px 20px',
            background: active ? 'linear-gradient(90deg, rgba(251, 191, 36, 0.2), transparent)' : 'transparent',
            border: 'none',
            borderLeft: active ? '4px solid var(--accent-safety)' : '4px solid transparent',
            color: active ? 'var(--accent-safety)' : 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '1rem',
            textAlign: 'left'
        }}
    >
        <Icon /> {children}
    </button>
);

const InputGroup = ({ label, children }) => (
    <div style={{ marginBottom: '1.2rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{label}</label>
        {children}
    </div>
);

const DeleteButton = ({ onClick }) => (
    <button
        onClick={onClick}
        style={{
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '0.9rem',
            alignSelf: 'start'
        }}
    >
        <FaTrash /> Remove
    </button>
);

const AddButton = ({ onClick, text }) => (
    <button
        onClick={onClick}
        style={{
            background: 'dashed',
            border: '2px dashed var(--glass-border)',
            color: 'var(--text-secondary)',
            padding: '1.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            background: 'transparent',
            transition: 'all 0.3s'
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-safety)';
            e.currentTarget.style.color = 'var(--accent-safety)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--glass-border)';
            e.currentTarget.style.color = 'var(--text-secondary)';
        }}
    >
        <FaPlus /> {text}
    </button>
);

const ImageUpload = ({ currentImage, onUpload }) => {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            // We need to strip /api since our fetch call constructs it manually or use axios
            // But here we constructed the full URL manually for fetch
            const uploadUrl = API_URL.replace('/api', '') + '/api/upload';

            const res = await fetch(uploadUrl, {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();

            if (data.success) {
                // Prepend base URL for display if it's a relative path
                const fullUrl = API_URL.replace('/api', '') + data.imageUrl;
                onUpload(fullUrl);
            } else {
                alert('Upload failed: ' + data.message);
            }
        } catch (error) {
            console.error(error);
            alert('Upload error');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Profile Image</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {currentImage && (
                    <img
                        src={currentImage}
                        alt="Profile"
                        style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-safety)' }}
                    />
                )}
                <div>
                    <label className="btn secondary" style={{ cursor: 'pointer', fontSize: '0.9rem' }}>
                        {uploading ? 'Uploading...' : 'Choose Image'}
                        <input type="file" onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
                    </label>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Max 5MB. JPG, PNG</p>
                </div>
            </div>
        </div>
    );
};

// ... inside Dashboard component ...
const Dashboard = () => {
    const { data, updateData, resetData } = usePortfolio();
    const { user, loading, logout } = useAuth();
    const [formData, setFormData] = useState(data);
    const [activeTab, setActiveTab] = useState('hero');
    const [message, setMessage] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) navigate('/login');
    }, [user, loading, navigate]);

    useEffect(() => {
        // Ensure all arrays exist even if DB is old
        setFormData({
            ...data,
            skills: data.skills || [],
            certifications: data.certifications || []
        });
    }, [data]);

    const handleChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
    };

    const handleArrayChange = (section, id, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: prev[section].map(item => item.id === id ? { ...item, [field]: value } : item)
        }));
    };

    const handleNestedArrayChange = (section, itemId, arrayField, index, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: prev[section].map(item => {
                if (item.id === itemId) {
                    const newArray = [...item[arrayField]];
                    newArray[index] = value;
                    return { ...item, [arrayField]: newArray };
                }
                return item;
            })
        }));
    };

    // Add Functions
    const addItem = (section, newItem) => {
        setFormData(prev => ({
            ...prev,
            [section]: [...(prev[section] || []), { ...newItem, id: Date.now() }]
        }));
    };

    // Remove Functions
    const removeItem = (section, id) => {
        if (window.confirm('Are you sure you want to remove this item?')) {
            setFormData(prev => ({
                ...prev,
                [section]: prev[section].filter(item => item.id !== id)
            }));
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        const result = await updateData(formData);
        setIsSaving(false);
        if (result.success) {
            setMessage({ type: 'success', text: 'Changes saved successfully!' });
        } else {
            setMessage({ type: 'error', text: 'Failed to save: ' + result.error });
        }
        setTimeout(() => setMessage(null), 3000);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading || !user) return <div className="section container" style={{ textAlign: 'center', paddingTop: '100px' }}>Loading dashboard...</div>;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)' }}>

            {/* Sidebar */}
            <div style={{
                width: '260px',
                borderRight: '1px solid var(--glass-border)',
                background: 'var(--bg-color-alt)',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                top: 0,
                bottom: 0,
                overflowY: 'auto',
                zIndex: 100
            }}>
                <div style={{ padding: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>Admin Panel</h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Welcome, {user.username}</p>
                </div>

                <nav style={{ flex: 1 }}>
                    <TabButton active={activeTab === 'hero'} onClick={() => setActiveTab('hero')} icon={FaLayerGroup}>
                        Hero Section
                    </TabButton>
                    <TabButton active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} icon={FaProjectDiagram}>
                        Projects
                    </TabButton>
                    <TabButton active={activeTab === 'skills'} onClick={() => setActiveTab('skills')} icon={FaUserTie}>
                        Skills
                    </TabButton>
                    <TabButton active={activeTab === 'certifications'} onClick={() => setActiveTab('certifications')} icon={FaGraduationCap}>
                        Certifications
                    </TabButton>
                    <TabButton active={activeTab === 'expertise'} onClick={() => setActiveTab('expertise')} icon={FaUserTie}>
                        Expertise Areas
                    </TabButton>
                    <TabButton active={activeTab === 'testimonials'} onClick={() => setActiveTab('testimonials')} icon={FaComment}>
                        Testimonials
                    </TabButton>
                </nav>

                <div style={{ padding: '2rem', borderTop: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button onClick={handleSave} className="btn primary" style={{ width: '100%', justifyContent: 'center' }} disabled={isSaving}>
                        {isSaving ? 'Saving...' : <><FaSave style={{ marginRight: '8px' }} /> Save Changes</>}
                    </button>
                    <button onClick={handleLogout} className="btn secondary" style={{ width: '100%', justifyContent: 'center', borderColor: '#ff4d4d', color: '#ff4d4d' }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#ff4d4d'; e.currentTarget.style.color = 'white' }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#ff4d4d' }}>
                        <FaSignOutAlt style={{ marginRight: '8px' }} /> Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, marginLeft: '260px', padding: '2rem 3rem' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>

                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            style={{
                                padding: '1rem',
                                borderRadius: '8px',
                                marginBottom: '2rem',
                                background: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                border: `1px solid ${message.type === 'success' ? '#22c55e' : '#ef4444'}`,
                                color: message.type === 'success' ? '#22c55e' : '#ef4444',
                                position: 'sticky',
                                top: '20px',
                                zIndex: 50
                            }}
                        >
                            {message.text}
                        </motion.div>
                    )}

                    <AnimatePresence mode="wait">
                        {activeTab === 'hero' && (
                            <motion.div
                                key="hero"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <h1 className="section-title" style={{ textAlign: 'left', marginBottom: '1.5rem', fontSize: '2rem' }}>Hero & Profile</h1>
                                <div className="card">
                                    {/* Switched to Image Upload Component */}
                                    <ImageUpload
                                        currentImage={formData.hero.profileImage}
                                        onUpload={(url) => handleChange('hero', 'profileImage', url)}
                                    />

                                    <InputGroup label="Badge Text">
                                        <input type="text" className="form-control" value={formData.hero.badge} onChange={(e) => handleChange('hero', 'badge', e.target.value)} />
                                    </InputGroup>
                                    <InputGroup label="Title Line 1">
                                        <input type="text" className="form-control" value={formData.hero.titleLine1} onChange={(e) => handleChange('hero', 'titleLine1', e.target.value)} />
                                    </InputGroup>
                                    <InputGroup label="Highlighted Title">
                                        <input type="text" className="form-control" value={formData.hero.titleHighlight} onChange={(e) => handleChange('hero', 'titleHighlight', e.target.value)} />
                                    </InputGroup>
                                    <InputGroup label="Description">
                                        <textarea rows="4" className="form-control" value={formData.hero.description} onChange={(e) => handleChange('hero', 'description', e.target.value)} />
                                    </InputGroup>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'skills' && (
                            <motion.div
                                key="skills"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <h1 className="section-title" style={{ textAlign: 'left', marginBottom: '1.5rem', fontSize: '2rem' }}>Skills Management</h1>
                                <div style={{ display: 'grid', gap: '2rem' }}>
                                    {formData.skills && formData.skills.map((skill, index) => (
                                        <div key={skill.id || index} className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px', gap: '1rem' }}>
                                                    <InputGroup label="Skill Name">
                                                        <input type="text" className="form-control" value={skill.name} onChange={(e) => handleArrayChange('skills', skill.id, 'name', e.target.value)} />
                                                    </InputGroup>
                                                    <InputGroup label="Category">
                                                        <select className="form-control" value={skill.category} onChange={(e) => handleArrayChange('skills', skill.id, 'category', e.target.value)}>
                                                            <option value="Safety Supervision">Safety Supervision</option>
                                                            <option value="Computer Science">Computer Science</option>
                                                            <option value="Digital Marketing">Digital Marketing</option>
                                                            <option value="Other">Other</option>
                                                        </select>
                                                    </InputGroup>
                                                    <InputGroup label="Level (%)">
                                                        <input type="number" className="form-control" value={skill.level} onChange={(e) => handleArrayChange('skills', skill.id, 'level', e.target.value)} />
                                                    </InputGroup>
                                                </div>
                                            </div>
                                            <DeleteButton onClick={() => removeItem('skills', skill.id)} />
                                        </div>
                                    ))}
                                    <AddButton
                                        text="Add New Skill"
                                        onClick={() => addItem('skills', { name: 'New Skill', category: 'Other', level: 50 })}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'certifications' && (
                            <motion.div
                                key="certifications"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <h1 className="section-title" style={{ textAlign: 'left', marginBottom: '1.5rem', fontSize: '2rem' }}>Certifications</h1>
                                <div style={{ display: 'grid', gap: '2rem' }}>
                                    {formData.certifications && formData.certifications.map((cert, index) => (
                                        <div key={cert.id || index} className="card">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                <h3 style={{ color: 'var(--accent-tech)' }}>{cert.title}</h3>
                                                <DeleteButton onClick={() => removeItem('certifications', cert.id)} />
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                <InputGroup label="Title">
                                                    <input type="text" className="form-control" value={cert.title} onChange={(e) => handleArrayChange('certifications', cert.id, 'title', e.target.value)} />
                                                </InputGroup>
                                                <InputGroup label="Subtitle">
                                                    <input type="text" className="form-control" value={cert.subtitle} onChange={(e) => handleArrayChange('certifications', cert.id, 'subtitle', e.target.value)} />
                                                </InputGroup>

                                                <div style={{ gridColumn: 'span 2' }}>
                                                    <ImageUpload
                                                        currentImage={cert.image}
                                                        onUpload={(url) => handleArrayChange('certifications', cert.id, 'image', url)}
                                                    />
                                                </div>
                                                <div style={{ gridColumn: 'span 2' }}>
                                                    <InputGroup label="Description">
                                                        <textarea rows="3" className="form-control" value={cert.desc} onChange={(e) => handleArrayChange('certifications', cert.id, 'desc', e.target.value)} />
                                                    </InputGroup>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <AddButton
                                        text="Add New Certification"
                                        onClick={() => addItem('certifications', { title: 'New Cert', subtitle: 'Institution', desc: 'Description...', iconType: 'certificate' })}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'projects' && (
                            <motion.div
                                key="projects"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <h1 className="section-title" style={{ textAlign: 'left', marginBottom: '1.5rem', fontSize: '2rem' }}>Projects</h1>
                                <div style={{ display: 'grid', gap: '2rem' }}>
                                    {formData.projects.map((project, index) => (
                                        <div key={project.id} className="card">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                                                <h3 style={{ color: 'var(--accent-tech)' }}>{project.title}</h3>
                                                <DeleteButton onClick={() => removeItem('projects', project.id)} />
                                            </div>
                                            <InputGroup label="Title">
                                                <input type="text" className="form-control" value={project.title} onChange={(e) => handleArrayChange('projects', project.id, 'title', e.target.value)} />
                                            </InputGroup>
                                            <InputGroup label="Category">
                                                <input type="text" className="form-control" value={project.category} onChange={(e) => handleArrayChange('projects', project.id, 'category', e.target.value)} />
                                            </InputGroup>
                                            <InputGroup label="Description">
                                                <textarea rows="3" className="form-control" value={project.desc} onChange={(e) => handleArrayChange('projects', project.id, 'desc', e.target.value)} />
                                            </InputGroup>
                                            <InputGroup label="Tech Stack (Separate inputs)">
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                                                    {project.tech.map((tech, idx) => (
                                                        <input
                                                            key={idx}
                                                            type="text"
                                                            className="form-control"
                                                            value={tech}
                                                            onChange={(e) => handleNestedArrayChange('projects', project.id, 'tech', idx, e.target.value)}
                                                            style={{ fontSize: '0.9rem', padding: '8px' }}
                                                        />
                                                    ))}
                                                </div>
                                            </InputGroup>
                                        </div>
                                    ))}
                                    <AddButton
                                        text="Add New Project"
                                        onClick={() => addItem('projects', { title: 'New Project', category: 'Web App', desc: 'Description...', tech: ['React', 'Node'] })}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Reuse Existing Expertise and Testimonial logic (abbreviated for length match, but logically same structure) */}
                        {activeTab === 'expertise' && (
                            <motion.div
                                key="expertise"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <h1 className="section-title" style={{ textAlign: 'left', marginBottom: '1.5rem', fontSize: '2rem' }}>Expertise Areas</h1>
                                <div style={{ display: 'grid', gap: '2rem' }}>
                                    {formData.expertise.map((item) => (
                                        <div key={item.id} className="card">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                                                <h3 style={{ color: 'var(--accent-safety)' }}>{item.title}</h3>
                                                <DeleteButton onClick={() => removeItem('expertise', item.id)} />
                                            </div>
                                            <InputGroup label="Title">
                                                <input type="text" className="form-control" value={item.title} onChange={(e) => handleArrayChange('expertise', item.id, 'title', e.target.value)} />
                                            </InputGroup>
                                            <InputGroup label="Description">
                                                <textarea rows="3" className="form-control" value={item.desc} onChange={(e) => handleArrayChange('expertise', item.id, 'desc', e.target.value)} />
                                            </InputGroup>
                                            <InputGroup label="Key Points (Separate with commas)">
                                                {/* Simple array handling for points - treating as joined string for simpler editing, or mapping inputs */}
                                                <div style={{ display: 'grid', gap: '10px' }}>
                                                    {item.points && item.points.map((point, idx) => (
                                                        <input
                                                            key={idx}
                                                            type="text"
                                                            className="form-control"
                                                            value={point}
                                                            onChange={(e) => handleNestedArrayChange('expertise', item.id, 'points', idx, e.target.value)}
                                                            style={{ marginBottom: '5px' }}
                                                        />
                                                    ))}
                                                </div>
                                            </InputGroup>
                                        </div>
                                    ))}
                                    <AddButton
                                        text="Add New Expertise Area"
                                        onClick={() => addItem('expertise', { title: 'New Area', desc: 'Description...', points: ['Point 1', 'Point 2'] })}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'testimonials' && (
                            <motion.div
                                key="testimonials"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <h1 className="section-title" style={{ textAlign: 'left', marginBottom: '1.5rem', fontSize: '2rem' }}>Testimonials</h1>
                                <div style={{ display: 'grid', gap: '2rem' }}>
                                    {formData.testimonials.map((t) => (
                                        <div key={t.id} className="card">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                                                <h3 style={{ color: 'var(--text-secondary)' }}>Testimonial from {t.name}</h3>
                                                <DeleteButton onClick={() => removeItem('testimonials', t.id)} />
                                            </div>
                                            <ImageUpload
                                                currentImage={t.image}
                                                onUpload={(url) => handleArrayChange('testimonials', t.id, 'image', url)}
                                            />
                                            <InputGroup label="Client Name">
                                                <input type="text" className="form-control" value={t.name} onChange={(e) => handleArrayChange('testimonials', t.id, 'name', e.target.value)} />
                                            </InputGroup>
                                            <InputGroup label="Role">
                                                <input type="text" className="form-control" value={t.role || ''} onChange={(e) => handleArrayChange('testimonials', t.id, 'role', e.target.value)} placeholder="e.g. CEO, TechSolutions" />
                                            </InputGroup>
                                            <InputGroup label="Feedback">
                                                <textarea rows="4" className="form-control" value={t.text} onChange={(e) => handleArrayChange('testimonials', t.id, 'text', e.target.value)} />
                                            </InputGroup>
                                        </div>
                                    ))}
                                    <AddButton
                                        text="Add New Testimonial"
                                        onClick={() => addItem('testimonials', { name: 'Client Name', role: 'Client Role', text: 'Feedback...' })}
                                    />
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
