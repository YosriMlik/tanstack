import { createFileRoute, Link } from '@tanstack/react-router'



export const Route = createFileRoute('/about')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <h1>About page</h1>
      <Link to='/'>Go back home</Link>
      <div style={{ height: "70vh" }}></div>
    </>
  )
}
