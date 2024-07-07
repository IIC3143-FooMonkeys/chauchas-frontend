import React, { useEffect, useState, useCallback } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import DiscountsList from './DiscountsList.js'
import axios from 'axios'
import '../css/Discounts.css'

const Discounts = () => {
  const { isAuthenticated } = useAuth0()
  const [page, setPage] = useState(1)
  const [Discounts, setDiscounts] = useState([])
  const countPage = 25

  const discounts = [{id: 10074, title: "Majestic", description: "25% de dcto. Todos los días.", category: "comida", covers: [
    "https://portales.bancochile.cl/uploads/000/068/188/f9c1306d-da8a-4271-924b-45e58dad772e/original/01.png",
    "https://portales.bancochile.cl/uploads/000/068/189/6c4ebbd2-730e-4210-9514-e8afbce35081/original/logo-majestic.jpg"
    ],}, {id: 10879, title: "Cine Hoyts", description: "Canjea hasta el 100% con tus Dólares-Premio", category: "cine",
     covers: [
        "https://portales.bancochile.cl/uploads/000/044/623/cdd3cf12-6996-4693-937a-eed6428da644/original/banner-Cine.jpg",
        "https://portales.bancochile.cl/uploads/000/044/631/585ee057-ed78-4d0b-9f74-420b7eb0b87f/original/logo_cine_hoyts.jpg"
    ]}]

  return (
    <div className='Discounts-container'>
      {!isAuthenticated && (
        <h2>You are not logged in</h2>
      )}
      {isAuthenticated && (
        <div className='Discounts'>
          <h2>Available Discounts</h2>
          <DiscountsList Discounts={Discounts} />
        </div>
      )}
    </div>
  )
}

export default Discounts
