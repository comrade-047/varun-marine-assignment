import { Routes, Route, NavLink, Outlet } from 'react-router-dom';

const RoutesTab = () => <div>Routes Tab Content</div>;
const CompareTab = () => <div>Compare Tab Content</div>;
const BankingTab = () => <div>Banking Tab Content</div>;
const PoolingTab = () => <div>Pooling Tab Content</div>;

function Layout() {
  const tabs = [
    { name: 'Routes', path: '/' },
    { name: 'Compare', path: '/compare' },
    { name: 'Banking', path: '/banking' },
    { name: 'Pooling', path: '/pooling' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">FuelEU Maritime</h1>
            <div className="flex space-x-4">
              {tabs.map((tab) => (
                <NavLink
                  key={tab.name}
                  to={tab.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
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

      {/* Page Content */}
      <main className="container mx-auto max-w-7xl p-4 sm:px-6 lg:px-8 mt-4">
        <div className="bg-white p-6 shadow rounded-lg">
          <Outlet /> {/* This renders the active tab's component */}
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