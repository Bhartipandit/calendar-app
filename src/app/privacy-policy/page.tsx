const PrivacyPolicyPage = () => {
  return (
    <main className="policy-container">
      <div className="policy-card">
        <h1 className="policy-title">Privacy Policy</h1>
        <p className="policy-updated">Last updated: January 2025</p>

        <p className="policy-section">
          This application uses Google OAuth 2.0 to access Google Calendar data
          strictly for displaying calendar events within the app.
        </p>

        <h2 className="policy-subtitle">Data Accessed</h2>
        <p className="policy-section">
          <p className="policy-section">
            With your consent, the application accesses the following Google
            user data:
          </p>
          <ul className="policy-list">
            <li>
              Google Calendar event details (such as title, date, time, and
              description)
            </li>
            <li>
              Calendar events created by third-party applications (e.g.,
              Microsoft Teams, Zoom, Goibibo) as they appear in your Google
              Calendar
            </li>
          </ul>
        </p>
        <h2 className="policy-subtitle">How We Use This Data</h2>
        <p className="policy-section">
          The accessed Google Calendar data is used solely to:
        </p>
        <p className="policy-section">
          <ul className="policy-list">
            <li>
              Display all your calendar events in a single unified calendar view
            </li>
            <li>
              Help you view your overall schedule alongside events you manually
              add in the app
            </li>
          </ul>
        </p>
        <p className="policy-section">
          The application{" "}
          <strong>does not modify, write, delete, or store</strong> any Google
          Calendar events. All calendar data is fetched in real time using
          Google Calendar APIs and displayed temporarily in the user interface.
        </p>

        <h2 className="policy-subtitle">Data Storage and Sharing</h2>
        <p className="policy-section">
          We do not store Google Calendar event data on our servers. We do not
          share, sell, or transfer Google user data to any third parties. Any
          events created directly within the app (not sourced from Google
          Calendar) are stored separately and securely in our backend.
        </p>

        <h2 className="policy-subtitle">Data Protection and Security</h2>
        <p className="policy-section">
          We take appropriate technical and organizational measures to protect
          Google user data from unauthorized access, loss, misuse, or
          disclosure.
        </p>
        <p className="policy-section">
          <ul className="policy-list">
            <li>
              All data access occurs over secure HTTPS connections using
              Google-approved OAuth 2.0 protocols.
            </li>
            <li>
              Google OAuth access tokens are used only during active user
              sessions and are not exposed to third parties.
            </li>
            <li>
              Access to Google user data is restricted strictly to the
              functionality required to display calendar events within the app.
            </li>
          </ul>
        </p>

        <h2 className="policy-subtitle">Authentication and Security</h2>
        <p className="policy-section">
          Authentication is handled securely via Google OAuth. This application
          does not collect or store Google account passwords.
        </p>

        <h2 className="policy-subtitle">Data Retention and Deletion</h2>
        <p className="policy-section">
          This application does not retain or store Google Calendar event data.
          All Google Calendar data is fetched in real time from Google APIs and
          displayed temporarily in the user interface.
        </p>
        <p className="policy-section">
          Once the session ends or the user revokes access, the application no
          longer has access to Google Calendar data. No Google user data is
          retained, cached, or backed up on our servers.
        </p>

        <div className="policy-contact">
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at:
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
