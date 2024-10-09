import Home from './pages/Home'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SnackbarProvider } from 'notistack'

function App() {
  const router = createBrowserRouter(
    [
      {
        path: '/',
        element: <Home />
      }
    ]
  )

  return (
    <>
      <div className="fixed overflow-hidden top-0 left-0 z-[-2] h-screen w-screen rotate-180 transform bg-white bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(22,163,74,.5)_100%)]"></div>
      <SnackbarProvider>
        <RouterProvider router={router} />
      </SnackbarProvider>
    </>
  )
}

export default App
