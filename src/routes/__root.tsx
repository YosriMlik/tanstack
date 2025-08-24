import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Link } from '@tanstack/react-router'


export const Route = createRootRoute({
  component: () => (
    <>
      <div className="App">
        <div className="App-main">
            <nav className="App-navbar">
              <div className="nav-links">
                <Link to="/">
                  Home
                </Link>
                <Link to="/about">
                  About
                </Link>
              </div>
            </nav>
            <Outlet />
        </div>      
      </div>
      <TanStackRouterDevtools />
    </>
  ),
})
