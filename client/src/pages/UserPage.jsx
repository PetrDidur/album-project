import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Container, Alert } from 'react-bootstrap';
import AlbumList from '../widgets/AlbumList/AlbumList';
import CreateAlbumModal from '../features/AlbumModals/CreateAlbumModal';
import RenameAlbumModal from '../features/AlbumModals/RenameAlbumModal';
import AddPhotosModal from '../features/AlbumModals/AddPhotosModal';
import DeleteAlbumModal from '../features/AlbumModals/DeleteAlbumModal';
import { useAlbums } from '../../src/features/AlbumActions/useAlbums'; // Импортируй хук

const UserPage = () => {
  const {
    albums,
    loading,
    error,
    fetchAlbums,
    createAlbum,
    updateAlbum,
    deleteAlbum,
    addPhotosToAlbum
  } = useAlbums();

  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showAddPhotosModal, setShowAddPhotosModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  const showAlert = (message, variant = 'success') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => {
      setAlert(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const hideAlert = () => {
    setAlert(prev => ({ ...prev, show: false }));
  };

  // Обработчик создания альбома
  const handleCreateAlbum = async (albumData) => {
    const formData = new FormData();
    formData.append('title', albumData.title);
    formData.append('desc', albumData.description || '');
    formData.append('isPrivate', albumData.isPrivate || false);
    
    if (albumData.coverImage) {
      formData.append('image', albumData.coverImage);
    }

    const result = await createAlbum(formData);
    
    if (result.success) {
      showAlert(`Альбом "${albumData.title}" создан!`, 'success');
      setShowCreateModal(false);
    } else {
      showAlert(result.error, 'danger');
    }
  };

  // Обработчик переименования альбома
  const handleRenameAlbum = async (albumId, newTitle) => {
    const result = await updateAlbum(albumId, { title: newTitle });
    
    if (result.success) {
      showAlert('Альбом переименован!', 'success');
      setShowRenameModal(false);
    } else {
      showAlert(result.error, 'danger');
    }
  };

  // Обработчик добавления фото
  const handleAddPhotos = async (albumId, photos) => {
    const result = await addPhotosToAlbum(albumId, photos);
    
    if (result.success) {
      showAlert(`${photos.length} фотографий добавлено в альбом!`, 'success');
      setShowAddPhotosModal(false);
    } else {
      showAlert(result.error, 'danger');
    }
  };

  // Обработчик удаления альбома
  const handleDeleteAlbum = async (albumId) => {
    const result = await deleteAlbum(albumId);
    
    if (result.success) {
      showAlert('Альбом удален!', 'warning');
      setShowDeleteModal(false);
    } else {
      showAlert(result.error, 'danger');
    }
  };

  const openRenameModal = (album) => {
    setSelectedAlbum(album);
    setShowRenameModal(true);
  };

  const openAddPhotosModal = (album) => {
    setSelectedAlbum(album);
    setShowAddPhotosModal(true);
  };

  const openDeleteModal = (album) => {
    setSelectedAlbum(album);
    setShowDeleteModal(true);
  };

  if (loading) {
    return <div className="text-center py-5">Загрузка альбомов...</div>;
  }

  if (error) {
    return <Alert variant="danger">Ошибка: {error}</Alert>;
  }

  return (
    <Container className="py-5">
      {/* Уведомления */}
      {alert.show && (
        <Alert 
          variant={alert.variant} 
          onClose={hideAlert} 
          dismissible
          className="position-fixed top-0 start-50 translate-middle-x mt-3"
          style={{ zIndex: 1050 }}
        >
          {alert.message}
        </Alert>
      )}

      {/* Заголовок и кнопка создания */}
      <Row className="align-items-center mb-5">
        <Col md={8}>
          <h1 className="display-5 fw-bold">Мои фотоальбомы</h1>
          <p className="text-muted">Все ваши воспоминания в одном месте</p>
        </Col>
        <Col md={4} className="text-md-end">
          <Button 
            variant="primary" 
            size="lg" 
            onClick={() => setShowCreateModal(true)}
            className="px-4"
          >
            + Создать фотоальбом
          </Button>
        </Col>
      </Row>

      {/* Список альбомов */}
      <AlbumList 
        albums={albums}
        onRename={openRenameModal}
        onAddPhotos={openAddPhotosModal}
        onDelete={openDeleteModal}
      />

      {/* Если альбомов нет */}
      {albums.length === 0 && !loading && (
        <div className="text-center py-5">
          <div className="display-1 text-muted mb-4">📷</div>
          <h3 className="mb-3">У вас пока нет альбомов</h3>
          <p className="text-muted mb-4">Создайте свой первый альбом для хранения фотографий</p>
          <Button 
            variant="primary"
            onClick={() => setShowCreateModal(true)}
          >
            Создать первый альбом
          </Button>
        </div>
      )}

      {/* Модальные окна */}
      <CreateAlbumModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        onCreate={handleCreateAlbum}
      />

      <RenameAlbumModal
        show={showRenameModal}
        onHide={() => setShowRenameModal(false)}
        album={selectedAlbum}
        onRename={handleRenameAlbum}
      />

      <AddPhotosModal
        show={showAddPhotosModal}
        onHide={() => setShowAddPhotosModal(false)}
        album={selectedAlbum}
        onAddPhotos={handleAddPhotos}
      />

      <DeleteAlbumModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        album={selectedAlbum}
        onDelete={handleDeleteAlbum}
      />

      {/* Футер */}
      <footer className="py-4 mt-5 text-center text-muted border-top">
        <div className="small">
          {albums.length} альбомов • {albums.reduce((sum, album) => sum + (album.photos || 0), 0)} фотографий
        </div>
      </footer>
    </Container>
  );
};

export default UserPage;