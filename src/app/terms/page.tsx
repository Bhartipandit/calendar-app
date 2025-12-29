const TermsPage = () => {
  return (
    <main className="policy-container">
      <div className="policy-card">
        <h1 className="policy-title">Terms of Service</h1>
        <p className="policy-updated">Last updated: January 2025</p>

        <p className="policy-section">
          By using this application, you agree to these Terms of Service. If you
          do not agree, please discontinue use of the application.
        </p>

        <p className="policy-section">
          This application uses Google OAuth 2.0 to access your Google Calendar
          on a <strong>read-only basis</strong>. The access is used solely to
          fetch and display calendar events in the app’s user interface.
        </p>

        <p className="policy-section">
          The application may display events created by third-party services
          (such as Microsoft Teams, Zoom, or Goibibo) only as they appear in
          your Google Calendar. The app does not create, modify, delete, or
          store any Google Calendar events.
        </p>

        <p className="policy-section">
          Any events created directly within this application (and not sourced
          from Google Calendar) are handled separately and stored securely in
          the app’s backend.
        </p>

        <p className="policy-section">
          All Google Calendar data is accessed in real time through Google APIs
          and is not permanently stored, shared, or sold to third parties.
        </p>

        <p className="policy-section">
          This application is provided on an “as is” and “as available” basis.
          We make no guarantees regarding availability, accuracy of displayed
          events, or uninterrupted access to the service.
        </p>

        <p className="policy-section">
          We are not responsible for missed events, incorrect scheduling,
          calendar discrepancies, or service interruptions that may result from
          Google API limitations, third-party integrations, or user actions.
        </p>

        <p className="policy-section">
          You may revoke the application’s access to your Google account at any
          time through your Google Account security settings.
        </p>
      </div>
    </main>
  );
};

export default TermsPage;
