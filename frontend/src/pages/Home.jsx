import React from 'react'
import Hero from '../components/Hero'
import NewArrivalProducts from '../components/NewArrivalProducts'
import ServiceFeatures from '../components/ServiceFeatures'
import DefaultProduct from '../components/DefaultProduct'
import Testimonials from '../components/Testimonials'
import Newsletter from '../components/Newsletter'

const Home = () => {
  return (
    <div>
      <Hero />
      <NewArrivalProducts/>
      <DefaultProduct />
      <ServiceFeatures />
      <Testimonials />
      <Newsletter />
    </div>
  )
}

export default Home
