import { Link, useLocation } from 'react-router-dom';
import SparxionLogo from '../assets/Sparxion-Logo.svg';

export function Navigation() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  const navItems = [
    { label: "John's Journey", path: '/journey' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'Software', path: '/software' },
    { label: 'Ethos', path: '/ethos' },
  ];

  // Hide navigation completely on landing page
  if (isHomePage) {
    return null;
  }

  return (
    <nav className="border-b border-bold border-black">
      <div className="max-w-[1600px] mx-auto px-medium py-small flex items-center justify-between">
        <Link to="/" className="hover:opacity-70 transition-standard">
          <img 
            src={SparxionLogo} 
            alt="SparXion" 
            className="h-8 w-auto"
          />
        </Link>
        <div className="flex gap-medium flex-wrap">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="text-body hover:text-dark-gray transition-standard"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
