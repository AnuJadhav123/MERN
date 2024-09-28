import React, { useEffect, useState } from 'react';
import { deleteUser, get } from '../services/ApiEndpoint';
import { toast } from 'react-hot-toast';

export default function Admin() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const GetUsers = async () => {
      try {
        const request = await get('/api/admin/getuser');
        if (request.status === 200) {
          setUsers(request.data.users); // Ensure you're accessing the correct property
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    GetUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const request = await deleteUser(`/api/admin/delet/${id}`);
        if (request.status === 200) {
          toast.success(request.data.message);
          setUsers(users.filter(user => user._id !== id)); // Remove deleted user from the state
        } else {
          toast.error('Failed to delete user');
        }
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Error deleting user');
        }
      }
    }
  };

  return (
    <>
      <div className='admin-container'>
        <h2>Manage Users</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users && users.map((elem, index) => (
              <tr key={index}>
                <td>{elem.name}</td>
                <td>{elem.email}</td>
                <td>
                  <button onClick={() => handleDelete(elem._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
