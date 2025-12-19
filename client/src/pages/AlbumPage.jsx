import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  Container, Row, Col, Button, Image, Modal,
  Dropdown, DropdownButton, Alert, Card, Spinner
} from 'react-bootstrap';
import { albumApi } from '../../src/entities/album/api';

const AlbumPage = () => {
  const { albumId } = useParams();
  const navigate = useNavigate();
  
  const [album, setAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showDeletePhotoModal, setShowDeletePhotoModal] = useState(false);
  const [showEditAlbumModal, setShowEditAlbumModal] = useState(false);
  const [showAddPhotosModal, setShowAddPhotosModal] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  const [albumTitle, setAlbumTitle] = useState('');
  const [albumDescription, setAlbumDescription] = useState('');

  useEffect(() => {
    fetchAlbumData();
  }, [albumId]);

  const fetchAlbumData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Получаем альбом
      const albumRes = await albumApi.getAlbumById(albumId);
      setAlbum(albumRes.data);
      setAlbumTitle(albumRes.data.title);
      setAlbumDescription(albumRes.data.desc || '');
      
      // Получаем фото альбома
      const photosRes = await albumApi.getAlbumPhotos(albumId);
      setPhotos(photosRes.data.photos || []);
      
    } catch (err) {
      setError('Ошибка загрузки альбома');
      console.error('Ошибка загрузки альбома:', err);
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, variant = 'success') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => {
      setAlert(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleViewPhoto = (photo) => {
    setSelectedPhoto(photo);
    setShowPhotoModal(true);
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      await albumApi.deletePhoto(photoId);
      setPhotos(prev => prev.filter(photo => photo.id !== photoId));
      setShowDeletePhotoModal(false);
      setSelectedPhoto(null);
      showAlert('Фотография удалена', 'warning');
    } catch (err) {
      showAlert('Ошибка удаления фото', 'danger');
    }
  };

  const handleAddPhotos = async (newPhotos) => {
    try {
      const result = await albumApi.uploadPhotos(albumId, newPhotos);
      
      // Обновляем список фото
      if (Array.isArray(result)) {
        setPhotos(prev => [...prev, ...result]);
      }
      
      showAlert(`${newPhotos.length} фотографий добавлено`, 'success');
      setShowAddPhotosModal(false);
      fetchAlbumData(); // Перезагружаем данные альбома
    } catch (err) {
      showAlert('Ошибка добавления фото', 'danger');
    }
  };

  const handleUpdateAlbum = async () => {
    try {
      await albumApi.updateAlbum(albumId, {
        title: albumTitle,
        desc: albumDescription
      });
      
      setAlbum(prev => ({
        ...prev,
        title: albumTitle,
        desc: albumDescription
      }));
      
      setShowEditAlbumModal(false);
      showAlert('Альбом обновлен', 'success');
    } catch (err) {
      showAlert('Ошибка обновления альбома', 'danger');
    }
  };

  const handleDeleteAlbum = async () => {
    try {
      await albumApi.deleteAlbum(albumId);
      showAlert('Альбом удален', 'warning');
      navigate('/userPage');
    } catch (err) {
      showAlert('Ошибка удаления альбома', 'danger');
    }
  };

  const handleUploadPhotos = async (e) => {
    const files = Array.from(e.target.files);
    await handleAddPhotos(files);
  };

  const navigatePhoto = (direction) => {
    if (!selectedPhoto) return;
    
    const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1;
    } else {
      newIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : 0;
    }
    
    setSelectedPhoto(photos[newIndex]);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </Spinner>
      </Container>
    );
  }

  if (error || !album) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error || 'Альбом не найден'}</Alert>
        <Button onClick={() => navigate('/userPage')}>Вернуться к альбомам</Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Уведомления */}
      {alert.show && (
        <Alert 
          variant={alert.variant} 
          onClose={() => setAlert({ ...alert, show: false })} 
          dismissible
          className="position-fixed top-0 start-50 translate-middle-x mt-3"
          style={{ zIndex: 1050 }}
        >
          {alert.message}
        </Alert>
      )}

      {/* Шапка альбома */}
      <Row className="align-items-center mb-4">
        <Col md={8}>
          <div className="d-flex align-items-center">
            <Button 
              variant="outline-secondary" 
              onClick={() => navigate('/userPage')}
              className="me-3"
            >
              ← Назад
            </Button>
            <div>
              <h1 className="mb-1">{album.title}</h1>
              <p className="text-muted mb-0">
                {album.desc || 'Без описания'} • {photos.length} фотографий
              </p>
            </div>
          </div>
        </Col>
        <Col md={4} className="text-md-end">
          <div className="d-flex justify-content-end gap-2">
            <Button 
              variant="outline-primary" 
              onClick={() => setShowEditAlbumModal(true)}
            >
              ✏️ Редактировать
            </Button>
            <DropdownButton
              variant="primary"
              title="Действия"
              align="end"
            >
              <Dropdown.Item onClick={() => document.getElementById('fileUpload').click()}>
                📷 Добавить фото
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setShowAddPhotosModal(true)}>
                📁 Добавить несколько
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item 
                onClick={handleDeleteAlbum}
                className="text-danger"
              >
                🗑️ Удалить альбом
              </Dropdown.Item>
            </DropdownButton>
          </div>
          <input
            type="file"
            id="fileUpload"
            multiple
            accept="image/*"
            onChange={handleUploadPhotos}
            style={{ display: 'none' }}
          />
        </Col>
      </Row>

      {/* Обложка альбома */}
      {album.img && (
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Img 
            variant="top" 
            src={`http://localhost:3000${album.img}`}
            style={{ height: '300px', objectFit: 'cover' }}
          />
        </Card>
      )}

      {/* Сетка фотографий */}
      <Row className="g-3">
        {photos.map(photo => (
          <Col key={photo.id} xs={6} sm={4} md={3} lg={2}>
            <Card className="border-0 shadow-sm hover-shadow" style={{ cursor: 'pointer' }}>
              <Card.Img
                variant="top"
                src={`http://localhost:3000${photo.imgUrl}`}
                style={{ height: '150px', objectFit: 'cover' }}
                onClick={() => handleViewPhoto(photo)}
              />
              <Card.Body className="p-2">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                      {photo.comment || 'Без комментария'}
                    </small>
                  </div>
                  <DropdownButton
                    variant="outline-secondary"
                    title="⋮"
                    size="sm"
                    align="end"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Dropdown.Item onClick={() => handleViewPhoto(photo)}>
                      👁️ Просмотр
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item 
                      onClick={() => {
                        setSelectedPhoto(photo);
                        setShowDeletePhotoModal(true);
                      }}
                      className="text-danger"
                    >
                      🗑️ Удалить
                    </Dropdown.Item>
                  </DropdownButton>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Если фотографий нет */}
      {photos.length === 0 && (
        <div className="text-center py-5">
          <div className="display-1 text-muted mb-4">📷</div>
          <h3 className="mb-3">В альбоме пока нет фотографий</h3>
          <p className="text-muted mb-4">Добавьте свои первые фотографии</p>
          <Button 
            variant="primary"
            onClick={() => document.getElementById('fileUpload').click()}
          >
            Добавить фото
          </Button>
        </div>
      )}

      {/* Модальные окна (остаются без изменений) */}
      {/* ... остальной код модальных окон ... */}
    </Container>
  );
};

export default AlbumPage;