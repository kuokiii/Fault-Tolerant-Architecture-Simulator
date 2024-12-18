'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter, ZAxis } from 'recharts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

const initialData = [
  { name: 'ECC', faultDetection: 95, faultCorrection: 90, overhead: 15, latency: 2, complexity: 70, powerConsumption: 20 },
  { name: 'TMR', faultDetection: 99, faultCorrection: 98, overhead: 30, latency: 3, complexity: 60, powerConsumption: 40 },
  { name: 'Checksum', faultDetection: 80, faultCorrection: 0, overhead: 5, latency: 1, complexity: 30, powerConsumption: 10 },
  { name: 'Parity', faultDetection: 50, faultCorrection: 0, overhead: 3, latency: 1, complexity: 20, powerConsumption: 5 },
]

export default function PerformanceAnalysis() {
  const [data, setData] = useState(initialData)
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null)
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([])

  useEffect(() => {
    // Generate time series data for the last 10 time points
    const generateTimeSeriesData = () => {
      const newData = []
      for (let i = 0; i < 10; i++) {
        const timePoint = {
          time: new Date(Date.now() - (9 - i) * 1000 * 60 * 60).toISOString().slice(11, 19), // Last 10 hours
        }
        initialData.forEach(technique => {
          timePoint[technique.name] = Math.floor(Math.random() * 100)
        })
        newData.push(timePoint)
      }
      setTimeSeriesData(newData)
    }

    generateTimeSeriesData()
    const interval = setInterval(generateTimeSeriesData, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  const updateData = () => {
    setData(data.map(item => ({
      ...item,
      faultDetection: Math.floor(Math.random() * 20) + 80,
      faultCorrection: Math.min(Math.floor(Math.random() * 20) + 80, item.faultDetection),
      overhead: Math.floor(Math.random() * 30) + 5,
      latency: Math.floor(Math.random() * 3) + 1,
      complexity: Math.floor(Math.random() * 50) + 20,
      powerConsumption: Math.floor(Math.random() * 40) + 5,
    })))
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-400 to-blue-500 flex flex-col items-center justify-center p-4">
      <Link href="/" className="absolute top-4 left-4 text-white hover:text-indigo-200 transition-colors">
        <Button variant="outline" className="bg-black text-white hover:bg-gray-800">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </Link>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <Card className="bg-white bg-opacity-90 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-600">Performance Analysis</CardTitle>
            <CardDescription>Comparison of Fault-Tolerant Techniques</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="charts" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="charts">Charts</TabsTrigger>
                <TabsTrigger value="info">Info</TabsTrigger>
              </TabsList>
              <TabsContent value="charts">
                <div className="space-y-8">
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend onClick={(e) => setSelectedMetric(e.dataKey)} />
                      <Line 
                        type="monotone" 
                        dataKey="faultDetection" 
                        stroke="#8884d8" 
                        name="Fault Detection (%)"
                        strokeWidth={selectedMetric === 'faultDetection' ? 4 : 2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="faultCorrection" 
                        stroke="#82ca9d" 
                        name="Fault Correction (%)"
                        strokeWidth={selectedMetric === 'faultCorrection' ? 4 : 2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="overhead" 
                        stroke="#ffc658" 
                        name="Overhead (%)"
                        strokeWidth={selectedMetric === 'overhead' ? 4 : 2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="latency" fill="#8884d8" name="Latency (ms)" />
                      <Bar dataKey="complexity" fill="#82ca9d" name="Complexity" />
                      <Bar dataKey="powerConsumption" fill="#ffc658" name="Power Consumption (W)" />
                    </BarChart>
                  </ResponsiveContainer>

                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart cx={300} cy={250} outerRadius={150} width={600} height={500} data={data}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="name" />
                      <PolarRadiusAxis />
                      <Radar name="Fault Detection" dataKey="faultDetection" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      <Radar name="Fault Correction" dataKey="faultCorrection" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                      <Radar name="Overhead" dataKey="overhead" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>

                  <ResponsiveContainer width="100%" height={400}>
                    <ScatterChart>
                      <CartesianGrid />
                      <XAxis dataKey="overhead" name="Overhead (%)" />
                      <YAxis dataKey="faultDetection" name="Fault Detection (%)" />
                      <ZAxis dataKey="powerConsumption" range={[60, 400]} name="Power Consumption (W)" />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Legend />
                      <Scatter name="Techniques" data={data} fill="#8884d8" />
                    </ScatterChart>
                  </ResponsiveContainer>

                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {initialData.map((technique, index) => (
                        <Line 
                          key={technique.name}
                          type="monotone" 
                          dataKey={technique.name} 
                          stroke={`hsl(${index * 90}, 70%, 50%)`}
                          strokeWidth={2}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              <TabsContent value="info">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Performance Metrics Explained</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li><strong>Fault Detection:</strong> The ability to identify errors in the system.</li>
                    <li><strong>Fault Correction:</strong> The capability to fix detected errors.</li>
                    <li><strong>Overhead:</strong> Additional resources required by the fault-tolerant technique.</li>
                    <li><strong>Latency:</strong> Time delay introduced by the fault-tolerant mechanism.</li>
                    <li><strong>Complexity:</strong> The intricacy of implementing and maintaining the technique.</li>
                    <li><strong>Power Consumption:</strong> Energy required to operate the fault-tolerant system.</li>
                  </ul>
                  <p>The charts provide a comprehensive comparison of different fault-tolerant techniques across these metrics. The scatter plot shows the relationship between overhead, fault detection, and power consumption, while the time series chart displays performance trends over time.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              This analysis compares fault detection and correction capabilities, 
              overhead costs, latency, complexity, and power consumption for different fault-tolerant techniques. 
              The time series chart shows the performance trends over the last 10 hours.
            </p>
            <Button onClick={updateData} className="bg-blue-500 hover:bg-blue-600 text-white">
              Simulate New Data
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

