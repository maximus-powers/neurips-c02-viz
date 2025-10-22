"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Users, Leaf, ArrowUpDown, ArrowUp, ArrowDown, TreePine } from "lucide-react"
import { FaWalking, FaHome, FaBuilding } from "react-icons/fa"
import { TbBuildingFactory2 } from "react-icons/tb"
import { MdElectricBolt } from "react-icons/md"
import { CreativeVisualization } from "@/components/creative-visualization"
import { MetricsKey } from "@/components/metrics-key"

type ModelData = {
  model_name: string
  clean_name: string
  company: string
  company_logo: string | null
  year: number
  carbon_emissions_kg: number
  emission_type: string
}

export default function Main() {
  const [data, setData] = useState<ModelData[]>([])
  
  const getCompanyInfo = (modelName: string) => {
    const companyMap = {
      "BERT (base)": { company: "Google", logo: "/google.svg", cleanName: "BERT (base)" },
      "BERT-Large": { company: "Google", logo: "/google.svg", cleanName: "BERT-Large" },
      "OpenAI GPT-2": { company: "OpenAI", logo: "/openai.svg", cleanName: "GPT-2" },
      "RoBERTa (Facebook AI)": { company: "Meta", logo: "/meta.svg", cleanName: "RoBERTa" },
      "OpenAI GPT-3": { company: "OpenAI", logo: "/openai.svg", cleanName: "GPT-3" },
      "Bloom (Big Science Initiative) (176B)": { company: "Big Science Initiative", logo: "/bloom.webp", cleanName: "Bloom (176B)" },
      "OPT (175B)": { company: "Meta", logo: "/meta.svg", cleanName: "OPT (175B)" },
      "DeepMind Gopher (280B)": { company: "DeepMind", logo: "/deepmind.svg", cleanName: "Gopher (280B)" },
      "OpenAI GPT-4": { company: "OpenAI", logo: "/openai.svg", cleanName: "GPT-4" },
      "Meta Llama 2 (70B)": { company: "Meta", logo: "/meta.svg", cleanName: "Llama 2 (70B)" },
      "Llama 3.1 405B": { company: "Meta", logo: "/meta.svg", cleanName: "Llama 3.1 405B" },
      "Meta Llama 3 (70B)": { company: "Meta", logo: "/meta.svg", cleanName: "Llama 3 (70B)" },
      "DeepSeek v3": { company: "DeepSeek", logo: "/deepseek.svg", cleanName: "DeepSeek v3" }
    }
    return companyMap[modelName as keyof typeof companyMap] || { company: "Unknown", logo: null, cleanName: modelName }
  }
  const [selectedScales, setSelectedScales] = useState<string[]>([])
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<"year" | "emissions" | "human_footprint" | "name">("emissions")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Constants for calculations
  const CO2_PER_TREE_PER_YEAR = 25 // kg
  const CO2_PER_PERSON_PER_DAY = 13.2 // kg

  const calculateTreesEquivalent = (carbonEmissionsKg: number) => {
    return carbonEmissionsKg / CO2_PER_TREE_PER_YEAR
  }

  const calculateHumanFootprintEquivalent = (carbonEmissionsKg: number) => {
    return carbonEmissionsKg / CO2_PER_PERSON_PER_DAY
  }

  const generateAnalogy = (carbonEmissionsKg: number) => {
    const people = calculateHumanFootprintEquivalent(carbonEmissionsKg)
    return `ECO₂= ${carbonEmissionsKg.toLocaleString()}kg/${CO2_PER_PERSON_PER_DAY}kg= daily CO₂ emissions of ${people.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} people`
  }

  const getModelScale = (emission: number): string => {
    if (emission <= 1000) return "Personal"
    if (emission <= 10000) return "Household"
    if (emission <= 100000) return "Commercial"
    if (emission <= 1000000) return "Industrial"
    return "Megascale"
  }

  const getScaleInfo = (scale: string) => {
    const scaleMap = {
      "Personal": { icon: FaWalking, color: "text-green-500", bgColor: "bg-green-100 dark:bg-green-900/30" },
      "Household": { icon: FaHome, color: "text-blue-500", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
      "Commercial": { icon: FaBuilding, color: "text-yellow-500", bgColor: "bg-yellow-100 dark:bg-yellow-900/30" },
      "Industrial": { icon: TbBuildingFactory2, color: "text-orange-500", bgColor: "bg-orange-100 dark:bg-orange-900/30" },
      "Megascale": { icon: MdElectricBolt, color: "text-red-500", bgColor: "bg-red-100 dark:bg-red-900/30" }
    }
    return scaleMap[scale as keyof typeof scaleMap]
  }

  const scales = ["Personal", "Household", "Commercial", "Industrial", "Megascale"]

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data: ModelData[]) => {
        const sortedData = data.sort((a, b) => a.year - b.year || a.carbon_emissions_kg - b.carbon_emissions_kg)
        setData(sortedData)
        setSelectedScales(scales)
        const companies = Array.from(new Set(sortedData.map(m => getCompanyInfo(m.model_name).company)))
        setSelectedCompanies(companies)
      })
  }, [])

  const displayedData = data
    .filter((model) => 
      selectedScales.includes(getModelScale(model.carbon_emissions_kg)) &&
      selectedCompanies.includes(getCompanyInfo(model.model_name).company)
    )
    .sort((a, b) => {
      let aValue: number | string, bValue: number | string
      
      switch (sortBy) {
        case "emissions":
          aValue = a.carbon_emissions_kg
          bValue = b.carbon_emissions_kg
          break
        case "human_footprint":
          aValue = calculateHumanFootprintEquivalent(a.carbon_emissions_kg)
          bValue = calculateHumanFootprintEquivalent(b.carbon_emissions_kg)
          break
        case "year":
          aValue = a.year
          bValue = b.year
          break
        case "name":
          aValue = a.model_name.toLowerCase()
          bValue = b.model_name.toLowerCase()
          break
        default:
          aValue = a.year
          bValue = b.year
      }

      let comparison = 0
      if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.localeCompare(bValue)
      } else {
        comparison = (aValue as number) - (bValue as number)
      }

      return sortDirection === "asc" ? comparison : -comparison
    })


  const handleScaleSelect = (scale: string, checked: boolean) => {
    setSelectedScales((prev) => (checked ? [...prev, scale] : prev.filter((s) => s !== scale)))
  }


  const handleCompanySelect = (company: string, checked: boolean) => {
    setSelectedCompanies((prev) => {
      const newSelection = checked ? [...prev, company] : prev.filter((c) => c !== company)
      
      const allCompanies = Array.from(new Set(data.map(m => getCompanyInfo(m.model_name).company)))
      const companiesWithLogos = allCompanies.filter(c => {
        const sampleModel = data.find(m => getCompanyInfo(m.model_name).company === c)
        const companyInfo = getCompanyInfo(sampleModel?.model_name || '')
        return companyInfo?.logo
      })
      const companiesWithoutLogos = allCompanies.filter(c => {
        const sampleModel = data.find(m => getCompanyInfo(m.model_name).company === c)
        const companyInfo = getCompanyInfo(sampleModel?.model_name || '')
        return !companyInfo?.logo
      })
      const hasSelectedVisibleCompany = companiesWithLogos.some(c => newSelection.includes(c))
      
      if (hasSelectedVisibleCompany) {
        const finalSelection = [...new Set([...newSelection, ...companiesWithoutLogos])]
        return finalSelection
      } else {
        return newSelection.filter(c => companiesWithLogos.includes(c))
      }
    })
  }

  const handleSort = (newSortBy: typeof sortBy) => {
    if (sortBy === newSortBy) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(newSortBy)
      setSortDirection(newSortBy === "emissions" || newSortBy === "human_footprint" ? "desc" : "asc")
    }
  }

  const getSortIcon = (field: typeof sortBy) => {
    if (sortBy !== field) return <ArrowUpDown className="h-3 w-3" />
    return sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 md:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">LM Carbon Footprint Visualizer</h1>
        <p className="text-xl sm:text-lg text-gray-600 dark:text-gray-400">
          Intuitive comparisons of CO₂ emissions from training of popular language models, with creative analogs.
        </p>
      </header>

      <main className="max-w-7xl mx-auto">
        <Card className="mb-8 pt-5">
          <CardContent className="flex flex-col items-center gap-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center sm:justify-between w-full">
              <div className="flex flex-col items-center w-full sm:w-auto">
                <Label className="mb-2 block text-lg sm:text-sm font-medium">Filter by Scale</Label>
                <div className="flex flex-wrap gap-2 justify-center w-full">
                  {scales.map((scale) => {
                    const isSelected = selectedScales.includes(scale)
                    const scaleInfo = getScaleInfo(scale)
                    const IconComponent = scaleInfo?.icon
                    return (
                      <button
                        key={scale}
                        onClick={() => handleScaleSelect(scale, !isSelected)}
                        className={`w-12 h-12 sm:w-10 sm:h-10 rounded-lg transition-all flex items-center justify-center ${
                          isSelected 
                            ? scaleInfo?.bgColor 
                            : 'opacity-40 grayscale bg-gray-100 dark:bg-gray-800'
                        }`}
                        title={scale}
                      >
                        {IconComponent && (
                          <IconComponent 
                            className={`w-6 h-6 sm:w-5 sm:h-5 ${isSelected ? scaleInfo?.color : 'text-gray-400'}`}
                            style={{ fontSize: '20px' }}
                          />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="flex flex-col items-center w-full sm:w-auto">
                <Label className="mb-2 block text-lg sm:text-sm font-medium">Filter by Company</Label>
                <div className="flex flex-wrap gap-2 justify-center w-full">
                  {Array.from(new Set(data.map(m => getCompanyInfo(m.model_name).company)))
                    .filter(company => {
                      const sampleModel = data.find(m => getCompanyInfo(m.model_name).company === company)
                      const companyInfo = getCompanyInfo(sampleModel?.model_name || '')
                      return companyInfo?.logo
                    })
                    .map((company) => {
                    const isSelected = selectedCompanies.includes(company)
                    const sampleModel = data.find(m => getCompanyInfo(m.model_name).company === company)
                    const companyInfo = getCompanyInfo(sampleModel?.model_name || '')
                    return (
                      <button
                        key={company}
                        onClick={() => handleCompanySelect(company, !isSelected)}
                        className={`w-12 h-12 sm:w-8 sm:h-8 rounded-lg transition-all ${
                          isSelected 
                            ? 'opacity-100' 
                            : 'opacity-40 grayscale'
                        }`}
                        title={company}
                      >
                        <img 
                          src={companyInfo.logo!} 
                          alt={company} 
                          className="w-full h-full object-contain rounded"
                        />
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="flex flex-col items-center w-full sm:w-auto">
                <Label className="mb-2 block text-lg sm:text-sm font-medium">Sort By</Label>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSort("emissions")}
                    className={`text-base sm:text-xs w-full sm:w-auto ${sortBy === "emissions" ? "bg-blue-100 dark:bg-blue-900/20" : ""}`}
                  >
                    Emissions {getSortIcon("emissions")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSort("year")}
                    className={`text-base sm:text-xs w-full sm:w-auto ${sortBy === "year" ? "bg-blue-100 dark:bg-blue-900/20" : ""}`}
                  >
                    Year {getSortIcon("year")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSort("name")}
                    className={`text-base sm:text-xs w-full sm:w-auto ${sortBy === "name" ? "bg-blue-100 dark:bg-blue-900/20" : ""}`}
                  >
                    Name {getSortIcon("name")}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <MetricsKey />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedData.map((model) => (
            <Card key={model.model_name} className="flex flex-col hover:shadow-lg transition-shadow relative">
              <CardHeader>
                <CardTitle className="text-xl">{getCompanyInfo(model.model_name).cleanName}</CardTitle>
                <CardDescription className="text-base sm:text-sm">{model.year}</CardDescription>
                {getCompanyInfo(model.model_name).logo && (
                  <div className="absolute top-4 right-4">
                    <img 
                      src={getCompanyInfo(model.model_name).logo!} 
                      alt={getCompanyInfo(model.model_name).company} 
                      className="w-8 h-8 object-contain rounded"
                      title={getCompanyInfo(model.model_name).company}
                    />
                  </div>
                )}
              </CardHeader>
              <CardContent className="flex-grow flex flex-col items-center text-center">
                <div className="mb-4 h-[200px] w-full">
                  <CreativeVisualization
                    model_name={model.model_name}
                    carbon_emissions_kg={model.carbon_emissions_kg}
                    trees_equivalent={calculateTreesEquivalent(model.carbon_emissions_kg)}
                    allEmissions={displayedData.map(m => m.carbon_emissions_kg)}
                  />
                </div>
                <div className="space-y-3 text-base sm:text-sm text-left w-full">
                  <p className="font-bold text-lg text-center">
                    {model.carbon_emissions_kg.toLocaleString()} kg CO₂eq
                  </p>
                  <p className="text-sm sm:text-xs text-center text-gray-500 dark:text-gray-400">
                    <span className={`px-2 py-1 rounded-full text-sm sm:text-xs ${
                      model.emission_type.startsWith('R') 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
                        : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                    }`}>
                      {model.emission_type.startsWith('R') ? 'Reported' : 'Estimated'}
                    </span>
                  </p>
                  <div className="flex items-start space-x-2 pt-3 border-t">
                    <Leaf className="h-4 w-4 mt-1 text-green-500 flex-shrink-0" />
                    <span>
                      Equivalent to <strong>{Math.round(calculateTreesEquivalent(model.carbon_emissions_kg)).toLocaleString()} trees'</strong>{" "}
                      annual CO₂ absorption.
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Users className="h-4 w-4 mt-1 text-orange-500 flex-shrink-0" />
                    <span>
                      Equivalent to one person's CO₂ footprint over{" "}
                      <strong>
                        {(() => {
                          const days = Math.round(calculateHumanFootprintEquivalent(model.carbon_emissions_kg))
                          if (days >= 365) {
                            const years = Math.round(days / 365)
                            return `${years.toLocaleString()} ${years === 1 ? 'year' : 'years'}`
                          } else if (days > 30) {
                            const months = Math.round(days / 30.44)
                            return `${months.toLocaleString()} ${months === 1 ? 'month' : 'months'}`
                          } else {
                            return `${days.toLocaleString()} ${days === 1 ? 'day' : 'days'}`
                          }
                        })()}
                      </strong>.
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm sm:text-xs text-gray-500 dark:text-gray-400 italic">{generateAnalogy(model.carbon_emissions_kg)}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
         
      </main>

    </div>
  )
}