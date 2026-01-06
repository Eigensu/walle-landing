import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export interface Tournament {
  id: string;
  title: string;
  game_name: string;
  stream_url: string;
  image_url: string;
  api_url: string;
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
  api_url?: string;
  status?: 'LIVE' | 'UPCOMING' | 'COMPLETED';
  start_time?: string;
}

// Tournament API calls
export const tournamentAPI = {
  getAll: async (): Promise<Tournament[]> => {
    const { data } = await api.get('/tournaments');
    return data;
  },

  getById: async (id: string): Promise<Tournament> => {
    const { data } = await api.get(`/tournaments/${id}`);
    return data;
  },

  getApiUrl: async (id: string): Promise<{ api_url: string }> => {
    const { data } = await api.get(`/tournaments/${id}/api-url`);
    return data;
  },

  create: async (tournament: TournamentCreate): Promise<Tournament> => {
    const { data } = await api.post('/tournaments', tournament);
    return data;
  },

  update: async (id: string, tournament: TournamentUpdate): Promise<Tournament> => {
    const { data } = await api.put(`/tournaments/${id}`, tournament);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tournaments/${id}`);
  },
};
