import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../api/axios';
import useAuth from '../auth/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import '../css/AuthForm.css';
import { toast } from 'react-toastify';
import { useState } from 'react';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <div className="auth-wrapper">
      <h2>Register</h2>
      <Formik
        initialValues={{ username: '', email: '', password: '' }}
        validationSchema={Yup.object({
          username: Yup.string().required('Username is required'),
          email: Yup.string().email('Invalid email').required('Email is required'),
          password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        })}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          setLoading(true);
          try {
            const res = await api.post('/auth/register', values);

            const { accessToken, refreshToken } = res.data;
            login({ accessToken, refreshToken });

            toast.success('Registered successfully!');
            setTimeout(() => navigate('/dashboard'), 100);
          } catch (error) {
            console.error('Register error:', error);
            setErrors({ general: 'Registration failed. Try again.' });
            toast.error('Registration failed.');
          } finally {
            setSubmitting(false);
            setLoading(false);
          }
        }}
      >
        {({ errors }) => (
          <Form className="auth-form">
            <Field name="username" placeholder="Username" />
            <ErrorMessage name="username" component="div" className="auth-error" />

            <Field name="email" type="email" placeholder="Email" />
            <ErrorMessage name="email" component="div" className="auth-error" />

            <Field name="password" type="password" placeholder="Password" />
            <ErrorMessage name="password" component="div" className="auth-error" />

            {errors.general && <div className="auth-error">{errors.general}</div>}

            <button type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </Form>
        )}
      </Formik>

      <div className="auth-toggle">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export default Register;
