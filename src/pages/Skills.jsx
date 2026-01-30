import React from 'react';
import { motion } from 'framer-motion';
import { FaUserShield, FaCode, FaChartLine, FaCheckCircle } from 'react-icons/fa';
import { usePortfolio } from '../context/PortfolioContext';

const SkillBar = ({ name, level }) => {
    return (
        <div className="skill-bar">
            <div className="skill-info">
                <span>{name}</span>
                <span>{level}%</span>
            </div>
            <div className="progress-bg">
                <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${level}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </div>
        </div>
    );
};

const Skills = () => {
    const { data, loading } = usePortfolio();

    if (loading || !data?.skills) return null;

    // Group skills by category
    const groupedSkills = data.skills.reduce((acc, skill) => {
        if (!acc[skill.category]) {
            acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
    }, {});

    const getIcon = (category) => {
        if (category.includes("Safety")) return <FaUserShield />;
        if (category.includes("Computer") || category.includes("Web")) return <FaCode />;
        if (category.includes("Marketing") || category.includes("Digital")) return <FaChartLine />;
        return <FaCheckCircle />;
    };

    return (
        <motion.div
            className="section container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="section-title">Professional Skills</div>

            <div className="skills-wrapper" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
                {Object.keys(groupedSkills).map((category) => (
                    <div className="skill-category" key={category}>
                        <h3>{getIcon(category)} {category}</h3>
                        {groupedSkills[category].map(skill => (
                            <SkillBar key={skill.id} name={skill.name} level={skill.level} />
                        ))}
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default Skills;
