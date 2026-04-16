"use client";

import { SessionProvider } from "next-auth/react";

export const AuthProvider = ({ children, session }) => {
  return (
    <SessionProvider
      session={session}
      refetchOnWindowFocus={false}
      refetchInterval={0}
    >
      {children}
    </SessionProvider>
  );
};
