"use client"

import { useState, useEffect } from "react"
import { TreePine, ChevronDown, ChevronUp } from "lucide-react"
import { FaWalking, FaHome, FaBuilding } from "react-icons/fa"
import { TbBuildingFactory2 } from "react-icons/tb"
import { MdElectricBolt } from "react-icons/md"
import { IoInformationCircleOutline } from "react-icons/io5"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function MetricsKey() {
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsExpanded(window.innerWidth >= 640) // sm breakpoint
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])
  const tierMetrics = [
    {
      icon: TreePine,
      color: "text-grey-600",
      bgColor: "bg-zinc-700 text-white dark:bg-grey-900/20", 
      title: "Universal References",
      items: [
        "Estimating that 1 mature tree absorbs 23 kg CO₂ per year",
        "Estimating that average human daily footprint is 13.2 kg CO₂",
        "Estimating that 1 liter of gasoline emits 4.6 kg CO₂ when burned"
      ]
    },
    {
      icon: FaWalking,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      title: "Personal Scale (<1,000 kg)",
      items: [
        "< 217 liters of gasoline",
        "Estimating that 1 liter of gasoline emits 4.6 kg of CO₂",
        "On the scale of personal daily activities"
      ]
    },
    {
      icon: FaHome,
      color: "text-blue-500", 
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      title: "Household Scale (1k-10k kg)",
      items: [
        "1.4 homes' annual electricity consumption",
        "Estimating that 1 home uses 7,300 kg CO₂ of electricity per year",
        "On the scale of residential energy use"
      ]
    },
    {
      icon: FaBuilding,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20", 
      title: "Commercial Scale (10k-100k kg)",
      items: [
        "2.5 cars driven for a full year",
        "Estimating that 1 car driven for a year emits 40,000 kg CO₂",
        "On the scale of small business operations"
      ]
    },
    {
      icon: TbBuildingFactory2,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      title: "Industrial Scale (100k-1M kg)",
      items: [
        "11 round-trip flights NYC to London",
        "Estimating that 1 round-trip flight NYC-London emits 90,000 kg CO₂",
        "On the scale of manufacturing operations"
      ]
    },
    {
      icon: MdElectricBolt,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      title: "Megascale (1M+ kg)",
      items: [
        "Multiple millions of kg CO₂",
        "Industrial scale impact beyond normal comparisons",
        "On the scale of major power generation facilities"
      ]
    }
  ]

  const renderMetricSection = (metrics: typeof tierMetrics) => (
    <div className="mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((category, index) => {
          const IconComponent = category.icon
          return (
            <div key={index} className="space-y-3">
              <div className={`flex items-center gap-2 p-3 rounded-lg ${category.bgColor}`}>
                <IconComponent 
                  className={`h-5 w-5 ${category.color}`} 
                  style={{ fontSize: '20px' }}
                />
                <h4 className="font-semibold text-base sm:text-sm">{category.title}</h4>
              </div>
              <ul className="space-y-2 text-sm sm:text-xs text-gray-600 dark:text-gray-400">
                {category.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <Card className="mb-8">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <IoInformationCircleOutline className="h-5 w-5" />
            Reference Guide
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-base sm:text-sm"
          >
            {isExpanded ? (
              <>
                Hide <ChevronUp className="h-4 w-4 ml-1" />
              </>
            ) : (
              <>
                Show <ChevronDown className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          {renderMetricSection(tierMetrics)}
          
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-base sm:text-sm mb-4">References</h4>
            <div className="text-sm sm:text-xs text-gray-600 dark:text-gray-400">
              [1] <a href="https://www.register-dynamics.co.uk/blog/artificial-footprints-series-the-environmental-impact-of-ai" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">Register Dynamics - The Environmental Impact of AI</a>, [2] <a href="https://arxiv.org/pdf/2211.05100" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">ArXiv - Power Hungry Processing: Watts Driving the Cost of AI Deployment?</a>, [3] <a href="https://huggingface.co/meta-llama/Llama-2-70b" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">Hugging Face - Llama 2 70B Model</a>, [4] <a href="https://huggingface.co/meta-llama/Meta-Llama-3-70B" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">Hugging Face - Meta Llama 3 70B Model</a>, [5] <a href="https://www.worldometers.info/co2-emissions/co2-emissions-per-capita/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">Worldometers - CO₂ Emissions Per Capita</a>, <a href="https://www.epa.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">U.S. Environmental Protection Agency</a>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}