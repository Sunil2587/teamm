import React, { useState, useRef } from 'react';

const Gallery = ({ gallery = [], onAddGalleryImage }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formData, setFormData] = useState({ url: '', caption: '' });
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef();

  const handleUpload = () => {
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Upload selected files to backend
    if (selectedFiles.length > 0) {
      for (const file of selectedFiles) {
        const data = new FormData();
        data.append('image', file);
        data.append('caption', file.name);
        const res = await fetch('http://localhost:5000/api/gallery/upload', {
          method: 'POST',
          body: data
        });
        const result = await res.json();
        if (onAddGalleryImage) onAddGalleryImage({ url: result.url, caption: result.caption });
      }
      setSelectedFiles([]);
      setShowModal(false);
      setFormData({ url: '', caption: '' });
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    // If URL provided
    if (formData.url && formData.caption) {
      if (onAddGalleryImage) onAddGalleryImage(formData);
      setFormData({ url: '', caption: '' });
      setShowModal(false);
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleDownload = (url, caption) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = caption || 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">🖼️ Sacred Gallery</h2>
          <button className="btn btn--primary" onClick={handleUpload}>
            <span className="btn-icon">📤</span>
            Upload Media
          </button>
        </div>

        <div className="gallery-grid">
          {gallery.map((image, idx) => (
            <div key={image._id || idx} className="gallery-item" onClick={() => handleImageClick(image)}>
              <img src={image.url} alt={image.caption} className="gallery-image" />
              <div className="gallery-overlay">
                <h4>{image.caption}</h4>
                <button
                  className="btn btn--secondary"
                  style={{ marginTop: '0.5rem' }}
                  onClick={e => {
                    e.stopPropagation();
                    handleDownload(image.url, image.caption);
                  }}
                >
                  ⬇️ Download
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedImage && (
          <div className="modal" onClick={() => setSelectedImage(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">{selectedImage.caption}</h3>
                <button className="modal-close" onClick={() => setSelectedImage(null)}>×</button>
              </div>
              <img
                src={selectedImage.url}
                alt={selectedImage.caption}
                style={{ width: '100%', height: 'auto', borderRadius: '10px' }}
              />
              <button
                className="btn btn--primary"
                style={{ marginTop: '1rem' }}
                onClick={() => handleDownload(selectedImage.url, selectedImage.caption)}
              >
                ⬇️ Download
              </button>
            </div>
          </div>
        )}

        {showModal && (
          <div className="modal" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Upload Media</h3>
                <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Select Images (from phone/computer)</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <div style={{ fontSize: '0.9em', color: '#888', marginTop: '0.3em' }}>
                    You can select multiple images or add a folder.
                  </div>
                </div>
                <div style={{ textAlign: 'center', margin: '1em 0', color: '#888' }}>OR</div>
                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input
                    type="url"
                    name="url"
                    className="form-control"
                    value={formData.url}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Caption</label>
                  <input
                    type="text"
                    name="caption"
                    className="form-control"
                    value={formData.caption}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn--secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn--primary">
                    Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;