import { useEffect } from "react";
import { useRouter } from "next/router";

// This is a placeholder to avoid ENOENT errors
// The real app is in the app directory using App Router
export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Redirect to app directory
    router.push("/");
  }, []);

  // Just render a loading message
  return <div>Loading...</div>;
}
