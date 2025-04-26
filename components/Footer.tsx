import React from 'react';

type FooterProps = {
    companyName?: string;
    links?: Array<{ label: string; href: string }>;
};

const Footer: React.FC<FooterProps> = ({
    companyName = 'Your Company',
    links = [],
}) => {
    
    return (
        <footer className="bg-gray-800 dark:bg-gray-900 text-white py-4">
            <div className="container mx-auto text-center">
            <p className="mb-4">{companyName} &copy; {new Date().getFullYear()}</p>
            <ul className="flex justify-center space-x-4">
                {links.map((link, index) => (
                <li key={index}>
                    <a href={link.href} className="text-white hover:text-blue-300 dark:hover:text-blue-400 transition duration-300">
                    {link.label}
                    </a>
                </li>
                ))}
            </ul>
            </div>
        </footer>
    );
};

export default Footer;