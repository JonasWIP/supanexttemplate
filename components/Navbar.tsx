import React from 'react';
import Link from 'next/link';

type NavbarProps = {
  logo?: string;
  links?: Array<{ label: string; href: string }>;
  isAuthenticated?: boolean;
  onLogout?: () => void;
  userName?: string | null;
};

const Navbar: React.FC<NavbarProps> = ({
  logo = 'Your Logo',
  links = [],
  isAuthenticated = false,
  onLogout,
  userName,
}) => {
  // Filter links - only show Dashboard if the user is authenticated
  const filteredLinks = links.filter(link => 
    link.href !== '/dashboard' || isAuthenticated
  );

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="text-xl font-bold">
          <Link href="/">
            {logo}
          </Link>
        </div>
        
        <div className="flex items-center">
          <ul className="flex space-x-6 mr-6">
            {filteredLinks.map((link, index) => (
              <li key={index}>
                <Link 
                  href={link.href}
                  className="text-gray-700 hover:text-blue-500 transition duration-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          
          {isAuthenticated ? (
            <div className="flex items-center">
              {userName && (
                <span className="mr-4 text-sm text-gray-600">
                  Hello, {userName}
                </span>
              )}
              <button
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              href="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;