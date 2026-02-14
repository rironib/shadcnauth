"use client";
import { signOut, useSession } from "next-auth/react";

export const useUser = () => {
  const { data: session, status, update } = useSession();

  const loading = status === "loading";
  const user = session?.user;

  return {
    session,
    status,
    user,
    loading,
    isAuthenticated: status === "authenticated",
    signOut,
    update,
  };
};
