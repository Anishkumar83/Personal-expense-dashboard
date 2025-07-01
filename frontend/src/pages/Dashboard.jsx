import { useState, useEffect } from 'react';
import api from '../api/axios';
import useAuth from '../auth/useAuth';
import '../css/Dashboard.css';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { accessToken, logout } = useAuth();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState('');
  const [groupBy, setGroupBy] = useState('month');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', amount: '', category: '', date: '' });
  const [editingId, setEditingId] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#aa46be', '#e91e63', '#3f51b5'];

  useEffect(() => {
    if (accessToken) {
      fetchExpenses();
    }
  }, [accessToken]);

  const fetchExpenses = () => {
    api.get('/expenses')
      .then(res => setExpenses(res.data))
      .catch(err => console.error('Error fetching expenses:', err));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/expenses/${editingId}`, form);
      } else {
        await api.post('/expenses', form);
      }
      resetForm();
      fetchExpenses();
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  const resetForm = () => {
    setForm({ title: '', amount: '', category: '', date: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (expense) => {
    setForm({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date
    });
    setEditingId(expense.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await api.delete(`/expenses/${id}`);
        fetchExpenses();
      } catch (err) {
        console.error('Error deleting expense:', err);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filterExpenses = () => {
    return expenses.filter((e) => {
      const matchesSearch =
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.category?.toLowerCase().includes(search.toLowerCase()) ||
        e.date.includes(search) ||
        e.id.toString() === search;

      const matchesMonth =
        dayjs(e.date).format('YYYY-MM') === currentMonth.format('YYYY-MM');

      return matchesSearch && matchesMonth;
    });
  };

  const groupExpenses = (filtered) => {
    const grouped = {};
    filtered.forEach(exp => {
      let key = groupBy === 'month'
        ? exp.date.slice(0, 7)
        : groupBy === 'category'
        ? exp.category || 'Uncategorized'
        : exp.date;

      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(exp);
    });
    return grouped;
  };

  const getPieChartData = () => {
    const categoryMap = {};
    filterExpenses().forEach(exp => {
      const cat = exp.category || 'Uncategorized';
      categoryMap[cat] = (categoryMap[cat] || 0) + exp.amount;
    });

    return Object.entries(categoryMap).map(([category, amount]) => ({
      category,
      amount,
    }));
  };

  const groupedExpenses = groupExpenses(filterExpenses());

  return (
    <div className="dashboard-container">
      <div className="dashboard-navbar">
        <h2 className="dashboard-title">Expense Dashboard</h2>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      <div className="controls">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select
          className="group-select"
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value)}
        >
          <option value="month">Group by Month</option>
          <option value="category">Group by Category</option>
          <option value="date">Group by Date</option>
        </select>
        <button onClick={() => {
          resetForm();
          setShowForm(!showForm);
        }} className="add-btn">
          {showForm ? 'Cancel' : 'Add Expense'}
        </button>
      </div>

      <div className="month-pagination">
        <button className="icon-btn" onClick={() => setCurrentMonth(currentMonth.subtract(1, 'month'))}>
          <FaArrowLeft />
        </button>
        <span>{currentMonth.format('MMMM YYYY')}</span>
        <button className="icon-btn" onClick={() => setCurrentMonth(currentMonth.add(1, 'month'))}>
          <FaArrowRight />
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleFormSubmit} className="expense-form">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
          <button type="submit" className="submit-btn">
            {editingId ? 'Update' : 'Add'}
          </button>
        </form>
      )}

      {Object.keys(groupedExpenses).length === 0 ? (
        <p className="no-data">No expenses found.</p>
      ) : (
        Object.entries(groupedExpenses).map(([group, items]) => {
          const total = items.reduce((sum, e) => sum + e.amount, 0);
          return (
            <div key={group} className="expense-group">
              <h3>{group} — Total: ₹{total.toFixed(2)}</h3>
              <div className="expense-table-wrapper">
                <table className="expense-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Amount</th>
                      <th>Category</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((e) => (
                      <tr key={e.id}>
                        <td>{e.id}</td>
                        <td>{e.title}</td>
                        <td>{e.amount}</td>
                        <td>{e.category}</td>
                        <td>{e.date}</td>
                        <td>
                          <button onClick={() => handleEdit(e)} className="edit-btn">Edit</button>
                          <button onClick={() => handleDelete(e.id)} className="delete-btn">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })
      )}

      <div className="chart-container">
        <h3>Expense Distribution by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={getPieChartData()}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              isAnimationActive={true}
              label={({ percent, category }) =>
                `${category} (${(percent * 100).toFixed(1)}%)`
              }
            >
              {getPieChartData().map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
