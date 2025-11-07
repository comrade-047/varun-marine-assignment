import { Routes, Route, NavLink, Outlet } from 'react-router-dom';

import { RoutesTab } from './adapters/ui/tabs/RoutesTab'
import { CompareTab } from './adapters/ui/tabs/CompareTab';
import { BankingTab } from './adapters/ui/tabs/BankingTab';
import { PoolingTab } from './adapters/ui/tabs/PoolingTab';

function Layout() {
  const tabs = [
    { name: 'Routes', path: '/' },
    { name: 'Compare', path: '/compare' },
    { name: 'Banking', path: '/banking' },
    { name: 'Pooling', path: '/pooling' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7F6] text-gray-900">
      <header className="sticky top-0 z-50 bg-[#001E2B]/95 backdrop-blur-md shadow-lg border-b border-[#023430]/40">
        <nav className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl sm:text-2xl font-semibold text-[#00ED64] tracking-tight">
              FuelEU Maritime
            </h1>

            <div className="flex space-x-2 sm:space-x-4">
              {tabs.map((tab) => (
                <NavLink
                  key={tab.name}
                  to={tab.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-[#00ED64]/10 text-[#00ED64] border border-[#00ED64]/40 shadow-sm'
                        : 'text-gray-300 hover:text-[#00ED64]/80 hover:bg-[#023430]/40'
                    }`
                  }
                >
                  {tab.name}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>
      </header>

      <main className="container mx-auto max-w-7xl p-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white p-6 shadow-md rounded-2xl border border-gray-100">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<RoutesTab />} />
        <Route path="compare" element={<CompareTab />} />
        <Route path="banking" element={<BankingTab />} />
        <Route path="pooling" element={<PoolingTab />} />
      </Route>
    </Routes>
  );
}

export default App;