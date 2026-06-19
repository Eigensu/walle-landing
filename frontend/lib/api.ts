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

// Carousel Interfaces
export interface CarouselSlide {
  id: string;
  imageUrl: string;
  headline: string;
  description: string;
  imagePosition: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CarouselSlideCreate {
  imageUrl: string;
  headline: string;
  description: string;
  imagePosition?: string;
  isActive?: boolean;
  order?: number;
}

export interface CarouselSlideUpdate {
  imageUrl?: string;
  headline?: string;
  description?: string;
  imagePosition?: string;
  isActive?: boolean;
  order?: number;
}

export const carouselAPI = {
  getActive: async (): Promise<CarouselSlide[]> => {
    const { data } = await api.get('/carousel');
    return data;
  },

  getAll: async (): Promise<CarouselSlide[]> => {
    const { data } = await api.get('/carousel/all');
    return data;
  },

  create: async (slide: CarouselSlideCreate): Promise<CarouselSlide> => {
    const { data } = await api.post('/carousel', slide);
    return data;
  },

  update: async (id: string, slide: CarouselSlideUpdate): Promise<CarouselSlide> => {
    const { data } = await api.put(`/carousel/${id}`, slide);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/carousel/${id}`);
  },

  toggleActive: async (id: string): Promise<CarouselSlide> => {
    const { data } = await api.patch(`/carousel/${id}/toggle`);
    return data;
  },

  uploadImage: async (file: File): Promise<{url: string}> => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  }
};
