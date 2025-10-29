// src/components/HomePage.jsx
// ========================================
// 🏠 HOMEPAGE / LANDING PAGE COMPONENT
// ========================================
// This component serves as the main landing page for SkillTree:
// - Hero section with compelling value proposition
// - Feature highlights showcasing platform capabilities
// - Call-to-action buttons for sign in and account creation
// - Modern, engaging design matching the app's glassmorphism theme
// - Responsive layout for all device sizes

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomePage = () => {
  // Animation variants for smooth entrance effects
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.34, 1.56, 0.64, 1],
        type: "spring",
        stiffness: 100
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      boxShadow: [
        "0 0 30px rgba(124, 58, 237, 0.6)",
        "0 0 50px rgba(0, 216, 255, 0.8)",
        "0 0 30px rgba(124, 58, 237, 0.6)"
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      className="homepage-wrapper"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Navigation Bar */}
      <motion.nav 
        className="homepage-navbar"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            🌳 SkillTree
          </Link>
          <div className="navbar-actions">
            <Link to="/signin" className="homepage-btn homepage-btn-secondary homepage-btn-nav">
              Sign In
            </Link>
            <Link to="/create-account" className="homepage-btn homepage-btn-primary homepage-btn-nav">
              Get Started Free →
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Animated Background Elements */}
      <div className="homepage-bg-elements">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
      </div>

      {/* Hero Section */}
      <motion.section className="homepage-hero" variants={itemVariants}>
        <div className="homepage-hero-content">
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            🚀 Start Your Learning Journey Today
          </motion.div>
          <motion.h1 
            className="homepage-title"
            variants={titleVariants}
          >
            🌳 Welcome to SkillTree
          </motion.h1>
          <motion.p 
            className="homepage-subtitle"
            variants={itemVariants}
          >
            Transform Your Career Path Through 
            <span className="gradient-text"> Gamified Learning</span>
          </motion.p>
          <motion.p 
            className="homepage-description"
            variants={itemVariants}
          >
            Discover personalized skill trees, unlock interactive lessons, and level up your expertise 
            with AI-generated challenges tailored to your career goals.
          </motion.p>
          
          {/* Stats Bar */}
          <motion.div 
            className="hero-stats"
            variants={itemVariants}
          >
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Active Learners</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Skills Available</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">95%</div>
              <div className="stat-label">Success Rate</div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section className="homepage-benefits" variants={itemVariants}>
        <h2 className="homepage-section-title" style={{ textAlign: 'center' }}>What You'll Gain</h2>
        <div className="homepage-benefits-grid">
          <motion.div 
            className="benefit-item"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="benefit-icon">⚡</div>
            <h4 className="benefit-title">Accelerated Career Growth</h4>
            <p className="benefit-text">Advance faster with targeted skill development aligned to your career goals</p>
          </motion.div>
          <motion.div 
            className="benefit-item"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="benefit-icon">💼</div>
            <h4 className="benefit-title">Industry-Relevant Skills</h4>
            <p className="benefit-text">Learn skills that employers actually value across all industries</p>
          </motion.div>
          <motion.div 
            className="benefit-item"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="benefit-icon">🎓</div>
            <h4 className="benefit-title">Self-Paced Learning</h4>
            <p className="benefit-text">Learn at your own speed with 24/7 access to all materials</p>
          </motion.div>
          <motion.div 
            className="benefit-item"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="benefit-icon">🏆</div>
            <h4 className="benefit-title">Achievement Tracking</h4>
            <p className="benefit-text">Build a portfolio of completed skills and lessons</p>
          </motion.div>
          <motion.div 
            className="benefit-item"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="benefit-icon">🌍</div>
            <h4 className="benefit-title">Universal Applicability</h4>
            <p className="benefit-text">Works for any career field - tech, healthcare, finance, education, and more</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section className="homepage-features" variants={itemVariants}>
        <h2 className="homepage-section-title">Why Choose SkillTree?</h2>
        <div className="homepage-features-grid">
          <motion.div 
            className="homepage-feature-card"
            whileHover={{ scale: 1.08, y: -10, rotateY: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div 
              className="feature-icon"
              whileHover={{ rotate: 360, scale: 1.2 }}
              transition={{ duration: 0.6 }}
            >
              🎯
            </motion.div>
            <h3 className="feature-title">Personalized Learning</h3>
            <p className="feature-description">
              Take a career quiz and upload your resume to get a customized skill tree 
              designed specifically for your goals and experience level.
            </p>
          </motion.div>

          <motion.div 
            className="homepage-feature-card"
            whileHover={{ scale: 1.08, y: -10, rotateY: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div 
              className="feature-icon"
              whileHover={{ rotate: 360, scale: 1.2 }}
              transition={{ duration: 0.6 }}
            >
              🎮
            </motion.div>
            <h3 className="feature-title">Gamified Experience</h3>
            <p className="feature-description">
              Learn through interactive challenges, real-world scenarios, and skill progression 
              that makes mastering new abilities engaging and fun.
            </p>
          </motion.div>

          <motion.div 
            className="homepage-feature-card"
            whileHover={{ scale: 1.08, y: -10, rotateY: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div 
              className="feature-icon"
              whileHover={{ rotate: 360, scale: 1.2 }}
              transition={{ duration: 0.6 }}
            >
              🤖
            </motion.div>
            <h3 className="feature-title">AI-Generated Content</h3>
            <p className="feature-description">
              Access dynamically generated lessons that adapt to different career paths and 
              skill levels, powered by intelligent content generation.
            </p>
          </motion.div>

          <motion.div 
            className="homepage-feature-card"
            whileHover={{ scale: 1.08, y: -10, rotateY: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div 
              className="feature-icon"
              whileHover={{ rotate: 360, scale: 1.2 }}
              transition={{ duration: 0.6 }}
            >
              📊
            </motion.div>
            <h3 className="feature-title">Progress Tracking</h3>
            <p className="feature-description">
              Monitor your learning journey with detailed progress tracking, completed 
              lessons, and unlock new skill branches as you advance.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section className="homepage-how-it-works" variants={itemVariants}>
        <h2 className="homepage-section-title">How It Works</h2>
        <div className="homepage-steps">
          <motion.div 
            className="homepage-step"
            whileHover={{ scale: 1.05, y: -8 }}
            transition={{ type: "spring", stiffness: 300 }}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.div 
              className="step-number"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              1
            </motion.div>
            <h3 className="step-title">Create Your Account</h3>
            <p className="step-description">
              Sign up in seconds and start your learning journey
            </p>
          </motion.div>

          <motion.div 
            className="homepage-step"
            whileHover={{ scale: 1.05, y: -8 }}
            transition={{ type: "spring", stiffness: 300 }}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.div 
              className="step-number"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              2
            </motion.div>
            <h3 className="step-title">Take the Career Quiz</h3>
            <p className="step-description">
              Answer questions about your interests to identify your ideal career path
            </p>
          </motion.div>

          <motion.div 
            className="homepage-step"
            whileHover={{ scale: 1.05, y: -8 }}
            transition={{ type: "spring", stiffness: 300 }}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.div 
              className="step-number"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              3
            </motion.div>
            <h3 className="step-title">Upload Your Resume (Optional)</h3>
            <p className="step-description">
              Let us customize your skill tree based on your existing experience
            </p>
          </motion.div>

          <motion.div 
            className="homepage-step"
            whileHover={{ scale: 1.05, y: -8 }}
            transition={{ type: "spring", stiffness: 300 }}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.div 
              className="step-number"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              4
            </motion.div>
            <h3 className="step-title">Start Learning</h3>
            <p className="step-description">
              Explore your personalized skill tree and unlock new lessons
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Industries Section */}
      <motion.section className="homepage-industries" variants={itemVariants}>
        <h2 className="homepage-section-title">Skills for Every Career Path</h2>
        <p className="homepage-section-subtitle">Whether you're in healthcare, finance, technology, education, or any other field, SkillTree adapts to your industry</p>
        <div className="industries-grid">
          {['Healthcare', 'Technology', 'Finance', 'Education', 'Marketing', 'Consulting', 'Legal', 'Engineering', 'Design', 'Operations', 'Sales', 'Human Resources'].map((industry, idx) => (
            <motion.div 
              key={industry}
              className="industry-tag"
              whileHover={{ scale: 1.1, y: -3 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              {industry}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section className="homepage-testimonials" variants={itemVariants}>
        <h2 className="homepage-section-title">Success Stories</h2>
        <div className="testimonials-grid">
          <motion.div 
            className="testimonial-card"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="testimonial-quote">"</div>
            <p className="testimonial-text">SkillTree helped me identify the exact skills I needed to transition from marketing to product management. The personalized approach made all the difference.</p>
            <div className="testimonial-author">
              <div className="testimonial-name">Sarah Chen</div>
              <div className="testimonial-role">Product Manager, TechCorp</div>
            </div>
          </motion.div>
          <motion.div 
            className="testimonial-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="testimonial-quote">"</div>
            <p className="testimonial-text">As a nurse, I wanted to advance to a leadership role. SkillTree created a custom path that covered everything from communication to project management.</p>
            <div className="testimonial-author">
              <div className="testimonial-name">Michael Rodriguez</div>
              <div className="testimonial-role">Nurse Manager, HealthCare Plus</div>
            </div>
          </motion.div>
          <motion.div 
            className="testimonial-card"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="testimonial-quote">"</div>
            <p className="testimonial-text">The gamified approach kept me engaged while learning critical thinking skills for my consulting career. Highly recommend!</p>
            <div className="testimonial-author">
              <div className="testimonial-name">Emily Watson</div>
              <div className="testimonial-role">Consultant, Strategy Partners</div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section className="homepage-faq" variants={itemVariants}>
        <h2 className="homepage-section-title">Frequently Asked Questions</h2>
        <div className="faq-grid">
          <motion.div 
            className="faq-item"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h4 className="faq-question">Is SkillTree free to use?</h4>
            <p className="faq-answer">Yes! SkillTree is completely free to start. Create your account and begin building your skill tree today.</p>
          </motion.div>
          <motion.div 
            className="faq-item"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h4 className="faq-question">Do I need to upload my resume?</h4>
            <p className="faq-answer">No, uploading your resume is optional. However, it helps us create a more personalized learning path based on your experience.</p>
          </motion.div>
          <motion.div 
            className="faq-item"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h4 className="faq-question">Which industries does SkillTree support?</h4>
            <p className="faq-answer">SkillTree works for ALL industries - from healthcare and finance to technology, education, marketing, legal, and beyond. Our lessons focus on transferable skills.</p>
          </motion.div>
          <motion.div 
            className="faq-item"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h4 className="faq-question">How does the AI lesson generation work?</h4>
            <p className="faq-answer">Our AI analyzes your career goals, skills, and experience to generate personalized lessons and challenges tailored specifically to your needs.</p>
          </motion.div>
          <motion.div 
            className="faq-item"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h4 className="faq-question">Can I track my progress?</h4>
            <p className="faq-answer">Absolutely! Your dashboard shows completed lessons, skill mastery levels, and your overall learning progress in real-time.</p>
          </motion.div>
          <motion.div 
            className="faq-item"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h4 className="faq-question">How long does it take to complete lessons?</h4>
            <p className="faq-answer">Lessons are self-paced. Spend as much or as little time as you need - there's no pressure to rush through the material.</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer CTA */}
      <motion.section className="homepage-footer-cta" variants={itemVariants}>
        <div className="footer-cta-content">
          <h2 className="footer-cta-title">Ready to Grow Your Skills?</h2>
          <p className="footer-cta-description">
            Join thousands of learners building their careers with SkillTree
          </p>
          <div className="footer-cta-buttons">
            <Link to="/create-account" className="homepage-btn homepage-btn-primary homepage-btn-large">
              Get Started Free
            </Link>
            <Link to="/signin" className="homepage-btn homepage-btn-secondary homepage-btn-large">
              Sign In
            </Link>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default HomePage;

