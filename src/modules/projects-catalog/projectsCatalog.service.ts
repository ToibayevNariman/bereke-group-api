import { PrismaClient, Prisma, Locale, CatalogBulletType, CatalogMediaType } from '@prisma/client'
import type { ApiProjectsProject, ApiProjectsResponse } from './projectsCatalog.types'

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

    const apiProjects: ApiProjectsProject[] = ordered.map((p, idx) => {
      const tr = p.translations[0]
      const styleName = p.style?.translations?.[0]?.name ?? p.style?.code ?? ''
      const materialName = p.material?.translations?.[0]?.name ?? p.material?.code ?? ''

      const gallery = p.media
        .filter((m) => m.type === CatalogMediaType.GALLERY_IMAGE)
        .sort((a, b) => (a.isCover === b.isCover ? a.sortOrder - b.sortOrder : a.isCover ? -1 : 1))

      const floorPlans = p.media
        .filter((m) => m.type === CatalogMediaType.FLOOR_PLAN)
        .sort((a, b) => a.sortOrder - b.sortOrder)

      const facades = p.media
        .filter((m) => m.type === CatalogMediaType.FACADE)
        .sort((a, b) => a.sortOrder - b.sortOrder)

      const videoThumb = p.media.find((m) => m.type === CatalogMediaType.VIDEO_THUMBNAIL)

      const bulletRows = p.bullets.flatMap((b) => {
        const text = b.translations[0]?.text
        if (!text) return []
        return [{ type: b.type, sortOrder: b.sortOrder, text }]
      })
      const grouped = groupBulletsByType(bulletRows)

      const constructionMaterials = p.materials.map((pm) => {
        const code = pm.material.code
        const value = pm.material.translations[0]?.name ?? code
        return { id: constructionMaterialIdFromCode(code), value }
      })

      return {
        id: String(idx + 1),
        name: tr?.name ?? p.code,
        images: gallery.map((m) => m.url),
        style: styleName,
        area: Number(p.areaM2),
        floors: p.floors,
        material: materialName,
        price: Number(p.priceAmount),
        characteristics: tr?.characteristics ?? '',
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
          floorPlans: floorPlans.map((m, i) => ({
            id: String(i + 1),
            url: m.url,
            title: titleByLocale(locale, 'floorPlan', i)
          })),
          facades: facades.map((m, i) => ({
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
        },
        featured: p.featured
      }
    })

    return { projects: apiProjects }
  }
}
