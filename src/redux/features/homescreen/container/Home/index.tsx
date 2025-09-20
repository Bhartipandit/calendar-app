"use client";

import { signIn, useSession } from "next-auth/react";
import Home from "@/components/Home";
import { useEffect } from "react";

const HomePage = () => {
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("google");
    }
  }, [status]);

  if (status === "loading") {
    return <p>Loading...</p>; // while NextAuth checks the session
  }

  return (
    <>
      {session ? (
        <div>
          <Home />
        </div>
      ) : null}
    </>
  );
};

export default HomePage;
