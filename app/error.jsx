"use client";

import { getErrorMessage } from "@/lib/getErrorMessage";

export default function Error({ error, reset }) {
  const message = getErrorMessage(error);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-semibold text-purple-300">Something went wrong</h1>
      <p className="max-w-md text-sm text-gray-400">
        {process.env.NODE_ENV === "development" ? message : "An unexpected error occurred. Please try again."}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-lg bg-purple-600 px-4 py-2 text-white transition hover:bg-purple-700"
      >
        Try again
      </button>
    </div>
  );
}
