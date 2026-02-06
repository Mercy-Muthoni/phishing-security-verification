import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/news')({
  component: NewsPage,
})

function NewsPage() {
  return <div>News Page</div>
}