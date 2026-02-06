import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/report')({
  component: ReportPage,
})

function ReportPage() {
  return <div>Report Page</div>
}