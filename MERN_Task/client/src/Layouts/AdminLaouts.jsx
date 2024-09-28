import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { get } from '../services/ApiEndpoint'; // API service
import Chart from 'chart.js/auto'; // Import Chart.js
import { toast } from 'react-hot-toast';

export default function AdminDashboard() {
  const user = useSelector((state) => state.Auth.user); // Get user info from Redux
  const navigate = useNavigate();
  const [users, setUsers] = useState([]); // State for user data

  // Check user role and fetch user data
  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchUserData();
    } else if (user && user.role !== 'admin') {
      navigate('/login'); // Redirect to login if user is not an admin
    }
  }, [user, navigate]);

  // Function to fetch user data
  const fetchUserData = async () => {
    try {
      const request = await get('/api/admin/getuser');
      if (request.status === 200) {
        const response = request.data;
        setUsers(response.users);
        generateChartData(response.users); // Call to generate charts
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Error fetching user data');
    }
  };

  // Function to generate chart data and render charts
  const generateChartData = (users) => {
    const barLabels = users.map(user => user.name); // User names for bar chart
    const pieData = [0, 0]; // For admin and regular user counts
    users.forEach(user => {
      if (user.role === 'admin') {
        pieData[0]++; // Increment admin count
      } else {
        pieData[1]++; // Increment user count
      }
    });

    const registrationDates = users.map(user => new Date(user.createdAt).getTime());

    // Create charts after the component is mounted
    setTimeout(() => {
      renderCharts(barLabels, pieData, registrationDates);
    }, 0);
  };

  // Function to render charts
  const renderCharts = (barLabels, pieData, registrationDates) => {
    // Bar Chart
    const ctxBar = document.getElementById('barChart').getContext('2d');
    new Chart(ctxBar, {
      type: 'bar',
      data: {
        labels: barLabels,
        datasets: [{
          label: 'User Names',
          data: barLabels.map(() => 1), // Dummy data for demonstration
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }],
      },
    });

    // Pie Chart
    const ctxPie = document.getElementById('pieChart').getContext('2d');
    new Chart(ctxPie, {
      type: 'pie',
      data: {
        labels: ['Admins', 'Users'],
        datasets: [{
          data: pieData,
          backgroundColor: ['#FF6384', '#36A2EB'],
        }],
      },
    });

    // Line Chart
    const ctxLine = document.getElementById('lineChart').getContext('2d');
    new Chart(ctxLine, {
      type: 'line',
      data: {
        labels: registrationDates.map((_, index) => `User ${index + 1}`),
        datasets: [{
          label: 'User Registration Times',
          data: registrationDates,
          fill: false,
          borderColor: 'rgba(255, 99, 132, 1)',
          tension: 0.1,
        }],
      },
    });
  };

  return (
    <>
      <div className="admin-dashboard">
        <h2>Admin Dashboard</h2>

        {/* Section for Charts */}
        <div className="dashboard-section">
          <h3>Charts</h3>
          <div className="charts-container">
            {/* Bar Chart */}
            <div>
              <canvas id="barChart" width="300" height="150"></canvas>
            </div>

            {/* Pie Chart */}
            <div>
              <canvas id="pieChart" width="300" height="150"></canvas>
            </div>

            {/* Line Chart */}
            <div>
              <canvas id="lineChart" width="300" height="150"></canvas>
            </div>
          </div>
        </div>

        {/* Section for User Data */}
        <div className="dashboard-section">
          <h3>User Data</h3>
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => handleDelete(user._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
