import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../context/DashboardContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { claims, loading, error, updateClaimStatus, sendNudge } = useDashboard();
  const [selectedClaim, setSelectedClaim] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const handleStatusChange = async (claimId: string, newStatus: string) => {
    try {
      await updateClaimStatus(claimId, newStatus, notes);
      setSelectedClaim(null);
      setNotes('');
    } catch (error) {
      console.error('Failed to update claim status:', error);
    }
  };

  const handleNudge = async (claimId: string) => {
    try {
      await sendNudge(claimId);
    } catch (error) {
      console.error('Failed to send nudge:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        Loading claims...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        {error}
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.name}</h1>
      
      <section className="claims-section">
        <h2>Your Claims</h2>
        {claims.length === 0 ? (
          <p>No claims found. Start by claiming an issue!</p>
        ) : (
          <div className="claims-list">
            {claims.map(claim => (
              <div
                key={claim._id}
                className={`claim-card ${claim.status}`}
                onClick={() => setSelectedClaim(claim._id)}
              >
                <h3>
                  {claim.repository.owner}/{claim.repository.name} #{claim.issue.number}
                </h3>
                <p className="issue-title">{claim.issue.title}</p>
                <div className="claim-details">
                  <span className="status">Status: {claim.status}</span>
                  <span className="activity">
                    Last active: {new Date(claim.lastActivityDate).toLocaleDateString()}
                  </span>
                </div>
                {claim.status === 'active' && (
                  <div className="claim-actions">
                    <button
                      className="btn btn-success"
                      onClick={() => handleStatusChange(claim._id, 'completed')}
                    >
                      Mark Completed
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleStatusChange(claim._id, 'abandoned')}
                    >
                      Abandon
                    </button>
                    {user?.role === 'maintainer' && (
                      <button
                        className="btn btn-warning"
                        onClick={() => handleNudge(claim._id)}
                      >
                        Send Nudge
                      </button>
                    )}
                  </div>
                )}
                {selectedClaim === claim._id && (
                  <div className="notes-form">
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes (optional)"
                      rows={3}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {user?.role === 'maintainer' && (
        <section className="stats-section">
          <h2>Claims Overview</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Active Claims</h4>
              <p>{claims.filter(claim => claim.status === 'active').length}</p>
            </div>
            <div className="stat-card">
              <h4>Completed Claims</h4>
              <p>{claims.filter(claim => claim.status === 'completed').length}</p>
            </div>
            <div className="stat-card">
              <h4>Abandoned Claims</h4>
              <p>{claims.filter(claim => claim.status === 'abandoned').length}</p>
            </div>
            <div className="stat-card">
              <h4>Released Claims</h4>
              <p>{claims.filter(claim => claim.status === 'released').length}</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;