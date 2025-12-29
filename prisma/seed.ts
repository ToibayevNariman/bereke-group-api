import {
  CatalogMediaType,
  CatalogProjectStatus,
  Locale,
  PrismaClient,
  UserType
} from '@prisma/client'

const prisma = new PrismaClient()

const ROLE_SEED = [
  { code: 'ADMIN', name: 'Admin', description: 'Administrative access' },
  { code: 'ACCOUNTANT', name: 'Accountant', description: 'Accounting access' },
  { code: 'HR', name: 'HR', description: 'Human resources access' },
  { code: 'FOREMAN', name: 'Foreman', description: 'Foreman access' },
  { code: 'SITE_MANAGER', name: 'Site manager', description: 'Site management access' },
  { code: 'SENIOR_ON_SITE', name: 'Senior on site', description: 'Senior on-site access' },
  { code: 'PROCUREMENT', name: 'Procurement', description: 'Procurement access' }
] as const

const CATALOG_STYLE_SEED = [
  {
    code: 'MODERN',
    translations: {
      ru: 'Современный',
      kk: 'Заманауи',
      en: 'Modern'
    }
  },
  {
    code: 'MINIMALISM',
    translations: {
      ru: 'Минимализм',
      kk: 'Минимализм',
      en: 'Minimalism'
    }
  },
  {
    code: 'HI_TECH',
    translations: {
      ru: 'Хай-тек',
      kk: 'Хай-тек',
      en: 'Hi-tech'
    }
  },
  {
    code: 'CLASSIC',
    translations: {
      ru: 'Классика',
      kk: 'Классика',
      en: 'Classic'
    }
  }
] as const

const CATALOG_MATERIAL_SEED = [
  {
    code: 'MONOLITH',
    translations: {
      ru: 'Монолит',
      kk: 'Монолит',
      en: 'Monolith'
    }
  },
  {
    code: 'BRICK',
    translations: {
      ru: 'Кирпич',
      kk: 'Кірпіш',
      en: 'Brick'
    }
  },
  {
    code: 'AAC',
    translations: {
      ru: 'Газоблок',
      kk: 'Газоблок',
      en: 'AAC block'
    }
  },
  {
    code: 'COMBINED',
    translations: {
      ru: 'Комбинированные материалы',
      kk: 'Комбинацияланған материалдар',
      en: 'Combined materials'
    }
  }
] as const

