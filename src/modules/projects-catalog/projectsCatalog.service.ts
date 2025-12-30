import { PrismaClient, Prisma, Locale, CatalogBulletType, CatalogMediaType } from '@prisma/client'
import type {
  ApiProjectsHomeResponse,
  ApiProjectsProject,
  ApiProjectsProjectSummary,
  ApiProjectsResponse
} from './projectsCatalog.types'

type ProjectWithIncludes = Prisma.ProjectsCatalogGetPayload<{
  include: {
    translations: { where: { locale: Locale } }
    style: { include: { translations: { where: { locale: Locale } } } }
    material: { include: { translations: { where: { locale: Locale } } } }
    media: true
    bullets: { include: { translations: { where: { locale: Locale } } } }
    materials: { include: { material: { include: { translations: { where: { locale: Locale } } } } } }
  }
}>

const PROJECT_ORDER = [
  'ALPINE_RIDGE',
  'SKYLINE_ESTATE',
  'GREEN_VALLEY',
  'HORIZON_VILLA',
  'CEDAR_POINT',
  'MAPLE_RESIDENCE'
] as const

const projectOrderIndex = new Map<string, number>(
  PROJECT_ORDER.map((code, idx) => [code, idx] as [string, number])
)

function formatDuration(seconds: number | null | undefined): string {
  if (!seconds || seconds <= 0) return ''
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function titleByLocale(
  locale: Locale,
  kind: 'floorPlan' | 'facade',
  index: number
): string {
  const i = index + 1

  if (kind === 'floorPlan') {
    if (locale === 'ru') return i === 1 ? 'План 1 этажа' : i === 2 ? 'План 2 этажа' : `План этажа ${i}`
    if (locale === 'kk') return i === 1 ? '1-қабат жоспары' : i === 2 ? '2-қабат жоспары' : `${i}-қабат жоспары`
    return i === 1 ? 'Ground Floor Plan' : i === 2 ? 'Second Floor Plan' : `Floor Plan ${i}`
  }

  if (locale === 'ru') return i === 1 ? 'Фасад спереди' : i === 2 ? 'Боковой фасад' : `Фасад ${i}`
  if (locale === 'kk') return i === 1 ? 'Алдыңғы қасбет' : i === 2 ? 'Бүйір қасбет' : `${i}-қасбет`
  return i === 1 ? 'Front Facade' : i === 2 ? 'Side Facade' : `Facade ${i}`
}

function constructionMaterialIdFromCode(code: string): string {
  switch (code) {
    case 'FOUNDATION':
      return 'foundation'
    case 'WALLS':
      return 'structure'
    case 'SLAB':
      return 'slabs'
    case 'ROOF':
      return 'roof'
    default:
      return code.toLowerCase()
  }
}

function groupBulletsByType(
  rows: Array<{ type: CatalogBulletType; sortOrder: number; text: string }>
): Record<CatalogBulletType, string[]> {
  const out: Record<CatalogBulletType, string[]> = {
    STRUCTURAL_CONCEPT: [],
    WHO_FOR: [],
    PRICE_INCLUDES: []
  }

  for (const row of rows) out[row.type].push(row.text)
  return out
}

export class ProjectsCatalogService {
  constructor(private readonly prisma: PrismaClient) {}

  async getProjectsCatalogHome(locale: Locale): Promise<ApiProjectsHomeResponse> {
    const projects = await this.prisma.projectsCatalog.findMany({
      where: { status: 'PUBLISHED', showOnHome: true },
      include: {
        translations: { where: { locale } },
        style: { include: { translations: { where: { locale } } } },
        material: { include: { translations: { where: { locale } } } },
        media: { orderBy: { sortOrder: 'asc' } }
      }
    })

    const apiProjects: ApiProjectsProjectSummary[] = this.mapProjects(projects, locale, {
      includeDetails: false
    })

    return { projects: apiProjects }
  }

  async getProjectsCatalog(locale: Locale): Promise<ApiProjectsResponse> {
    const projects: ProjectWithIncludes[] = await this.prisma.projectsCatalog.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        translations: { where: { locale } },
        style: { include: { translations: { where: { locale } } } },
        material: { include: { translations: { where: { locale } } } },
        media: { orderBy: { sortOrder: 'asc' } },
        bullets: {
          orderBy: { sortOrder: 'asc' },
          include: { translations: { where: { locale } } }
        },
        materials: {
          orderBy: { sortOrder: 'asc' },
          include: {
            material: {
              include: { translations: { where: { locale } } }
            }
          }
        }
      }
    })

    // stable order like frontend mock
    const ordered = [...projects].sort((a, b) => {
      const ai = projectOrderIndex.get(a.code) ?? 999
      const bi = projectOrderIndex.get(b.code) ?? 999
      return ai - bi
    })

    const apiProjects: ApiProjectsProject[] = this.mapProjects(ordered, locale, {
      includeDetails: true
    })

    return { projects: apiProjects }
  }

  private mapProjects(
    projects: Array<any>,
    locale: Locale,
    opts: { includeDetails: boolean }
  ): Array<any> {
    // stable order like frontend mock
    const ordered = [...projects].sort((a, b) => {
      const ai = projectOrderIndex.get(a.code) ?? 999
      const bi = projectOrderIndex.get(b.code) ?? 999
      return ai - bi
    })

    return ordered.map((p, idx) => {
      const tr = p.translations?.[0]
      const styleName = p.style?.translations?.[0]?.name ?? p.style?.code ?? ''
      const materialName = p.material?.translations?.[0]?.name ?? p.material?.code ?? ''

      const gallery = (p.media ?? [])
        .filter((m: any) => m.type === CatalogMediaType.GALLERY_IMAGE)
        .sort((a: any, b: any) =>
          a.isCover === b.isCover ? a.sortOrder - b.sortOrder : a.isCover ? -1 : 1
        )

      const base = {
        id: String(idx + 1),
        name: tr?.name ?? p.code,
        images: gallery.map((m: any) => m.url),
        style: styleName,
        area: Number(p.areaM2),
        floors: p.floors,
        material: materialName,
        price: Number(p.priceAmount),
        characteristics: tr?.characteristics ?? '',
        featured: p.featured,
        showOnHome: p.showOnHome
      } satisfies Omit<ApiProjectsProject, 'details'>

      if (!opts.includeDetails) {
        return base satisfies ApiProjectsProjectSummary
      }

      const floorPlans = (p.media ?? [])
        .filter((m: any) => m.type === CatalogMediaType.FLOOR_PLAN)
        .sort((a: any, b: any) => a.sortOrder - b.sortOrder)

      const facades = (p.media ?? [])
        .filter((m: any) => m.type === CatalogMediaType.FACADE)
        .sort((a: any, b: any) => a.sortOrder - b.sortOrder)

      const videoThumb = (p.media ?? []).find(
        (m: any) => m.type === CatalogMediaType.VIDEO_THUMBNAIL
      )

      const bulletRows = (p.bullets ?? []).flatMap((b: any) => {
        const text = b.translations?.[0]?.text
        if (!text) return []
        return [{ type: b.type, sortOrder: b.sortOrder, text }]
      })
      const grouped = groupBulletsByType(bulletRows)

      const constructionMaterials = (p.materials ?? []).map((pm: any) => {
        const code = pm.material.code
        const value = pm.material.translations?.[0]?.name ?? code
        return { id: constructionMaterialIdFromCode(code), value }
      })

      return {
        ...base,
        details: {
          bedrooms: p.bedrooms ?? 0,
          description: tr?.description ?? '',
          structuralConceptBullets: grouped.STRUCTURAL_CONCEPT,
          constructionMaterials,
          whoForBullets: grouped.WHO_FOR,
          timeline: {
            designPhaseValue: tr?.timelineDesignPhaseValue ?? '',
            constructionValue: tr?.timelineConstructionValue ?? '',
            fullCycleValue: tr?.timelineFullCycleValue ?? ''
          },
          priceIncludesBullets: grouped.PRICE_INCLUDES,
          floorPlans: floorPlans.map((m: any, i: number) => ({
            id: String(i + 1),
            url: m.url,
            title: titleByLocale(locale, 'floorPlan', i)
          })),
          facades: facades.map((m: any, i: number) => ({
            id: String(i + 1),
            url: m.url,
            title: titleByLocale(locale, 'facade', i)
          })),
          video: {
            thumbnailUrl: videoThumb?.url ?? '',
            duration: formatDuration(videoThumb?.durationSeconds),
            title: tr?.videoTitle ?? ''
          },
          implementationText: tr?.implementationText ?? ''
        }
      } satisfies ApiProjectsProject
    })
  }
}
