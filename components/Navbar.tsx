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
    <nav className="bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700/30 py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="text-xl font-bold dark:text-white">
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
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition duration-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          
          {isAuthenticated ? (
            <div className="flex items-center">
              {userName && (
                <span className="mr-4 text-sm text-gray-600 dark:text-gray-300">
                  Hello, {userName}
                </span>
              )}
              <button
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Link 
                href="/register"
                className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-4 py-2 rounded-md transition duration-300"
              >
                Register
              </Link>
              <Link 
                href="/login"
                className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;