const PROJECTS_CATALOG_MOCK_PROJECTS = [
  {
    code: 'ALPINE_RIDGE',
    area: 285,
    floors: 2,
    styleCode: 'MODERN',
    materialCode: 'MONOLITH',
    priceAmount: 45000000,
    priceCurrency: 'KZT',
    translations: {
      ru: {
        name: 'Alpine Ridge',
        characteristics: 'Панорамные окна, гараж на 2 машины'
      },
      kk: {
        name: 'Alpine Ridge',
        characteristics: 'Панорамалық терезелер, 2 көлікке арналған гараж'
      },
      en: {
        name: 'Alpine Ridge',
        characteristics: 'Panoramic windows, garage for 2 cars'
      }
    },
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGV4dGVyaW9yfGVufDF8fHx8MTc2NjYzMzQ4NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1564703048291-bcf7f001d83d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3VzZSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NjY2ODMwOTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1659720879214-62bfaf383b79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBob3VzZSUyMGRlc2lnbnxlbnwxfHx8fDE3NjY2ODMwOTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ]
  },
  {
    code: 'SKYLINE_ESTATE',
    area: 320,
    floors: 3,
    styleCode: 'CLASSIC',
    materialCode: 'BRICK',
    priceAmount: 58000000,
    priceCurrency: 'KZT',
    translations: {
      ru: {
        name: 'Skyline Estate',
        characteristics: 'Терраса, винный погреб, умный дом'
      },
      kk: {
        name: 'Skyline Estate',
        characteristics: 'Терраса, шарап жертөлесі, ақылды үй'
      },
      en: {
        name: 'Skyline Estate',
        characteristics: 'Terrace, wine cellar, smart home'
      }
    },
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwaG91c2V8ZW58MXx8fHwxNzY2NjgzMDk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1629964642991-4838222984e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmljayUyMGhvdXNlJTIwZmFjYWRlfGVufDF8fHx8MTc2NjY4MzA5NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1718066236079-9085195c389e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMG1vZGVybiUyMGhvbWV8ZW58MXx8fHwxNzY2NjgzMDk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ]
  },
  {
    code: 'GREEN_VALLEY',
    area: 195,
    floors: 1,
    styleCode: 'MINIMALISM',
    materialCode: 'AAC',
    priceAmount: 28000000,
    priceCurrency: 'KZT',
    translations: {
      ru: {
        name: 'Green Valley',
        characteristics: 'Энергоэффективный дом, солнечные панели'
      },
      kk: {
        name: 'Green Valley',
        characteristics: 'Энергия үнемдейтін үй, күн панельдері'
      },
      en: {
        name: 'Green Valley',
        characteristics: 'Energy efficient, solar panels'
      }
    },
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1659720879214-62bfaf383b79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBob3VzZSUyMGRlc2lnbnxlbnwxfHx8fDE3NjY2ODMwOTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGV4dGVyaW9yfGVufDF8fHx8MTc2NjYzMzQ4NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ]
  },
  {
    code: 'HORIZON_VILLA',
    area: 410,
    floors: 2,
    styleCode: 'HI_TECH',
    materialCode: 'COMBINED',
    priceAmount: 72000000,
    priceCurrency: 'KZT',
    translations: {
      ru: {
        name: 'Horizon Villa',
        characteristics: 'Бассейн, домашний кинотеатр, спортзал'
      },
      kk: {
        name: 'Horizon Villa',
        characteristics: 'Бассейн, үй кинотеатры, спортзал'
      },
      en: {
        name: 'Horizon Villa',
        characteristics: 'Pool, home cinema, gym'
      }
    },
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1564703048291-bcf7f001d83d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3VzZSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NjY2ODMwOTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1718066236079-9085195c389e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMG1vZGVybiUyMGhvbWV8ZW58MXx8fHwxNzY2NjgzMDk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwaG91c2V8ZW58MXx8fHwxNzY2NjgzMDk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ]
  },
  {
    code: 'CEDAR_POINT',
    area: 240,
    floors: 2,
    styleCode: 'MODERN',
    materialCode: 'BRICK',
    priceAmount: 38000000,
    priceCurrency: 'KZT',
    translations: {
      ru: {
        name: 'Cedar Point',
        characteristics: 'Камин, просторная терраса'
      },
      kk: {
        name: 'Cedar Point',
        characteristics: 'Камин, кең терраса'
      },
      en: {
        name: 'Cedar Point',
        characteristics: 'Fireplace, spacious terrace'
      }
    },
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1629964642991-4838222984e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmljayUyMGhvdXNlJTIwZmFjYWRlfGVufDF8fHx8MTc2NjY4MzA5NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGV4dGVyaW9yfGVufDF8fHx8MTc2NjYzMzQ4NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ]
  },
  {
    code: 'MAPLE_RESIDENCE',
    area: 175,
    floors: 1,
    styleCode: 'MINIMALISM',
    materialCode: 'AAC',
    priceAmount: 24000000,
    priceCurrency: 'KZT',
    translations: {
      ru: {
        name: 'Maple Residence',
        characteristics: 'Открытая планировка, вид на сад'
      },
      kk: {
        name: 'Maple Residence',
        characteristics: 'Ашық жоспарлау, бақ көрінісі'
      },
      en: {
        name: 'Maple Residence',
        characteristics: 'Open plan, garden view'
      }
    },
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1718066236079-9085195c389e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMG1vZGVybiUyMGhvbWV8ZW58MXx8fHwxNzY2NjgzMDk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1659720879214-62bfaf383b79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBob3VzZSUyMGRlc2lnbnxlbnwxfHx8fDE3NjY2ODMwOTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ]
  }
] as const

const CONSTRUCTION_MATERIAL_SEED = [
  {
    code: 'FOUNDATION',
    translations: {
      ru: 'Фундамент',
      kk: 'Іргетас',
      en: 'Foundation'
    }
  },
  {
    code: 'WALLS',
    translations: {
      ru: 'Стены',
      kk: 'Қабырғалар',
      en: 'Walls'
    }
  },
  {
    code: 'SLAB',
    translations: {
      ru: 'Плита перекрытия',
      kk: 'Қабатаралық плита',
      en: 'Slab'
    }
  },
  {
    code: 'ROOF',
    translations: {
      ru: 'Кровля',
      kk: 'Шатыр',
      en: 'Roof'
    }
  },
  {
    code: 'FACADE',
    translations: {
      ru: 'Фасад',
      kk: 'Қасбет',
      en: 'Facade'
    }
  },
  {
    code: 'WINDOWS',
    translations: {
      ru: 'Окна',
      kk: 'Терезелер',
      en: 'Windows'
    }
  }
] as const

async function seedRoles(): Promise<void> {
  for (const role of ROLE_SEED) {
    await prisma.role.upsert({
      where: { code: role.code },
      update: {
        name: role.name,
        description: role.description
      },
      create: {
        code: role.code,
        name: role.name,
        description: role.description
      }
    })
  }
}

async function seedSystemAdmin(): Promise<void> {
  const existing = await prisma.user.findFirst({
    where: { userType: UserType.SYSTEM_ADMIN }
  })

  if (existing) return

  const user = await prisma.user.create({
    data: {
      userType: UserType.SYSTEM_ADMIN,
      isActive: true,
      profile: {
        create: {
          lastName: 'Admin',
          firstName: 'System',
          middleName: null,
          // Placeholder 12-char IIN; change in real provisioning.
          iin: '000000000000'
        }
      },
      systemAdminCredential: {
        create: {
          // Placeholder hash; must be replaced in real provisioning.
          passwordHash: 'CHANGE_ME'
        }
      }
    }
  })

  await prisma.appSetting.upsert({
    where: { key: 'SYSTEM_ADMIN_USER_ID' },
    update: { value: user.id },
    create: { key: 'SYSTEM_ADMIN_USER_ID', value: user.id }
  })
}

async function seedProjectCatalogDictionaries(): Promise<void> {
  const locales: Locale[] = [Locale.ru, Locale.kk, Locale.en]

  for (const item of CATALOG_STYLE_SEED) {
    const style = await prisma.projectsCatalogStyle.upsert({
      where: { code: item.code },
      update: {},
      create: { code: item.code }
    })

    for (const locale of locales) {
      const name = item.translations[locale]
      await prisma.projectsCatalogStyleTranslation.upsert({
        where: { styleId_locale: { styleId: style.id, locale } },
        update: { name },
        create: { styleId: style.id, locale, name }
      })
    }
  }

  for (const item of CATALOG_MATERIAL_SEED) {
    const material = await prisma.projectsCatalogMaterial.upsert({
      where: { code: item.code },
      update: {},
      create: { code: item.code }
    })

    for (const locale of locales) {
      const name = item.translations[locale]
      await prisma.projectsCatalogMaterialTranslation.upsert({
        where: { materialId_locale: { materialId: material.id, locale } },
        update: { name },
        create: { materialId: material.id, locale, name }
      })
    }
  }

  for (const item of CONSTRUCTION_MATERIAL_SEED) {
    const material = await prisma.projectsCatalogConstructionMaterial.upsert({
      where: { code: item.code },
      update: { isActive: true },
      create: { code: item.code, isActive: true }
    })

    for (const locale of locales) {
      const name = item.translations[locale]
      await prisma.projectsCatalogConstructionMaterialTranslation.upsert({
        where: { materialId_locale: { materialId: material.id, locale } },
        update: { name },
        create: { materialId: material.id, locale, name }
      })
    }
  }
}

async function seedProjectCatalogMockProjects(): Promise<void> {
  const locales: Locale[] = [Locale.ru, Locale.kk, Locale.en]

  const stylesByCode = new Map(
    (await prisma.projectsCatalogStyle.findMany({ select: { id: true, code: true } })).map(
      (x) => [x.code, x.id]
    )
  )
  const materialsByCode = new Map(
    (
      await prisma.projectsCatalogMaterial.findMany({ select: { id: true, code: true } })
    ).map((x) => [x.code, x.id])
  )

  for (const project of PROJECTS_CATALOG_MOCK_PROJECTS) {
    const styleId = stylesByCode.get(project.styleCode) ?? null
    const materialId = materialsByCode.get(project.materialCode) ?? null

    await prisma.$transaction(async (tx) => {
      const saved = await tx.projectsCatalog.upsert({
        where: { code: project.code },
        update: {
          status: CatalogProjectStatus.PUBLISHED,
          featured: project.featured,
          areaM2: project.area.toFixed(2),
          floors: project.floors,
          priceAmount: BigInt(project.priceAmount),
          priceCurrency: project.priceCurrency,
          styleId,
          materialId
        },
        create: {
          code: project.code,
          status: CatalogProjectStatus.PUBLISHED,
          featured: project.featured,
          areaM2: project.area.toFixed(2),
          floors: project.floors,
          bedrooms: null,
          priceAmount: BigInt(project.priceAmount),
          priceCurrency: project.priceCurrency,
          styleId,
          materialId
        }
      })

      for (const locale of locales) {
        const translation = project.translations[locale]
        await tx.projectsCatalogTranslation.upsert({
          where: { projectId_locale: { projectId: saved.id, locale } },
          update: {
            name: translation.name,
            characteristics: translation.characteristics,
            description: translation.characteristics,
            implementationText: '',
            timelineDesignPhaseValue: '',
            timelineConstructionValue: '',
            timelineFullCycleValue: '',
            videoTitle: null
          },
          create: {
            projectId: saved.id,
            locale,
            name: translation.name,
            characteristics: translation.characteristics,
            description: translation.characteristics,
            implementationText: '',
            timelineDesignPhaseValue: '',
            timelineConstructionValue: '',
            timelineFullCycleValue: '',
            videoTitle: null
          }
        })
      }

      await tx.projectsCatalogMedia.deleteMany({ where: { projectId: saved.id } })
      await tx.projectsCatalogMedia.createMany({
        data: project.images.map((url, index) => ({
          projectId: saved.id,
          type: CatalogMediaType.GALLERY_IMAGE,
          url,
          sortOrder: index,
          title: null,
          durationSeconds: null,
          isCover: index === 0
        }))
      })
    })
  }
}

async function seedFirstEmployeeAdmin(): Promise<void> {
  const phoneE164 = '+77051509977'

  const placeholderIin = '890915301135'

  const adminRole = await prisma.role.findUnique({ where: { code: 'ADMIN' } })
  if (!adminRole) {
    throw new Error('Role ADMIN is missing. Seed roles first.')
  }

  const existingIdentity = await prisma.authIdentity.findUnique({
    where: { phoneE164 }
  })

  const hireDate = new Date('2018-01-01T00:00:00.000Z')

  if (!existingIdentity) {
    const user = await prisma.user.create({
      data: {
        userType: UserType.EMPLOYEE,
        isActive: true,
        profile: {
          create: {
            lastName: 'Тойбаев',
            firstName: 'Нариман',
            middleName: 'Болатович',
            iin: placeholderIin
          }
        },
        employee: {
          create: {
            hireDate
          }
        },
        identities: {
          create: {
            phoneE164,
            isPrimary: true,
            isVerified: true
          }
        }
      }
    })

    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: user.id, roleId: adminRole.id } },
      update: {},
      create: { userId: user.id, roleId: adminRole.id }
    })

    return
  }

  // If the identity exists, ensure the linked user has employee record and ADMIN role.
  const userId = existingIdentity.userId

  await prisma.user.update({
    where: { id: userId },
    data: {
      userType: UserType.EMPLOYEE,
      isActive: true,
      employee: {
        upsert: {
          update: { hireDate },
          create: { hireDate }
        }
      },
      profile: {
        upsert: {
          update: {
            lastName: 'Тойбаев',
            firstName: 'Нариман',
            middleName: 'Болатович'
          },
          create: {
            lastName: 'Тойбаев',
            firstName: 'Нариман',
            middleName: 'Болатович',
            iin: placeholderIin
          }
        }
      }
    }
  })

  await prisma.authIdentity.update({
    where: { id: existingIdentity.id },
    data: { isVerified: true, isPrimary: true }
  })

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId, roleId: adminRole.id } },
    update: {},
    create: { userId, roleId: adminRole.id }
  })
}

async function main(): Promise<void> {
  await seedRoles()
  await seedSystemAdmin()
  await seedFirstEmployeeAdmin()
  await seedProjectCatalogDictionaries()
  await seedProjectCatalogMockProjects()
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (err) => {
    // eslint-disable-next-line no-console
    console.error(err)
    await prisma.$disconnect()
    process.exit(1)
  })
