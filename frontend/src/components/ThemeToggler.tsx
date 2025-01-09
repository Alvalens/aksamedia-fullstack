import React, { useState, useEffect } from 'react';
import { Moon, Sun, Laptop, ChevronDown } from 'lucide-react'; // Import necessary icons from Lucide

const ThemeToggler: React.FC = () => {
	const [theme, setTheme] = useState<string>(() => {
		// Get the theme from localStorage or system preference
		return localStorage.getItem('theme') || 'system';
	});

	const [isOpen, setIsOpen] = useState(false); // State to manage dropdown visibility

	// Sync the theme to the document and localStorage
	useEffect(() => {
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

		const applyTheme = () => {
			if (theme === 'system') {
				document.documentElement.classList.toggle('dark', prefersDark.matches);
				localStorage.setItem('theme', 'system');
			} else {
				document.documentElement.classList.toggle('dark', theme === 'dark');
				localStorage.setItem('theme', theme);
			}
		};

		const handleChange = (e: MediaQueryListEvent) => {
			if (theme === 'system') {
				document.documentElement.classList.toggle('dark', e.matches);
			}
		};

		applyTheme();

		if (theme === 'system') {
			prefersDark.addEventListener('change', handleChange);
			return () => {
				prefersDark.removeEventListener('change', handleChange);
			};
		}
	}, [theme]);

	// Handle theme change
	const toggleTheme = (newTheme: string) => {
		setTheme(newTheme);
		setIsOpen(false); 
	};

	return (
		<div className="relative">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="p-2 rounded-full text-gray-800 dark:text-gray-200 hover:text-blue-500 focus:outline-none"
			>
				<span className="flex items-center">
					<span>{theme === 'light' ? <Sun size={20} /> : theme === 'dark' ? <Moon size={20} /> : <Laptop size={20} />}</span>
					<ChevronDown size={20} />
				</span>
			</button>

			{/* Dropdown Menu */}
			{isOpen && (
				<div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-lg rounded-lg">
					<button
						onClick={() => toggleTheme('light')}
						className={`w-full p-2 text-left hover:bg-gray-200 dark:hover:bg-gray-700 ${theme === 'light' ? 'bg-gray-200 dark:bg-gray-600' : ''}`}
					>
						<div className="flex items-center space-x-2">
							<Sun size={20} />
							<span>Light Mode</span>
						</div>
					</button>

					<button
						onClick={() => toggleTheme('dark')}
						className={`w-full p-2 text-left hover:bg-gray-200 dark:hover:bg-gray-700 ${theme === 'dark' ? 'bg-gray-200 dark:bg-gray-600' : ''}`}
					>
						<div className="flex items-center space-x-2">
							<Moon size={20} />
							<span>Dark Mode</span>
						</div>
					</button>

					<button
						onClick={() => toggleTheme('system')}
						className={`w-full p-2 text-left hover:bg-gray-200 dark:hover:bg-gray-700 ${theme === 'system' ? 'bg-gray-200 dark:bg-gray-600' : ''}`}
					>
						<div className="flex items-center space-x-2">
							<Laptop size={20} />
							<span>System Default</span>
						</div>
					</button>
				</div>
			)}
		</div>
	);
};

export default ThemeToggler;
