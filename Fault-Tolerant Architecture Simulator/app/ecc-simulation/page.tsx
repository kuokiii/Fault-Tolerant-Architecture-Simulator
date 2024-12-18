'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Info } from 'lucide-react'

export default function ECCSimulation() {
  const [input, setInput] = useState('')
  const [encoded, setEncoded] = useState('')
  const [decoded, setDecoded] = useState('')
  const [error, setError] = useState('')
  const [animationStep, setAnimationStep] = useState(0)
  const [simulationCount, setSimulationCount] = useState(0)
  const [successRate, setSuccessRate] = useState(100)
  const [eccType, setEccType] = useState('hamming')
  const [errorProbability, setErrorProbability] = useState(0.1)
  const [burstErrorLength, setBurstErrorLength] = useState(2)

  const simulateECC = () => {
    const hammingEncode = (data: string): string => {
      const d = data.split('').map(Number)
      const m = d.length
      const r = Math.ceil(Math.log2(m + Math.ceil(Math.log2(m)) + 1))
      const encoded = new Array(m + r).fill(0)

      let j = 0
      for (let i = 1; i <= m + r; i++) {
        if ((i & (i - 1)) !== 0) {
          encoded[i - 1] = d[j]
          j++
        }
      }

      for (let i = 0; i < r; i++) {
        const pos = Math.pow(2, i)
        let parity = 0
        for (let j = pos; j <= m + r; j += pos * 2) {
          for (let k = j; k < j + pos && k <= m + r; k++) {
            parity ^= encoded[k - 1]
          }
        }
        encoded[pos - 1] = parity
      }

      return encoded.join('')
    }

    const hammingDecode = (data: string): string => {
      const bits = data.split('').map(Number)
      const n = bits.length
      const r = Math.ceil(Math.log2(n))

      let errorPos = 0
      for (let i = 0; i < r; i++) {
        const pos = Math.pow(2, i)
        let parity = 0
        for (let j = pos; j <= n; j += pos * 2) {
          for (let k = j; k < j + pos && k <= n; k++) {
            parity ^= bits[k - 1]
          }
        }
        if (parity !== 0) {
          errorPos += pos
        }
      }

      if (errorPos !== 0) {
        bits[errorPos - 1] = 1 - bits[errorPos - 1]
      }

      const decoded = []
      for (let i = 1; i <= n; i++) {
        if ((i & (i - 1)) !== 0) {
          decoded.push(bits[i - 1])
        }
      }

      return decoded.join('')
    }

    const reedSolomonEncode = (data: string): string => {
      // Simplified Reed-Solomon encoding (just for demonstration)
      const k = Math.floor(data.length / 2)
      const parity = data.slice(0, k).split('').map((bit, index) => 
        bit === data[data.length - 1 - index] ? '0' : '1'
      ).join('')
      return data + parity
    }

    const reedSolomonDecode = (data: string): string => {
      // Simplified Reed-Solomon decoding (just for demonstration)
      const k = Math.floor(data.length / 3)
      const original = data.slice(0, 2 * k)
      const parity = data.slice(2 * k)
      let errors = 0
      for (let i = 0; i < k; i++) {
        if (parity[i] !== (original[i] === original[2 * k - 1 - i] ? '0' : '1')) {
          errors++
        }
      }
      return errors <= Math.floor(k / 2) ? original : 'Uncorrectable error'
    }

    const convolutionalEncode = (data: string): string => {
      // Simple convolutional encoder with rate 1/2 and constraint length 3
      const encoded = []
      const state = [0, 0]
      for (const bit of data) {
        const input = parseInt(bit)
        encoded.push((input ^ state[0] ^ state[1]).toString())
        encoded.push((input ^ state[1]).toString())
        state.unshift(input)
        state.pop()
      }
      return encoded.join('')
    }

    const convolutionalDecode = (data: string): string => {
      // Simplified Viterbi decoder (just for demonstration)
      const decoded = []
      for (let i = 0; i < data.length; i += 2) {
        const received = parseInt(data.slice(i, i + 2), 2)
        decoded.push((received >> 1).toString())
      }
      return decoded.join('')
    }

    if (!/^[01]+$/.test(input)) {
      setError('Please enter a valid binary number')
      setEncoded('')
      setDecoded('')
      setAnimationStep(0)
      return
    }

    if (input.length === 0) {
      setError('Please enter a binary number')
      setEncoded('')
      setDecoded('')
      setAnimationStep(0)
      return
    }

    let encodedData: string
    if (eccType === 'hamming') {
      encodedData = hammingEncode(input)
    } else if (eccType === 'reed-solomon') {
      encodedData = reedSolomonEncode(input)
    } else {
      encodedData = convolutionalEncode(input)
    }
    setEncoded(encodedData)

    // Simulate errors based on errorProbability
    let dataWithError = encodedData.split('')
    if (Math.random() < errorProbability) {
      const startPos = Math.floor(Math.random() * (encodedData.length - burstErrorLength + 1))
      for (let i = 0; i < burstErrorLength; i++) {
        dataWithError[startPos + i] = dataWithError[startPos + i] === '0' ? '1' : '0'
      }
    }
    dataWithError = dataWithError.join('')

    let decodedData: string
    if (eccType === 'hamming') {
      decodedData = hammingDecode(dataWithError)
    } else if (eccType === 'reed-solomon') {
      decodedData = reedSolomonDecode(dataWithError)
    } else {
      decodedData = convolutionalDecode(dataWithError)
    }
    setDecoded(decodedData)

    setError('')
    setAnimationStep(1)
    setSimulationCount(prev => prev + 1)
    setSuccessRate(prev => {
      const newSuccessCount = prev * (simulationCount / 100) + (decodedData === input ? 1 : 0)
      return Math.round((newSuccessCount / (simulationCount + 1)) * 100)
    })
  }

  useEffect(() => {
    if (animationStep > 0 && animationStep < 4) {
      const timer = setTimeout(() => setAnimationStep(animationStep + 1), 1500)
      return () => clearTimeout(timer)
    }
  }, [animationStep])

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500 flex flex-col items-center justify-center p-4">
      <Link href="/" className="absolute top-4 left-4 text-white hover:text-blue-200 transition-colors">
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
            <CardTitle className="text-2xl text-blue-600">ECC Simulation</CardTitle>
            <CardDescription>Simulate Error-Correcting Codes</CardDescription>
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
                    <label htmlFor="ecc-type" className="block text-sm font-medium text-gray-700">ECC Type</label>
                    <Select onValueChange={(value) => setEccType(value as 'hamming' | 'reed-solomon' | 'convolutional')} defaultValue={eccType}>
                      <SelectTrigger id="ecc-type">
                        <SelectValue placeholder="Select ECC type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hamming">Hamming Code</SelectItem>
                        <SelectItem value="reed-solomon">Reed-Solomon Code</SelectItem>
                        <SelectItem value="convolutional">Convolutional Code</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label htmlFor="input" className="block text-sm font-medium text-gray-700">Input (binary)</label>
                    <Input
                      id="input"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Enter binary data"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label htmlFor="error-probability" className="block text-sm font-medium text-gray-700">
                      Error Probability: {errorProbability.toFixed(2)}
                    </label>
                    <Slider
                      id="error-probability"
                      min={0}
                      max={1}
                      step={0.01}
                      value={[errorProbability]}
                      onValueChange={(value) => setErrorProbability(value[0])}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Adjust the probability of errors occurring in the encoded data. Higher values increase the likelihood of bit flips.
                    </p>
                  </div>
                  <div>
                    <label htmlFor="burst-error-length" className="block text-sm font-medium text-gray-700">
                      Burst Error Length: {burstErrorLength}
                    </label>
                    <Slider
                      id="burst-error-length"
                      min={1}
                      max={10}
                      step={1}
                      value={[burstErrorLength]}
                      onValueChange={(value) => setBurstErrorLength(value[0])}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Set the length of burst errors. Longer bursts are more challenging for some ECC methods to correct.
                    </p>
                  </div>
                  {error && <p className="text-red-500">{error}</p>}
                  {encoded && (
                    <div className="space-y-2">
                      <motion.p 
                        className="font-semibold text-green-600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: animationStep >= 1 ? 1 : 0 }}
                      >
                        Encoded: {encoded}
                      </motion.p>
                      <motion.p 
                        className="font-semibold text-red-600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: animationStep >= 2 ? 1 : 0 }}
                      >
                        Transmitted (with potential errors):
                        {encoded.split('').map((bit, index) => (
                          <span 
                            key={index}
                            className={bit !== decoded[index] ? 'bg-red-200' : ''}
                          >
                            {bit}
                          </span>
                        ))}
                      </motion.p>
                      <motion.p 
                        className="font-semibold text-blue-600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: animationStep >= 3 ? 1 : 0 }}
                      >
                        Decoded: {decoded}
                      </motion.p>
                    </div>
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
                  <h3 className="text-lg font-semibold">Error-Correcting Codes (ECC)</h3>
                  <p>ECC are used to detect and correct errors in data transmission or storage. This simulation demonstrates three types of ECC:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li><strong>Hamming Code:</strong> Can detect up to two simultaneous bit errors and correct single-bit errors.</li>
                    <li><strong>Reed-Solomon Code:</strong> Excellent at correcting burst errors in block-based transmissions.</li>
                    <li><strong>Convolutional Code:</strong> Suited for real-time error correction in streaming data.</li>
                  </ul>
                  <p>Adjust the error probability and burst error length to see how different ECC methods perform under various error conditions.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button onClick={simulateECC} className="w-full bg-blue-500 hover:bg-blue-600 text-white">Simulate ECC</Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

