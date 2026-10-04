import React from 'react';

export const LandingPage = ({ onLoginClick }) => {
  return (
    <div style={{ backgroundColor: '#ffffff', color: '#000000', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Navigation Bar */}
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '24px 5%',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '-0.5px' }}>Bheeshma Bank</div>
        <div style={{ display: 'flex', gap: '32px', fontSize: '14px', alignItems: 'center' }}>
          <a href="#" style={{ color: '#000', textDecoration: 'none', fontWeight: '500' }}>Solutions</a>
          <a href="#" style={{ color: '#000', textDecoration: 'none', fontWeight: '500' }}>Corporate</a>
          <button 
            onClick={onLoginClick}
            style={{ 
              background: '#000', color: '#fff', border: 'none', 
              padding: '10px 24px', borderRadius: '999px', cursor: 'pointer',
              fontWeight: '600', fontSize: '13px', letterSpacing: '0.5px'
            }}
          >
            Client Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '40px 5%' }}>
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          height: '500px', 
          backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Overlay to darken image slightly for text readability */}
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)' }}></div>
          <h1 style={{ 
            position: 'relative',
            color: '#ffffff', 
            fontSize: '56px', 
            fontWeight: '600',
            letterSpacing: '-1px',
            textAlign: 'center',
            textShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}>
            Next-Generation Autonomous Banking
          </h1>
        </div>
      </section>

      {/* Section 1: Institutional Expertise */}
      <section style={{ display: 'flex', padding: '60px 5%', gap: '60px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 400px', height: '600px' }}>
          <img 
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80" 
            alt="Professional Woman" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div style={{ flex: '1 1 400px', paddingRight: '10%' }}>
          <h2 style={{ fontSize: '42px', fontWeight: '500', lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-1px' }}>
            AI-Powered Wealth Copilot,<br />Tailored for You
          </h2>
          <p style={{ fontSize: '16px', color: '#4b5563', lineHeight: 1.6, marginBottom: '40px' }}>
            Experience the future of finance with Bheeshma's autonomous AI agents. We analyze your spending, optimize your budget, and execute smart investments in real-time.
          </p>
          <button style={{
            background: '#000', color: '#fff', border: 'none', 
            padding: '14px 32px', borderRadius: '999px', cursor: 'pointer',
            fontWeight: '600', fontSize: '13px', letterSpacing: '1px'
          }}>
            DISCOVER COPILOT
          </button>
        </div>
      </section>

      {/* Section 2: Innovative Banking */}
      <section style={{ display: 'flex', padding: '60px 5%', gap: '60px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 400px', paddingRight: '10%', paddingLeft: '5%' }}>
          <h2 style={{ fontSize: '42px', fontWeight: '500', lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-1px' }}>
            Instant Sovereign Loans
          </h2>
          <p style={{ fontSize: '16px', color: '#4b5563', lineHeight: 1.6, marginBottom: '20px' }}>
            Bheeshma’s Multi-Agent Underwriting Engine provides instant loan approvals without the traditional paperwork.
          </p>
          <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: 1.6, marginBottom: '40px' }}>
            By securely connecting to your financial history, our AI risk assessment agents evaluate your creditworthiness in seconds. You get access to capital immediately, with flexible terms and dynamic interest rates optimized for your profile.
          </p>
        </div>
        <div style={{ flex: '1 1 400px', height: '600px' }}>
          <img 
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80" 
            alt="Student on campus" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </section>

      {/* Footer / Contact Section */}
      <section style={{ backgroundColor: '#a3bce2', padding: '80px 5%', display: 'flex', gap: '60px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px' }}>
          <h2 style={{ fontSize: '42px', fontWeight: '400', lineHeight: 1.1, marginBottom: '24px', color: '#000' }}>
            Begin Your<br />Financial<br />Transformation
          </h2>
          <p style={{ fontSize: '14px', color: '#1f2937', lineHeight: 1.6, maxWidth: '400px' }}>
            Complete the short inquiry form to enable our specialists to evaluate your objectives and develop a tailored strategy to work together.
          </p>
        </div>

        <div style={{ flex: '1 1 400px' }}>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={e => e.preventDefault()}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', color: '#000' }}>Name</label>
                <input 
                  type="text" 
                  placeholder="First Name (required)" 
                  style={{ width: '100%', padding: '12px', border: '1px solid #7c93b6', background: 'transparent', borderRadius: '24px', outline: 'none', color: '#000' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', color: '#a3bce2' }}>Last Name</label>
                <input 
                  type="text" 
                  placeholder="Last Name (required)" 
                  style={{ width: '100%', padding: '12px', border: '1px solid #7c93b6', background: 'transparent', borderRadius: '24px', outline: 'none', color: '#000' }} 
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', color: '#000' }}>Email <span style={{ color: '#4b5563' }}>(required)</span></label>
              <input 
                type="email" 
                style={{ width: '100%', padding: '12px', border: '1px solid #7c93b6', background: 'transparent', borderRadius: '24px', outline: 'none', color: '#000' }} 
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input type="checkbox" id="newsletter" />
              <label htmlFor="newsletter" style={{ fontSize: '12px', color: '#000' }}>Sign up for news and updates</label>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', color: '#000' }}>Message <span style={{ color: '#4b5563' }}>(required)</span></label>
              <textarea 
                rows={4}
                style={{ width: '100%', padding: '12px', border: '1px solid #7c93b6', background: 'transparent', borderRadius: '16px', outline: 'none', color: '#000', resize: 'vertical' }} 
              />
            </div>

            <button style={{
              background: '#000', color: '#fff', border: 'none', 
              padding: '12px 32px', borderRadius: '999px', cursor: 'pointer',
              fontWeight: '600', fontSize: '12px', letterSpacing: '1px',
              alignSelf: 'flex-start', marginTop: '10px'
            }}>
              SUBMIT
            </button>
          </form>
        </div>
      </section>

    </div>
  );
};
