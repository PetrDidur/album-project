import axiosInstance from "../../shared/lib/axiosInstance";

export const albumApi = {
  // Получить все альбомы пользователя
  async getAlbums() {
    const response = await axiosInstance.get(`/api/album`);
    return response.data;
  },

  // Создать альбом
  async createAlbum(albumData) {
    const response = await axiosInstance.post('/api/album', albumData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Обновить альбом
  async updateAlbum(albumId, updateData) {
    const response = await axiosInstance.put(`/api/album/${albumId}`, updateData);
    return response.data;
  },

  // Удалить альбом
  async deleteAlbum(albumId) {
    const response = await axiosInstance.delete(`/api/album/${albumId}`);
    return response.data;
  },

  // Получить альбом по ID
  async getAlbumById(albumId) {
    const response = await axiosInstance.get(`/api/album/${albumId}`);
    return response.data;
  },

  // Загрузить одно фото в альбом
  async uploadPhoto(albumId, photoFile, comment = '') {
    const formData = new FormData();
    formData.append('image', photoFile);
    formData.append('albumId', albumId);
    if (comment) {
      formData.append('comment', comment);
    }

    const response = await axiosInstance.post('/api/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Загрузить несколько фото в альбом
  async uploadPhotos(albumId, photoFiles) {
    const uploadPromises = photoFiles.map(file => 
      this.uploadPhoto(albumId, file)
    );
    return Promise.all(uploadPromises);
  },

  // Получить все фото альбома
  async getAlbumPhotos(albumId) {
    const response = await axiosInstance.get(`/photo/album/${albumId}`);
    return response.data;
  },

  // Удалить фото
  async deletePhoto(photoId) {
    const response = await axiosInstance.delete(`/api/photo/${photoId}`);
    return response.data;
  }
};