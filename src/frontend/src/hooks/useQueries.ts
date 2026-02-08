import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { GlossaryTerm, Article, ResearchPaper, LearningSection, Feedback, Stock, UserProfile, ChatAskResponsePayload, BlogPost, GlossarySnapshot, GlossaryStats, GlossaryBatch, GlossaryDiagnostic } from '../backend';
import { toast } from 'sonner';
import { cTermsBatch } from '../data/glossaryBulkImportC';
import { termToKey } from '../utils/glossaryKey';

// Local type definition for System Info (backend method not yet implemented)
export interface SystemInfoStorageUsage {
  approximateTotalBytes: bigint;
  glossaryBytes: bigint;
  articlesBytes: bigint;
  blogsBytes: bigint;
  feedbackBytes: bigint;
  researchPapersBytes: bigint;
}

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

// Glossary Queries - Enhanced with diagnostics and readiness signals
export function useGetAllTerms() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<Array<[string, GlossaryTerm]>>({
    queryKey: ['glossaryTerms'],
    queryFn: async () => {
      if (!actor) {
        console.log('[Glossary] Actor not available in useGetAllTerms - query should not run');
        throw new Error('Actor not available');
      }
      console.log('[Glossary] Fetching all terms...');
      const result = await actor.getGlossaryTerms();
      console.log(`[Glossary] Fetched ${result.length} terms`);
      return result;
    },
    enabled: !!actor && !actorFetching,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: 2,
  });

  // Log query state for diagnostics
  if (query.isError) {
    console.error('[Glossary] Query error:', query.error);
  }

  const isActorReady = !!actor && !actorFetching;

  return {
    ...query,
    data: query.data || [],
    isActorAvailable: !!actor,
    isQueryEnabled: isActorReady,
    isFetched: isActorReady && query.isFetched,
  };
}

export function useSearchTerms(searchText: string) {
  const { actor, isFetching: actorFetching } = useActor();
  
  // Normalize search text: trim whitespace and treat whitespace-only as empty
  const normalizedSearch = searchText.trim();

  const query = useQuery<Array<[string, GlossaryTerm]>>({
    queryKey: ['glossaryTerms', 'search', normalizedSearch],
    queryFn: async () => {
      if (!actor) {
        console.log('[Glossary] Actor not available in useSearchTerms - query should not run');
        throw new Error('Actor not available');
      }
      if (!normalizedSearch) {
        console.log('[Glossary] Empty search, fetching all terms...');
        const result = await actor.getGlossaryTerms();
        console.log(`[Glossary] Fetched ${result.length} terms (all)`);
        return result;
      }
      console.log(`[Glossary] Searching for: "${normalizedSearch}"`);
      const result = await actor.searchGlossary(normalizedSearch);
      console.log(`[Glossary] Search returned ${result.length} terms`);
      return result;
    },
    enabled: !!actor && !actorFetching,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: 2,
  });

  // Log query state for diagnostics
  if (query.isError) {
    console.error('[Glossary] Search query error:', query.error);
  }

  const isActorReady = !!actor && !actorFetching;

  return {
    ...query,
    data: query.data || [],
    isActorAvailable: !!actor,
    isQueryEnabled: isActorReady,
    isFetched: isActorReady && query.isFetched,
  };
}

// Glossary Diagnostics Query (Admin only)
export function useGetGlossaryDiagnosticsByPrefix(prefix: string) {
  const { actor, isFetching } = useActor();
  const { data: isAdmin = false } = useIsCallerAdmin();

  return useQuery<GlossaryDiagnostic[]>({
    queryKey: ['glossaryDiagnostics', prefix],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGlossaryDiagnosticsByPrefix(prefix);
    },
    enabled: !!actor && !isFetching && isAdmin,
    retry: false,
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
      queryClient.invalidateQueries({ queryKey: ['glossaryDiagnostics'] });
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
      queryClient.invalidateQueries({ queryKey: ['glossaryDiagnostics'] });
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
      queryClient.invalidateQueries({ queryKey: ['glossaryDiagnostics'] });
      toast.success('Term deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete term');
    },
  });
}

// Glossary Backup/Restore Queries and Mutations
export function useGetGlossarySnapshotStats() {
  const { actor, isFetching } = useActor();

  return useQuery<GlossaryStats>({
    queryKey: ['glossaryStats'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getGlossarySnapshotStats();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useExportGlossarySnapshot() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.exportGlossarySnapshot();
    },
    onSuccess: () => {
      toast.success('Glossary snapshot exported successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to export glossary snapshot');
    },
  });
}

export function useRestoreGlossaryFromSnapshot() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (snapshot: GlossarySnapshot) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.restoreGlossaryFromSnapshot(snapshot);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['glossaryTerms'] });
      queryClient.invalidateQueries({ queryKey: ['glossaryStats'] });
      queryClient.invalidateQueries({ queryKey: ['glossaryDiagnostics'] });
      toast.success('Glossary restored successfully (merge mode)');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to restore glossary');
    },
  });
}

export function useReplaceGlossaryWithSnapshot() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (snapshot: GlossarySnapshot) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.replaceGlossaryWithSnapshot(snapshot);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['glossaryTerms'] });
      queryClient.invalidateQueries({ queryKey: ['glossaryStats'] });
      queryClient.invalidateQueries({ queryKey: ['glossaryDiagnostics'] });
      toast.success('Glossary replaced successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to replace glossary');
    },
  });
}

// Glossary Bulk Import C-Terms Mutation
export function usePublishGlossaryBatch() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (batch: GlossaryBatch) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.publishGlossaryBatch(batch);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['glossaryTerms'] });
      queryClient.invalidateQueries({ queryKey: ['glossaryDiagnostics'] });
      toast.success('Glossary batch published successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to publish glossary batch');
    },
  });
}

