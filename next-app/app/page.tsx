"use client";

import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Nav from '@/components/Nav';

export default function Home() {

  // const { data: session } = useSession();
  // if (session) {
  //   redirect("/chat");
  // }

  // if (session === null) {
  //   redirect("/login");
  // }
  
  return (
    <main>
      <div>
        {/* <Login /> */}
        {/* <ChatApp /> */}
      </div>
      
    </main>
  )
}
