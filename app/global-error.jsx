"use client";

import { getErrorMessage } from "@/lib/getErrorMessage";

export default function GlobalError({ error, reset }) {
  const message = getErrorMessage(error);

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-950 text-gray-100 antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
          <h1 className="text-2xl font-semibold text-purple-300">Something went wrong</h1>
          <p className="max-w-md text-sm text-gray-400">
            {process.env.NODE_ENV === "development"
              ? message
              : "A critical error occurred. Please refresh the page."}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-lg bg-purple-600 px-4 py-2 text-white transition hover:bg-purple-700"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
