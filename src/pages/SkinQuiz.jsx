import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizAPI } from '../services/api';
import './SkinQuiz.css';

const SkinQuiz = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [quizData, setQuizData] = useState({
    skinType: '',
    concerns: [],
    budgetRange: '',
    preferences: []
  });
  const [loading, setLoading] = useState(false);

  const handleSkinTypeSelect = (type) => {
    setQuizData({ ...quizData, skinType: type });
  };

  const handleConcernToggle = (concern) => {
    const concerns = quizData.concerns.includes(concern)
      ? quizData.concerns.filter(c => c !== concern)
      : [...quizData.concerns, concern];
    setQuizData({ ...quizData, concerns });
  };

  const handleBudgetSelect = (budget) => {
    setQuizData({ ...quizData, budgetRange: budget });
  };

  const handlePreferenceToggle = (preference) => {
    const preferences = quizData.preferences.includes(preference)
      ? quizData.preferences.filter(p => p !== preference)
      : [...quizData.preferences, preference];
    setQuizData({ ...quizData, preferences });
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

const handleSubmit = async () => {
  try {
    // Save quiz data to localStorage
    localStorage.setItem('lastQuizData', JSON.stringify(quizData));
    
    // Navigate to results page
    navigate('/quiz-results', { state: { quizData } });

    // TODO: Uncomment when products are added
    /*
    const response = await quizAPI.submitQuiz(quizData);
    navigate('/quiz-results', { 
      state: { 
        quizData, 
        recommendations: response.data 
      } 
    });
    */

  } catch (error) {
    console.error('Quiz error:', error);
    alert('Failed to submit quiz. Please try again.');
  }
};

  const isStepValid = () => {
    switch (step) {
      case 1: return quizData.skinType !== '';
      case 2: return quizData.concerns.length > 0;
      case 3: return quizData.budgetRange !== '';
      case 4: return true; // Preferences are optional
      default: return false;
    }
  };

  return (
    <div className="skin-quiz-page">
      <div className="container">
        {/* Progress Bar */}
        <div className="quiz-progress" data-aos="fade-down">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
          <p className="progress-text">Step {step} of 4</p>
        </div>

        {/* Quiz Content */}
        <div className="quiz-content" data-aos="fade-up">
          {/* Step 1: Skin Type */}
          {step === 1 && (
            <div className="quiz-step">
              <h2>What's your skin type?</h2>
              <p className="step-subtitle">Choose the one that best describes your skin</p>
              
              <div className="options-grid">
                {['Oily', 'Dry', 'Combination', 'Sensitive', 'Normal'].map(type => (
                  <button
                    key={type}
                    className={`option-card ${quizData.skinType === type ? 'active' : ''}`}
                    onClick={() => handleSkinTypeSelect(type)}
                  >
                    <h3>{type}</h3>
                    <p>
                      {type === 'Oily' && 'Shiny, enlarged pores'}
                      {type === 'Dry' && 'Flaky, tight feeling'}
                      {type === 'Combination' && 'Oily T-zone, dry cheeks'}
                      {type === 'Sensitive' && 'Easily irritated, reactive'}
                      {type === 'Normal' && 'Balanced, not too oily or dry'}
                    </p>
                  </button>
                ))}
              </div>
            </div>
           )}

           {/* Step 2: Skin Concerns */}
           {step === 2 && (
             <div className="quiz-step">
               <h2>What are your main skin concerns?</h2>
               <p className="step-subtitle">Select all that apply (or choose "No Specific Concerns")</p>
    
               <div className="options-grid">
                {[
                  { value: 'No Concerns', desc: 'My skin is balanced and healthy' },
                  { value: 'Acne', desc: 'Breakouts and blemishes' },
                  { value: 'Dark Spots', desc: 'Hyperpigmentation' },
                  { value: 'Dryness', desc: 'Dehydrated skin' },
                  { value: 'Fine Lines', desc: 'Signs of aging' }
                ].map(concern => (
                  <button
                    key={concern.value}
                    className={`option-card ${quizData.concerns.includes(concern.value) ? 'active' : ''}`}
                    onClick={() => handleConcernToggle(concern.value)}
                  >
                    <h3>{concern.value}</h3>
                    <p>{concern.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Budget */}
          {step === 3 && (
            <div className="quiz-step">
              <h2>What's your budget per product?</h2>
              <p className="step-subtitle">Help us recommend products in your range</p>
              
              <div className="options-grid">
                {[
                  { value: 'Under 100', label: 'Under AED 100', desc: 'Budget-friendly' },
                  { value: '100-150', label: 'AED 100-150', desc: 'Mid-range' },
                  { value: '150-200', label: 'AED 150-200', desc: 'Premium' },
                  { value: 'Above 200', label: 'Above AED 200', desc: 'Luxury' }
                ].map(budget => (
                  <button
                    key={budget.value}
                    className={`option-card ${quizData.budgetRange === budget.value ? 'active' : ''}`}
                    onClick={() => handleBudgetSelect(budget.value)}
                  >
                    <h3>{budget.label}</h3>
                    <p>{budget.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Preferences */}
          {step === 4 && (
            <div className="quiz-step">
              <h2>Any specific preferences?</h2>
              <p className="step-subtitle">Optional - select all that apply</p>
              
              <div className="options-grid">
                {[
                  { value: 'Vegan', icon: '🌱', desc: 'Plant-based only' },
                  { value: 'Cruelty-free', icon: '🐰', desc: 'Not tested on animals' }
                ].map(pref => (
                  <button
                    key={pref.value}
                    className={`option-card ${quizData.preferences.includes(pref.value) ? 'active' : ''}`}
                    onClick={() => handlePreferenceToggle(pref.value)}
                  >
                    <div className="option-icon">{pref.icon}</div>
                    <h3>{pref.value}</h3>
                    <p>{pref.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="quiz-navigation">
            {step > 1 && (
              <button className="btn-outline" onClick={handleBack}>
                Back
              </button>
            )}
            
            {step < 4 ? (
              <button 
                className="btn-primary"
                onClick={handleNext}
                disabled={!isStepValid()}
              >
                Next
              </button>
            ) : (
              <button 
                className="btn-primary"
                onClick={handleSubmit}
                disabled={loading || !isStepValid()}
              >
                {loading ? 'Getting Results...' : 'Get My Recommendations'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkinQuiz;