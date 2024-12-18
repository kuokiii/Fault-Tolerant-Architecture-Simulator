'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Instagram, Github, Cpu, Server, Database, HardDrive } from 'lucide-react'
import { motion, useAnimation } from 'framer-motion'

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const controls = useAnimation()

  const cardVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 }
    }
  }

  const architectureAnimation = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemAnimation = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  useEffect(() => {
    controls.start("visible")
  }, [controls])

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col">
      <header className="bg-black bg-opacity-50 text-white p-4">
        <nav className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Cpu className="h-8 w-8 text-blue-400" />
              <Link href="/" className="text-2xl font-bold hover:text-blue-400 transition-colors">
                FTS
              </Link>
            </div>
            <div className="flex space-x-2">
              <Link href="/ecc-simulation">
                <Button variant="outline" className="bg-black text-white hover:bg-gray-800">ECC Simulation</Button>
              </Link>
              <Link href="/tmr-simulation">
                <Button variant="outline" className="bg-black text-white hover:bg-gray-800">TMR Simulation</Button>
              </Link>
              <Link href="/fault-injection">
                <Button variant="outline" className="bg-black text-white hover:bg-gray-800">Fault Injection</Button>
              </Link>
              <Link href="/performance-analysis">
                <Button variant="outline" className="bg-black text-white hover:bg-gray-800">Performance Analysis</Button>
              </Link>
            </div>
          </div>
          <div className="flex space-x-2">
            <Link href="/login">
              <Button variant="outline" className="bg-black text-white hover:bg-gray-800">Login</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="bg-black text-white hover:bg-gray-800">Register</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-8">
        <motion.h1 
          className="text-5xl font-bold text-white mb-4 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Fault-Tolerant Architecture Simulator
        </motion.h1>

        <motion.p
          className="text-xl text-white mb-8 text-center max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Explore and simulate advanced fault-tolerant techniques in computer architecture. 
          Understand how modern systems maintain reliability in the face of hardware failures.
        </motion.p>

        <motion.div
          className="mb-12"
          variants={architectureAnimation}
          initial="hidden"
          animate={controls}
        >
          <motion.div className="flex items-center justify-center space-x-4">
            <motion.div variants={itemAnimation} className="bg-white p-4 rounded-lg shadow-lg">
              <Server className="h-12 w-12 text-blue-500" />
            </motion.div>
            <motion.div variants={itemAnimation} className="bg-white p-4 rounded-lg shadow-lg">
              <Database className="h-12 w-12 text-green-500" />
            </motion.div>
            <motion.div variants={itemAnimation} className="bg-white p-4 rounded-lg shadow-lg">
              <HardDrive className="h-12 w-12 text-red-500" />
            </motion.div>
          </motion.div>
          <motion.div 
            className="h-1 bg-yellow-400 mt-2" 
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 1, duration: 0.5 }}
          />
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            onHoverStart={() => setHoveredCard('ecc')}
            onHoverEnd={() => setHoveredCard(null)}
          >
            <Card className="h-full bg-gradient-to-br from-green-400 to-blue-500 text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cpu className="mr-2" />
                  ECC Simulation
                </CardTitle>
                <CardDescription className="text-blue-100">Error-Correcting Codes</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Simulate and visualize how Error-Correcting Codes detect and correct bit errors in data transmission, crucial for maintaining data integrity in computer memory and storage systems.</p>
                <Link href="/ecc-simulation">
                  <Button className="mt-4 w-full bg-white text-blue-500 hover:bg-blue-100 transition-colors">
                    Try ECC Simulation
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover="hover"
            onHoverStart={() => setHoveredCard('tmr')}
            onHoverEnd={() => setHoveredCard(null)}
          >
            <Card className="h-full bg-gradient-to-br from-yellow-400 to-red-500 text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cpu className="mr-2" />
                  TMR Simulation
                </CardTitle>
                <CardDescription className="text-red-100">Triple Modular Redundancy</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Explore how Triple Modular Redundancy uses voting mechanisms to enhance system reliability, a technique commonly used in critical systems like aerospace and nuclear power plants.</p>
                <Link href="/tmr-simulation">
                  <Button className="mt-4 w-full bg-white text-red-500 hover:bg-red-100 transition-colors">
                    Try TMR Simulation
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover="hover"
            onHoverStart={() => setHoveredCard('fault')}
            onHoverEnd={() => setHoveredCard(null)}
          >
            <Card className="h-full bg-gradient-to-br from-purple-400 to-pink-500 text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cpu className="mr-2" />
                  Fault Injection
                </CardTitle>
                <CardDescription className="text-pink-100">Simulate System Errors</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Inject faults into the system to test and validate fault-tolerant mechanisms, mimicking real-world scenarios that computer architects must account for in robust system design.</p>
                <Link href="/fault-injection">
                  <Button className="mt-4 w-full bg-white text-pink-500 hover:bg-pink-100 transition-colors">
                    Try Fault Injection
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover="hover"
            onHoverStart={() => setHoveredCard('performance')}
            onHoverEnd={() => setHoveredCard(null)}
          >
            <Card className="h-full bg-gradient-to-br from-indigo-400 to-blue-500 text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cpu className="mr-2" />
                  Performance Analysis
                </CardTitle>
                <CardDescription className="text-blue-100">Compare Fault-Tolerant Techniques</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Analyze and compare the performance of different fault-tolerant architectures, essential for making informed decisions in computer system design and optimization.</p>
                <Link href="/performance-analysis">
                  <Button className="mt-4 w-full bg-white text-blue-500 hover:bg-blue-100 transition-colors">
                    View Performance Analysis
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>

      <footer className="bg-black bg-opacity-50 text-white p-4 text-center">
        <p className="mb-2">© {new Date().getFullYear()} Fault-Tolerant Architecture Simulator. All rights reserved. Developed by Nirupam Thapa a.k.a kuoki</p>
        <div className="flex justify-center space-x-4">
          <a href="https://instagram.com/_kuoki/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">
            <Instagram size={24} />
          </a>
          <a href="https://github.com/kuokiii" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">
            <Github size={24} />
          </a>
        </div>
      </footer>
    </div>
  )
}

