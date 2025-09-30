import { useNavigate } from 'react-router-dom';

const Upload = () => {
  const navigate = useNavigate();

  const handleFile = (file) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF, DOC, or DOCX file');
      return;
    }
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h1 className="auth-title">Upload Your Resume</h1>
        <p className="auth-subtitle">
          Upload your resume to automatically build your skill tree
          from your experience
        </p>

        <div
          className="drop-zone"
          onClick={() => document.getElementById('file-input')?.click()}
          onDragOver={e => {
            e.preventDefault();
            e.currentTarget.classList.add('dragover');
          }}
          onDragLeave={e => e.currentTarget.classList.remove('dragover')}
          onDrop={e => {
            e.preventDefault();
            e.currentTarget.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
              handleFile(files[0]);
            }
          }}
        >
          <div className="upload-icon">📄</div>
          <div>Drop your resume here</div>
          <div>or click to browse files</div>
          <div className="upload-hint">Supports PDF, DOC, DOCX files up to 10MB</div>
        </div>

        <input
          id="file-input"
          type="file"
          accept=".pdf,.doc,.docx"
          style={{ display: 'none' }}
          onChange={e => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        <button className="auth-btn" onClick={() => navigate('/dashboard')}>
          Skip for now
        </button>
      </div>
    </div>
  );
};

export default Upload;
