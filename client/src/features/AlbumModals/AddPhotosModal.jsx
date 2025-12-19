import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Image } from 'react-bootstrap';

const AddPhotosModal = ({ show, onHide, album, onAddPhotos }) => {
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (!show) {
      setUploadedPhotos([]);
      setFiles([]);
    }
  }, [show]);

  const handleFileUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
    
    const photoUrls = selectedFiles.map(file => URL.createObjectURL(file));
    setUploadedPhotos(prev => [...prev, ...photoUrls]);
  };

  const removeUploadedPhoto = (index) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (files.length === 0 || !album) return;
    onAddPhotos(album.id, files);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          Добавить фото в "{album?.title || 'альбом'}"
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-4">
            <Form.Label>Выберите фотографии</Form.Label>
            <Form.Control
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
            />
            <Form.Text className="text-muted">
              Можно выбрать несколько файлов
            </Form.Text>
          </Form.Group>

          {uploadedPhotos.length > 0 && (
            <>
              <h6>Выбранные фото ({uploadedPhotos.length}):</h6>
              <Row className="g-2 mb-4">
                {uploadedPhotos.map((photo, index) => (
                  <Col xs={4} md={3} key={index}>
                    <div className="position-relative">
                      <Image 
                        src={photo} 
                        thumbnail 
                        className="w-100" 
                        style={{ height: '80px', objectFit: 'cover' }}
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        className="position-absolute top-0 end-0"
                        style={{ transform: 'translate(30%, -30%)' }}
                        onClick={() => removeUploadedPhoto(index)}
                      >
                        ×
                      </Button>
                    </div>
                  </Col>
                ))}
              </Row>
            </>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Отмена
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={files.length === 0}>
          Добавить {files.length} фото
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddPhotosModal;