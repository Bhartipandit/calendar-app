const TermsPage = () => {
  return (
    <main className="policy-container">
      <div className="policy-card">
        <h1 className="policy-title">Terms of Service</h1>
        <p className="policy-updated">Last updated: January 2025</p>

        <p className="policy-section">
          By using this application, you agree to allow access to your Google Calendar <strong>for read-only purposes</strong> to display your events. We do not modify 
          or write to your Google Calendar.
        </p>

        <p className="policy-section">
          Any functionality to create, read, or save events within this app is handled 
          separately and stored securely in the app's backend.
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
