import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './QuizResults.css';

const QuizResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [quizData, setQuizData] = useState(null);

  useEffect(() => {
    // Get quiz data from navigation state or localStorage
    const data = location.state?.quizData || JSON.parse(localStorage.getItem('lastQuizData') || 'null');
    
    if (!data) {
      // No quiz data - redirect to quiz
      navigate('/skin-quiz');
      return;
    }
    
    setQuizData(data);
  }, [location, navigate]);

  if (!quizData) {
    return (
      <div className="loading-container">
        <p>Loading your results...</p>
      </div>
    );
  }

  return (
    <div className="quiz-results-page">
      <div className="container">
        <section className="results-hero" data-aos="fade-up">
          <h1>Your Skin Profile</h1>
          <p>Based on your quiz answers, here's what we learned about your skin</p>
        </section>

        {/* Skin Analysis */}
        <section className="skin-analysis" data-aos="fade-up">
          <div className="analysis-card">
            <h2>Your Skin Type</h2>
            <div className="skin-type-badge">{quizData.skinType}</div>
            <p className="analysis-description">
              {getSkinTypeDescription(quizData.skinType)}
            </p>
          </div>

          {quizData.concerns && quizData.concerns.length > 0 && (
            <div className="analysis-card">
              <h2>Primary Concerns</h2>
              <div className="concerns-list">
                {quizData.concerns.map((concern, index) => (
                  <span key={index} className="concern-tag">{concern}</span>
                ))}
              </div>
            </div>
          )}

          {quizData.preferences && quizData.preferences.length > 0 && (
            <div className="analysis-card">
              <h2>Your Preferences</h2>
              <div className="preferences-list">
                {quizData.preferences.map((pref, index) => (
                  <span key={index} className="preference-tag">✓ {pref}</span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Recommendations Coming Soon */}
        <section className="recommendations-section" data-aos="fade-up">
          <div className="coming-soon-card">
            <h2>Personalized Recommendations</h2>
            <p>We're curating the perfect products for your {quizData.skinType} skin.</p>
            <p>Check back soon for personalized recommendations based on your skin profile!</p>
            
            <div className="action-buttons">
              <button 
                className="btn-primary"
                onClick={() => navigate('/shop')}
              >
                Browse All Products
              </button>
              <button 
                className="btn-outline"
                onClick={() => navigate('/skin-quiz')}
              >
                Retake Quiz
              </button>
            </div>
          </div>
        </section>

        {/* General Tips */}
        <section className="tips-section" data-aos="fade-up">
          <h2>General Skincare Tips for {quizData.skinType} Skin</h2>
          <div className="tips-grid">
            {getSkincareTips(quizData.skinType).map((tip, index) => (
              <div key={index} className="tip-card">
                <h3>{tip.title}</h3>
                <p>{tip.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// Helper functions
const getSkinTypeDescription = (skinType) => {
  const descriptions = {
    'Dry': 'Your skin tends to feel tight and may show flaky patches. Focus on deep hydration and barrier repair.',
    'Oily': 'Your skin produces excess sebum, especially in the T-zone. Look for oil-free, non-comedogenic products.',
    'Combination': 'You have both dry and oily areas. Balance is key - treat different zones accordingly.',
    'Normal': 'Your skin is well-balanced with few concerns. Maintain its health with gentle, nourishing products.',
    'Sensitive': 'Your skin reacts easily to products or environmental factors. Choose fragrance-free, hypoallergenic formulas.'
  };
  return descriptions[skinType] || 'Your unique skin type deserves customized care.';
};

const getSkincareTips = (skinType) => {
  const tips = {
    'Dry': [
      { title: 'Hydrate Deeply', description: 'Use rich moisturizers with hyaluronic acid and ceramides' },
      { title: 'Avoid Hot Water', description: 'Wash with lukewarm water to prevent moisture loss' },
      { title: 'Layer Products', description: 'Apply hydrating toner before moisturizer for better absorption' }
    ],
    'Oily': [
      { title: 'Cleanse Twice Daily', description: 'Use a gentle, foaming cleanser morning and night' },
      { title: 'Don\'t Skip Moisturizer', description: 'Use oil-free, lightweight gel moisturizers' },
      { title: 'Exfoliate Regularly', description: 'Use chemical exfoliants 2-3 times per week' }
    ],
    'Combination': [
      { title: 'Multi-Mask', description: 'Use different masks on different zones as needed' },
      { title: 'Lightweight Hydration', description: 'Choose gel-based moisturizers that won\'t clog pores' },
      { title: 'Target Concerns', description: 'Treat oily and dry areas with specific products' }
    ],
    'Normal': [
      { title: 'Maintain Balance', description: 'Stick to a simple, consistent routine' },
      { title: 'Prevent Issues', description: 'Use antioxidants and SPF daily' },
      { title: 'Listen to Your Skin', description: 'Adjust products based on seasonal changes' }
    ],
    'Sensitive': [
      { title: 'Patch Test Always', description: 'Test new products on a small area first' },
      { title: 'Fragrance-Free', description: 'Choose products without added fragrances' },
      { title: 'Gentle Ingredients', description: 'Look for soothing ingredients like centella and allantoin' }
    ]
  };
  return tips[skinType] || tips['Normal'];
};

export default QuizResults;