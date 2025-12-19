const API_URL = import.meta.env.VITE_API;

export const albumApi = {
  // Получить все альбомы пользователя
  async getAlbums() {
    const response = await fetch(`${API_URL}/albums`, {
      credentials: 'include'
    });
    return response.json();
  },

  // Создать альбом
  async createAlbum(albumData) {
    const response = await fetch(`${API_URL}/albums`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(albumData),
      credentials: 'include'
    });
    return response.json();
  },

  // Обновить альбом
  async updateAlbum(albumId, updateData) {
    const response = await fetch(`${API_URL}/albums/${albumId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
      credentials: 'include'
    });
    return response.json();
  },

  // Удалить альбом
  async deleteAlbum(albumId) {
    const response = await fetch(`${API_URL}/albums/${albumId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    return response.json();
  },

  // Загрузить фото в альбом
  async uploadPhotos(albumId, photos) {
    const formData = new FormData();
    photos.forEach(photo => {
      formData.append('photos', photo);
    });

    const response = await fetch(`${API_URL}/albums/${albumId}/photos`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });
    return response.json();
  }
};