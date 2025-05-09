"use client";

import { useAppSelector } from "../redux/hooks";
import Login from "./Login";
import { ReactNode } from "react";

interface AuthWrapperProps {
  children: ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { isLoggedIn } = useAppSelector((state) => state.auth);

  // If not logged in, show login screen
  if (!isLoggedIn) {
    return <Login />;
  }

  // If logged in, show the children components
  return <>{children}</>;
}
