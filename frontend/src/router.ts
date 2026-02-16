import { createRoute, createRootRoute, createRouter } from '@tanstack/react-router'
import { RootLayout } from './routes/__root'
import { HomePage } from './routes/index'
import { EducationPage } from './routes/education'
import { NewsPage } from './routes/news'
import { TipsPage } from './routes/tips'
import { ReportPage } from './routes/report'
import { VerifyLinkPage } from './routes/verify-link'
import { AdminLoginPage } from './routes/admin-login'
import { AdminDashboardPage } from './routes/admin-dashboard'

const rootRoute = createRootRoute({
  component: RootLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const educationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'education',
  component: EducationPage,
})

const newsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'news',
  component: NewsPage,
})

const tipsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'tips',
  component: TipsPage,
})

const reportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'report',
  component: ReportPage,
})

const verifyLinkRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'verify-link',
  component: VerifyLinkPage,
})

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'admin-login',
  component: AdminLoginPage,
})

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'admin-dashboard',
  component: AdminDashboardPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  educationRoute,
  newsRoute,
  tipsRoute,
  reportRoute,
  verifyLinkRoute,
  adminLoginRoute,
  adminDashboardRoute,
])

export const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
