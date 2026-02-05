import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, AlertCircle, BookOpen, FileText, Library, Sparkles, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useChatAsk } from '../hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';
import type { ChatAskResponseSource } from '../backend';
import { ChatSourceType } from '../backend';
import {
  detectLanguagePreference,
  detectRecommendationIntent,
  detectCalculatorIntent,
  detectLegalTaxIntent,
  buildRefusalResponse,
  buildLegalTaxRefusalResponse,
  buildCalculatorExplanation,
  buildNoContentResponse,
  buildSourceBasedResponse,
  shouldAppendDisclaimer,
  getDisclaimerLine,
  getFullDisclaimer,
} from '../utils/arthSaathiChat';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  sources?: ChatAskResponseSource[];
  timestamp: Date;
}

export default function ChatAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [userLanguage, setUserLanguage] = useState<'hinglish' | 'english'>('hinglish');
  const [useWebSources, setUseWebSources] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  const chatMutation = useChatAsk();

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || chatMutation.isPending) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Detect language preference
    const detectedLanguage = detectLanguagePreference(userMessage.content);
    setUserLanguage(detectedLanguage);

    // Detect intents - these checks happen BEFORE any backend call
    const hasRecommendationIntent = detectRecommendationIntent(userMessage.content);
    const calculatorIntent = detectCalculatorIntent(userMessage.content);
    const hasLegalTaxIntent = detectLegalTaxIntent(userMessage.content);

    try {
      // Handle refusal cases first (before backend call)
      if (hasRecommendationIntent) {
        const refusalContent = buildRefusalResponse(detectedLanguage);
        const disclaimerLine = getDisclaimerLine(detectedLanguage);
        
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          type: 'assistant',
          content: `${refusalContent}\n\n${disclaimerLine}`,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setShowDisclaimer(true);
        return;
      }

      if (hasLegalTaxIntent) {
        const refusalContent = buildLegalTaxRefusalResponse(detectedLanguage);
        const disclaimerLine = getDisclaimerLine(detectedLanguage);
        
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          type: 'assistant',
          content: `${refusalContent}\n\n${disclaimerLine}`,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        return;
      }

      // Handle calculator intent
      if (calculatorIntent) {
        const calculatorContent = buildCalculatorExplanation(calculatorIntent, detectedLanguage);
        const disclaimerLine = getDisclaimerLine(detectedLanguage);
        
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          type: 'assistant',
          content: `${calculatorContent}\n\n${disclaimerLine}`,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setShowDisclaimer(true);
        return;
      }

      // Fetch content from backend (always use chatAsk for now, as internet mode is not yet implemented in backend)
      const response = await chatMutation.mutateAsync(userMessage.content);

      let assistantContent = '';
      
      if (response.sources.length === 0) {
        assistantContent = buildNoContentResponse(detectedLanguage);
      } else {
        assistantContent = buildSourceBasedResponse(response.sources, detectedLanguage);
        
        // Append disclaimer if needed
        if (shouldAppendDisclaimer(userMessage.content, hasRecommendationIntent, !!calculatorIntent)) {
          const disclaimerLine = getDisclaimerLine(detectedLanguage);
          assistantContent += `\n\n${disclaimerLine}`;
        }
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        type: 'assistant',
        content: assistantContent,
        sources: response.sources,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Show disclaimer banner for certain intents
      if (shouldAppendDisclaimer(userMessage.content, hasRecommendationIntent, !!calculatorIntent)) {
        setShowDisclaimer(true);
      }
    } catch (error: any) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: 'assistant',
        content: error.message?.includes('maintenance') 
          ? (detectedLanguage === 'english' 
              ? 'The service is currently under maintenance. Please check back soon.'
              : 'Service abhi maintenance mein hai. Kripya thodi der baad check karein.')
          : (detectedLanguage === 'english'
              ? 'Sorry, I encountered an error processing your question. Please try again.'
              : 'Maaf kijiye, aapke question ko process karne mein error aayi. Kripya phir se try karein.'),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getSourceIcon = (type: ChatSourceType) => {
    switch (type) {
      case ChatSourceType.glossary:
        return <Library className="h-4 w-4" />;
      case ChatSourceType.learningSection:
        return <BookOpen className="h-4 w-4" />;
      case ChatSourceType.article:
        return <FileText className="h-4 w-4" />;
      case ChatSourceType.internetResult:
        return <Globe className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getSourcePath = (source: ChatAskResponseSource): string => {
    switch (source.type) {
      case ChatSourceType.glossary:
        return '/glossary';
      case ChatSourceType.learningSection:
        return '/learning';
      case ChatSourceType.article:
        return '/articles';
      default:
        return '/';
    }
  };

  const handleSourceClick = (source: ChatAskResponseSource) => {
    // If it's an internet source, open in new tab
    if (source.type === ChatSourceType.internetResult && source.internetSource?.url) {
      window.open(source.internetSource.url, '_blank', 'noopener,noreferrer');
      return;
    }
    
    // Otherwise, navigate in-app
    const path = getSourcePath(source);
    navigate({ to: path });
    setIsOpen(false);
  };

  const getSourceBadgeText = (type: ChatSourceType): string => {
    switch (type) {
      case ChatSourceType.glossary:
        return 'Glossary';
      case ChatSourceType.learningSection:
        return 'Learning';
      case ChatSourceType.article:
        return 'Article';
      case ChatSourceType.internetResult:
        return 'Web';
      default:
        return 'Source';
    }
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg transition-transform hover:scale-110"
        aria-label="ArthSaathi - Finance Education Assistant"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat Panel */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-md shadow-2xl sm:w-96">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-primary" />
              ArthSaathi
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Finance Education Assistant – Hinglish mein seekhein
            </p>
            
            {/* Web Sources Toggle */}
            <div className="flex items-center justify-between pt-3 border-t mt-3">
              <Label htmlFor="web-sources-toggle" className="text-xs font-normal cursor-pointer">
                Use Web Sources
              </Label>
              <Switch
                id="web-sources-toggle"
                checked={useWebSources}
                onCheckedChange={setUseWebSources}
                disabled
                className="opacity-50"
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              Coming soon: Search the web for additional information
            </p>
          </CardHeader>

          <CardContent className="p-0">
            {/* Disclaimer Alert */}
            {showDisclaimer && (
              <div className="p-4 border-b bg-muted/30">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    {getFullDisclaimer(userLanguage)}
                  </AlertDescription>
                </Alert>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDisclaimer(false)}
                  className="mt-2 h-7 text-xs"
                >
                  {userLanguage === 'english' ? 'Dismiss' : 'Samajh gaya'}
                </Button>
              </div>
            )}

            {/* Messages Area */}
            <ScrollArea ref={scrollAreaRef} className="h-[400px] p-4">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
                  <Sparkles className="mb-4 h-12 w-12 opacity-20" />
                  <p className="text-sm font-medium mb-2">
                    Namaste! Main ArthSaathi hoon 🙏
                  </p>
                  <p className="text-xs mb-4">
                    Financial concepts ko simple Hinglish mein samjhata hoon
                  </p>
                  <div className="space-y-2 text-left w-full max-w-[280px]">
                    <p className="text-xs font-semibold">Try asking:</p>
                    <div className="space-y-1">
                      <p className="text-xs bg-muted/50 rounded px-2 py-1">• "SIP kya hai?"</p>
                      <p className="text-xs bg-muted/50 rounded px-2 py-1">• "Mutual funds explain karo"</p>
                      <p className="text-xs bg-muted/50 rounded px-2 py-1">• "EMI calculator kaise use karein?"</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg px-4 py-2 ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                        
                        {/* Sources */}
                        {message.sources && message.sources.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <Separator className="my-2" />
                            <p className="text-xs font-semibold opacity-70">
                              {userLanguage === 'english' ? 'Sources:' : 'Sources:'}
                            </p>
                            {message.sources.slice(0, 5).map((source, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSourceClick(source)}
                                className="flex w-full items-start gap-2 rounded border border-border/50 bg-background/50 p-2 text-left transition-colors hover:bg-background/80"
                              >
                                <div className="mt-0.5 opacity-60">
                                  {getSourceIcon(source.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium truncate">{source.title}</p>
                                  {source.type === ChatSourceType.internetResult && source.internetSource?.snippet && (
                                    <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">
                                      {source.internetSource.snippet}
                                    </p>
                                  )}
                                  <Badge 
                                    variant={source.type === ChatSourceType.internetResult ? "default" : "outline"} 
                                    className="mt-1 text-[10px] h-4"
                                  >
                                    {getSourceBadgeText(source.type)}
                                  </Badge>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Loading Indicator */}
                  {chatMutation.isPending && (
                    <div className="flex justify-start">
                      <div className="max-w-[85%] rounded-lg bg-muted px-4 py-2">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <p className="text-sm text-muted-foreground">
                            {userLanguage === 'english' ? 'Searching resources...' : 'Resources dhundh raha hoon...'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={userLanguage === 'english' ? 'Ask a question...' : 'Apna sawal puchiye...'}
                  className="min-h-[60px] max-h-[120px] resize-none"
                  disabled={chatMutation.isPending}
                />
                <Button
                  onClick={handleSendMessage}
                  size="icon"
                  disabled={!inputValue.trim() || chatMutation.isPending}
                  className="h-[60px] w-[60px] shrink-0"
                >
                  {chatMutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {userLanguage === 'english' 
                  ? 'Press Enter to send, Shift+Enter for new line'
                  : 'Enter dabaye bhejne ke liye, Shift+Enter naye line ke liye'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
