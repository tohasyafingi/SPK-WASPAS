/**
 * API Configuration
 */
const resolveApiBaseUrl = () => {
  if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;

  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol || 'http:';
    const hostname = window.location.hostname || 'localhost';
    const backendPort = '5000';
    return `${protocol}//${hostname}:${backendPort}/api`;
  }

  return 'http://localhost:5000/api';
};

export const API_BASE_URL = resolveApiBaseUrl();

export const API_ENDPOINTS = {
  // Kandidat
  KANDIDAT: `${API_BASE_URL}/kandidat`,
  KANDIDAT_BY_ID: (id) => `${API_BASE_URL}/kandidat/${id}`,

  // Kriteria
  KRITERIA: `${API_BASE_URL}/kriteria`,
  KRITERIA_BY_ID: (id) => `${API_BASE_URL}/kriteria/${id}`,

  // Penilaian
  PENILAIAN: `${API_BASE_URL}/penilaian`,
  PENILAIAN_BY_ID: (id) => `${API_BASE_URL}/penilaian/${id}`,
  PENILAIAN_BY_KANDIDAT: (kandidatId) => `${API_BASE_URL}/penilaian/kandidat/${kandidatId}`,

  // Hasil WASPAS
  HASIL: `${API_BASE_URL}/hasil`,
  HASIL_DETAIL: (kandidatId) => `${API_BASE_URL}/hasil/${kandidatId}/detail`,

  // Health check
  HEALTH: `${API_BASE_URL}/../health`
};

export default API_ENDPOINTS;
