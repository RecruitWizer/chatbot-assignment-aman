"use client";

import type { NextRequest } from "next/server";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Login() {
  const { data: session } = useSession();
  if (session) {
    redirect("/chat");
  }

  return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Login Page</h1>
          <button className="p-3 bg-green-500 text-white rounded" onClick={() => signIn("google")}>
            Sign in with Google
          </button>
        </div>
      </div>
  );
}