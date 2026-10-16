
import './App.css'

import React from 'react'
import ParticleBackground from './components/ParticleBackground'
import CustomCursor from './components/CustomCursor'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Skills from './components/Skills'
import Experience from './components/Experience'
import ScrollEffects from './components/ScrollEffects'
import About from './components/About'
import Stack from './components/Stack'
import Contact from './components/Contact'
import MusicPlayer from './components/Musicplayer'
import Ex from './components/Ex'

const App = () => {
  return (
    <div>
      <ParticleBackground/>
      <CustomCursor/>
      <ScrollEffects/>
      <Navbar/>
      
      <Hero/>
      <Skills/>
      <Experience/>
      <Ex/>
      <About/>
      <Stack/>
      <Contact/>
    </div>
  )
}

export default App