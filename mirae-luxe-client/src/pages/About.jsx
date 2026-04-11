import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero" data-aos="fade-in">
        <div className="container">
          <h1 data-aos="fade-up">About MIRAÉ LUXE</h1>
          <p className="hero-subtitle" data-aos="fade-up" data-aos-delay="200">
            Where luxury meets conscious beauty
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section section-padding">
        <div className="container">
          <div className="story-content">
            <div className="story-text" data-aos="fade-right">
              <h2>Our Story</h2>
              <p>
                MIRAÉ LUXE was born from a vision to redefine luxury beauty. 
                In a world where premium skincare and makeup often come at the 
                cost of our planet and its creatures, we dared to dream differently.
              </p>
              <p>
                Founded in Dubai in 2026, MIRAÉ LUXE represents the future of beauty - 
                where high-performance formulations meet uncompromising ethics. 
                Our name combines "Mirae" (미래), meaning "future" in Korean, with 
                "Luxe" symbolizing our commitment to luxury.
              </p>
              <p>
                Every product in our curated collection is 100% vegan, cruelty-free, 
                and formulated with premium ingredients that deliver visible results. 
                We believe you shouldn't have to choose between efficacy and ethics.
              </p>
            </div>
            <div className="story-image" data-aos="fade-left">
              <img 
                src={require('../assets/images/logo-full.png')} 
                alt="MIRAÉ LUXE Logo" 
               style={{
                 width: '100%',
                 maxWidth: '400px',
                height: 'auto',
                 objectFit: 'contain'
               }}
             />
           </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section section-padding bg-beige">
        <div className="container">
          <h2 className="section-title" data-aos="fade-up">Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card" data-aos="fade-up" data-aos-delay="100">
              <div className="value-icon">🌿</div>
              <h3>Sustainability First</h3>
              <p>
                We are committed to reducing our environmental impact through 
                eco-conscious packaging, sustainable sourcing, and carbon-neutral shipping.
              </p>
            </div>

            <div className="value-card" data-aos="fade-up" data-aos-delay="200">
              <div className="value-icon">🐰</div>
              <h3>100% Cruelty-Free</h3>
              <p>
                No animal testing. Ever. We work exclusively with suppliers who 
                share our commitment to animal welfare.
              </p>
            </div>

            <div className="value-card" data-aos="fade-up" data-aos-delay="300">
              <div className="value-icon">🌱</div>
              <h3>Vegan Formulas</h3>
              <p>
                All our products are completely free from animal-derived ingredients. 
                Beauty that's kind to all living beings.
              </p>
            </div>

            <div className="value-card" data-aos="fade-up" data-aos-delay="400">
              <div className="value-icon">✨</div>
              <h3>Efficacy Matters</h3>
              <p>
                Clean doesn't mean compromise. Our formulations deliver professional-grade 
                results with premium, performance-driven ingredients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section section-padding">
        <div className="container">
          <div className="mission-content" data-aos="fade-up">
            <h2>Our Mission</h2>
            <p className="mission-text">
              To revolutionize the beauty industry by proving that luxury, performance, 
              and ethics can coexist. We're building a future where every beauty ritual 
              is a conscious choice - one that nourishes your skin while respecting our planet.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section section-padding bg-beige">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item" data-aos="zoom-in" data-aos-delay="100">
              <h3>100%</h3>
              <p>Vegan & Cruelty-Free</p>
            </div>
            <div className="stat-item" data-aos="zoom-in" data-aos-delay="200">
              <h3>152+</h3>
              <p>Premium Products</p>
            </div>
            <div className="stat-item" data-aos="zoom-in" data-aos-delay="300">
              <h3>0</h3>
              <p>Animal Testing</p>
            </div>
            <div className="stat-item" data-aos="zoom-in" data-aos-delay="400">
              <h3>Dubai</h3>
              <p>Based in UAE</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Note */}
      <section className="team-section section-padding">
        <div className="container">
          <div className="team-content" data-aos="fade-up">
            <h2>University Project</h2>
            <p>
              This e-commerce platform was developed as part of a Computing Group Project 
              (CP50112E) at the University of West London. Created by a dedicated team of 
              five students passionate about technology and beauty.
            </p>
            <div className="team-members">
              <p><strong>Team Members:</strong></p>
              <ul>
                <li>Fathima Safva Ovinakath Kammukkakath</li>
                <li>Fathimath Neha Mirsa Sajid</li>
                <li>Asna Haris</li>
                <li>Nishna Valiyakath Noushad</li>
                <li>Helen Moncy Abraham</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;