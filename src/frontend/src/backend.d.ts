import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface GlossaryBatchTerm {
    key: string;
    term: GlossaryTerm;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface GlossaryDiagnostic {
    key: string;
    term: string;
}
export interface GlossaryStats {
    lastSnapshotVersion?: bigint;
    currentTermCount: bigint;
    lastBackupTimestamp?: bigint;
    lastRestoreTimestamp?: bigint;
}
export interface Feedback {
    name: string;
    email: string;
    message: string;
}
export interface MarketHour {
    closeMinute: bigint;
    closeHour: bigint;
    weekday: bigint;
    openMinute: bigint;
    openHour: bigint;
}
export interface GlossarySnapshot {
    terms: Array<[string, GlossaryTerm]>;
    termCount: bigint;
    createdAt: bigint;
    version: bigint;
}
export interface PersistentGlossaryEntry {
    key: string;
    term: GlossaryTerm;
    approved: boolean;
}
export interface ResearchPaper {
    id: bigint;
    title: string;
    file: ExternalBlob;
    description: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface Stock {
    ltp: number;
    dayClose: number;
    companyName: string;
    symbol: string;
}
export interface ChatAskResponseSource {
    id?: bigint;
    title: string;
    content: string;
    type: ChatSourceType;
    internetSource?: InternetResultSource;
}
export interface Article {
    id: bigint;
    title: string;
    content: string;
    category: string;
}
export interface BlogPost {
    id: bigint;
    title: string;
    content: string;
    isPublished: boolean;
    tags: Array<string>;
    publishedAt: bigint;
    author: string;
    lastUpdatedAt: bigint;
    category: string;
}
export interface GlossaryTerm {
    term: string;
    example: string;
    usage: string;
    definition: string;
}
export interface GlossaryBatch {
    terms: Array<GlossaryBatchTerm>;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface LearningSection {
    title: string;
    content: string;
}
export interface ChatAskResponsePayload {
    sources: Array<ChatAskResponseSource>;
}
export interface InternetResultSource {
    url: string;
    title: string;
    snippet: string;
}
export interface UserProfile {
    name: string;
    email: string;
}
export enum ChatSourceType {
    internetResult = "internetResult",
    article = "article",
    learningSection = "learningSection",
    glossary = "glossary"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addArticle(title: string, content: string, category: string): Promise<bigint>;
    addBlog(title: string, content: string, author: string, tags: Array<string>, category: string, publishedAt: bigint, isPublished: boolean): Promise<bigint>;
    addGlossaryTerm(key: string, term: GlossaryTerm): Promise<void>;
    addLearningSection(key: string, section: LearningSection): Promise<void>;
    addPersistentGlossaryEntries(entries: Array<PersistentGlossaryEntry>): Promise<void>;
    addResearchPaper(title: string, description: string, file: ExternalBlob): Promise<bigint>;
    approveAllPersistentGlossaryEntries(): Promise<void>;
    approvePersistentGlossaryEntry(key: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    chatAsk(_question: string): Promise<ChatAskResponsePayload>;
    deleteArticle(id: bigint): Promise<void>;
    deleteBlog(id: bigint): Promise<void>;
    deleteFeedback(id: bigint): Promise<void>;
    deleteGlossaryTerm(key: string): Promise<void>;
    deleteLearningSection(key: string): Promise<void>;
    deleteResearchPaper(id: bigint): Promise<void>;
    exportGlossarySnapshot(): Promise<GlossarySnapshot>;
    getAllFeedback(): Promise<Array<[bigint, Feedback]>>;
    getApplicationPaths(): Promise<string>;
    getArticle(id: bigint): Promise<Article | null>;
    getArticles(): Promise<Array<Article>>;
    getArticlesByCategory(category: string): Promise<Array<Article>>;
    getBlog(id: bigint): Promise<BlogPost | null>;
    getBlogs(includeUnpublished: boolean): Promise<Array<BlogPost>>;
    getBlogsByCategory(category: string, includeUnpublished: boolean): Promise<Array<BlogPost>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getGlossaryDiagnosticsByPrefix(prefix: string): Promise<Array<GlossaryDiagnostic>>;
    getGlossarySnapshotStats(): Promise<GlossaryStats>;
    getGlossaryTerms(): Promise<Array<[string, GlossaryTerm]>>;
    getLearningSection(key: string): Promise<LearningSection | null>;
    getLearningSections(): Promise<Array<[string, LearningSection]>>;
    getMaintenanceStatus(): Promise<boolean>;
    getMarketHours(): Promise<Array<[bigint, MarketHour]>>;
    getMarketStatus(): Promise<boolean>;
    getNifty100Stocks(): Promise<Array<Stock>>;
    getNifty50Stocks(): Promise<Array<Stock>>;
    getNifty50Symbols(): Promise<Array<string>>;
    getResearchPaper(id: bigint): Promise<ResearchPaper | null>;
    getResearchPapers(): Promise<Array<ResearchPaper>>;
    getStock(symbol: string): Promise<Stock | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeMarketHours(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isMarketOpen(): Promise<boolean>;
    publishGlossaryBatch(batch: GlossaryBatch): Promise<void>;
    replaceGlossaryWithSnapshot(snapshot: GlossarySnapshot): Promise<void>;
    restoreGlossaryFromSnapshot(snapshot: GlossarySnapshot): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchGlossary(searchTerm: string): Promise<Array<[string, GlossaryTerm]>>;
    setMaintenanceMode(enabled: boolean): Promise<void>;
    submitFeedback(name: string, email: string, message: string): Promise<bigint>;
    submitJobTitle(_jobTitle: string): Promise<string>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateArticle(id: bigint, title: string, content: string, category: string): Promise<void>;
    updateBlog(id: bigint, title: string, content: string, author: string, tags: Array<string>, category: string, publishedAt: bigint, isPublished: boolean): Promise<void>;
    updateBlogUpdatedTime(id: bigint, forcePublishedAt: bigint): Promise<void>;
    updateGlossaryTerm(key: string, term: GlossaryTerm): Promise<void>;
    updateLearningSection(key: string, section: LearningSection): Promise<void>;
    updateNifty50Data(symbol: string, ltp: number, dayClose: number): Promise<void>;
    updateStock(symbol: string, stock: Stock): Promise<void>;
}
