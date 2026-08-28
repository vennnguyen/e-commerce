"use client";

import { createQueryClient } from "@/lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => createQueryClient());
  return <QueryClientProvider client={queryClient}>{children}
  <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right"></ReactQueryDevtools>
  </QueryClientProvider>
}
