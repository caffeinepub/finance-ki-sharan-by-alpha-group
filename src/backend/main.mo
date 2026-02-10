import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import ExternalBlob "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import OutCall "http-outcalls/outcall";
import Bool "mo:core/Bool";
import Principal "mo:core/Principal";
import Int "mo:core/Int";
import Nat64 "mo:core/Nat64";
import Array "mo:core/Array";
import Float "mo:core/Float";

actor {
  public type InternalTime = Int;

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

  var marketData_lastUpdate : ?Time.Time = null;
  var marketData_cache : [Stock] = [];

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

  public type GlossarySnapshot = {
    terms : [(Text, GlossaryTerm)];
    createdAt : Int;
    termCount : Nat;
    version : Nat;
  };

  public type GlossaryStats = {
    currentTermCount : Nat;
    lastBackupTimestamp : ?Int;
    lastRestoreTimestamp : ?Int;
    lastSnapshotVersion : ?Nat;
  };

  public type PersistentGlossaryEntry = {
    key : Text;
    term : GlossaryTerm;
    approved : Bool;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  var persistentGlossary = Map.empty<Text, GlossaryTerm>();
  let articles = Map.empty<Nat, Article>();
  let researchPapers = Map.empty<Nat, ResearchPaper>();
  let learningSections = Map.empty<Text, LearningSection>();
  let feedbackList = Map.empty<Nat, Feedback>();
  let marketHoursCache = Map.empty<Nat, MarketHour>();
  let nifty50Stocks = Map.empty<Text, Stock>();
  let nifty50DataCache = Map.empty<Text, Nifty50StockData>();
  let blogs = Map.empty<Nat, BlogPost>();
  let persistentGlossaryEntries = Map.empty<Text, PersistentGlossaryEntry>();

  var nextArticleId = 1;
  var nextResearchPaperId = 1;
  var nextFeedbackId = 1;
  var nextBlogId = 1;
  var marketHoursInitialized = false;
  var maintenanceMode : Bool = false;

  var lastBackupTimestamp : ?InternalTime = null;
  var lastRestoreTimestamp : ?InternalTime = null;
  var lastSnapshotVersion = 0;

  var lastMarketFetchTimestamp : ?Int = null; // Track last cache time

  func checkMaintenanceAccess(caller : Principal) {
    if (maintenanceMode and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Service under maintenance. Please check back soon.");
    };
  };

  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public query ({ caller }) func chatAsk(_question : Text) : async ChatAskResponsePayload {
    checkMaintenanceAccess(caller);

    let glossaryArray = persistentGlossary.entries().toArray().map(
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

  public query ({ caller }) func getMaintenanceStatus() : async Bool {
    maintenanceMode;
  };

  public shared ({ caller }) func setMaintenanceMode(enabled : Bool) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can change maintenance mode");
    };
    maintenanceMode := enabled;
  };

  public query ({ caller }) func getGlossaryTerms() : async [(Text, GlossaryTerm)] {
    checkMaintenanceAccess(caller);
    persistentGlossary.entries().toArray();
  };

  public query ({ caller }) func searchGlossary(searchTerm : Text) : async [(Text, GlossaryTerm)] {
    checkMaintenanceAccess(caller);
    let lowerSearch = searchTerm.toLower();
    let results = persistentGlossary.entries().toArray().filter(
      func((key, term)) : Bool {
        term.term.toLower().contains(#text lowerSearch) or
        term.definition.toLower().contains(#text lowerSearch)
      }
    );
    results;
  };

  public shared ({ caller }) func addGlossaryTerm(key : Text, term : GlossaryTerm) : async () {
    checkMaintenanceAccess(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add glossary terms");
    };
    persistentGlossary.add(key, term);
  };

  public shared ({ caller }) func updateGlossaryTerm(key : Text, term : GlossaryTerm) : async () {
    checkMaintenanceAccess(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update glossary terms");
    };
    persistentGlossary.add(key, term);
  };

  public shared ({ caller }) func deleteGlossaryTerm(key : Text) : async () {
    checkMaintenanceAccess(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete glossary terms");
    };
    persistentGlossary.remove(key);
  };

  public query ({ caller }) func getGlossaryDiagnosticsByPrefix(prefix : Text) : async [GlossaryDiagnostic] {
    checkMaintenanceAccess(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view glossary diagnostics");
    };
    let lowerPrefix = prefix.toLower();
    persistentGlossary.entries().toArray().filter(
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
    checkMaintenanceAccess(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can publish glossary batches");
    };

    for (entry in batch.terms.values()) {
      persistentGlossary.add(entry.key, entry.term);
    };
  };

  public query ({ caller }) func getGlossarySnapshotStats() : async GlossaryStats {
    checkMaintenanceAccess(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view stats");
    };
    {
      currentTermCount = persistentGlossary.size();
      lastBackupTimestamp;
      lastRestoreTimestamp;
      lastSnapshotVersion = if (lastSnapshotVersion == 0) { null } else { ?lastSnapshotVersion };
    };
  };

  public shared ({ caller }) func exportGlossarySnapshot() : async GlossarySnapshot {
    checkMaintenanceAccess(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can export glossary snapshot");
    };

    let newSnapshot : GlossarySnapshot = {
      terms = persistentGlossary.entries().toArray();
      createdAt = Time.now();
      termCount = persistentGlossary.size();
      version = lastSnapshotVersion + 1;
    };

    lastBackupTimestamp := ?Time.now();
    lastSnapshotVersion += 1;

    newSnapshot;
  };

  public shared ({ caller }) func restoreGlossaryFromSnapshot(snapshot : GlossarySnapshot) : async () {
    checkMaintenanceAccess(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can restore glossary from snapshot");
    };

    for (entry in snapshot.terms.values()) {
      let (key, term) = entry;
      persistentGlossary.add(key, term);
    };

    lastRestoreTimestamp := ?Time.now();
    lastSnapshotVersion := snapshot.version;
  };

  public shared ({ caller }) func replaceGlossaryWithSnapshot(snapshot : GlossarySnapshot) : async () {
    checkMaintenanceAccess(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can replace glossary with snapshot");
    };

    persistentGlossary.clear();

    for (entry in snapshot.terms.values()) {
      let (key, term) = entry;
      persistentGlossary.add(key, term);
    };

    lastRestoreTimestamp := ?Time.now();
    lastSnapshotVersion := snapshot.version;
  };

  public shared ({ caller }) func addPersistentGlossaryEntries(entries : [PersistentGlossaryEntry]) : async () {
    checkMaintenanceAccess(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can persist entries");
    };

    for (entry in entries.values()) {
      persistentGlossaryEntries.add(entry.key, entry);
    };
  };

  public shared ({ caller }) func approvePersistentGlossaryEntry(key : Text) : async () {
    checkMaintenanceAccess(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can approve entries");
    };

    switch (persistentGlossaryEntries.get(key)) {
      case (null) { Runtime.trap("Entry not found") };
      case (?entry) {
        let approvedEntry = {
          key = entry.key;
          term = entry.term;
          approved = true;
        };
        persistentGlossaryEntries.add(key, approvedEntry);
        persistentGlossary.add(key, entry.term);
      };
    };
  };

  public shared ({ caller }) func approveAllPersistentGlossaryEntries() : async () {
    checkMaintenanceAccess(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can approve entries");
    };

    let entriesArray = persistentGlossaryEntries.entries().toArray();

    for ((key, entry) in entriesArray.values()) {
      let approvedEntry = {
        key = entry.key;
        term = entry.term;
        approved = true;
      };
      persistentGlossaryEntries.add(key, approvedEntry);
      persistentGlossary.add(key, entry.term);
    };
  };

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
    checkMaintenanceAccess(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
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
    checkMaintenanceAccess(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
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
    checkMaintenanceAccess(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete articles");
    };
    articles.remove(id);
  };

  public query ({ caller }) func getResearchPapers() : async [ResearchPaper] {
    checkMaintenanceAccess(caller);
    researchPapers.entries().map(func((_, paper) : (Nat, ResearchPaper)) : ResearchPaper { paper }).toArray();
  };

  public query ({ caller }) func getResearchPaper(id : Nat) : async ?ResearchPaper {
    checkMaintenanceAccess(caller);
    researchPapers.get(id);
  };

  public shared ({ caller }) func addResearchPaper(title : Text, description : Text, file : ExternalBlob.ExternalBlob) : async Nat {
    checkMaintenanceAccess(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
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
    checkMaintenanceAccess(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete research papers");
    };
    researchPapers.remove(id);
  };

  public query ({ caller }) func getBlog(id : Nat) : async ?BlogPost {
    checkMaintenanceAccess(caller);

    let blog = blogs.get(id);

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
    checkMaintenanceAccess(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
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
    checkMaintenanceAccess(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
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
    checkMaintenanceAccess(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
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
    checkMaintenanceAccess(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete blogs");
    };
    blogs.remove(id);
  };

  public query ({ caller }) func getLearningSections() : async [(Text, LearningSection)] {
    checkMaintenanceAccess(caller);
    learningSections.entries().toArray();
  };

  public query ({ caller }) func getLearningSection(key : Text) : async ?LearningSection {
    checkMaintenanceAccess(caller);
    learningSections.get(key);
  };

  public shared ({ caller }) func addLearningSection(key : Text, section : LearningSection) : async () {
    checkMaintenanceAccess(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add learning sections");
    };
    learningSections.add(key, section);
  };

  public shared ({ caller }) func updateLearningSection(key : Text, section : LearningSection) : async () {
    checkMaintenanceAccess(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update learning sections");
    };
    learningSections.add(key, section);
  };

  public shared ({ caller }) func deleteLearningSection(key : Text) : async () {
    checkMaintenanceAccess(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete learning sections");
    };
    learningSections.remove(key);
  };

  public shared ({ caller }) func submitFeedback(name : Text, email : Text, message : Text) : async Nat {
    checkMaintenanceAccess(caller);
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
    checkMaintenanceAccess(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view feedback");
    };
    feedbackList.entries().toArray();
  };

  public shared ({ caller }) func deleteFeedback(id : Nat) : async () {
    checkMaintenanceAccess(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete feedback");
    };
    feedbackList.remove(id);
  };

  public query ({ caller }) func getMarketStatus() : async Bool {
    checkMaintenanceAccess(caller);
    false;
  };

  public shared ({ caller }) func updateStock(symbol : Text, stock : Stock) : async () {
    checkMaintenanceAccess(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update stock data");
    };
    nifty50Stocks.add(symbol, stock);
  };

  public shared ({ caller }) func initializeMarketHours() : async () {
    checkMaintenanceAccess(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
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

  public shared ({ caller }) func updateNifty50Data(symbol : Text, ltp : Float, dayClose : Float) : async () {
    checkMaintenanceAccess(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
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

  public query ({ caller }) func getNifty50Stocks() : async [Stock] {
    checkMaintenanceAccess(caller);

    let cacheDuration : Int = 30 * 1000000000; // 30 seconds in nanoseconds

    switch (lastMarketFetchTimestamp) {
      case (?lastFetch) {
        let now = Time.now();
        let timeSinceLastFetch = now - lastFetch;
        if (timeSinceLastFetch < cacheDuration) {
          return marketData_cache;
        };
      };
      case (null) {};
    };

    lastMarketFetchTimestamp := ?Time.now();

    let stocks = [
      {
        symbol = "ADANIPORTS";
        companyName = "Adani Ports and Special Economic Zone Ltd";
        ltp = 700.0;
        dayClose = 695.0;
      },
      {
        symbol = "ASIANPAINT";
        companyName = "Asian Paints Ltd";
        ltp = 3000.0;
        dayClose = 2950.0;
      },
      {
        symbol = "AXISBANK";
        companyName = "Axis Bank Ltd";
        ltp = 800.0;
        dayClose = 790.0;
      },
      {
        symbol = "HDFCBANK";
        companyName = "HDFC Bank Ltd";
        ltp = 1600.0;
        dayClose = 1580.0;
      },
      {
        symbol = "INFY";
        companyName = "Infosys Ltd";
        ltp = 1400.0;
        dayClose = 1385.0;
      },
      {
        symbol = "RELIANCE";
        companyName = "Reliance Industries Ltd";
        ltp = 2400.0;
        dayClose = 2375.0;
      },
      {
        symbol = "TCS";
        companyName = "Tata Consultancy Services Ltd";
        ltp = 3400.0;
        dayClose = 3350.0;
      },
      {
        symbol = "SBIN";
        companyName = "State Bank of India";
        ltp = 450.0;
        dayClose = 445.0;
      },
    ];

    marketData_cache := stocks;

    stocks;
  };

  public shared ({ caller }) func getStock(symbol : Text) : async ?Stock {
    checkMaintenanceAccess(caller);

    let stocks = await getNifty50Stocks();
    switch (stocks.find(func(stock) { stock.symbol == symbol })) {
      case (?foundStock) { return ?foundStock };
      case (null) { return null };
    };
  };

  public query ({ caller }) func getNifty100Stocks() : async [Stock] {
    checkMaintenanceAccess(caller);
    let cacheDuration : Int = 30 * 1000000000; // 30 seconds in nanoseconds

    switch (marketData_lastUpdate, marketData_cache) {
      case (?lastUpdate, cachedStocks) {
        let timeSinceLastUpdate = Time.now() - lastUpdate;
        if (timeSinceLastUpdate < cacheDuration) { return cachedStocks };
      };
      case (null, _) {};
    };

    let stocks = [
      {
        symbol = "ADANIPORTS";
        companyName = "Adani Ports and Special Economic Zone Ltd";
        ltp = 702.0;
        dayClose = 697.0;
      },
      {
        symbol = "ASIANPAINT";
        companyName = "Asian Paints Ltd";
        ltp = 3002.0;
        dayClose = 2990.0;
      },
    ];

    marketData_cache := stocks;
    marketData_lastUpdate := ?Time.now();

    stocks;
  };
};
