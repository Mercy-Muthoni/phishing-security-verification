import { createFileRoute } from '@tanstack/react-router'
import { Route as rootRoute } from './routes/__root'
import { Route as indexRoute } from './routes/index'
import { Route as educationRoute } from './routes/education'
import { Route as newsRoute } from './routes/news'
import { Route as tipsRoute } from './routes/tips'
import { Route as reportRoute } from './routes/report'
import { Route as verifyLinkRoute } from './routes/verify-link'
import { Route as adminLoginRoute } from './routes/admin-login'
import { Route as adminDashboardRoute } from './routes/admin-dashboard'

export const routeTree = rootRoute.addChildren([
  indexRoute,
  educationRoute,
  newsRoute,
  tipsRoute,
  reportRoute,
  verifyLinkRoute,
  adminLoginRoute,
  adminDashboardRoute,
])