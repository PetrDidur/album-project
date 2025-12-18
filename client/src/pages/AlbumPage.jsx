import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  Container, 
  Row, 
  Col, 
  Button, 
  Image, 
  Modal,
  Dropdown,
  DropdownButton,
  Alert,
  Card
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const AlbumPage = () => {
  const { albumId } = useParams();
  const navigate = useNavigate();
  
  // Моковые данные для альбома и фотографий
  const [album, setAlbum] = useState({
    id: parseInt(albumId),
    title: `Альбом ${albumId}`,
    description: 'Мой любимый альбом с фотографиями',
    cover: `https://via.placeholder.com/800x400/6C5CE7/FFFFFF?text=Альбом+${albumId}`,
    photosCount: 12,
    createdDate: '2024-01-15',
    author: 'Вы'
  });

  // Моковые фотографии
  const [photos, setPhotos] = useState([
    { id: 1, url: 'https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Фото+1', title: 'Закат на море', date: '2024-01-10', description: 'Красивый закат' },
    { id: 2, url: 'https://via.placeholder.com/400x300/4ECDC4/FFFFFF?text=Фото+2', title: 'Горный пейзаж', date: '2024-01-11', description: 'Горы в утреннем тумане' },
    { id: 3, url: 'https://via.placeholder.com/400x300/45B7D1/FFFFFF?text=Фото+3', title: 'Городская улица', date: '2024-01-12' },
    { id: 4, url: 'https://via.placeholder.com/400x300/96CEB4/FFFFFF?text=Фото+4', title: 'Летний пикник', date: '2024-01-13', description: 'Отдых на природе' },
    { id: 5, url: 'https://via.placeholder.com/400x300/FECA57/FFFFFF?text=Фото+5', title: 'Ночной город', date: '2024-01-14' },
    { id: 6, url: 'https://via.placeholder.com/400x300/FF9FF3/FFFFFF?text=Фото+6', title: 'Осенний лес', date: '2024-01-15', description: 'Прогулка по осеннему лесу' },
    { id: 7, url: 'https://via.placeholder.com/400x300/54A0FF/FFFFFF?text=Фото+7', title: 'Морской берег', date: '2024-01-16' },
    { id: 8, url: 'https://via.placeholder.com/400x300/5F27CD/FFFFFF?text=Фото+8', title: 'Зимний вечер', date: '2024-01-17', description: 'Первый снег' },
    { id: 9, url: 'https://via.placeholder.com/400x300/00D2D3/FFFFFF?text=Фото+9', title: 'Весенние цветы', date: '2024-01-18' },
    { id: 10, url: 'https://via.placeholder.com/400x300/FF9F43/FFFFFF?text=Фото+10', title: 'Архитектура', date: '2024-01-19' },
    { id: 11, url: 'https://via.placeholder.com/400x300/EE5A24/FFFFFF?text=Фото+11', title: 'Портрет', date: '2024-01-20', description: 'Портретная съемка' },
    { id: 12, url: 'https://via.placeholder.com/400x300/5758BB/FFFFFF?text=Фото+12', title: 'Абстракция', date: '2024-01-21' },
  ]);

  // Состояния
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showDeletePhotoModal, setShowDeletePhotoModal] = useState(false);
  const [showEditAlbumModal, setShowEditAlbumModal] = useState(false);
  const [showAddPhotosModal, setShowAddPhotosModal] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  const [albumTitle, setAlbumTitle] = useState(album.title);
  const [albumDescription, setAlbumDescription] = useState(album.description);

  // Функции для уведомлений
  const showAlert = (message, variant = 'success') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => {
      setAlert(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Просмотр фотографии
  const handleViewPhoto = (photo) => {
    setSelectedPhoto(photo);
    setShowPhotoModal(true);
  };

  // Удаление фотографии
  const handleDeletePhoto = (photoId) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
    setShowDeletePhotoModal(false);
    setSelectedPhoto(null);
    showAlert('Фотография удалена', 'warning');
  };

  // Добавление фотографий
  const handleAddPhotos = (newPhotos) => {
    const newPhotoObjects = newPhotos.map((file, index) => ({
      id: photos.length + index + 1,
      url: URL.createObjectURL(file),
      title: `Новое фото ${photos.length + index + 1}`,
      date: new Date().toISOString().split('T')[0]
    }));
    
    setPhotos(prev => [...prev, ...newPhotoObjects]);
    showAlert(`${newPhotos.length} фотографий добавлено`, 'success');
  };

  // Обновление альбома
  const handleUpdateAlbum = () => {
    setAlbum(prev => ({
      ...prev,
      title: albumTitle,
      description: albumDescription
    }));
    setShowEditAlbumModal(false);
    showAlert('Альбом обновлен', 'success');
  };

  // Удаление альбома
  const handleDeleteAlbum = () => {
    // Здесь будет навигация назад с удалением
    navigate('/userPage');
    showAlert('Альбом удален', 'warning');
  };

  // Навигация между фотографиями
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

  // Временная функция для добавления тестовых фото
  const handleUploadPhotos = (e) => {
    const files = Array.from(e.target.files);
    handleAddPhotos(files);
  };

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
                {album.description} • {photos.length} фотографий • Создан {album.createdDate}
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
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Img 
          variant="top" 
          src={album.cover}
          style={{ height: '300px', objectFit: 'cover' }}
        />
      </Card>

      {/* Сетка фотографий */}
      <Row className="g-3">
        {photos.map(photo => (
          <Col key={photo.id} xs={6} sm={4} md={3} lg={2}>
            <Card className="border-0 shadow-sm hover-shadow" style={{ cursor: 'pointer' }}>
              <Card.Img
                variant="top"
                src={photo.url}
                style={{ height: '150px', objectFit: 'cover' }}
                onClick={() => handleViewPhoto(photo)}
              />
              <Card.Body className="p-2">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <small className="d-block fw-medium" style={{ fontSize: '0.8rem' }}>
                      {photo.title}
                    </small>
                    {photo.description && (
                      <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>
                        {photo.description}
                      </small>
                    )}
                    <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                      {photo.date}
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
                    <Dropdown.Item>
                      ✏️ Переименовать
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

      {/* Модальное окно просмотра фотографии */}
      <Modal 
        show={showPhotoModal} 
        onHide={() => setShowPhotoModal(false)}
        size="xl"
        centered
      >
        {selectedPhoto && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedPhoto.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
              <Image 
                src={selectedPhoto.url} 
                fluid 
                style={{ maxHeight: '70vh', objectFit: 'contain' }}
              />
              {selectedPhoto.description && (
                <p className="mt-3">{selectedPhoto.description}</p>
              )}
              <div className="mt-3 text-muted">
                <small>Дата: {selectedPhoto.date}</small>
              </div>
            </Modal.Body>
            <Modal.Footer className="justify-content-between">
              <div>
                <Button 
                  variant="outline-secondary" 
                  onClick={() => navigatePhoto('prev')}
                  className="me-2"
                >
                  ← Назад
                </Button>
                <Button 
                  variant="outline-secondary" 
                  onClick={() => navigatePhoto('next')}
                >
                  Вперед →
                </Button>
              </div>
              <div>
                <Button 
                  variant="outline-danger" 
                  onClick={() => {
                    setShowPhotoModal(false);
                    setShowDeletePhotoModal(true);
                  }}
                  className="me-2"
                >
                  Удалить
                </Button>
                <Button variant="primary" onClick={() => setShowPhotoModal(false)}>
                  Закрыть
                </Button>
              </div>
            </Modal.Footer>
          </>
        )}
      </Modal>

      {/* Модальное окно редактирования альбома */}
      <Modal show={showEditAlbumModal} onHide={() => setShowEditAlbumModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Редактировать альбом</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Название альбома</label>
            <input
              type="text"
              className="form-control"
              value={albumTitle}
              onChange={(e) => setAlbumTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Описание</label>
            <textarea
              className="form-control"
              rows="3"
              value={albumDescription}
              onChange={(e) => setAlbumDescription(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditAlbumModal(false)}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleUpdateAlbum}>
            Сохранить
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Модальное окно подтверждения удаления фото */}
      <Modal show={showDeletePhotoModal} onHide={() => setShowDeletePhotoModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Удалить фотографию</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Вы уверены, что хотите удалить фотографию "{selectedPhoto?.title}"?
          Это действие нельзя отменить.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeletePhotoModal(false)}>
            Отмена
          </Button>
          <Button 
            variant="danger" 
            onClick={() => selectedPhoto && handleDeletePhoto(selectedPhoto.id)}
          >
            Удалить
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Модальное окно добавления нескольких фото (можно переиспользовать из UserPage) */}
      <Modal show={showAddPhotosModal} onHide={() => setShowAddPhotosModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Добавить фотографии</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Выберите фотографии</label>
            <input
              type="file"
              className="form-control"
              multiple
              accept="image/*"
              onChange={handleUploadPhotos}
            />
            <div className="form-text">
              Можно выбрать несколько файлов одновременно
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddPhotosModal(false)}>
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AlbumPage;