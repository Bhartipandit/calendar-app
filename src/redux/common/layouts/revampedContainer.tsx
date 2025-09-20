"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface RevampedContainerProps {
  children: ReactNode;
}

const RevampedContainer: React.FC<RevampedContainerProps> = ({ children }) => {
  return (
    <>
      <SessionProvider>{children}</SessionProvider>
    </>
  );
};

export default RevampedContainer;
