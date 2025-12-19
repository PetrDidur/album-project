import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const RenameAlbumModal = ({ show, onHide, album, onRename }) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (album) {
      setTitle(album.title || '');
    }
  }, [album]);

  const handleSubmit = () => {
    if (!title.trim() || !album) return;
    onRename(album.id, title);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Переименовать альбом</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Новое название</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите новое название"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Отмена
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Сохранить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RenameAlbumModal;