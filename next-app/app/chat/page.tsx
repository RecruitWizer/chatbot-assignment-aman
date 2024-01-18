"use client";

import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import ChatApp from '../../pages/ChatApp';

export default function Admin() {
  const { data: session } = useSession();
  if (session === null) {
    redirect("/login");
  }

  return (
    <div>
      <ChatApp />
    </div>
  );
}