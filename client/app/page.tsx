// app/page.tsx
import { Suspense } from "react";
import AppClient from "./AppClient";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading application...</div>}>
      <AppClient />
    </Suspense>
  );
}
