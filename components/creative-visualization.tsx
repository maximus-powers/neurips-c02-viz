"use client"

import { useMemo } from "react"
import { TreePine } from "lucide-react"
import { FaWalking, FaHome, FaBuilding } from "react-icons/fa"
import { TbBuildingFactory2 } from "react-icons/tb"
import { MdElectricBolt } from "react-icons/md"

interface CreativeVisualizationProps {
  model_name: string
  carbon_emissions_kg: number
  trees_equivalent: number
  allEmissions: number[]
}

export function CreativeVisualization({ model_name, carbon_emissions_kg, trees_equivalent, allEmissions }: CreativeVisualizationProps) {
  const { tier, icon, color, metaphor, sizePercent } = useMemo(() => {
    const emission = carbon_emissions_kg
    
    let currentTierEmissions: number[] = []
    if (emission <= 1000) {
      currentTierEmissions = allEmissions.filter(e => e <= 1000)
    } else if (emission <= 10000) {
      currentTierEmissions = allEmissions.filter(e => e > 1000 && e <= 10000)
    } else if (emission <= 100000) {
      currentTierEmissions = allEmissions.filter(e => e > 10000 && e <= 100000)
    } else if (emission <= 1000000) {
      currentTierEmissions = allEmissions.filter(e => e > 100000 && e <= 1000000)
    } else {
      currentTierEmissions = allEmissions.filter(e => e > 1000000)
    }
    
    const tierSizeRange = { min: 30, max: 90 }
    
    const normalizeWithinTier = (value: number, tierValues: number[], range: {min: number, max: number}) => {
      if (tierValues.length <= 1) return (range.min + range.max) / 2
      const minVal = Math.min(...tierValues)
      const maxVal = Math.max(...tierValues)
      if (minVal === maxVal) return (range.min + range.max) / 2
      const normalized = (value - minVal) / (maxVal - minVal)
      return range.min + (normalized * (range.max - range.min))
    }
    
    if (emission <= 1000) {
      return {
        tier: "Personal",
        icon: FaWalking,
        color: "text-green-500",
        metaphor: `${Math.round(emission / 2.3).toLocaleString()} liters of gasoline`,
        sizePercent: normalizeWithinTier(emission, currentTierEmissions, tierSizeRange)
      }
    } else if (emission <= 10000) {
      return {
        tier: "Household",
        icon: FaHome,
        color: "text-blue-500",
        metaphor: `${(emission / 4798).toFixed(1)} homes' annual electricity`,
        sizePercent: normalizeWithinTier(emission, currentTierEmissions, tierSizeRange)
      }
    } else if (emission <= 100000) {
      return {
        tier: "Commercial",
        icon: FaBuilding,
        color: "text-yellow-500",
        metaphor: `${(emission / 4600).toFixed(1)} cars driven for a year`,
        sizePercent: normalizeWithinTier(emission, currentTierEmissions, tierSizeRange)
      }
    } else if (emission <= 1000000) {
      return {
        tier: "Industrial",
        icon: TbBuildingFactory2,
        color: "text-orange-500",
        metaphor: `${Math.round(emission / 1180).toLocaleString()} round-trip flights NYC-London`,
        sizePercent: normalizeWithinTier(emission, currentTierEmissions, tierSizeRange)
      }
    } else {
      return {
        tier: "Megascale",
        icon: MdElectricBolt,
        color: "text-red-500",
        metaphor: `${(emission / 432648).toFixed(1)} hours of a coal power plant`,
        sizePercent: normalizeWithinTier(emission, currentTierEmissions, tierSizeRange)
      }
    }
  }, [carbon_emissions_kg, allEmissions])

  const IconComponent = icon
  
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      {/* Tier badge */}
      <div className={`text-xs px-2 py-1 rounded-full mb-2 ${
        tier === "Personal" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" :
        tier === "Household" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" :
        tier === "Commercial" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300" :
        tier === "Industrial" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300" :
        "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
      }`}>
        {tier} Scale
      </div>

      <div className="flex-1 flex items-center justify-center relative">
        <div 
          className={`relative flex items-center justify-center rounded-full ${
            tier === "Personal" ? "bg-green-50 dark:bg-green-900/20" :
            tier === "Household" ? "bg-blue-50 dark:bg-blue-900/20" :
            tier === "Commercial" ? "bg-yellow-50 dark:bg-yellow-900/20" :
            tier === "Industrial" ? "bg-orange-50 dark:bg-orange-900/20" :
            "bg-red-50 dark:bg-red-900/20"
          }`}
          style={{
            width: `${Math.min(140, sizePercent * 1.6)}px`,
            height: `${Math.min(140, sizePercent * 1.6)}px`
          }}
        >
          <IconComponent 
            className={color} 
            style={{ fontSize: `${Math.max(20, Math.min(72, sizePercent * 0.8))}px` }}
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 text-center">
          <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            {carbon_emissions_kg >= 1000000 ? `${(carbon_emissions_kg / 1000000).toFixed(1)}M` :
             carbon_emissions_kg >= 1000 ? `${(carbon_emissions_kg / 1000).toFixed(0)}k` :
             carbon_emissions_kg.toLocaleString()} kg
          </div>
        </div>
      </div>

      <div className="mt-2 text-xs text-center text-gray-600 dark:text-gray-400 px-2">
        ≈ {metaphor}
      </div>

      <div className="mt-1 flex items-center text-xs text-green-600 dark:text-green-400">
        <TreePine size={12} className="mr-1" />
        {Math.round(trees_equivalent).toLocaleString()} trees
      </div>
    </div>
  )
}