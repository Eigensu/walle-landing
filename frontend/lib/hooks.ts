'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tournamentAPI, Tournament, TournamentCreate, TournamentUpdate, carouselAPI, CarouselSlideCreate, CarouselSlideUpdate } from './api';

const TOURNAMENTS_KEY = ['tournaments'];

export function useTournaments() {
  return useQuery({
    queryKey: TOURNAMENTS_KEY,
    queryFn: tournamentAPI.getAll,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useCreateTournament() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tournament: TournamentCreate) => tournamentAPI.create(tournament),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TOURNAMENTS_KEY });
    },
  });
}

export function useUpdateTournament() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TournamentUpdate }) =>
      tournamentAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TOURNAMENTS_KEY });
    },
  });
}

export function useTournament(id: string) {
  return useQuery({
    queryKey: ['tournament', id],
    queryFn: () => tournamentAPI.getById(id),
    enabled: !!id,
  });
}

export function useTournamentApiUrl(id: string) {
  return useQuery({
    queryKey: ['tournament', id, 'api-url'],
    queryFn: () => tournamentAPI.getApiUrl(id),
    enabled: !!id,
  });
}

export function useDeleteTournament() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tournamentAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TOURNAMENTS_KEY });
    },
  });
}

const CAROUSEL_KEY = ['carousel'];
const CAROUSEL_ALL_KEY = ['carousel', 'all'];

export function useActiveCarousel() {
  return useQuery({
    queryKey: CAROUSEL_KEY,
    queryFn: carouselAPI.getActive,
    refetchInterval: 60000,
  });
}

export function useAllCarousel() {
  return useQuery({
    queryKey: CAROUSEL_ALL_KEY,
    queryFn: carouselAPI.getAll,
  });
}

export function useCreateCarouselSlide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slide: CarouselSlideCreate) => carouselAPI.create(slide),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAROUSEL_KEY });
      queryClient.invalidateQueries({ queryKey: CAROUSEL_ALL_KEY });
    },
  });
}

export function useUpdateCarouselSlide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CarouselSlideUpdate }) =>
      carouselAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAROUSEL_KEY });
      queryClient.invalidateQueries({ queryKey: CAROUSEL_ALL_KEY });
    },
  });
}

export function useDeleteCarouselSlide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => carouselAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAROUSEL_KEY });
      queryClient.invalidateQueries({ queryKey: CAROUSEL_ALL_KEY });
    },
  });
}

export function useToggleCarouselSlide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => carouselAPI.toggleActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAROUSEL_KEY });
      queryClient.invalidateQueries({ queryKey: CAROUSEL_ALL_KEY });
    },
  });
}
