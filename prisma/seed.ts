import { PrismaClient, UserType } from '@prisma/client'

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

async function main(): Promise<void> {
  await seedRoles()
  await seedSystemAdmin()
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
