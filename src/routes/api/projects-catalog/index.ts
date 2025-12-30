import type { FastifyPluginAsync } from 'fastify'
import { registerProjectsCatalogRoutes } from '../../../modules/projects-catalog/projectsCatalog.routes'

const projectsCatalogRoutePlugin: FastifyPluginAsync = async (fastify): Promise<void> => {
  await registerProjectsCatalogRoutes(fastify, {})
}

export default projectsCatalogRoutePlugin
