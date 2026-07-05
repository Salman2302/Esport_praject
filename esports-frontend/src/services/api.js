import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8080/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('esports_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const registerUser   = (data) => API.post('/auth/register', data);
export const loginUser      = (data) => API.post('/auth/login', data);

// Tournaments
export const getAllTournaments    = ()       => API.get('/tournaments/public/all');
export const getTournamentById    = (id)     => API.get(`/tournaments/public/${id}`);
export const getTournamentsByStatus = (s)   => API.get(`/tournaments/public/status/${s}`);
export const createTournament     = (data)   => API.post('/tournaments/create', data);
export const updateTournamentStatus = (id, status) => API.put(`/tournaments/${id}/status`, { status });
export const getMyTournaments     = ()       => API.get('/tournaments/my-tournaments');

// Teams
export const registerTeam       = (data)   => API.post('/teams/register', data);
export const getTeamsByTournament = (id)   => API.get(`/teams/tournament/${id}`);
export const approveTeam        = (id)     => API.put(`/teams/${id}/approve`);
export const getMyTeams         = ()       => API.get('/teams/my-teams');

// Matches
export const getMatchesByTournament = (id) => API.get(`/matches/tournament/${id}`);
export const getLiveMatches         = ()   => API.get('/matches/live');
export const scheduleMatch          = (data) => API.post('/matches/schedule', data);
export const updateMatchResult      = (id, data) => API.put(`/matches/${id}/result`, data);
export const goLive                 = (id) => API.put(`/matches/${id}/go-live`);

// Admin
export const getAdminStats  = ()       => API.get('/admin/stats');
export const getAllUsers     = ()       => API.get('/admin/users');
export const changeUserRole = (id, role) => API.put(`/admin/users/${id}/role`, { role });

export default API;
