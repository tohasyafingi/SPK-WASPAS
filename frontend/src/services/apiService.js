/**
 * API Service
 * Handle semua HTTP requests ke backend
 */
import API_ENDPOINTS from '../config/api.js';

/**
 * Generic fetch wrapper dengan error handling
 */
const apiCall = async (url, options = {}) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers
      },
      ...options
    });

    let payload = null;
    try {
      payload = await response.json();
    } catch (e) {
      payload = null;
    }

    if (!response.ok) {
      const message = payload?.message || `HTTP Error: ${response.status}`;
      throw new Error(message);
    }

    return payload;
  } catch (error) {
    console.error(`API Error [${url}]:`, error);
    throw error;
  }
};

// ==========================================
// KANDIDAT API
// ==========================================

export const kandidatAPI = {
  getAll: () =>
    apiCall(API_ENDPOINTS.KANDIDAT),

  getById: (id) =>
    apiCall(API_ENDPOINTS.KANDIDAT_BY_ID(id)),

  create: (data) =>
    apiCall(API_ENDPOINTS.KANDIDAT, {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  update: (id, data) =>
    apiCall(API_ENDPOINTS.KANDIDAT_BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  delete: (id) =>
    apiCall(API_ENDPOINTS.KANDIDAT_BY_ID(id), {
      method: 'DELETE'
    })
};

// ==========================================
// KRITERIA API
// ==========================================

export const kriteriaAPI = {
  getAll: () =>
    apiCall(API_ENDPOINTS.KRITERIA),

  getById: (id) =>
    apiCall(API_ENDPOINTS.KRITERIA_BY_ID(id)),

  create: (data) =>
    apiCall(API_ENDPOINTS.KRITERIA, {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  update: (id, data) =>
    apiCall(API_ENDPOINTS.KRITERIA_BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  delete: (id) =>
    apiCall(API_ENDPOINTS.KRITERIA_BY_ID(id), {
      method: 'DELETE'
    })
};

// ==========================================
// PENILAIAN API
// ==========================================

export const penilaianAPI = {
  getAll: () =>
    apiCall(API_ENDPOINTS.PENILAIAN),

  getById: (id) =>
    apiCall(API_ENDPOINTS.PENILAIAN_BY_ID(id)),

  getByKandidatId: (kandidatId) =>
    apiCall(API_ENDPOINTS.PENILAIAN_BY_KANDIDAT(kandidatId)),

  create: (data) =>
    apiCall(API_ENDPOINTS.PENILAIAN, {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  update: (id, data) =>
    apiCall(API_ENDPOINTS.PENILAIAN_BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  delete: (id) =>
    apiCall(API_ENDPOINTS.PENILAIAN_BY_ID(id), {
      method: 'DELETE'
    })
};

// ==========================================
// WASPAS HASIL API
// ==========================================

export const hasilAPI = {
  getHasil: () =>
    apiCall(API_ENDPOINTS.HASIL),

  getDetail: (kandidatId) =>
    apiCall(API_ENDPOINTS.HASIL_DETAIL(kandidatId))
};

// ==========================================
// DASHBOARD SUMMARY (utility)
// ==========================================

export const getSummary = async () => {
  try {
    const [kandidatRes, kriteriaRes, penilaianRes] = await Promise.all([
      apiCall(API_ENDPOINTS.KANDIDAT),
      apiCall(API_ENDPOINTS.KRITERIA),
      apiCall(API_ENDPOINTS.PENILAIAN)
    ]);

    const kandidatData = Array.isArray(kandidatRes?.data) ? kandidatRes.data : (Array.isArray(kandidatRes) ? kandidatRes : []);
    const kriteriaData = Array.isArray(kriteriaRes?.data) ? kriteriaRes.data : (Array.isArray(kriteriaRes) ? kriteriaRes : []);
    const penilaianData = Array.isArray(penilaianRes?.data) ? penilaianRes.data : (Array.isArray(penilaianRes) ? penilaianRes : []);

    const kandidatCount = kandidatData.length;
    const kriteriaCount = kriteriaData.length;
    const penilaianCount = penilaianData.length;

    let penilaianCompleted = false;
    if (penilaianData.length > 0 && kandidatCount > 0 && kriteriaCount > 0) {
      const kandidatIds = new Set(
        penilaianData
          .map((p) => p?.kandidat_id ?? p?.kandidatId ?? p?.kandidat ?? p?.kandidat_id_fk)
          .filter((id) => id !== undefined && id !== null)
      );
      // completed if tiap kandidat sudah punya nilai untuk seluruh kriteria
      penilaianCompleted = kandidatIds.size === kandidatCount && (penilaianCount >= kandidatCount * kriteriaCount);
    }

    return { kandidat: kandidatCount, kriteria: kriteriaCount, penilaianCompleted, penilaian: penilaianCount };
  } catch (e) {
    // Fallback summary if any call fails
    return { kandidat: '-', kriteria: '-', penilaianCompleted: false, penilaian: '-' };
  }
};
