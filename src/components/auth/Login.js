import React, { useContext, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Nome de usuário é obrigatório'),
  password: Yup.string().required('Senha é obrigatória'),
});

const Login = () => {
  const { login, error } = useContext(AuthContext);
  const [loginError, setLoginError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoginError(null);
    const success = await login(values);
    
    if (success) {
      navigate('/dashboard');
    } else {
      setLoginError(error || 'Erro ao fazer login. Verifique suas credenciais.');
    }
    
    setSubmitting(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        
        {loginError && (
          <div className="error-message">{loginError}</div>
        )}
        
        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="username">Nome de Usuário</label>
                <Field type="text" name="username" id="username" className="form-control" />
                <ErrorMessage name="username" component="div" className="error-text" />
              </div>

              <div className="form-group">
                <label htmlFor="password">Senha</label>
                <Field type="password" name="password" id="password" className="form-control" />
                <ErrorMessage name="password" component="div" className="error-text" />
              </div>

              <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                {isSubmitting ? 'Entrando...' : 'Entrar'}
              </button>
            </Form>
          )}
        </Formik>
        
        <div className="auth-links">
          <p>
            Não tem uma conta? <Link to="/register">Registre-se</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
