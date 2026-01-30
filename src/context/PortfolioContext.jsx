import React, { createContext, useState, useContext, useEffect } from 'react';
import { portfolioAPI } from '../services/api';

const PortfolioContext = createContext();

export const usePortfolio = () => useContext(PortfolioContext);

const defaultData = {
    hero: {
        badge: "Hello, I'm Mehran Khan",
        titleLine1: "Safety Supervisor &",
        titleHighlight: "Tech Professional",
        description: "I combine NEBOSH/IOSH Safety Standards with Computer Science Expertise to build safer, smarter, and more efficient environments."
    },
    expertise: [
        {
            id: 1,
            title: "Safety Supervision",
            desc: "Certified NEBOSH & IOSH professional ensuring workplace compliance, risk management, and accident prevention.",
            points: ["Risk Assessment", "Fire Safety", "HSE Audits"]
        },
        {
            id: 2,
            title: "Web Development",
            desc: "BS Computer Science graduate building responsive, modern websites with a focus on good UX and clean code.",
            points: ["React & Frontend", "Responsive Design", "Technical Support"]
        },
        {
            id: 3,
            title: "Digital Marketing",
            desc: "Enhancing online presence through strategic SEO and data-driven digital marketing campaigns.",
            points: ["SEO Optimization", "Social Media Growth", "Content Strategy"]
        }
    ],
    testimonials: [
        {
            id: 1,
            text: "Mehran's dual skill set is incredible. He managed our site safety protocols perfectly while also overhauling our digital reporting system. Highly recommended!",
            name: "Sajid Ali",
            role: "Construction Manager"
        },
        {
            id: 2,
            text: "He built our company portfolio and optimized it for SEO. We saw a 40% increase in traffic within two months. Professional and efficient.",
            name: "Ahmed Khan",
            role: "CEO, TechSolutions"
        },
        {
            id: 3,
            text: "Detail-oriented and safety-conscious. Mehran conducted a thorough fire safety audit for our warehouse that helped us pass inspection with flying colors.",
            name: "Bilal Ahmed",
            role: "Logistics Director"
        }
    ],
    projects: [
        {
            id: 1,
            title: "SafetyFirst Audit Portal",
            category: "Web Development & Safety",
            desc: "A web application designed to streamline the process of workplace safety audits. Allows officers quite checklists, upload hazard photos, and generate compliance reports automatically.",
            tech: ["React.js", "Node.js", "Safety Compliance Standards"],
            link: "#"
        },
        {
            id: 2,
            title: "Hazard Detection AI",
            category: "Machine Learning (Prototype)",
            desc: "An experimental Python script using OpenCV to detect whether construction workers are wearing hard hats in real-time video feeds. Aims to automate safety monitoring.",
            tech: ["Python", "OpenCV", "Computer Vision"],
            link: "#"
        },
        {
            id: 3,
            title: "TechSafe SEO Campaign",
            category: "Digital Marketing",
            desc: "Led a comprehensive SEO and Social Media campaign for a safety equipment retailer. Increased organic traffic by 150% and improved keyword rankings for 'industrial safety gear'.",
            tech: ["SEO", "Google Analytics", "Content Marketing"],
            link: "#"
        }
    ]
};

export const PortfolioProvider = ({ children }) => {
    const [data, setData] = useState(defaultData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await portfolioAPI.get();
                if (res.data) {
                    setData(res.data);
                }
            } catch (err) {
                console.error("Failed to fetch portfolio data, using default", err);
                // Optionally check localStorage as fallback if needed
                const savedData = localStorage.getItem('portfolioData');
                if (savedData) {
                    setData(JSON.parse(savedData));
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const updateData = async (newData) => {
        try {
            await portfolioAPI.update(newData);
            setData(newData);
            localStorage.setItem('portfolioData', JSON.stringify(newData)); // Keep local sync as backup
            return { success: true };
        } catch (err) {
            console.error("Failed to update data", err);
            return { success: false, error: err.message };
        }
    };

    const resetData = () => {
        // Warning: This resets to defaultData but doesn't auto-save to backend unless you call updateData
        setData(defaultData);
        // You might want to update backend immediately or let user save
    };

    return (
        <PortfolioContext.Provider value={{ data, updateData, resetData, loading, error }}>
            {children}
        </PortfolioContext.Provider>
    );
};
