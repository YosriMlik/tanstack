import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// Import the generated route tree
import { routeTree } from './routeTree.gen.ts'

import './styles.css'
import reportWebVitals from './reportWebVitals.ts'

// Configure NProgress
NProgress.configure({
  showSpinner: false,
  minimum: 0.08,
  easing: 'ease',
  speed: 200,
  trickle: true,
  trickleSpeed: 100,
  parent: 'body',
  template: '<div class="bar" role="bar"></div>',
})

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})


// More granular event handling
router.subscribe('onBeforeLoad', ({ pathChanged }) => {
  if (pathChanged) {
    NProgress.start()
  }
})

router.subscribe('onLoad', () => {
  NProgress.set(0.7) // Set to 70% when content starts loading
})

router.subscribe('onResolved', () => {
  NProgress.done()
})

// Handle initial load
router.subscribe('onLoad', ({ toLocation }) => {
  if (toLocation.href === window.location.href) {
    NProgress.done()
  }
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()