import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Employee } from '../../../types/Employee';

const Create: React.FC = () => {
	const [employee, setEmployee] = useState<Omit<Employee, 'id'>>({
		image: '',
		name: '',
		phone: '',
		division: '',
		position: '',
	});
	const [error, setError] = useState<string | null>(null);

	const navigate = useNavigate();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setEmployee((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!employee.name || !employee.phone || !employee.division || !employee.position) {
			setError('All fields are required.');
			return;
		}

		if (!/^\d{8,12}$/.test(employee.phone)) {
			setError('Phone number must be 8-12 digits.');
			return;
		}

		if (!/^[a-zA-Z ]+$/.test(employee.name)) {
			setError('Name must be string.');
			return;
		}

		const newEmployee: Employee = {
			id: Math.random().toString(36).substr(2, 9),
			...employee,
		};

		const existingEmployees = JSON.parse(localStorage.getItem('employees') || '[]');

		const updatedEmployees = [...existingEmployees, newEmployee];

		localStorage.setItem('employees', JSON.stringify(updatedEmployees));

		console.log('New Employee:', newEmployee);
		alert('Employee created successfully!');
		navigate('/employees');
	};

	return (
		<div className='max-w-7xl mx-auto p-6 bg-white dark:bg-gray-600 dark:text-white shadow-sm rounded-md'>
			<div className="space-y-4">
				<h1 className="text-2xl font-bold mb-4">Add New Employee</h1>
				{error && <p className="text-red-500 mb-4">{error}</p>}
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-white">
							Image URL
						</label>
						<input
							type="text"
							id="image"
							name="image"
							value={employee.image}
							onChange={handleChange}
							className="mt-1 block dark:bg-gray-700 w-full border border-gray-300 rounded px-3 py-2"
						/>
					</div>
					<div>
						<label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-white">
							Name
						</label>
						<input
							type="text"
							id="name"
							name="name"
							value={employee.name}
							onChange={handleChange}
							className="mt-1 block dark:bg-gray-700 w-full border border-gray-300 rounded px-3 py-2"
							required
						/>
					</div>
					<div>
						<label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-white">
							Phone
						</label>
						<input
							type="text"
							id="phone"
							name="phone"
							value={employee.phone}
							onChange={handleChange}
							className="mt-1 block dark:bg-gray-700 w-full border border-gray-300 rounded px-3 py-2"
							required
						/>
					</div>
					<div>
						<label htmlFor="division" className="block text-sm font-medium text-gray-700 dark:text-white">
							Division
						</label>
						<input
							type="text"
							id="division"
							name="division"
							value={employee.division}
							onChange={handleChange}
							className="mt-1 block dark:bg-gray-700 w-full border border-gray-300 rounded px-3 py-2"
							required
						/>
					</div>
					<div>
						<label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-white">
							Position
						</label>
						<input
							type="text"
							id="position"
							name="position"
							value={employee.position}
							onChange={handleChange}
							className="mt-1 block dark:bg-gray-700 w-full border border-gray-300 rounded px-3 py-2"
							required
						/>
					</div>
					<div className="flex justify-end gap-2">
						<button
							type="button"
							onClick={() => navigate('/employees')}
							className="bg-gray-500 text-white py-2 px-4 rounded"
						>
							Cancel
						</button>
						<button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
							Save
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Create;