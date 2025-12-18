import { useState, useEffect } from 'react';
import { albumApi } from '../../entities/album/api';

export const useAlbums = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const data = await albumApi.getAlbums();
      setAlbums(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const createAlbum = async (albumData) => {
    try {
      const newAlbum = await albumApi.createAlbum(albumData);
      setAlbums(prev => [...prev, newAlbum]);
      return { success: true, data: newAlbum };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateAlbum = async (albumId, updateData) => {
    try {
      const updated = await albumApi.updateAlbum(albumId, updateData);
      setAlbums(prev => prev.map(album => 
        album.id === albumId ? updated : album
      ));
      return { success: true, data: updated };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteAlbum = async (albumId) => {
    try {
      await albumApi.deleteAlbum(albumId);
      setAlbums(prev => prev.filter(album => album.id !== albumId));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const addPhotosToAlbum = async (albumId, photos) => {
    try {
      const result = await albumApi.uploadPhotos(albumId, photos);
      // Обновляем количество фото в альбоме
      setAlbums(prev => prev.map(album => 
        album.id === albumId 
          ? { ...album, photos: album.photos + photos.length }
          : album
      ));
      return { success: true, data: result };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    albums,
    loading,
    error,
    fetchAlbums,
    createAlbum,
    updateAlbum,
    deleteAlbum,
    addPhotosToAlbum
  };
};