"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ReactNode, useState } from "react";

function ReactQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" /> */}
    </QueryClientProvider>
  );
}

export default ReactQueryProvider;
