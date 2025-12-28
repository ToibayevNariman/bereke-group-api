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
