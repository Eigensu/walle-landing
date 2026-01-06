'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tournamentAPI, Tournament, TournamentCreate, TournamentUpdate } from './api';

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
