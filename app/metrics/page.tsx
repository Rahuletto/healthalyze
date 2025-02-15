import { getStatistics } from '@/utils/sqlite';
import React from 'react'
import GraphPage from './components/Graph';
import { DataAnalysis } from '@/types/DataAnalysis';
import { SignedOut, SignedIn, UserButton } from '@clerk/nextjs';
import { Link } from 'lucide-react';
import Image from 'next/image';


export default async function MetricsPage() {
  const metrics = await getStatistics() as DataAnalysis

  return (
    <>
      <head className='md:px-24 px-14 flex justify-between absolute top-0 left-0 w-screen'>
        <div className='flex py-6 gap-2 items-center justify-center'>
          <Image src="/icon.svg" height={42} width={42} alt="icon" />
          <h1 className='text-2xl font-semibold text-white'>Healthalyze</h1>
        </div>
        <SignedOut>
          <Link href="/sign-up" className='text-black px-6 py-2 font-semibold rounded-full bg-white'>Sign Up</Link>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </head>
      <main className='gradiented w-screen mt-14 min-h-screen flex items-center justify-center'>
        <GraphPage data={metrics} />
      </main>
    </>
  )
}
