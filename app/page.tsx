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
import { Users, Leaf, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
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
  trees_equivalent: number
  human_footprint_equivalent: number
  analogy: string
}

export default function Main() {
  const [data, setData] = useState<ModelData[]>([])
  
  // Company mapping until data structure is updated
  const getCompanyInfo = (modelName: string) => {
    const companyMap = {
      "BERT (base)": { company: "Google", logo: "/google.svg", cleanName: "BERT (base)" },
      "ULMfit": { company: "Independent", logo: null, cleanName: "ULMfit" },
      "OpenAI GPT": { company: "OpenAI", logo: "/openai.svg", cleanName: "GPT" },
      "GPT-2": { company: "OpenAI", logo: "/openai.svg", cleanName: "GPT-2" },
      "RoBERTa (Facebook AI)": { company: "Meta", logo: "/meta.svg", cleanName: "RoBERTa" },
      "GPT-3": { company: "OpenAI", logo: "/openai.svg", cleanName: "GPT-3" },
      "Bloom (Big Science Initiative)": { company: "Big Science Initiative", logo: "/bloom.webp", cleanName: "Bloom" },
      "OPT": { company: "Meta", logo: "/meta.svg", cleanName: "OPT" },
      "Gopher": { company: "DeepMind", logo: "/deepmind.svg", cleanName: "Gopher" },
      "Bard (powered by LaMDA 2)": { company: "Google", logo: "/google.svg", cleanName: "Bard" },
      "Gemini (Google)": { company: "Google", logo: "/google.svg", cleanName: "Gemini" },
      "GPT-4": { company: "OpenAI", logo: "/openai.svg", cleanName: "GPT-4" },
      "Llama 2": { company: "Meta", logo: "/meta.svg", cleanName: "Llama 2" },
      "Orca (Microsoft)": { company: "Microsoft", logo: "/microsoft.svg", cleanName: "Orca" },
      "PaLM 2 (Google)": { company: "Google", logo: "/google.svg", cleanName: "PaLM 2" },
      "Aya 101 (Cohere for AI)": { company: "Cohere", logo: "/cohere.png", cleanName: "Aya 101" },
      "Llama 3": { company: "Meta", logo: "/meta.svg", cleanName: "Llama 3" },
      "DeepSeek-R1 (DeepSeek-AI)": { company: "DeepSeek", logo: "/deepseek.svg", cleanName: "DeepSeek-R1" }
    }
    return companyMap[modelName as keyof typeof companyMap] || { company: "Unknown", logo: null, cleanName: modelName }
  }
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [selectedScales, setSelectedScales] = useState<string[]>([])
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<"year" | "emissions" | "human_footprint" | "name">("emissions")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Helper function to get the scale/tier of a model
  const getModelScale = (emission: number): string => {
    if (emission <= 1000) return "Personal"
    if (emission <= 10000) return "Household"
    if (emission <= 100000) return "Commercial"
    if (emission <= 1000000) return "Industrial"
    return "Megascale"
  }

  const scales = ["Personal", "Household", "Commercial", "Industrial", "Megascale"]

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data: ModelData[]) => {
        const sortedData = data.sort((a, b) => a.year - b.year || a.carbon_emissions_kg - b.carbon_emissions_kg)
        setData(sortedData)
        setSelectedModels(sortedData.map((m) => m.model_name))
        setSelectedScales(scales)
        const companies = Array.from(new Set(sortedData.map(m => getCompanyInfo(m.model_name).company)))
        setSelectedCompanies(companies)
      })
  }, [])

  const displayedData = data
    .filter((model) => 
      selectedModels.includes(model.model_name) && 
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
          aValue = a.human_footprint_equivalent
          bValue = b.human_footprint_equivalent
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

  const handleSelectAll = (checked: boolean) => {
    setSelectedModels(checked ? data.map((m) => m.model_name) : [])
  }

  const handleModelSelect = (modelName: string, checked: boolean) => {
    setSelectedModels((prev) => (checked ? [...prev, modelName] : prev.filter((m) => m !== modelName)))
  }

  const handleScaleSelectAll = (checked: boolean) => {
    setSelectedScales(checked ? scales : [])
  }

  const handleScaleSelect = (scale: string, checked: boolean) => {
    setSelectedScales((prev) => (checked ? [...prev, scale] : prev.filter((s) => s !== scale)))
  }

  const handleCompanySelectAll = (checked: boolean) => {
    const companies = Array.from(new Set(data.map(m => getCompanyInfo(m.model_name).company)))
    setSelectedCompanies(checked ? companies : [])
  }

  const handleCompanySelect = (company: string, checked: boolean) => {
    setSelectedCompanies((prev) => (checked ? [...prev, company] : prev.filter((c) => c !== company)))
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
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Intuitive comparisons of CO₂ emissions from training of popular language models, with creative analogs.
        </p>
      </header>

      <main className="max-w-7xl mx-auto">
        <Card className="mb-8 pt-5">
          <CardContent className="flex flex-col items-center gap-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center sm:justify-between w-full">
              <div className="flex flex-col items-center">
                <Label className="mb-2 block">Filter Models</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                      {`Select Models (${selectedModels.length} of ${data.length} selected)`}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 max-h-96 overflow-y-auto">
                    <DropdownMenuLabel>Models</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={selectedModels.length === data.length}
                      onCheckedChange={handleSelectAll}
                    >
                      Select All
                    </DropdownMenuCheckboxItem>
                    {data.map((model) => (
                      <DropdownMenuCheckboxItem
                        key={model.model_name}
                        checked={selectedModels.includes(model.model_name)}
                        onCheckedChange={(checked) => handleModelSelect(model.model_name, checked)}
                      >
                        {model.model_name}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex flex-col items-center">
                <Label className="mb-2 block">Filter by Scale</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                      {`Select Scales (${selectedScales.length} of ${scales.length} selected)`}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 max-h-96 overflow-y-auto">
                    <DropdownMenuLabel>Emission Scales</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={selectedScales.length === scales.length}
                      onCheckedChange={handleScaleSelectAll}
                    >
                      Select All
                    </DropdownMenuCheckboxItem>
                    {scales.map((scale) => (
                      <DropdownMenuCheckboxItem
                        key={scale}
                        checked={selectedScales.includes(scale)}
                        onCheckedChange={(checked) => handleScaleSelect(scale, checked)}
                      >
                        {scale}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex flex-col items-center">
                <Label className="mb-2 block">Filter by Company</Label>
                <div className="flex flex-wrap gap-2 justify-center">
                  {Array.from(new Set(data.map(m => getCompanyInfo(m.model_name).company))).map((company) => {
                    const isSelected = selectedCompanies.includes(company)
                    const sampleModel = data.find(m => getCompanyInfo(m.model_name).company === company)
                    const companyInfo = getCompanyInfo(sampleModel?.model_name || '')
                    return (
                      <button
                        key={company}
                        onClick={() => handleCompanySelect(company, !isSelected)}
                        className={`w-8 h-8 rounded-lg transition-all ${
                          isSelected 
                            ? 'opacity-100' 
                            : 'opacity-40 grayscale'
                        }`}
                        title={company}
                      >
                        {companyInfo?.logo && (
                          <img 
                            src={companyInfo.logo} 
                            alt={company} 
                            className="w-full h-full object-contain rounded"
                          />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="flex flex-col items-center">
                <Label className="mb-2 block">Sort By</Label>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSort("emissions")}
                    className={`text-xs ${sortBy === "emissions" ? "bg-blue-100 dark:bg-blue-900/20" : ""}`}
                  >
                    Emissions {getSortIcon("emissions")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSort("year")}
                    className={`text-xs ${sortBy === "year" ? "bg-blue-100 dark:bg-blue-900/20" : ""}`}
                  >
                    Year {getSortIcon("year")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSort("name")}
                    className={`text-xs ${sortBy === "name" ? "bg-blue-100 dark:bg-blue-900/20" : ""}`}
                  >
                    Name {getSortIcon("name")}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedData.map((model) => (
            <Card key={model.model_name} className="flex flex-col hover:shadow-lg transition-shadow relative">
              <CardHeader>
                <CardTitle className="text-xl">{getCompanyInfo(model.model_name).cleanName}</CardTitle>
                <CardDescription>{model.year}</CardDescription>
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
                    trees_equivalent={model.trees_equivalent}
                    allEmissions={displayedData.map(m => m.carbon_emissions_kg)}
                  />
                </div>
                <div className="space-y-3 text-sm text-left w-full">
                  <p className="font-bold text-lg text-center">
                    {model.carbon_emissions_kg.toLocaleString()} kg CO₂eq
                  </p>
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                    <span className={`px-2 py-1 rounded-full text-xs ${
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
                      Equivalent to <strong>{Math.round(model.trees_equivalent).toLocaleString()} trees'</strong>{" "}
                      annual CO₂ absorption.
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Users className="h-4 w-4 mt-1 text-orange-500 flex-shrink-0" />
                    <span>
                      Equivalent to one person's daily CO₂ footprint for{" "}
                      <strong>
                        {(() => {
                          const days = Math.round(model.human_footprint_equivalent)
                          if (days >= 365) {
                            const years = Math.round(days / 365)
                            return `${years.toLocaleString()} ${years === 1 ? 'year' : 'years'}`
                          } else if (days > 30) {
                            const months = Math.round(days / 30.44) // Average days per month
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
                <p className="text-xs text-gray-500 dark:text-gray-400 italic">{model.analogy}</p>
              </CardFooter>
            </Card>
          ))}
        </div>

        <MetricsKey />
         
      </main>

      <footer className="text-center mt-12 py-4 border-t border-gray-200 dark:border-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Data sourced from publicly available information. Visualizations show true proportional scale.
        </p>
      </footer>
    </div>
  )
}