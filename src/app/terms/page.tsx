const TermsPage = () => {
  return (
    <main className="policy-container">
      <div className="policy-card">
        <h1 className="policy-title">Terms of Service</h1>
        <p className="policy-updated">Last updated: January 2025</p>

        <p className="policy-section">
          By using this application, you agree to allow access to your Google
          Calendar only for the features explicitly provided by the app.
        </p>

        <p className="policy-section">
          This application is provided on an "as is" and "as available" basis,
          without warranties of any kind, either express or implied.
        </p>

        <p className="policy-section">
          We are not responsible for data loss, calendar misconfigurations,
          missed events, or service interruptions that may occur while using
          the application.
        </p>

        <p className="policy-section">
          You may revoke the app’s access to your Google account at any time
          through your Google Account security settings.
        </p>
      </div>
    </main>
  );
};

export default TermsPage;
