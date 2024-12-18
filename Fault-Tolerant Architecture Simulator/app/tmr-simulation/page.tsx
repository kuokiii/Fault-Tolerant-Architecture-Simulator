'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

type VotingStrategy = 'majority' | 'weighted' | 'adaptive' | 'threshold'

export default function TMRSimulation() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [moduleOutputs, setModuleOutputs] = useState<string[]>([])
  const [animationStep, setAnimationStep] = useState(0)
  const [simulationCount, setSimulationCount] = useState(0)
  const [successRate, setSuccessRate] = useState(100)
  const [votingStrategy, setVotingStrategy] = useState<VotingStrategy>('majority')
  const [moduleReliabilities, setModuleReliabilities] = useState([0.95, 0.9, 0.85])
  const [faultProbability, setFaultProbability] = useState(0.1)
  const [thresholdValue, setThresholdValue] = useState(2)

  const simulateTMR = () => {
    const simulateModule = (input: string, reliability: number): string => {
      return input.split('').map(bit => 
        Math.random() < reliability ? bit : (Math.random() < 0.5 ? '0' : '1')
      ).join('')
    }

    if (!/^[01]+$/.test(input)) {
      setOutput('Please enter a valid binary string')
      return
    }

    const results = moduleReliabilities.map(reliability => simulateModule(input, 1 - faultProbability * (1 - reliability)))

    setModuleOutputs(results)

    let finalOutput: string
    switch (votingStrategy) {
      case 'majority':
        finalOutput = results[0].split('').map((_, index) => {
          const bits = results.map(r => r[index])
          return bits.filter(b => b === '1').length > bits.length / 2 ? '1' : '0'
        }).join('')
        break
      case 'weighted':
        finalOutputfinalOutput = results[0].split('').map((_, index) => {
          const weightedSum = results.reduce((sum, result, i) => sum + (result[index] === '1' ? moduleReliabilities[i] : 0), 0)
          return weightedSum > moduleReliabilities.reduce((a, b) => a + b) / 2 ? '1' : '0'
        }).join('')
        break
      case 'adaptive':
        const mostReliableIndex = moduleReliabilities.indexOf(Math.max(...moduleReliabilities))
        finalOutput = results[mostReliableIndex]
        break
      case 'threshold':
        finalOutput = results[0].split('').map((_, index) => {
          const bits = results.map(r => r[index])
          return bits.filter(b => b === '1').length >= thresholdValue ? '1' : '0'
        }).join('')
        break
    }

    setOutput(`TMR Output: ${finalOutput}`)
    setAnimationStep(1)
    setSimulationCount(prev => prev + 1)
    setSuccessRate(prev => {
      const newSuccessCount = prev * (simulationCount / 100) + (finalOutput === input ? 1 : 0)
      return Math.round((newSuccessCount / (simulationCount + 1)) * 100)
    })

    // Update module reliabilities based on their performance
    setModuleReliabilities(prev => prev.map((reliability, index) => 
      results[index] === input ? Math.min(reliability + 0.01, 1) : Math.max(reliability - 0.01, 0)
    ))
  }

  useEffect(() => {
    if (animationStep > 0 && animationStep < 4) {
      const timer = setTimeout(() => setAnimationStep(animationStep + 1), 1500)
      return () => clearTimeout(timer)
    }
  }, [animationStep])

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-400 to-red-500 flex flex-col items-center justify-center p-4">
      <Link href="/" className="absolute top-4 left-4 text-white hover:text-yellow-200 transition-colors">
        <Button variant="outline" className="bg-black text-white hover:bg-gray-800">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </Link>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-2xl bg-white bg-opacity-90 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-2xl text-red-600">TMR Simulation</CardTitle>
            <CardDescription>Simulate Triple Modular Redundancy</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="simulation" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="simulation">Simulation</TabsTrigger>
                <TabsTrigger value="info">Info</TabsTrigger>
              </TabsList>
              <TabsContent value="simulation">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="voting-strategy" className="block text-sm font-medium text-gray-700">Voting Strategy</label>
                    <Select onValueChange={(value) => setVotingStrategy(value as VotingStrategy)} defaultValue={votingStrategy}>
                      <SelectTrigger id="voting-strategy">
                        <SelectValue placeholder="Select voting strategy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="majority">Majority Voting</SelectItem>
                        <SelectItem value="weighted">Weighted Voting</SelectItem>
                        <SelectItem value="adaptive">Adaptive Voting</SelectItem>
                        <SelectItem value="threshold">Threshold Voting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label htmlFor="input" className="block text-sm font-medium text-gray-700">Input (binary string)</label>
                    <Input
                      id="input"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Enter binary data"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label htmlFor="fault-probability" className="block text-sm font-medium text-gray-700">
                      Fault Probability: {faultProbability.toFixed(2)}
                    </label>
                    <Slider
                      id="fault-probability"
                      min={0}
                      max={1}
                      step={0.01}
                      value={[faultProbability]}
                      onValueChange={(value) => setFaultProbability(value[0])}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Adjust the probability of faults occurring in the modules. Higher values increase the likelihood of errors.
                    </p>
                  </div>
                  {votingStrategy === 'threshold' && (
                    <div>
                      <label htmlFor="threshold-value" className="block text-sm font-medium text-gray-700">
                        Threshold Value: {thresholdValue}
                      </label>
                      <Slider
                        id="threshold-value"
                        min={1}
                        max={3}
                        step={1}
                        value={[thresholdValue]}
                        onValueChange={(value) => setThresholdValue(value[0])}
                        className="mt-1"
                      />
                    </div>
                  )}
                  {moduleOutputs.length > 0 && (
                    <div className="space-y-2">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: animationStep >= 1 ? 1 : 0 }}
                      >
                        <p className="font-semibold">Module Outputs:</p>
                        <div className="flex flex-col space-y-2 mt-2">
                          {moduleOutputs.map((output, index) => (
                            <motion.div 
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.5 }}
                              className="p-2 rounded bg-gray-100 flex justify-between items-center"
                            >
                              <span>Module {index + 1}: {output}</span>
                              <span className="text-sm text-gray-500">Reliability: {moduleReliabilities[index].toFixed(2)}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                      <motion.p 
                        className="font-semibold text-blue-600 mt-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: animationStep >= 3 ? 1 : 0 }}
                      >
                        {output}
                      </motion.p>
                    </div>
                  )}
                  {output && (
                    <motion.p 
                      className="text-sm text-gray-600 mt-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: animationStep >= 4 ? 1 : 0 }}
                    >
                      The simulation uses {votingStrategy} voting to determine the final output. 
                      Module reliabilities are dynamically updated based on their performance.
                    </motion.p>
                  )}
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700">Simulation Statistics:</p>
                    <p className="text-sm text-gray-600">Total Simulations: {simulationCount}</p>
                    <p className="text-sm text-gray-600">Success Rate: {successRate}%</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="info">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Triple Modular Redundancy (TMR)</h3>
                  <p>TMR is a fault-tolerant technique where three identical modules perform the same operation, and a voter determines the final output. This simulation explores different voting strategies:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li><strong>Majority Voting:</strong> The most common output among the three modules is selected.</li>
                    <li><strong>Weighted Voting:</strong> Each module's output is weighted by its reliability.</li>
                    <li><strong>Adaptive Voting:</strong> The output of the most reliable module is selected.</li>
                    <li><strong>Threshold Voting:</strong> The output is determined based on a user-defined threshold.</li>
                  </ul>
                  <p>Adjust the fault probability to see how different voting strategies perform under various error conditions.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button onClick={simulateTMR} className="w-full bg-red-500 hover:bg-red-600 text-white">Simulate TMR</Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

