import React from 'react';
import { useNavigate } from 'react-router'; 
import { Card, Button, DropdownButton, Dropdown } from 'react-bootstrap';

const AlbumCard = ({ 
  album, 
  onRename, 
  onAddPhotos, 
  onDelete
}) => {
  const navigate = useNavigate(); // Добавьте

  const handleViewAlbum = () => {
    navigate(`/album/${album.id}`);
  };

  return (
    <Card className="h-100 border-0 shadow-sm" style={{ cursor: 'pointer' }}>
      <Card.Img 
        variant="top" 
        src={album.cover}
        style={{ height: '200px', objectFit: 'cover' }}
        onClick={handleViewAlbum} // Добавьте обработчик
      />
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title 
            className="mb-1" 
            style={{ fontSize: '1.1rem' }}
            onClick={handleViewAlbum}
          >
            {album.title}
          </Card.Title>
          <DropdownButton
            variant="outline-secondary"
            title="⋮"
            size="sm"
            align="end"
            onClick={(e) => e.stopPropagation()}
          >
            <Dropdown.Item onClick={() => onRename(album)}>
              ✏️ Переименовать
            </Dropdown.Item>
            <Dropdown.Item onClick={() => onAddPhotos(album)}>
              📷 Добавить фото
            </Dropdown.Item>
            <Dropdown.Item onClick={handleViewAlbum}>
              👁️ Просмотреть
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item 
              onClick={() => onDelete(album)}
              className="text-danger"
            >
              🗑️ Удалить альбом
            </Dropdown.Item>
          </DropdownButton>
        </div>
        {album.description && (
          <Card.Text className="text-muted small mb-2">
            {album.description}
          </Card.Text>
        )}
        <Card.Text className="text-muted small">
          {album.photos} фотографий
        </Card.Text>
        <Button 
          variant="outline-primary" 
          size="sm" 
          className="w-100 mt-2"
          onClick={() => onAddPhotos(album)}
        >
          Добавить фото
        </Button>
        <Button 
          variant="outline-secondary" 
          size="sm" 
          className="w-100 mt-2"
          onClick={handleViewAlbum}
        >
          Открыть альбом
        </Button>
      </Card.Body>
    </Card>
  );
};

export default AlbumCard;