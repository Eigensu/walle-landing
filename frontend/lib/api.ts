import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export interface Tournament {
  id: number;
  title: string;
  game_name: string;
  stream_url: string;
  image_url: string;
  api_url?: string;  // Make optional for backward compatibility
  status: 'LIVE' | 'UPCOMING' | 'COMPLETED';
  start_time: string;
}

export interface TournamentCreate {
  title: string;
  game_name: string;
  stream_url: string;
  image_url: string;
  api_url: string;
  status?: 'LIVE' | 'UPCOMING' | 'COMPLETED';
  start_time: string;
}

export interface TournamentUpdate {
  title?: string;
  game_name?: string;
  stream_url?: string;
  image_url?: string;
  api_url?: string;  // Keep optional for updates
  status?: 'LIVE' | 'UPCOMING' | 'COMPLETED';
  start_time?: string;
}

// Tournament API calls
export const tournamentAPI = {
  getAll: async (): Promise<Tournament[]> => {
    const { data } = await api.get('/tournaments');
    return data;
  },

  getById: async (id: number): Promise<Tournament> => {
    const { data } = await api.get(`/tournaments/${id}`);
    return data;
  },

  getApiUrl: async (id: number): Promise<{ api_url: string }> => {
    const { data } = await api.get(`/tournaments/${id}/api-url`);
    return data;
  },

  create: async (tournament: TournamentCreate): Promise<Tournament> => {
    const { data } = await api.post('/tournaments', tournament);
    return data;
  },

  update: async (id: number, tournament: TournamentUpdate): Promise<Tournament> => {
    const { data } = await api.put(`/tournaments/${id}`, tournament);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/tournaments/${id}`);
  },
};
