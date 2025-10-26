import React from 'react'
import AboutHero from '../components/AboutHero'
import TeamMembers from '../components/TeamMembers'
import WebsiteInfo from '../components/WebsiteInfo'
import ServiceFeatures from '../components/ServiceFeatures'
import Testimonials from '../components/Testimonials'
import Newsletter from '../components/Newsletter'

const About = () => {
  return (
    <div>
      <AboutHero />
      <TeamMembers />
      <WebsiteInfo />
      <ServiceFeatures />
      <Testimonials />
      <Newsletter />
    </div>
  )
}

export default About
