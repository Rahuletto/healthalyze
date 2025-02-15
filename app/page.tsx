'use client'
import { SignedOut, SignedIn, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'


export default function Home() {
  return (
    <>
      <head className='md:px-24 py-6 px-14 flex justify-between absolute top-0 left-0 w-screen'>
        <div className='flex gap-2 items-center justify-center'>
          <Image src="/icon.svg" height={42} width={42} alt="icon" />
        <h1 className='text-2xl font-semibold text-foreground'>Healthalyze</h1>
        </div>
        <SignedOut>
          <Link href="/sign-up" className='text-background px-6 py-2 font-semibold rounded-full bg-foreground'>Sign Up</Link>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </head>

        <main className="pl-32 flex justify-between">
          <div className='flex flex-col justify-center gap-6 font-classy max-w-[600px]'>
            <h1 className='text-6xl font-medium '>Your <span className='text-red'>Health</span>, Backed by AI.</h1>
            <p className='opacity-60'>Healthalyze is an AI-powered tool that assesses your stroke risk using deep learning. Enter your health details to get an instant probability score and AI-driven prevention advice</p>
            <Link href="/dashboard" className='text-background px-6 py-2 font-semibold rounded-full font-sans text-xl w-fit mt-12 bg-foreground'>Check out</Link>
          </div>
          <img src="/hero.svg" alt="hero" className='h-screen' />          
        </main>
    </>
  );
}
