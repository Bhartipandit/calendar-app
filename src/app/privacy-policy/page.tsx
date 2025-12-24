const PrivacyPolicyPage = () => {
  return (
    <main className="policy-container">
      <div className="policy-card">
        <h1 className="policy-title">Privacy Policy</h1>
        <p className="policy-updated">Last updated: January 2025</p>

        <p className="policy-section">
          This application uses Google OAuth to securely access Google Calendar data for 
          the purpose of <strong>reading calendar events only</strong>. We do not modify, 
          write, or store any events in your Google Calendar.
        </p>

        <p className="policy-section">
          Any functionality to read, write, or save events within this app is handled <strong>separately in the app</strong> and stored securely in our backend.
        </p>

        <p className="policy-section">
          We do not store, share, or sell user data to third parties.
          All access is limited to the functionality provided by the app.
        </p>

        <p className="policy-section">
          All authentication is handled securely via Google OAuth.
          No Google account passwords are collected or stored by this application.
        </p>

        <div className="policy-contact">
          <p>
            If you have any questions about this Privacy Policy, contact us at:
            <br />
            <a href="mailto:hello.bhartipandit@gmail.com">
              hello.bhartipandit@gmail.com
            </a>
          </p>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicyPage;
