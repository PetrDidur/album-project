import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const CreateAlbumModal = ({ show, onHide, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) return;
    onCreate({ title, description });
    setTitle('');
    setDescription('');
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Создать новый альбом</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Название альбома *</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Лето 2023"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Описание (необязательно)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Краткое описание альбома"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Отмена
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Создать альбом
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateAlbumModal;