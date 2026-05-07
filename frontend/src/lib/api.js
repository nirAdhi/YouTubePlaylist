import axios from 'axios';

function normalizeApiBase(raw) {
  if (!raw) return '';
  // Allow configuring either https://example.com or https://example.com/api
  return raw.replace(/\/+$/, '').replace(/\/api$/, '');
}

const API_BASE = normalizeApiBase(process.env.NEXT_PUBLIC_API_URL);

const api = axios.create({
  baseURL: API_BASE ? `${API_BASE}/api` : '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

export async function login(email, password) {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
}

export async function register(email, password) {
  const res = await api.post('/auth/register', { email, password });
  return res.data;
}

export async function fetchVideos(params = {}) {
  const res = await api.get('/videos', { params });
  return res.data;
}

export async function addVideo(url, note) {
  const res = await api.post('/videos', { url, note });
  return res.data;
}

export async function updateVideo(id, data) {
  const res = await api.patch(`/videos/${id}`, data);
  return res.data;
}

export async function deleteVideo(id) {
  const res = await api.delete(`/videos/${id}`);
  return res.data;
}

export async function fetchPlaylists() {
  const res = await api.get('/playlists');
  return res.data;
}

export async function createPlaylist(name) {
  const res = await api.post('/playlists', { name });
  return res.data;
}

export async function addVideoToPlaylist(playlistId, videoId) {
  const res = await api.post(`/playlists/${playlistId}/videos`, { videoId });
  return res.data;
}

export async function deletePlaylist(id) {
  const res = await api.delete(`/playlists/${id}`);
  return res.data;
}

export async function fetchReminders() {
  const res = await api.get('/reminders');
  return res.data;
}

export async function createReminder(videoId, scheduledTime) {
  const res = await api.post('/reminders', { videoId, scheduledTime });
  return res.data;
}

export async function deleteReminder(id) {
  const res = await api.delete(`/reminders/${id}`);
  return res.data;
}
