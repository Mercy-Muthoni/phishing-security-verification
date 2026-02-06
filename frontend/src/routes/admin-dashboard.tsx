import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin-dashboard')({
  component: AdminDashboardPage,
})

function AdminDashboardPage() {
  return <div>Admin Dashboard Page</div>
}