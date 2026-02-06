import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/education')({
  component: EducationPage,
})

function EducationPage() {
  return <div>Education Page</div>
}