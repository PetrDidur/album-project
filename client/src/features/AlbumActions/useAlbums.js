import { useState, useEffect } from 'react';
import { albumApi } from '../../entities/album/api';

export const useAlbums = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await albumApi.getAlbums();
      // Предполагаем, что сервер возвращает { success: true, data: [...] }
      setAlbums(response.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Ошибка загрузки альбомов:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const createAlbum = async (albumData) => {
    try {
      const response = await albumApi.createAlbum(albumData);
      const newAlbum = response.data;
      setAlbums(prev => [...prev, newAlbum]);
      return { success: true, data: newAlbum };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || err.message 
      };
    }
  };

  const updateAlbum = async (albumId, updateData) => {
    try {
      const response = await albumApi.updateAlbum(albumId, updateData);
      const updated = response.data;
      setAlbums(prev => prev.map(album => 
        album.id === albumId ? updated : album
      ));
      return { success: true, data: updated };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || err.message 
      };
    }
  };

  const deleteAlbum = async (albumId) => {
    try {
      await albumApi.deleteAlbum(albumId);
      setAlbums(prev => prev.filter(album => album.id !== albumId));
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || err.message 
      };
    }
  };

  const addPhotosToAlbum = async (albumId, photoFiles) => {
    try {
      const result = await albumApi.uploadPhotos(albumId, photoFiles);
      
      // Обновляем конкретный альбом
      setAlbums(prev => prev.map(album => {
        if (album.id === albumId) {
          // Если бэкенд возвращает количество фото - используем его
          // Иначе инкрементируем счетчик
          const photoCount = Array.isArray(result) ? result.length : photoFiles.length;
          return {
            ...album,
            photos: (album.photos || 0) + photoCount
          };
        }
        return album;
      }));
      
      return { success: true, data: result };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || err.message 
      };
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