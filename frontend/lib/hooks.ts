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
    mutationFn: ({ id, data }: { id: number; data: TournamentUpdate }) =>
      tournamentAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TOURNAMENTS_KEY });
    },
  });
}

export function useDeleteTournament() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => tournamentAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TOURNAMENTS_KEY });
    },
  });
}
