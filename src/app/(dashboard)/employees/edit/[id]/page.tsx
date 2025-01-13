'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Employee {
  id: string;  
  fullName: string;
  email: string;
  phone: string | null;
  position: string;
  departmentId: string;
}

export default function EditEmployee() {
  const router = useRouter();
  const params = useParams();
  const [employee, setEmployee] = useState<Employee | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    departmentId: ''
  });

  useEffect(() => {
    
    const fetchEmployee = async () => {
      try {
        const response = await fetch(`/api/employees/${params.id}`);
        const data = await response.json();
        setEmployee(data);
        setFormData({
          fullName: data.name,
          email: data.email,
          phone: data.phone,
          position: data.position,
          departmentId: data.departmentId,
        });
      } catch (error) {
        console.error('Error fetching employee:', error);
      }
    };

    if (params.id) {
      fetchEmployee();
    }
  }, [params.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/employees/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/employees');
        router.refresh();
      }
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  return (
    <div className="h-screen py-8 px-4 sm:px-6 lg:px-8 bg-white rounded-lg shadow-md">
<div className="max-w-6xl mx-auto">
        <div className="mb-8">
    <h1 className="text-2xl font-bold text-gray-900">Edit Employee</h1>
  </div>
      
  <div className="bg-white shadow rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.fullName}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="position" className="block text-sm font-medium text-gray-700">
            Position
          </label>
          <input
            type="text"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700">
            DepartmentId
          </label>
          <input
            type="text"
            id="departmentId"
            name="departmentId"
            value={formData.departmentId}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Update Employee
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
      </div>
      </div>
    </div>
  );
}



  

 

  
    
