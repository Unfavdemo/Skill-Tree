import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-semibold text-purple-200">Page not found</h1>
      <Link href="/" className="text-cyan-300 underline">
        Back to home
      </Link>
    </div>
  );
}
