import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/verify-link')({
  component: VerifyLinkPage,
})

function VerifyLinkPage() {
  return <div>Verify Link Page</div>
}