import { SignedOut, SignedIn, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import AnimatedStrokePredictionForm from './components/Form'
import { auth } from '@clerk/nextjs/server'
import { getPredictionById } from '@/utils/sqlite'

export default async function Page() {
    const { userId } = await auth()
    const data = await getPredictionById(userId ?? "")
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
            <main className='gradiented w-screen h-screen flex items-center justify-center'>
                <AnimatedStrokePredictionForm  data={data as any} /> 
            </main>
        </>
    )
}
