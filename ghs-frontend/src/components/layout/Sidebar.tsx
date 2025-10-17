import { NavLink } from 'react-router-dom';
import { Home, FileText, PlusCircle, CheckCircle, Users, Settings, LogOut } from 'lucide-react';

const navigation = [
  { name: 'Tableau de bord', href: '/dashboard', icon: Home },
  { name: 'Mes Demandes', href: '/requests', icon: FileText },
  { name: 'Nouvelle Demande', href: '/requests/new', icon: PlusCircle },
  { name: 'Validations N1', href: '/validations/n1', icon: CheckCircle },
  { name: 'Validations N2', href: '/validations/n2', icon: CheckCircle },
  { name: 'Employés', href: '/employees', icon: Users },
  { name: 'Services', href: '/services', icon: Settings },
  { name: 'Comptes', href: '/accounts', icon: Users },
  { name: 'Délégations', href: '/delegations', icon: Users },
  { name: 'Rapports', href: '/reports', icon: FileText },
];

const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <div 
      className={`fixed inset-y-0 left-0 z-40 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0 w-64' : '-translate-x-48 w-16'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <h1 className={`text-xl font-bold text-blue-600 ${!isOpen && 'hidden'}`}>GHS</h1>
          <h1 className={`text-xl font-bold text-blue-600 ${isOpen && 'hidden'}`}>G</h1>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <Icon className={`flex-shrink-0 h-5 w-5 ${!isOpen && 'mx-auto'}`} />
                <span className={!isOpen ? 'hidden' : 'ml-3'}>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
        
        {/* User Profile / Logout */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600 text-sm">U</span>
              </div>
            </div>
            {isOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Utilisateur</p>
                <button className="text-xs text-gray-500 hover:text-gray-700 flex items-center">
                  <LogOut className="h-4 w-4 mr-1" />
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
