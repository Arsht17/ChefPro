import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppStateProvider, useApp } from './state/AppState'
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { ChefModal } from './components/chef/ChefModal'
import { Toasts } from './components/ui/Toasts'
import { Home } from './routes/Home'
import { Collection } from './routes/Collection'
import { NotDesigned } from './routes/NotDesigned'

function Shell() {
  const { state, dispatch } = useApp()

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-bg-01">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[70] focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-text-inverse"
      >
        Skip to content
      </a>

      <Header onToggleSidebar={() => dispatch({ type: 'toggleSidebar' })} />

      <div className="flex min-h-0 flex-1">
        {/* Full-height rail: the row is the only thing that scrolls, so the
            nav stays put while the dashboard moves under it. */}
        <div className="hidden shrink-0 md:block">
          <Sidebar collapsed={state.sidebarCollapsed} />
        </div>

        <main
          id="main"
          className="scrollbar-primary min-w-0 flex-1 overflow-y-auto px-4 py-6 xl:px-8"
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collection" element={<Collection />} />
            <Route
              path="/discovery"
              element={
                <NotDesigned
                  title="Chef Discovery"
                  summary="Browse every chef on ChefPro, not just your recommendations."
                />
              }
            />
            <Route
              path="/academy"
              element={
                <NotDesigned
                  title="Chef Academy"
                  summary="Courses, the techniques library and structured learning paths."
                />
              }
            />
            <Route
              path="/recent"
              element={
                <NotDesigned
                  title="Recently Viewed"
                  summary="Chefs, techniques and recipes you have looked at lately."
                />
              }
            />
            <Route
              path="/plan"
              element={
                <NotDesigned
                  title="Your Plan"
                  summary="Your Plus membership, billing and what it unlocks."
                />
              }
            />
            <Route
              path="/settings"
              element={
                <NotDesigned
                  title="Settings"
                  summary="Account preferences and notifications."
                />
              }
            />
            <Route
              path="*"
              element={
                <NotDesigned
                  title="Page not found"
                  summary="That route is not part of ChefPro."
                />
              }
            />
          </Routes>
        </main>
      </div>

      <ChefModal />
      <Toasts />
    </div>
  )
}

export default function App() {
  return (
    <AppStateProvider>
      {/* HashRouter: GitHub Pages serves static files with no SPA rewrite, so
          a BrowserRouter deep link would 404 on refresh. */}
      <HashRouter>
        <Shell />
      </HashRouter>
    </AppStateProvider>
  )
}