export function usePublishCTermsBatch() {
  const publishBatch = usePublishGlossaryBatch();

  return useMutation({
    mutationFn: async () => {
      const batch: GlossaryBatch = {
        terms: cTermsBatch.map((entry) => ({
          key: termToKey(entry.term),
          term: {
            term: entry.term,
            definition: entry.definition,
            example: entry.example || '',
            usage: entry.usage || '',
          },
        })),
      };
      return publishBatch.mutateAsync(batch);
    },
  });
}

// Article Queries
export function useGetArticles() {
  const { actor, isFetching } = useActor();

  return useQuery<Article[]>({
    queryKey: ['articles'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getArticles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetArticlesByCategory(category: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Article[]>({
    queryKey: ['articles', 'category', category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getArticlesByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetArticle(id: number) {
  const { actor, isFetching } = useActor();

  return useQuery<Article | null>({
    queryKey: ['article', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getArticle(BigInt(id));
    },
    enabled: !!actor && !isFetching && id > 0,
  });
}

export function useAddArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, content, category }: { title: string; content: string; category: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addArticle(title, content, category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast.success('Article added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add article');
    },
  });
}

export function useUpdateArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title, content, category }: { id: number; title: string; content: string; category: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateArticle(BigInt(id), title, content, category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast.success('Article updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update article');
    },
  });
}

export function useDeleteArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteArticle(BigInt(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast.success('Article deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete article');
    },
  });
}

// Research Paper Queries
export function useGetResearchPapers() {
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

export function useAddResearchPaper() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, description, file }: { title: string; description: string; file: any }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addResearchPaper(title, description, file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['researchPapers'] });
      toast.success('Research paper added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add research paper');
    },
  });
}

export function useDeleteResearchPaper() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteResearchPaper(BigInt(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['researchPapers'] });
      toast.success('Research paper deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete research paper');
    },
  });
}

// Learning Section Queries
export function useGetLearningSections() {
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

export function useGetLearningSection(key: string) {
  const { actor, isFetching } = useActor();

  return useQuery<LearningSection | null>({
    queryKey: ['learningSection', key],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getLearningSection(key);
    },
    enabled: !!actor && !isFetching && key.length > 0,
  });
}

export function useAddLearningSection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, section }: { key: string; section: LearningSection }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addLearningSection(key, section);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learningSections'] });
      toast.success('Learning section added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add learning section');
    },
  });
}

export function useUpdateLearningSection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, section }: { key: string; section: LearningSection }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateLearningSection(key, section);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learningSections'] });
      toast.success('Learning section updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update learning section');
    },
  });
}

export function useDeleteLearningSection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (key: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteLearningSection(key);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learningSections'] });
      toast.success('Learning section deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete learning section');
    },
  });
}

// Feedback Queries
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

export function useGetAllFeedback() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[bigint, Feedback]>>({
    queryKey: ['feedback'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFeedback();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDeleteFeedback() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteFeedback(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
      toast.success('Feedback deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete feedback');
    },
  });
}

// Blog Queries
export function useGetBlogs(includeUnpublished: boolean = false) {
  const { actor, isFetching } = useActor();

  return useQuery<BlogPost[]>({
    queryKey: ['blogs', includeUnpublished],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBlogs(includeUnpublished);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBlog(id: number) {
  const { actor, isFetching } = useActor();

  return useQuery<BlogPost | null>({
    queryKey: ['blog', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getBlog(BigInt(id));
    },
    enabled: !!actor && !isFetching && id > 0,
  });
}

export function useGetBlogsByCategory(category: string, includeUnpublished: boolean = false) {
  const { actor, isFetching } = useActor();

  return useQuery<BlogPost[]>({
    queryKey: ['blogs', 'category', category, includeUnpublished],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBlogsByCategory(category, includeUnpublished);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddBlog() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      content,
      author,
      tags,
      category,
      publishedAt,
      isPublished,
    }: {
      title: string;
      content: string;
      author: string;
      tags: string[];
      category: string;
      publishedAt: bigint;
      isPublished: boolean;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addBlog(title, content, author, tags, category, publishedAt, isPublished);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast.success('Blog added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add blog');
    },
  });
}

export function useUpdateBlog() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      content,
      author,
      tags,
      category,
      publishedAt,
      isPublished,
    }: {
      id: number;
      title: string;
      content: string;
      author: string;
      tags: string[];
      category: string;
      publishedAt: bigint;
      isPublished: boolean;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateBlog(BigInt(id), title, content, author, tags, category, publishedAt, isPublished);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast.success('Blog updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update blog');
    },
  });
}

export function useDeleteBlog() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteBlog(BigInt(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast.success('Blog deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete blog');
    },
  });
}

// Market Data Queries
export function useIsMarketOpen() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['marketOpen'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isMarketOpen();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60000, // Cache for 1 minute
    refetchInterval: 60000, // Refetch every minute
    retry: false,
  });
}

export function useGetNifty50Stocks() {
  const { actor, isFetching } = useActor();

  return useQuery<Stock[]>({
    queryKey: ['nifty50Stocks'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNifty50Stocks();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30000, // Cache for 30 seconds
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 2,
  });
}

// System Info Query (with graceful handling for unimplemented backend method)
export function useGetSystemInfoStorageUsage() {
  const { actor, isFetching } = useActor();

  return useQuery<SystemInfoStorageUsage | null>({
    queryKey: ['systemInfoStorageUsage'],
    queryFn: async () => {
      if (!actor) return null;
      
      // Backend method not yet implemented - return null
      console.warn('getSystemInfoStorageUsage method not yet implemented in backend');
      return null;
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}
