import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tips')({
  component: TipsPage,
})

function TipsPage() {
  return <div>Tips Page</div>
}