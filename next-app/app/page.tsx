"use client";

import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Home() {

  const { data: session } = useSession();
  if (session) {
    redirect("/chat");
  }

  if (session === null) {
    redirect("/login");
  }
  
  return (
    <main>
      <div>
        {/* <Login /> */}
        {/* <ChatApp /> */}
      </div>
      
    </main>
  )
}
