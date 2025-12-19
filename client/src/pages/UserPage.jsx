import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Container, Alert } from 'react-bootstrap';
import AlbumList from '../widgets/AlbumList/AlbumList';
import CreateAlbumModal from '../features/AlbumModals/CreateAlbumModal';
import RenameAlbumModal from '../features/AlbumModals/RenameAlbumModal';
import AddPhotosModal from '../features/AlbumModals/AddPhotosModal';
import DeleteAlbumModal from '../features/AlbumModals/DeleteAlbumModal';
import { albumApi } from '../entities/album/api';

const UserPage = () => {
  // Моковые данные альбомов
  const [albums, setAlbums] = useState([
    { 
      id: 1, 
      title: "Лето 2023", 
      photos: 47, 
      cover: "https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Лето+2023",
      description: "Летний отдых на море"
    },
    { 
      id: 2, 
      title: "Свадьба", 
      photos: 123, 
      cover: "https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Свадьба",
      description: "Наша свадебная церемония"
    },
    { 
      id: 3, 
      title: "Путешествие в Италию", 
      photos: 89, 
      cover: "https://via.placeholder.com/300x200/45B7D1/FFFFFF?text=Италия",
      description: "Рим, Венеция, Флоренция"
    },
    { 
      id: 4, 
      title: "Выпускной", 
      photos: 56, 
      cover: "https://via.placeholder.com/300x200/96CEB4/FFFFFF?text=Выпускной",
      description: "Выпускной вечер 2023"
    },
  ]);

  // Состояния
  const [loading] = useState(false);
  const [error] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showAddPhotosModal, setShowAddPhotosModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  // Функции для уведомлений
  const showAlert = (message, variant = 'success') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => {
      setAlert(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const hideAlert = () => {
    setAlert(prev => ({ ...prev, show: false }));
  };

  // Функции для работы с альбомами
  const handleCreateAlbum = async (albumData) => {
    const data = await albumApi.createAlbum(albumData);
    
    setAlbums(prev => [...prev, data.data]);
    showAlert(`Альбом "${albumData.title}" создан!`, 'success');
  };

  const handleRenameAlbum = async (albumId, newTitle) => {
    setAlbums(prev => 
      prev.map(album => 
        album.id === albumId 
          ? { ...album, title: newTitle }
          : album
      )
    );
    showAlert('Альбом переименован!', 'success');
  };

  const handleAddPhotos = async (albumId, photos) => {
    // Обновляем количество фото
    setAlbums(prev => 
      prev.map(album => 
        album.id === albumId 
          ? { 
              ...album, 
              photos: album.photos + photos.length,
              // Если у альбома стандартная обложка - меняем на первую загруженную
              cover: album.cover.includes('placeholder.com') && photos.length > 0
                ? URL.createObjectURL(photos[0])
                : album.cover
            }
          : album
      )
    );
    showAlert(`${photos.length} фотографий добавлено в альбом!`, 'success');
  };

  const handleDeleteAlbum = async (albumId) => {
    const data = await albumApi.deleteAlbum(albumId);
    setAlbums(prev => [...prev, data.data]);
  };

  // Открытие модальных окон
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
  useEffect(() => {
  albumApi.getAlbums()
    .then(data => {
      if (data.data.length > 0) {  // только если есть альбомы в базе
        setAlbums(data.data);
      }
    })
    .catch(err => {
      console.log(err);
    });
}, []);
 
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
          {/* {albums.length} альбомов • {albums.reduce((sum, album) => sum + album.photos, 0)} фотографий */}
        </div>
      </footer>
    </Container>
  );
};

export default UserPage;