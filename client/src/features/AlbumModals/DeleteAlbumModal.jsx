import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DeleteAlbumModal = ({ show, onHide, album, onDelete }) => {
  const handleDelete = () => {
    if (!album) return;
    onDelete(album.id);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Подтверждение удаления</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Вы уверены, что хотите удалить альбом <strong>"{album?.title}"</strong>? 
        Это действие нельзя отменить. Все фотографии в альбоме также будут удалены.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Отмена
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Удалить альбом
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteAlbumModal;