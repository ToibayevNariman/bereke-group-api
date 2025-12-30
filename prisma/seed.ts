import {
  CatalogMediaType,
  CatalogProjectStatus,
  CatalogBulletType,
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

const PROJECT_DETAILS_V2 = {
  bedrooms: 4,
  translations: {
    en: {
      description:
        'Modern two-story house designed for comfortable family living. Thoughtful layout, open spaces, and panoramic windows create a sense of freedom and connection with nature. The project balances aesthetics, functionality, and construction efficiency, making it ideal for contemporary homeowners.',
      implementationText:
        'This project has already been adapted and implemented for real sites in Almaty region. Our clients appreciate the balance of design, functionality, and construction quality.',
      timeline: {
        designPhaseValue: '2–3 months',
        constructionValue: '10–12 months',
        fullCycleValue: '12–15 months'
      },
      videoTitle: 'Alpine Ridge - Virtual Tour'
    },
    ru: {
      description:
        'Современный двухэтажный дом, созданный для комфортной семейной жизни. Продуманная планировка, открытые пространства и панорамные окна создают ощущение свободы и связи с природой. Проект сочетает эстетику, функциональность и эффективность строительства, поэтому отлично подходит для современных домовладельцев.',
      implementationText:
        'Этот проект уже адаптирован и реализован на реальных участках в Алматинской области. Наши клиенты ценят баланс дизайна, функциональности и качества строительства.',
      timeline: {
        designPhaseValue: '2–3 месяца',
        constructionValue: '10–12 месяцев',
        fullCycleValue: '12–15 месяцев'
      },
      videoTitle: 'Alpine Ridge — виртуальный тур'
    },
    kk: {
      description:
        'Отбасыға жайлы өмір сүруге арналған заманауи екі қабатты үй. Ойластырылған жоспар, кең ашық аймақтар және панорамалық терезелер еркіндік сезімін беріп, табиғатпен байланыс орнатады. Жоба эстетика, функционалдылық және құрылыс тиімділігін үйлестіріп, заманауи үй иелеріне лайық.',
      implementationText:
        'Бұл жоба Алматы облысындағы нақты учаскелерге бейімделіп, іске асырылған. Клиенттеріміз дизайн, функционалдылық және құрылыс сапасының тепе-теңдігін жоғары бағалайды.',
      timeline: {
        designPhaseValue: '2–3 ай',
        constructionValue: '10–12 ай',
        fullCycleValue: '12–15 ай'
      },
      videoTitle: 'Alpine Ridge — виртуалды тур'
    }
  },
  bullets: {
    STRUCTURAL_CONCEPT: {
      en: [
        'Symmetrical structural layout for balanced load distribution',
        'Reinforced concrete core providing lateral stability',
        'Optimized mass distribution to minimize seismic forces',
        'Foundation system adaptable to local soil conditions'
      ],
      ru: [
        'Симметричная несущая схема для равномерного распределения нагрузок',
        'Железобетонное ядро жёсткости для устойчивости к боковым нагрузкам',
        'Оптимизированное распределение массы для снижения сейсмических воздействий',
        'Фундаментная система, адаптируемая под местные грунтовые условия'
      ],
      kk: [
        'Жүктемені тең бөлу үшін симметриялы көтергіш құрылымдық схема',
        'Көлденең күштерге тұрақтылық беретін темірбетон қаттылық өзегі',
        'Сейсмикалық әсерді азайтуға арналған масса таралуының оңтайландырылуы',
        'Жергілікті топырақ жағдайына бейімделетін іргетас жүйесі'
      ]
    },
    WHO_FOR: {
      en: [
        'Families with 2–3 children seeking spacious living',
        'Suburban or hillside plots with scenic surroundings',
        'Clients who prefer modern architecture and design',
        'Homeowners seeking reliable turnkey construction services'
      ],
      ru: [
        'Семьям с 2–3 детьми, которым нужно больше пространства',
        'Для загородных или склоновых участков с живописным окружением',
        'Клиентам, предпочитающим современную архитектуру и дизайн',
        'Тем, кто ищет надёжное строительство «под ключ»'
      ],
      kk: [
        '2–3 баласы бар, кең өмір сүру кеңістігін қалайтын отбасыларға',
        'Қала сыртындағы немесе еңісті жердегі, көрікті табиғаты бар учаскелерге',
        'Заманауи сәулет пен дизайнды ұнататын клиенттерге',
        'Сенімді «кілтпен тапсыру» құрылыс қызметін қалайтын үй иелеріне'
      ]
    },
    PRICE_INCLUDES: {
      en: [
        'Complete design works and documentation',
        'All construction works and materials',
        'Engineering systems and solutions',
        'Technical supervision and quality control'
      ],
      ru: [
        'Полный комплекс проектных работ и документации',
        'Все строительные работы и материалы',
        'Инженерные системы и решения',
        'Технический надзор и контроль качества'
      ],
      kk: [
        'Жобалау жұмыстары мен құжаттаманың толық пакеті',
        'Барлық құрылыс жұмыстары мен материалдар',
        'Инженерлік жүйелер мен шешімдер',
        'Техникалық қадағалау және сапаны бақылау'
      ]
    }
  },
  constructionMaterials: [
    { code: 'FOUNDATION', sortOrder: 0 },
    { code: 'WALLS', sortOrder: 1 },
    { code: 'SLAB', sortOrder: 2 },
    { code: 'ROOF', sortOrder: 3 }
  ],
  media: {
    floorPlans: [
      'https://images.unsplash.com/photo-1721244653580-79577d2822a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3VzZSUyMGZsb29yJTIwcGxhbiUyMGJsdWVwcmludHxlbnwxfHx8fDE3NjY2NDc4NTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1721244653580-79577d2822a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmFsJTIwZmxvb3IlMjBwbGFufGVufDF8fHx8MTc2NjY4NzA0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    facades: [
      'https://images.unsplash.com/photo-1646731463677-68cbe0017996?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWlsZGluZyUyMGZhY2FkZSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NjY3NTU1MDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1722421492323-eaf9c401befe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGZyb250JTIwZWxldmF0aW9ufGVufDF8fHx8MTc2Njc1NTUwNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    videoThumbnailUrl:
      'https://images.unsplash.com/photo-1610264146566-c233419fb1c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3VzZSUyMGNvbnN0cnVjdGlvbiUyMHZpZGVvfGVufDF8fHx8MTc2Njc1NTUwNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    videoDuration: '4:32'
  }
} as const

const CONSTRUCTION_MATERIAL_SEED = [
  {
    code: 'FOUNDATION',
    translations: {
      ru: 'Монолитная плита',
      kk: 'Монолитті плита',
      en: 'Monolithic slab'
    }
  },
  {
    code: 'WALLS',
    translations: {
      ru: 'Кирпич + бетон',
      kk: 'Кірпіш + бетон',
      en: 'Brick + concrete'
    }
  },
  {
    code: 'SLAB',
    translations: {
      ru: 'Железобетон',
      kk: 'Темірбетон',
      en: 'Reinforced concrete'
    }
  },
  {
    code: 'ROOF',
    translations: {
      ru: 'Плоская кровля',
      kk: 'Жазық шатыр',
      en: 'Flat roof'
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

function parseDurationSeconds(value: string | null | undefined): number | null {
  if (!value) return null
  const raw = value.trim()
  if (!raw) return null

  // Supports mm:ss or hh:mm:ss
  const parts = raw.split(':').map((p) => p.trim())
  if (parts.length < 2 || parts.length > 3) return null

  const nums = parts.map((p) => Number.parseInt(p, 10))
  if (nums.some((n) => !Number.isFinite(n) || n < 0)) return null

  if (nums.length === 2) {
    const [m, s] = nums
    if (s >= 60) return null
    return m * 60 + s
  }

  const [h, m, s] = nums
  if (m >= 60 || s >= 60) return null
  return h * 3600 + m * 60 + s
}

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

  const constructionMaterialsByCode = new Map(
    (
      await prisma.projectsCatalogConstructionMaterial.findMany({
        select: { id: true, code: true }
      })
    ).map((x) => [x.code, x.id])
  )

  for (const project of PROJECTS_CATALOG_MOCK_PROJECTS) {
    const styleId = stylesByCode.get(project.styleCode) ?? null
    const materialId = materialsByCode.get(project.materialCode) ?? null

    const details = PROJECT_DETAILS_V2

    await prisma.$transaction(async (tx) => {
      const saved = await tx.projectsCatalog.upsert({
        where: { code: project.code },
        update: {
          status: CatalogProjectStatus.PUBLISHED,
          featured: project.featured,
          areaM2: project.area.toFixed(2),
          floors: project.floors,
          bedrooms: details.bedrooms,
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
          bedrooms: details.bedrooms,
          priceAmount: BigInt(project.priceAmount),
          priceCurrency: project.priceCurrency,
          styleId,
          materialId
        }
      })

      for (const locale of locales) {
        const translation = project.translations[locale]
        const detailsT = details.translations[locale]
        await tx.projectsCatalogTranslation.upsert({
          where: { projectId_locale: { projectId: saved.id, locale } },
          update: {
            name: translation.name,
            characteristics: translation.characteristics,
            description: detailsT.description,
            implementationText: detailsT.implementationText,
            timelineDesignPhaseValue: detailsT.timeline.designPhaseValue,
            timelineConstructionValue: detailsT.timeline.constructionValue,
            timelineFullCycleValue: detailsT.timeline.fullCycleValue,
            videoTitle: detailsT.videoTitle
          },
          create: {
            projectId: saved.id,
            locale,
            name: translation.name,
            characteristics: translation.characteristics,
            description: detailsT.description,
            implementationText: detailsT.implementationText,
            timelineDesignPhaseValue: detailsT.timeline.designPhaseValue,
            timelineConstructionValue: detailsT.timeline.constructionValue,
            timelineFullCycleValue: detailsT.timeline.fullCycleValue,
            videoTitle: detailsT.videoTitle
          }
        })
      }

      await tx.projectsCatalogMedia.deleteMany({ where: { projectId: saved.id } })

      const durationSeconds = parseDurationSeconds(details.media.videoDuration)
      const mediaData = [
        ...project.images.map((url, index) => ({
          projectId: saved.id,
          type: CatalogMediaType.GALLERY_IMAGE,
          url,
          sortOrder: index,
          title: null,
          durationSeconds: null,
          isCover: index === 0
        })),
        ...details.media.floorPlans.map((url, index) => ({
          projectId: saved.id,
          type: CatalogMediaType.FLOOR_PLAN,
          url,
          sortOrder: index,
          title: null,
          durationSeconds: null,
          isCover: false
        })),
        ...details.media.facades.map((url, index) => ({
          projectId: saved.id,
          type: CatalogMediaType.FACADE,
          url,
          sortOrder: index,
          title: null,
          durationSeconds: null,
          isCover: false
        })),
        {
          projectId: saved.id,
          type: CatalogMediaType.VIDEO_THUMBNAIL,
          url: details.media.videoThumbnailUrl,
          sortOrder: 0,
          title: null,
          durationSeconds,
          isCover: false
        }
      ]

      await tx.projectsCatalogMedia.createMany({ data: mediaData })

      // Replace bullets (translations are cascade-deleted).
      await tx.projectsCatalogBullet.deleteMany({ where: { projectId: saved.id } })

      const bulletSpecs: Array<{ type: CatalogBulletType; textsByLocale: any }> = [
        {
          type: CatalogBulletType.STRUCTURAL_CONCEPT,
          textsByLocale: details.bullets.STRUCTURAL_CONCEPT
        },
        {
          type: CatalogBulletType.WHO_FOR,
          textsByLocale: details.bullets.WHO_FOR
        },
        {
          type: CatalogBulletType.PRICE_INCLUDES,
          textsByLocale: details.bullets.PRICE_INCLUDES
        }
      ]

      for (const spec of bulletSpecs) {
        const enList: string[] = spec.textsByLocale.en
        for (let i = 0; i < enList.length; i++) {
          await tx.projectsCatalogBullet.create({
            data: {
              projectId: saved.id,
              type: spec.type,
              sortOrder: i,
              translations: {
                create: locales.map((locale) => ({
                  locale,
                  text: spec.textsByLocale[locale][i]
                }))
              }
            }
          })
        }
      }

      // Replace construction materials (project-specific set/order).
      await tx.projectsCatalogProjectConstructionMaterial.deleteMany({
        where: { projectId: saved.id }
      })

      const joinRows = details.constructionMaterials.map((m) => {
        const materialId = constructionMaterialsByCode.get(m.code)
        if (!materialId) {
          throw new Error(`Missing construction material seed: ${m.code}`)
        }

        return {
          projectId: saved.id,
          materialId,
          sortOrder: m.sortOrder
        }
      })

      await tx.projectsCatalogProjectConstructionMaterial.createMany({ data: joinRows })
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
