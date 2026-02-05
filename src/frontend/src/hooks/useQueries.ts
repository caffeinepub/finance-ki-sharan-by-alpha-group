import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { GlossaryTerm, Article, ResearchPaper, LearningSection, Feedback, Stock, UserProfile, ChatAskResponsePayload, BlogPost } from '../backend';
import { toast } from 'sonner';

// Maintenance Mode Query
export function useIsMaintenanceMode() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['maintenanceMode'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.getMaintenanceStatus();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

// Admin Check Query
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile saved successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save profile');
    },
  });
}

// Chat Assistance Mutation (existing, non-internet mode)
export function useChatAsk() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (question: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.chatAsk(question);
    },
    onError: (error: Error) => {
      // Don't show toast for errors - let the component handle it
      console.error('Chat error:', error);
    },
  });
}

// Glossary Queries - Enhanced with aggressive refetch policies for post-deployment reliability
export function useGetAllTerms() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, GlossaryTerm]>>({
    queryKey: ['glossaryTerms'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGlossaryTerms();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0, // Always consider data stale to refetch on mount
    refetchOnMount: true, // Refetch every time component mounts
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    retry: 2, // Retry failed requests twice
  });
}

export function useSearchTerms(searchText: string) {
  const { actor, isFetching } = useActor();
  
  // Normalize search text: trim whitespace and treat whitespace-only as empty
  const normalizedSearch = searchText.trim();

  return useQuery<Array<[string, GlossaryTerm]>>({
    queryKey: ['glossaryTerms', 'search', normalizedSearch],
    queryFn: async () => {
      if (!actor) return [];
      if (!normalizedSearch) {
        // Return all terms when normalized search is empty
        return actor.getGlossaryTerms();
      }
      return actor.searchGlossary(normalizedSearch);
    },
    enabled: !!actor && !isFetching,
    staleTime: 0, // Always consider data stale to refetch on mount
    refetchOnMount: true, // Refetch every time component mounts
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    retry: 2, // Retry failed requests twice
  });
}

export function useAddTerm() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, term }: { key: string; term: GlossaryTerm }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addGlossaryTerm(key, term);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['glossaryTerms'] });
      toast.success('Term added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add term');
    },
  });
}

export function useUpdateTerm() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, term }: { key: string; term: GlossaryTerm }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateGlossaryTerm(key, term);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['glossaryTerms'] });
      toast.success('Term updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update term');
    },
  });
}

export function useDeleteTerm() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (key: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteGlossaryTerm(key);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['glossaryTerms'] });
      toast.success('Term deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete term');
    },
  });
}

// Learning Section Queries
export function useGetAllLearningSections() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, LearningSection]>>({
    queryKey: ['learningSections'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLearningSections();
    },
    enabled: !!actor && !isFetching,
  });
}

// Article Queries
export function useGetArticlesByCategory(category: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Article[]>({
    queryKey: ['articles', category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getArticlesByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

// Research Paper Queries
export function useGetAllResearchPapers() {
  const { actor, isFetching } = useActor();

  return useQuery<ResearchPaper[]>({
    queryKey: ['researchPapers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getResearchPapers();
    },
    enabled: !!actor && !isFetching,
  });
}

// Blog Queries
export function useGetBlogs() {
  const { actor, isFetching } = useActor();

  return useQuery<BlogPost[]>({
    queryKey: ['blogs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBlogs(false); // false = only published blogs for public view
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBlog(id: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<BlogPost | null>({
    queryKey: ['blog', id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getBlog(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

// Feedback Mutation
export function useSubmitFeedback() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ name, email, message }: { name: string; email: string; message: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.submitFeedback(name, email, message);
    },
    onSuccess: () => {
      toast.success('Feedback submitted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to submit feedback');
    },
  });
}

// Admin Feedback Queries
export function useGetAllFeedback() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[bigint, Feedback]>>({
    queryKey: ['feedback'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFeedback();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

// NIFTY 50 Stock Prices Query
export function useGetNifty50Stocks() {
  const { actor, isFetching } = useActor();

  return useQuery<Stock[]>({
    queryKey: ['nifty50Stocks'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNifty50Stocks();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000, // Refetch every 30 seconds during market hours
    retry: false,
  });
}
