import React, { useState, useRef, useEffect } from 'react';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! 👋 I'm your MIRAÉ LUXE beauty assistant. Ask me anything about skincare, makeup, ingredients, or routines!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim().toLowerCase();
    const originalMessage = input.trim();
    setInput('');

    // Add user message
    const newMessages = [
      ...messages,
      { role: 'user', content: originalMessage }
    ];
    setMessages(newMessages);
    setIsLoading(true);

    // Simulate AI thinking delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Mock AI responses based on keywords
    let aiResponse = '';

    // Dry Skin
    if (userMessage.includes('dry') && (userMessage.includes('skin') || userMessage.includes('routine'))) {
      aiResponse = "For dry skin, I recommend our Hydrating Hyaluronic Serum ✨ It contains triple-weight hyaluronic acid that provides deep hydration and plumps the skin. Pair it with a rich moisturizer and avoid harsh cleansers. A good routine would be:\n\n1. Gentle cream cleanser\n2. Hydrating toner\n3. Hyaluronic Acid Serum\n4. Rich moisturizer\n5. Sunscreen (AM only)\n\nWould you like specific product recommendations from our collection?";
    }
    
    // Oily Skin
    else if (userMessage.includes('oily') && (userMessage.includes('skin') || userMessage.includes('routine'))) {
      aiResponse = "For oily skin, our Niacinamide Serum is perfect! 💎 It helps control sebum production, minimize pores, and reduce shine. Here's an ideal routine:\n\n1. Foaming gel cleanser\n2. Balancing toner\n3. Niacinamide Serum\n4. Lightweight gel moisturizer\n5. Oil-free sunscreen (AM)\n\nAvoid heavy creams and opt for water-based products. What specific concerns would you like to address?";
    }
    
    // Combination Skin
    else if (userMessage.includes('combination') && userMessage.includes('skin')) {
      aiResponse = "Combination skin needs balance! 🌸 Use lightweight products that hydrate without adding oil to the T-zone:\n\n1. Gentle gel cleanser\n2. Hydrating toner\n3. Niacinamide or Hyaluronic Acid Serum\n4. Gel-cream moisturizer\n5. Lightweight sunscreen\n\nYou can use different products on different zones - richer cream on dry areas, mattifying products on oily zones. Need help choosing specific products?";
    }
    
    // Sensitive Skin
    else if (userMessage.includes('sensitive') && userMessage.includes('skin')) {
      aiResponse = "For sensitive skin, choose fragrance-free, hypoallergenic products and always patch test first! 🌸 Our gentle formulas are perfect:\n\n✓ Avoid harsh acids, retinol, and fragrances\n✓ Look for soothing ingredients like Centella, Allantoin\n✓ Use lukewarm water, not hot\n✓ Minimal products = less irritation\n\nAll MIRAÉ LUXE products are cruelty-free and vegan. What specific sensitivity issues are you experiencing?";
    }
    
    // Acne / Breakouts
    else if (userMessage.includes('acne') || userMessage.includes('breakout') || userMessage.includes('pimple')) {
      aiResponse = "For acne-prone skin, I recommend products with Niacinamide and Salicylic Acid! 💎\n\n✓ Our Niacinamide Serum helps reduce inflammation and prevent breakouts\n✓ Use a gentle cleanser (don't over-cleanse!)\n✓ Always remove makeup before bed\n✓ Patch test new products\n✓ Avoid touching your face\n\nKey ingredients: Niacinamide, Salicylic Acid, Tea Tree Oil, Zinc. Would you like a complete anti-acne routine recommendation?";
    }
    
    // Dark Spots / Pigmentation
    else if (userMessage.includes('dark spot') || userMessage.includes('pigment') || userMessage.includes('hyperpigment')) {
      aiResponse = "For dark spots and hyperpigmentation, try our Vitamin C Brightening Cream! ✨\n\n✓ Contains 15% Vitamin C to fade dark spots\n✓ Use in the morning with sunscreen (crucial!)\n✓ Pair with Niacinamide at night\n✓ Results in 4-8 weeks with consistent use\n\nOther brightening ingredients: Niacinamide, Alpha Arbutin, Kojic Acid, Licorice Root. Always use SPF 50+ daily! Want more brightening tips?";
    }
    
    // Routine / Steps
    else if (userMessage.includes('routine') || userMessage.includes('step') || userMessage.includes('order')) {
      aiResponse = "Here's the correct skincare routine order! 🌸\n\n**Morning:**\n1. Cleanser\n2. Toner\n3. Serum (Vitamin C)\n4. Eye Cream\n5. Moisturizer\n6. Sunscreen (SPF 50+)\n\n**Evening:**\n1. Cleanser (double cleanse if wearing makeup)\n2. Toner\n3. Treatment (Retinol/Acids)\n4. Serum (Hyaluronic Acid/Niacinamide)\n5. Eye Cream\n6. Moisturizer\n\nWhat's your skin type so I can personalize this for you?";
    }
    
    // Vitamin C
    else if (userMessage.includes('vitamin c') || userMessage.includes('brightening')) {
      aiResponse = "Our Vitamin C Brightening Cream is excellent for dull skin! ✨\n\n✓ 15% Vitamin C concentration\n✓ Reduces dark spots and evens skin tone\n✓ Boosts collagen production\n✓ Use in the morning before sunscreen\n✓ Store in a cool, dark place\n\n**Pro Tips:**\n- Start with lower % if new to Vitamin C\n- Don't mix with Retinol (use separately AM/PM)\n- Pair with Niacinamide for extra brightening\n\nWould you like to know about pairing it with other products?";
    }
    
    // Retinol / Anti-aging
    else if (userMessage.includes('retinol') || userMessage.includes('anti-aging') || userMessage.includes('anti aging') || userMessage.includes('wrinkle')) {
      aiResponse = "Retinol is the gold standard for anti-aging! 💎\n\n**How to use:**\n✓ Start 2-3x per week at night\n✓ Always use moisturizer after\n✓ MUST wear SPF 50+ during the day\n✓ Expect some dryness/flaking initially (normal!)\n\n**Don't mix with:**\n❌ Vitamin C (use in AM instead)\n❌ AHA/BHA acids\n❌ Other retinoids\n\n**Do pair with:**\n✓ Hyaluronic Acid\n✓ Ceramides\n✓ Peptides\n\nResults in 8-12 weeks! Would you like product recommendations?";
    }
    
    // Hyaluronic Acid
    else if (userMessage.includes('hyaluronic') || userMessage.includes('hydrat') || userMessage.includes('moisture')) {
      aiResponse = "Hyaluronic Acid is a hydration powerhouse! ✨\n\n**Benefits:**\n✓ Holds 1000x its weight in water\n✓ Plumps skin and reduces fine lines\n✓ Suitable for ALL skin types\n✓ Non-comedogenic (won't clog pores)\n\n**How to use:**\n- Apply on DAMP skin (crucial!)\n- Follow with moisturizer to seal it in\n- Use AM & PM\n\nOur Hydrating Serum has 3 molecular weights for deep + surface hydration. Perfect for dry, dehydrated, or aging skin! 💎";
    }
    
    // Niacinamide
    else if (userMessage.includes('niacinamide') || userMessage.includes('b3')) {
      aiResponse = "Niacinamide (Vitamin B3) is incredibly versatile! 💎\n\n**Benefits:**\n✓ Controls oil production\n✓ Minimizes pores\n✓ Reduces redness and inflammation\n✓ Brightens skin tone\n✓ Strengthens skin barrier\n\n**Perfect for:**\n- Oily/acne-prone skin\n- Large pores\n- Redness/sensitivity\n- Hyperpigmentation\n\n**Works well with:**\n✓ Hyaluronic Acid\n✓ Vitamin C\n✓ Retinol\n\nUse 5-10% concentration. Our Niacinamide Serum is AED 139. Want to know more?";
    }
    
    // Serum / Essence
    else if (userMessage.includes('serum') || userMessage.includes('essence')) {
      aiResponse = "Serums are concentrated treatments with active ingredients! ✨\n\n**We have several options:**\n\n💎 **Hyaluronic Acid Serum** (AED 149)\n- For: Hydration, all skin types\n- Plumps and moisturizes\n\n💎 **Niacinamide Serum** (AED 139)\n- For: Oil control, pores, acne\n- Balances and refines\n\n💎 **Vitamin C Cream** (AED 179)\n- For: Brightening, dull skin\n- Evens tone and prevents dark spots\n\n**Apply:**\nAfter cleansing/toner, before moisturizer. What's your main concern?";
    }
    
    // Layer / Layering
    else if (userMessage.includes('layer') || userMessage.includes('mix') || userMessage.includes('combine')) {
      aiResponse = "Skincare layering order: Thinnest → Thickest! 🌸\n\n**Correct order:**\n1. Water-based (toners, essences)\n2. Serums (thinnest to thickest)\n3. Eye cream\n4. Moisturizer\n5. Oil/Balm (if using)\n6. Sunscreen (AM only, always last)\n\n**Can layer together:**\n✓ Hyaluronic Acid + Niacinamide\n✓ Vitamin C + Hyaluronic Acid\n✓ Niacinamide + most ingredients\n\n**Keep separate (AM/PM):**\n❌ Retinol + Vitamin C\n❌ Retinol + AHA/BHA\n\nNeed help with your specific routine?";
    }
    
    // Sunscreen / SPF
    else if (userMessage.includes('sunscreen') || userMessage.includes('spf') || userMessage.includes('sun')) {
      aiResponse = "Sunscreen is THE most important anti-aging product! ☀️\n\n**Must-knows:**\n✓ Use SPF 50+ daily (even indoors/cloudy days)\n✓ Apply 1/4 teaspoon for face\n✓ Reapply every 2 hours if outdoors\n✓ Apply as LAST step of skincare\n✓ Wait 15 min before sun exposure\n\n**Types:**\n- Physical: Zinc Oxide, Titanium Dioxide\n- Chemical: Avobenzone, Octinoxate\n- Hybrid: Both\n\nAll anti-aging efforts are wasted without SPF! 💎";
    }
    
    // Makeup / Lipstick
    else if (userMessage.includes('lipstick') || userMessage.includes('lip')) {
      aiResponse = "Our Velvet Matte Lipstick collection offers long-lasting color! 💄\n\n**Features:**\n✓ 12-hour wear\n✓ Enriched with Vitamin E\n✓ Vegan & cruelty-free\n✓ AED 89\n\n**Application tips:**\n1. Exfoliate lips gently\n2. Apply lip balm first (let absorb)\n3. Line lips with matching liner\n4. Apply lipstick from center outward\n5. Blot with tissue for longer wear\n\n**For dry lips:**\nPrep with hydrating lip balm 10 min before. What shade or finish are you looking for?";
    }
    
    // Foundation / Base
    else if (userMessage.includes('foundation') || userMessage.includes('base') || userMessage.includes('coverage')) {
      aiResponse = "Foundation tips for flawless skin! ✨\n\n**For Dry Skin:**\n- Use hydrating primer\n- Luminous/dewy finish foundation\n- Apply with damp sponge\n\n**For Oily Skin:**\n- Mattifying primer\n- Matte finish foundation\n- Set with translucent powder\n\n**Application:**\n1. Prep: moisturizer + primer\n2. Apply in thin layers\n3. Blend from center outward\n4. Use our HD Foundation Brush (AED 65)\n5. Set with setting spray\n\nNeed help finding your shade?";
    }
    
    // Brushes / Tools
    else if (userMessage.includes('brush') || userMessage.includes('tool') || userMessage.includes('applicator')) {
      aiResponse = "Professional tools make all the difference! 💎\n\n**Our Brush Collection:**\n\n✓ **Foundation Brush** (AED 65)\n- Dense synthetic bristles\n- Airbrushed finish\n\n✓ **Blending Brush** (AED 55)\n- Soft eyeshadow blending\n- Seamless transitions\n\n✓ **Powder Brush** (AED 70)\n- Large, fluffy\n- Even powder application\n\n**Care tips:**\n- Wash weekly with gentle soap\n- Dry flat on towel\n- Store bristles up\n\nAll brushes are vegan with synthetic bristles! Which type do you need?";
    }
    
    // Price / Cost / Membership
    else if (userMessage.includes('price') || userMessage.includes('cost') || userMessage.includes('expensive') || userMessage.includes('cheap')) {
      aiResponse = "Our products range from AED 45 to AED 299 💎\n\n**Popular prices:**\n- Serums: AED 139-149\n- Moisturizers: AED 159-179\n- Lipsticks: AED 89\n- Brushes: AED 55-70\n\n**Save more with Membership!**\n✨ AED 99/year gets you:\n✓ 15% off ALL products\n✓ Free shipping\n✓ Free gift every order\n✓ Early access to launches\n✓ Birthday special discount\n\n**Average savings: AED 900+ per year!**\nInterested in joining?";
    }
    
    // Membership
    else if (userMessage.includes('member') || userMessage.includes('premium') || userMessage.includes('subscription')) {
      aiResponse = "MIRAÉ LUXE Premium Membership - AED 99/year! ✨\n\n**Benefits:**\n💎 15% off ALL products\n💎 Free shipping (no minimum)\n💎 Free gift with EVERY order\n💎 Early access to new launches\n💎 Exclusive member events\n💎 Birthday month discount\n\n**Math:**\nWith average order of AED 300:\n- Save AED 45 per order\n- Just 3 orders = membership paid off!\n- Average member saves AED 900+/year\n\nReady to join and start saving?";
    }
    
    // Vegan / Cruelty-free
    else if (userMessage.includes('vegan') || userMessage.includes('cruelty') || userMessage.includes('animal')) {
      aiResponse = "ALL MIRAÉ LUXE products are 100% vegan & cruelty-free! 🌸\n\n✓ No animal-derived ingredients\n✓ Never tested on animals\n✓ Certified cruelty-free\n✓ Plant-based formulas\n✓ Eco-conscious packaging\n\n**Our commitment:**\n- Ethical beauty practices\n- Sustainable sourcing\n- Clean ingredients\n- Transparent formulations\n\nBeauty without compromise! 💚 What products are you interested in?";
    }
    
    // Ingredients
    else if (userMessage.includes('ingredient') || userMessage.includes('contains') || userMessage.includes('formula')) {
      aiResponse = "I'd be happy to explain ingredients! 💎\n\n**Our star ingredients:**\n✨ Hyaluronic Acid - Hydration\n✨ Niacinamide - Oil control, pores\n✨ Vitamin C - Brightening\n✨ Vitamin E - Antioxidant protection\n✨ Peptides - Anti-aging\n✨ Ceramides - Barrier repair\n✨ Natural extracts - Soothing\n\n**We avoid:**\n❌ Parabens\n❌ Sulfates\n❌ Synthetic fragrances\n❌ Animal ingredients\n\nWhich ingredient would you like to know more about?";
    }
    
    // Shipping / Delivery
    else if (userMessage.includes('ship') || userMessage.includes('deliver') || userMessage.includes('order')) {
      aiResponse = "Shipping from Dubai, UAE! 🇦🇪\n\n**Shipping:**\n- Free shipping on orders over AED 200\n- AED 20 flat rate for orders under AED 200\n- Members get FREE shipping on ALL orders!\n\n**Delivery time:**\n- Dubai: 1-2 business days\n- UAE: 2-3 business days\n- GCC: 3-5 business days\n\n**Order tracking:**\n- Email confirmation sent immediately\n- Tracking number within 24 hours\n- Track in 'My Account' section\n\nAny other questions?";
    }
    
    // Returns / Exchange
    else if (userMessage.includes('return') || userMessage.includes('exchange') || userMessage.includes('refund')) {
      aiResponse = "Our return policy is customer-friendly! 💎\n\n**Returns:**\n✓ 30-day return window\n✓ Products must be unopened\n✓ Original packaging required\n✓ Full refund or exchange\n\n**How to return:**\n1. Contact us within 30 days\n2. Get return authorization\n3. Ship back to our Dubai address\n4. Refund processed in 5-7 days\n\n**Note:** Opened products can't be returned for hygiene reasons. Have questions about a specific order?";
    }
    
    // Contact / Help
    else if (userMessage.includes('contact') || userMessage.includes('email') || userMessage.includes('phone') || userMessage.includes('help')) {
      aiResponse = "We're here to help! 💎\n\n**Contact us:**\n📧 miraeluxe.ae@gmail.com\n📱 Instagram: @miraeluxe.ae\n🌐 Location: Dubai, UAE 🇦🇪\n\n**Customer service hours:**\nSunday - Thursday: 9 AM - 6 PM GST\n\n**Response time:**\n- Email: Within 24 hours\n- Instagram DM: Within 12 hours\n\nYou can also visit our Contact page on the website for a direct message form! What can I help you with?";
    }
    
    // Greetings
    else if (userMessage.includes('hi') || userMessage.includes('hello') || userMessage.includes('hey') || userMessage === 'h') {
      aiResponse = "Hello! 👋 Welcome to MIRAÉ LUXE! I'm here to help with:\n\n✨ Skincare routines & recommendations\n💄 Makeup tips & techniques\n🧴 Ingredient information\n💎 Product pairing advice\n🌸 Skin concern solutions\n\nWhat would you like to know about today?";
    }
    
    // Thanks
    else if (userMessage.includes('thank') || userMessage.includes('thanks') || userMessage.includes('appreciate')) {
      aiResponse = "You're very welcome! ✨ I'm always here to help with your skincare and makeup questions. Happy shopping at MIRAÉ LUXE! 💎\n\nFeel free to ask anything else! 🌸";
    }
    
    // Bye
    else if (userMessage.includes('bye') || userMessage.includes('goodbye')) {
      aiResponse = "Goodbye! 👋 Thank you for chatting with MIRAÉ LUXE. Come back anytime for beauty advice! Stay glowing! ✨💎";
    }
    
    // Default response
    else {
      const randomResponses = [
        "That's a great question! I can help you with skincare routines, product recommendations, ingredient information, and makeup tips. Could you tell me more about your skin type or specific concerns? 🌸",
        "I'd love to help! Could you provide more details? For example:\n\n✓ What's your skin type? (dry, oily, combination, sensitive)\n✓ What are your main concerns? (acne, aging, dullness)\n✓ What products are you currently using?\n\nThis will help me give you personalized advice! 💎",
        "I'm here to assist! I can help with:\n\n✨ Skincare routines for your skin type\n💄 Makeup application tips\n🧴 Product recommendations\n🌸 Ingredient explanations\n\nWhat would you like to explore? Feel free to ask about dry skin, oily skin, acne, anti-aging, or any MIRAÉ LUXE product!"
      ];
      aiResponse = randomResponses[Math.floor(Math.random() * randomResponses.length)];
    }

    setMessages([
      ...newMessages,
      { role: 'assistant', content: aiResponse }
    ]);
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    "What's the best routine for dry skin?",
    "How to layer serums?",
    "Best products for acne-prone skin?",
    "Tell me about your membership"
  ];

  const handleQuickQuestion = (question) => {
    setInput(question);
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button 
          className="chat-bubble" 
          onClick={() => setIsOpen(true)}
          aria-label="Open chat"
        >
          <FiMessageCircle size={24} />
          <span className="chat-badge">Ask AI</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-content">
              <div className="chat-avatar">✨</div>
              <div>
                <h3>MIRAÉ LUXE Assistant</h3>
                <p>Your beauty expert</p>
              </div>
            </div>
            <button 
              className="chat-close" 
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`chat-message ${message.role}`}
              >
                {message.role === 'assistant' && (
                  <div className="message-avatar">✨</div>
                )}
                <div className="message-content">
                  {message.content}
                </div>
                {message.role === 'user' && (
                  <div className="message-avatar user-avatar">You</div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="chat-message assistant">
                <div className="message-avatar">✨</div>
                <div className="message-content typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions (show only at start) */}
          {messages.length === 1 && (
            <div className="quick-questions">
              <p className="quick-questions-title">Popular questions:</p>
              {quickQuestions.map((q, index) => (
                <button
                  key={index}
                  className="quick-question-btn"
                  onClick={() => handleQuickQuestion(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="chat-input-container">
            <input
              type="text"
              className="chat-input"
              placeholder="Ask about skincare, makeup, ingredients..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <button 
              className="chat-send-btn" 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
            >
              <FiSend size={20} />
            </button>
          </div>

          <div className="chat-footer">
            Powered by MIRAÉ LUXE AI • Always verify with professionals
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;