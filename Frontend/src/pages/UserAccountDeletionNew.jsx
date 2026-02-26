import React from 'react';

const UserAccountDeletionNew = () => {
  return (
    <div className="bg-[#f8fafc] min-h-screen font-['DM_Sans',_sans-serif] text-[#1a1a1a] m-0 p-0">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap');
          
          :root {
            --orange: #ff6b35;
            --orange-light: #fff3ef;
            --text: #1a1a1a;
            --muted: #6b7280;
            --border: #e2e8f0;
            --white: #ffffff;
            --bg: #f8fafc;
          }

          .standalone-wrapper {
            font-family: 'DM Sans', sans-serif;
            background: var(--bg);
            color: var(--text);
            min-height: 100vh;
          }

          .dm-serif {
            font-family: 'DM Serif Display', serif;
          }

          /* NAV */
          .standalone-nav {
            background: #ff6b35;
            padding: 0;
            height: 72px;
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          }

          .nav-container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 0 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
          }

          .nav-links {
            display: flex;
            gap: 3rem;
            list-style: none;
          }

          .nav-links a {
            text-decoration: none;
            color: #ffffff;
            font-size: 1rem;
            font-weight: 600;
            transition: opacity 0.2s;
            letter-spacing: 0.02em;
          }

          .nav-links a:hover {
            opacity: 0.8;
          }

          /* MAIN */
          .standalone-main {
            max-width: 1000px;
            margin: 0 auto;
            padding: 4rem 1.5rem 6rem;
          }

          .page-header {
            margin-bottom: 3.5rem;
            text-align: center;
          }

          .badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #fff3ef;
            color: #ff6b35;
            font-size: 0.8rem;
            font-weight: 600;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            padding: 6px 14px;
            border-radius: 100px;
            margin-bottom: 1.25rem;
          }

          .page-header h1 {
            font-family: 'DM Serif Display', serif;
            font-size: 2.5rem;
            font-weight: 400;
            color: #1a1a1a;
            line-height: 1.25;
            margin-bottom: 1rem;
          }

          .page-header p {
            font-size: 1.4rem;
            color: #6b7280;
            line-height: 1.6;
            max-width: 900px;
            margin: 0 auto;
          }

          /* INFO CARDS */
          .info-strip {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
            margin-bottom: 3.5rem;
          }

          .info-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 1.5rem;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
            transition: transform 0.2s, box-shadow 0.2s;
          }

          .info-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);
          }

          .info-card .icon {
            width: 48px;
            height: 48px;
            background: #fff3ef;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
            color: #ff6b35;
            transition: transform 0.2s;
          }

          .info-card:hover .icon {
            transform: scale(1.1);
          }

          .info-card h3 {
            font-size: 0.82rem;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 0.25rem;
          }

          .info-card p {
            font-size: 0.92rem;
            color: #1a1a1a;
            font-weight: 500;
          }

          /* FORM SECTION */
          .form-section {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
          }

          .form-section-header {
            padding: 1.4rem 1.8rem;
            border-bottom: 1px solid #e2e8f0;
          }

          .form-section-header h2 {
            font-size: 1rem;
            font-weight: 600;
            color: #1a1a1a;
          }

          .form-section-header p {
            font-size: 0.85rem;
            color: #6b7280;
            margin-top: 3px;
          }

          .form-section iframe {
            display: block;
            width: 100%;
            min-height: 1000px;
            border: none;
          }

          @media (max-width: 600px) {
            .info-strip { grid-template-columns: 1fr; }
            .nav-links { display: none; }
            .page-header h1 { font-size: 1.6rem; }
          }
        `}
      </style>

      <div className="standalone-wrapper">
        <nav className="standalone-nav">
          <div className="nav-container">
            <ul className="nav-links">
              <li><a href="https://treecampus.in/">Home</a></li>
              <li><a href="https://treecampus.in/how-it-works/">How It Works</a></li>
              <li><a href="https://treecampus.in/english-speaking-classes-online-free/">Spoken English Free</a></li>
            </ul>
          </div>
        </nav>

        <main className="standalone-main">
          <div className="page-header">
            <div className="badge">
              <svg width="12" height="12" fill="none" viewBox="0 0 16 16">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 5v4M8 11v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Account Management
            </div>
            <h1>Delete Your Tree Campus Account</h1>
            <p>
              Please provide the information below so we can start processing your request. Once you submit, we'll send you a verification email. Your request will take <strong>90 days</strong> to process after verification is complete.
            </p>
          </div>

          <div className="info-strip">
            <div className="info-card">
              <div className="icon">
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                  <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7L8 1z" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </div>
              <h3>Step 1</h3>
              <p>Submit this form</p>
            </div>
            <div className="info-card">
              <div className="icon">
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                  <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M1 6h14" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </div>
              <h3>Step 2</h3>
              <p>Account Verification</p>
            </div>
            <div className="info-card">
              <div className="icon">
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M5.5 8l2 2 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </div>
              <h3>Step 3</h3>
              <p>Processed in 90 days</p>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <h2>Account Deletion Request Form</h2>
              <p>All fields are required. Please ensure you use the email linked to your account.</p>
            </div>
            <iframe 
              src="https://docs.google.com/forms/d/e/1FAIpQLSeYXmea8KCPTmsjv7fqta13r_onq6JdrIlNpncA5WjyKHa-Dw/viewform?embedded=true" 
              width="100%" 
              height="1000" 
              frameBorder="0" 
              marginHeight="0" 
              marginWidth="0"
              title="Form"
            >
              Loading…
            </iframe>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserAccountDeletionNew;
