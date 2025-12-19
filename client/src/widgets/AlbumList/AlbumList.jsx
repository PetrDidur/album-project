import React from 'react';
import { Row, Col } from 'react-bootstrap';
import AlbumCard from './AlbumCard';

const AlbumList = ({ albums, onRename, onAddPhotos, onDelete, onView }) => {
  return (
    <Row className="g-4">
      {albums.map(album => (
        <Col key={album.id} xs={12} sm={6} md={4} lg={3}>
          <AlbumCard
            album={album}
            onRename={() => onRename(album)}
            onAddPhotos={() => onAddPhotos(album)}
            onDelete={() => onDelete(album)}
            onView={() => onView && onView(album)}
          />
        </Col>
      ))}
    </Row>
  );
};

export default AlbumList;