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

type FaultType = 'bit-flip' | 'stuck-at-0' | 'stuck-at-1' | 'random' | 'burst' | 'intermittent'

export default function FaultInjection() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [faultPositions, setFaultPositions] = useState<number[]>([])
  const [animationStep, setAnimationStep] = useState(0)
  const [faultType, setFaultType] = useState<FaultType>('bit-flip')
  const [faultProbability, setFaultProbability] = useState(0.1)
  const [burstLength, setBurstLength] = useState(3)
  const [intermittentPeriod, setIntermittentPeriod] = useState(5)

  const injectFault = () => {
    if (!/^[01]+$/.test(input)) {
      setOutput('Please enter a valid binary string')
      return
    }

    const injectFaults = (data: string): [string, number[]] => {
      const chars = data.split('')
      const positions: number[] = []
      
      switch (faultType) {
        case 'burst':
          const startPosition = Math.floor(Math.random() * (data.length - burstLength + 1))
          for (let i = 0; i < burstLength; i++) {
            if (Math.random() < faultProbability) {
              positions.push(startPosition + i)
              chars[startPosition + i] = Math.random() < 0.5 ? '0' : '1'
            }
          }
          break
        case 'intermittent':
          for (let i = 0; i < data.length; i++) {
            if (i % intermittentPeriod === 0 && Math.random() < faultProbability) {
              positions.push(i)
              chars[i] = chars[i] === '0' ? '1' : '0'
            }
          }
          break
        default:
          for (let i = 0; i < data.length; i++) {
            if (Math.random() < faultProbability) {
              positions.push(i)
              switch (faultType) {
                case 'bit-flip':
                  chars[i] = chars[i] === '0' ? '1' : '0'
                  break
                case 'stuck-at-0':
                  chars[i] = '0'
                  break
                case 'stuck-at-1':
                  chars[i] = '1'
                  break
                case 'random':
                  chars[i] = Math.random() < 0.5 ? '0' : '1'
                  break
              }
            }
          }
      }
      
      return [chars.join(''), positions]
    }

    const [faultyOutput, faultPos] = injectFaults(input)
    setOutput(`Original: ${input}
Faulty:   ${faultyOutput}`)
    setFaultPositions(faultPos)
    setAnimationStep(1)
  }

  useEffect(() => {
    if (animationStep > 0 && animationStep < 4) {
      const timer = setTimeout(() => setAnimationStep(animationStep + 1), 1500)
      return () => clearTimeout(timer)
    }
  }, [animationStep])

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 to-pink-500 flex flex-col items-center justify-center p-4">
      <Link href="/" className="absolute top-4 left-4 text-white hover:text-purple-200 transition-colors">
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
            <CardTitle className="text-2xl text-pink-600">Fault Injection</CardTitle>
            <CardDescription>Simulate various types of faults in binary data</CardDescription>
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
                    <label htmlFor="input" className="block text-sm font-medium text-gray-700">Input (binary string)</label>
                    <Input
                      id="input"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Enter binary data"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label htmlFor="fault-type" className="block text-sm font-medium text-gray-700">Fault Type</label>
                      <Select onValueChange={(value) => setFaultType(value as FaultType)}>
                        <SelectTrigger id="fault-type">
                          <SelectValue placeholder="Select fault type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bit-flip">Bit Flip</SelectItem>
                          <SelectItem value="stuck-at-0">Stuck-at-0</SelectItem>
                          <SelectItem value="stuck-at-1">Stuck-at-1</SelectItem>
                          <SelectItem value="random">Random</SelectItem>
                          <SelectItem value="burst">Burst</SelectItem>
                          <SelectItem value="intermittent">Intermittent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
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
                          Adjust the probability of faults being injected into the input data. Higher values increase the frequency of faults.
                        </p>
                      </div>
                    </div>
                  </div>
                  {faultType === 'burst' && (
                    <div>
                      <label htmlFor="burst-length" className="block text-sm font-medium text-gray-700">
                        Burst Length: {burstLength}
                      </label>
                      <Slider
                        id="burst-length"
                        min={1}
                        max={10}
                        step={1}
                        value={[burstLength]}
                        onValueChange={(value) => setBurstLength(value[0])}
                        className="mt-1"
                      />
                    </div>
                  )}
                  {faultType === 'intermittent' && (
                    <div>
                      <label htmlFor="intermittent-period" className="block text-sm font-medium text-gray-700">
                        Intermittent Period: {intermittentPeriod}
                      </label>
                      <Slider
                        id="intermittent-period"
                        min={2}
                        max={20}
                        step={1}
                        value={[intermittentPeriod]}
                        onValueChange={(value) => setIntermittentPeriod(value[0])}
                        className="mt-1"
                      />
                    </div>
                  )}
                  {output && (
                    <div className="space-y-2">
                      <motion.pre 
                        className="font-mono bg-gray-100 p-2 rounded"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: animationStep >= 1 ? 1 : 0 }}
                      >
                        {output.split('\n').map((line, index) => (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.5 }}
                          >
                            {line}
                          </motion.div>
                        ))}
                      </motion.pre>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: animationStep >= 2 ? 1 : 0 }}
                      >
                        <p className="font-semibold">Fault Locations:</p>
                        <div className="flex flex-wrap">
                          {input.split('').map((bit, index) => (
                            <motion.span
                              key={index}
                              className={`inline-block w-8 h-8 border border-gray-300 flex items-center justify-center ${faultPositions.includes(index) ? 'bg-red-200' : ''}`}
                              initial={{ backgroundColor: '#ffffff' }}
                              animate={{ backgroundColor: faultPositions.includes(index) ? '#FED7D7' : '#ffffff' }}
                              transition={{ duration: 0.5 }}
                            >
                              {bit}
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>
                      <motion.p 
                        className="text-sm text-gray-600 mt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: animationStep >= 3 ? 1 : 0 }}
                      >
                        The simulation introduced {faultType} fault(s) in the input data. 
                        In real systems, fault-tolerant mechanisms would detect and potentially correct such errors.
                      </motion.p>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="info">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Fault Injection Types</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li><strong>Bit Flip:</strong> Randomly flips bits from 0 to 1 or vice versa.</li>
                    <li><strong>Stuck-at-0/1:</strong> Sets bits to always be 0 or 1, simulating hardware faults.</li>
                    <li><strong>Random:</strong> Replaces bits with random values.</li>
                    <li><strong>Burst:</strong> Introduces errors in a continuous sequence, simulating burst noise.</li>
                    <li><strong>Intermittent:</strong> Periodically introduces errors, simulating recurring faults.</li>
                  </ul>
                  <p>Adjust the fault probability, burst length, and intermittent period to simulate different fault scenarios.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button onClick={injectFault} className="w-full bg-pink-500 hover:bg-pink-600 text-white">Inject Fault</Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

