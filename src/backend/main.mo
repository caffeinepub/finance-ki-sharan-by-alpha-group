import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Float "mo:core/Float";
import ExternalBlob "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import OutCall "http-outcalls/outcall";
import Bool "mo:core/Bool";
import Runtime "mo:core/Runtime";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type UserProfile = {
    name : Text;
    email : Text;
  };

  public type GlossaryTerm = {
    term : Text;
    definition : Text;
    example : Text;
    usage : Text;
  };

  public type Article = {
    id : Nat;
    title : Text;
    content : Text;
    category : Text;
  };

  public type ResearchPaper = {
    id : Nat;
    title : Text;
    description : Text;
    file : ExternalBlob.ExternalBlob;
  };

  public type LearningSection = {
    title : Text;
    content : Text;
  };

  public type Feedback = {
    name : Text;
    email : Text;
    message : Text;
  };

  public type MarketHour = {
    weekday : Nat;
    openHour : Nat;
    openMinute : Nat;
    closeHour : Nat;
    closeMinute : Nat;
  };

  public type Stock = {
    symbol : Text;
    companyName : Text;
    ltp : Float;
    dayClose : Float;
  };

  public type Nifty50StockData = {
    ltp : Float;
    dayClose : Float;
  };

  public type MarketStatus = {
    #open;
    #closed;
  };

  public type ChatAskResponsePayload = {
    sources : [ChatAskResponseSource];
  };

  public type ChatSourceType = {
    #glossary;
    #learningSection;
    #article;
    #internetResult;
  };

  public type InternetResultSource = {
    title : Text;
    snippet : Text;
    url : Text;
  };

  public type ChatAskResponseSource = {
    title : Text;
    content : Text;
    type_ : ChatSourceType;
    id : ?Nat;
    internetSource : ?InternetResultSource;
  };

  public type GlossaryDiagnostic = {
    key : Text;
    term : Text;
  };

  type GlossaryBatchTerm = {
    key : Text;
    term : GlossaryTerm;
  };

  type GlossaryBatch = {
    terms : [GlossaryBatchTerm];
  };

  // NEW Blogs Management
  public type BlogPost = {
    id : Nat;
    title : Text;
    content : Text;
    author : Text;
    tags : [Text];
    category : Text;
    publishedAt : Nat;
    lastUpdatedAt : Nat;
    isPublished : Bool;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let glossary = Map.empty<Text, GlossaryTerm>();
  let articles = Map.empty<Nat, Article>();
  let researchPapers = Map.empty<Nat, ResearchPaper>();
  let learningSections = Map.empty<Text, LearningSection>();
  let feedbackList = Map.empty<Nat, Feedback>();
  let marketHoursCache = Map.empty<Nat, MarketHour>();
  let nifty50Stocks = Map.empty<Text, Stock>();
  let nifty50DataCache = Map.empty<Text, Nifty50StockData>();
  let blogs = Map.empty<Nat, BlogPost>();

  var nextArticleId = 1;
  var nextResearchPaperId = 1;
  var nextFeedbackId = 1;
  var nextBlogId = 1;
  var marketHoursInitialized = false;
  var maintenanceMode : Bool = false;

  // ============================================
  // Helper function to check maintenance mode
  // ============================================
  func checkMaintenanceAccess(caller : Principal) {
    if (maintenanceMode and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Service under maintenance. Please check back soon.");
    };
  };

  // ========== Extended Chat Workflow with Internet Reference Results ==========
  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public query ({ caller }) func chatAsk(_question : Text) : async ChatAskResponsePayload {
    checkMaintenanceAccess(caller);

    let glossaryArray = glossary.entries().toArray().map(
      func((_, g)) {
        {
          title = g.term;
          content = g.definition;
          type_ = #glossary;
          id = null;
          internetSource = null;
        };
      }
    );

    let learningArray = learningSections.entries().toArray().map(
      func((_, l)) {
        {
          title = l.title;
          content = l.content;
          type_ = #learningSection;
          id = null;
          internetSource = null;
        };
      }
    );

    let articlesArray = articles.entries().toArray().map(
      func((_, a)) {
        {
          title = a.title;
          content = a.content;
          type_ = #article;
          id = ?a.id;
          internetSource = null;
        };
      }
    );

    let allSources = glossaryArray.concat(learningArray).concat(articlesArray);

    { sources = allSources };
  };

  public query ({ caller }) func submitJobTitle(_jobTitle : Text) : async Text {
    checkMaintenanceAccess(caller);
    "Automatic job notifier is planned to be implemented in a future release";
  };

  public query ({ caller }) func getApplicationPaths() : async Text {
    checkMaintenanceAccess(caller);
    "Introducing 'Application Pathways' feature soon. Stay tuned for streamlined application process insights and guidance!";
  };

  // ============================================
  // User Profile Management
  // ============================================
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    checkMaintenanceAccess(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    checkMaintenanceAccess(caller);
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    checkMaintenanceAccess(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ============================================
  // Maintenance Mode
  // ============================================
  public query ({ caller }) func getMaintenanceStatus() : async Bool {
    // If caller is admin, they can bypass maintenance mode
    if (AccessControl.isAdmin(accessControlState, caller)) {
      return false;
    };
    return maintenanceMode;
  };

  public shared ({ caller }) func setMaintenanceMode(enabled : Bool) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can change maintenance mode");
    };
    maintenanceMode := enabled;
  };

  // ============================================
  // Glossary Management
  // ============================================
  public query ({ caller }) func getGlossaryTerms() : async [(Text, GlossaryTerm)] {
    checkMaintenanceAccess(caller);
    glossary.entries().toArray();
  };

  public query ({ caller }) func searchGlossary(searchTerm : Text) : async [(Text, GlossaryTerm)] {
    checkMaintenanceAccess(caller);
    let lowerSearch = searchTerm.toLower();
    let results = glossary.entries().toArray().filter(
      func((key, term)) : Bool {
        term.term.toLower().contains(#text lowerSearch) or
        term.definition.toLower().contains(#text lowerSearch)
      }
    );
    results;
  };

  public shared ({ caller }) func addGlossaryTerm(key : Text, term : GlossaryTerm) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add glossary terms");
    };
    glossary.add(key, term);
  };

  public shared ({ caller }) func updateGlossaryTerm(key : Text, term : GlossaryTerm) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update glossary terms");
    };
    glossary.add(key, term);
  };

  public shared ({ caller }) func deleteGlossaryTerm(key : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete glossary terms");
    };
    glossary.remove(key);
  };

  public query ({ caller }) func getGlossaryDiagnosticsByPrefix(prefix : Text) : async [GlossaryDiagnostic] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view glossary diagnostics");
    };
    let lowerPrefix = prefix.toLower();
    glossary.entries().toArray().filter(
      func((key, term)) {
        key.startsWith(#text lowerPrefix);
      }
    ).map(
      func((key, term)) {
        {
          key = key;
          term = term.term;
        };
      }
    );
  };

  public shared ({ caller }) func publishGlossaryBatch(batch : GlossaryBatch) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can publish glossary batches");
    };

    for (entry in batch.terms.values()) {
      glossary.add(entry.key, entry.term);
    };
  };

  // ============================================
  // Articles Management
  // ============================================
  public query ({ caller }) func getArticles() : async [Article] {
    checkMaintenanceAccess(caller);
    articles.entries().map(func((_, article) : (Nat, Article)) : Article { article }).toArray();
  };

  public query ({ caller }) func getArticle(id : Nat) : async ?Article {
    checkMaintenanceAccess(caller);
    articles.get(id);
  };

  public query ({ caller }) func getArticlesByCategory(category : Text) : async [Article] {
    checkMaintenanceAccess(caller);
    let filtered = articles.entries().map(func((_, article) : (Nat, Article)) : Article { article }).toArray().filter(
      func(article : Article) : Bool { article.category == category }
    );
    filtered;
  };

  public shared ({ caller }) func addArticle(title : Text, content : Text, category : Text) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add articles");
    };
    let id = nextArticleId;
    let article : Article = {
      id = id;
      title = title;
      content = content;
      category = category;
    };
    articles.add(id, article);
    nextArticleId += 1;
    id;
  };

  public shared ({ caller }) func updateArticle(id : Nat, title : Text, content : Text, category : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update articles");
    };
    let article : Article = {
      id = id;
      title = title;
      content = content;
      category = category;
    };
    articles.add(id, article);
  };

  public shared ({ caller }) func deleteArticle(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete articles");
    };
    articles.remove(id);
  };

  // ============================================
  // Research Papers Management
  // ============================================
  public query ({ caller }) func getResearchPapers() : async [ResearchPaper] {
    checkMaintenanceAccess(caller);
    researchPapers.entries().map(func((_, paper) : (Nat, ResearchPaper)) : ResearchPaper { paper }).toArray();
  };

  public query ({ caller }) func getResearchPaper(id : Nat) : async ?ResearchPaper {
    checkMaintenanceAccess(caller);
    researchPapers.get(id);
  };

  public shared ({ caller }) func addResearchPaper(title : Text, description : Text, file : ExternalBlob.ExternalBlob) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add research papers");
    };
    let id = nextResearchPaperId;
    let paper : ResearchPaper = {
      id = id;
      title = title;
      description = description;
      file = file;
    };
    researchPapers.add(id, paper);
    nextResearchPaperId += 1;
    id;
  };

  public shared ({ caller }) func deleteResearchPaper(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete research papers");
    };
    researchPapers.remove(id);
  };

  // ============================================
  // Blog Posts Management (NEW)
  // ============================================
  public query ({ caller }) func getBlog(id : Nat) : async ?BlogPost {
    checkMaintenanceAccess(caller);

    let blog = blogs.get(id);

    // If blog is unpublished, only admins can view it
    switch (blog) {
      case (?b) {
        if (not b.isPublished and not AccessControl.isAdmin(accessControlState, caller)) {
          return null;
        };
        blog;
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func getBlogs(includeUnpublished : Bool) : async [BlogPost] {
    checkMaintenanceAccess(caller);

    // Only admins can request unpublished blogs
    let shouldIncludeUnpublished = includeUnpublished and AccessControl.isAdmin(accessControlState, caller);

    var filteredEntries = blogs.entries().toArray().map(
      func((_, blog)) { blog }
    );

    if (not shouldIncludeUnpublished) {
      filteredEntries := filteredEntries.filter(
        func(blog) { blog.isPublished }
      );
    };

    filteredEntries;
  };

  public query ({ caller }) func getBlogsByCategory(category : Text, includeUnpublished : Bool) : async [BlogPost] {
    checkMaintenanceAccess(caller);

    // Only admins can request unpublished blogs
    let shouldIncludeUnpublished = includeUnpublished and AccessControl.isAdmin(accessControlState, caller);

    var filteredEntries = blogs.entries().toArray().map(
      func((_, blog)) { blog }
    );

    filteredEntries := filteredEntries.filter(
      func(blog) { blog.category == category }
    );

    if (not shouldIncludeUnpublished) {
      filteredEntries := filteredEntries.filter(
        func(blog) { blog.isPublished }
      );
    };

    filteredEntries;
  };

  public shared ({ caller }) func addBlog(
    title : Text,
    content : Text,
    author : Text,
    tags : [Text],
    category : Text,
    publishedAt : Nat,
    isPublished : Bool,
  ) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add blogs");
    };

    let id = nextBlogId;
    let now = publishedAt;
    let blog : BlogPost = {
      id = id;
      title = title;
      content = content;
      author = author;
      tags = tags;
      category = category;
      publishedAt = publishedAt;
      lastUpdatedAt = now;
      isPublished = isPublished;
    };
    blogs.add(id, blog);
    nextBlogId += 1;
    id;
  };

  public shared ({ caller }) func updateBlog(
    id : Nat,
    title : Text,
    content : Text,
    author : Text,
    tags : [Text],
    category : Text,
    publishedAt : Nat,
    isPublished : Bool,
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update blogs");
    };

    let now = publishedAt;
    let blog : BlogPost = {
      id = id;
      title = title;
      content = content;
      author = author;
      tags = tags;
      category = category;
      publishedAt = publishedAt;
      lastUpdatedAt = now;
      isPublished = isPublished;
    };
    blogs.add(id, blog);
  };

  public shared ({ caller }) func updateBlogUpdatedTime(
    id : Nat,
    forcePublishedAt : Nat,
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update blogs");
    };

    let blog = switch (blogs.get(id)) {
      case (null) { Runtime.trap("Blog not found") };
      case (?b) { b };
    };

    let blogWithUpdatedTime = {
      blog with
      lastUpdatedAt = forcePublishedAt;
      publishedAt = if (blog.publishedAt == 0) { forcePublishedAt } else { blog.publishedAt };
    };

    blogs.add(id, blogWithUpdatedTime);
  };

  public shared ({ caller }) func deleteBlog(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete blogs");
    };
    blogs.remove(id);
  };

  // ============================================
  // Learning Sections Management
  // ============================================
  public query ({ caller }) func getLearningSections() : async [(Text, LearningSection)] {
    checkMaintenanceAccess(caller);
    learningSections.entries().toArray();
  };

  public query ({ caller }) func getLearningSection(key : Text) : async ?LearningSection {
    checkMaintenanceAccess(caller);
    learningSections.get(key);
  };

  public shared ({ caller }) func addLearningSection(key : Text, section : LearningSection) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add learning sections");
    };
    learningSections.add(key, section);
  };

  public shared ({ caller }) func updateLearningSection(key : Text, section : LearningSection) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update learning sections");
    };
    learningSections.add(key, section);
  };

  public shared ({ caller }) func deleteLearningSection(key : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete learning sections");
    };
    learningSections.remove(key);
  };

  // ============================================
  // Feedback Management
  // ============================================
  public shared ({ caller }) func submitFeedback(name : Text, email : Text, message : Text) : async Nat {
    checkMaintenanceAccess(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit feedback");
    };
    let id = nextFeedbackId;
    let feedback : Feedback = {
      name = name;
      email = email;
      message = message;
    };
    feedbackList.add(id, feedback);
    nextFeedbackId += 1;
    id;
  };

  public query ({ caller }) func getAllFeedback() : async [(Nat, Feedback)] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view feedback");
    };
    feedbackList.entries().toArray();
  };

  public shared ({ caller }) func deleteFeedback(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete feedback");
    };
    feedbackList.remove(id);
  };

  // ============================================
  // Market Data Management
  // ============================================
  public query ({ caller }) func getMarketStatus() : async Bool {
    checkMaintenanceAccess(caller);
    false;
  };

  public query ({ caller }) func getNifty50Stocks() : async [Stock] {
    checkMaintenanceAccess(caller);
    nifty50Stocks.entries().map(func((_, stock) : (Text, Stock)) : Stock { stock }).toArray();
  };

  public query ({ caller }) func getStock(symbol : Text) : async ?Stock {
    checkMaintenanceAccess(caller);
    nifty50Stocks.get(symbol);
  };

  public shared ({ caller }) func updateStock(symbol : Text, stock : Stock) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update stock data");
    };
    nifty50Stocks.add(symbol, stock);
  };

  public shared ({ caller }) func initializeMarketHours() : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can initialize market hours");
    };
    if (marketHoursInitialized) {
      Runtime.trap("Market hours already initialized");
    };

    for (day in Nat.range(0, 5)) {
      let marketHour : MarketHour = {
        weekday = day;
        openHour = 9;
        openMinute = 15;
        closeHour = 15;
        closeMinute = 30;
      };
      marketHoursCache.add(day, marketHour);
    };

    marketHoursInitialized := true;
  };

  public query ({ caller }) func getMarketHours() : async [(Nat, MarketHour)] {
    checkMaintenanceAccess(caller);
    marketHoursCache.entries().toArray();
  };

  public query ({ caller }) func getNifty50Data(symbol : Text) : async ?Nifty50StockData {
    checkMaintenanceAccess(caller);
    nifty50DataCache.get(symbol);
  };

  public query ({ caller }) func getAllNifty50Data() : async [(Text, Nifty50StockData)] {
    checkMaintenanceAccess(caller);
    nifty50DataCache.entries().toArray();
  };

  public shared ({ caller }) func updateNifty50Data(symbol : Text, ltp : Float, dayClose : Float) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update Nifty 50 data");
    };
    let stockData : Nifty50StockData = {
      ltp = ltp;
      dayClose = dayClose;
    };
    nifty50DataCache.add(symbol, stockData);
  };

  public query ({ caller }) func isMarketOpen() : async Bool {
    checkMaintenanceAccess(caller);
    false;
  };

  public query ({ caller }) func getNifty50Symbols() : async [Text] {
    checkMaintenanceAccess(caller);
    [
      "ADANIPORTS",
      "APOLLOHOSP",
      "ASIANPAINT",
      "AXISBANK",
      "BAJAJ-AUTO",
      "BAJFINANCE",
      "BAJAJFINSV",
      "BPCL",
      "BHARTIARTL",
      "BRITANNIA",
      "CIPLA",
      "COALINDIA",
      "DIVISLAB",
      "DRREDDY",
      "EICHERMOT",
      "GRASIM",
      "HCLTECH",
      "HDFCBANK",
      "HDFCLIFE",
      "HEROMOTOCO",
      "HINDALCO",
      "HINDUNILVR",
      "ICICIBANK",
      "ITC",
      "INDUSINDBK",
      "INFY",
      "JSWSTEEL",
      "KOTAKBANK",
      "LT",
      "LTIM",
      "LTTS",
      "M&M",
      "MARUTI",
      "NESTLEIND",
      "NTPC",
      "ONGC",
      "POWERGRID",
      "RELIANCE",
      "SBIN",
      "SHRIRAMFIN",
      "SUNPHARMA",
      "TCS",
      "TATACONSUM",
      "TATAMOTORS",
      "TATASTEEL",
      "TECHM",
      "TITAN",
      "UPL",
      "ULTRACEMCO",
      "WIPRO",
    ];
  };
};
