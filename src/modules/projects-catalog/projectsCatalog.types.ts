export type ApiProjectsMediaItem = {
  id: string
  url: string
  title: string
}

export type ApiProjectsProjectDetails = {
  bedrooms: number
  description: string
  structuralConceptBullets: string[]
  constructionMaterials: Array<{ id: string; value: string }>
  whoForBullets: string[]
  timeline: {
    designPhaseValue: string
    constructionValue: string
    fullCycleValue: string
  }
  priceIncludesBullets: string[]
  floorPlans: ApiProjectsMediaItem[]
  facades: ApiProjectsMediaItem[]
  video: {
    thumbnailUrl: string
    duration: string
    title: string
  }
  implementationText: string
}

export type ApiProjectsProject = {
  id: string
  name: string
  images: string[]
  style: string
  area: number
  floors: number
  material: string
  price: number
  characteristics: string
  details?: ApiProjectsProjectDetails
  featured?: boolean
}

export type ApiProjectsResponse = {
  projects: ApiProjectsProject[]
}
