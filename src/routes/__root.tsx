import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import logo from '../logo.svg'
import { Link } from '@tanstack/react-router'
import '../App.css'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="App">
        <div className="App-main">
            <header style={{ padding: '1rem 0', textAlign: 'center' }}>
                <img src={logo} className="App-logo" alt="logo"/>
                <nav>
                    <Link to="/" style={{ marginRight: 12 }}>Posts</Link>
                    <Link to="/about">About</Link>
                </nav>
            </header>
            <Outlet />
        </div>      
      </div>
      <TanStackRouterDevtools />
    </>
  ),
})
