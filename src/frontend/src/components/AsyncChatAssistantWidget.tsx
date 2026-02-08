import { lazy, Suspense, useEffect, useState } from 'react';

const ChatAssistantWidget = lazy(() => import('./ChatAssistantWidget'));

export default function AsyncChatAssistantWidget() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Defer loading until after initial render using requestIdleCallback or setTimeout
    if ('requestIdleCallback' in window) {
      const idleCallback = requestIdleCallback(() => {
        setShouldLoad(true);
      }, { timeout: 2000 });

      return () => cancelIdleCallback(idleCallback);
    } else {
      const timeout = setTimeout(() => {
        setShouldLoad(true);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, []);

  if (!shouldLoad) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <ChatAssistantWidget />
    </Suspense>
  );
}
