'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/constants/routes'

const Home = () => {
  const router = useRouter()

  useEffect(() => {
    router.push(ROUTES.PRODUCTS)
  }, [router])

  return null
}

export default Home
