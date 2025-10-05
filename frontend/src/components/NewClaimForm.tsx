import { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';

const NewClaimForm = ({ onClose }: { onClose: () => void }) => {
  const { createClaim } = useDashboard();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    repositoryOwner: '',
    repositoryName: '',
    issueNumber: '',
    issueTitle: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const repository = {
        owner: formData.repositoryOwner,
        name: formData.repositoryName,
        url: `https://github.com/${formData.repositoryOwner}/${formData.repositoryName}`
      };

      const issue = {
        number: parseInt(formData.issueNumber),
        title: formData.issueTitle,
        url: `${repository.url}/issues/${formData.issueNumber}`
      };

      await createClaim(repository, issue);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create claim');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Claim New Issue</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="repositoryOwner">Repository Owner</label>
            <input
              type="text"
              id="repositoryOwner"
              name="repositoryOwner"
              value={formData.repositoryOwner}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="repositoryName">Repository Name</label>
            <input
              type="text"
              id="repositoryName"
              name="repositoryName"
              value={formData.repositoryName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="issueNumber">Issue Number</label>
            <input
              type="number"
              id="issueNumber"
              name="issueNumber"
              value={formData.issueNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="issueTitle">Issue Title</label>
            <input
              type="text"
              id="issueTitle"
              name="issueTitle"
              value={formData.issueTitle}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Claim'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewClaimForm;