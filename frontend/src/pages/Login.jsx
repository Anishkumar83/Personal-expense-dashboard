import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../api/axios';
import useAuth from '../auth/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import '../css/AuthForm.css';
import { toast } from 'react-toastify';
import { useState } from 'react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <div className="auth-wrapper">
      <h2>Login</h2>
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={Yup.object({
          username: Yup.string().required('Username is required'),
          password: Yup.string().required('Password is required'),
        })}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          setLoading(true);
          try {
            const res = await api.post('/auth/login', values);
            const { accessToken, refreshToken } = res.data;

            login({ accessToken, refreshToken });

            toast.success('Login successful!');
            setTimeout(() => navigate('/dashboard'), 100);
          } catch (error) {
            console.error('Login error:', error);
            setErrors({ general: 'Invalid username or password' });
            toast.error('Login failed. Check your credentials.');
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

            <Field name="password" type="password" placeholder="Password" />
            <ErrorMessage name="password" component="div" className="auth-error" />

            {errors.general && <div className="auth-error">{errors.general}</div>}

            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </Form>
        )}
      </Formik>

      <div className="auth-toggle">
        Don&apos;t have an account? <Link to="/register">Register</Link>
      </div>
    </div>
  );
};

export default Login;
