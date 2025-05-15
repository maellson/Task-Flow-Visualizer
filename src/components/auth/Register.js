import React, { useContext, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Nome de usuário deve ter pelo menos 3 caracteres')
    .required('Nome de usuário é obrigatório'),
  email: Yup.string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  password: Yup.string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .required('Senha é obrigatória'),
  password2: Yup.string()
    .oneOf([Yup.ref('password'), null], 'As senhas devem ser iguais')
    .required('Confirmação de senha é obrigatória'),
  first_name: Yup.string().required('Nome é obrigatório'),
  last_name: Yup.string().required('Sobrenome é obrigatório'),
  user_type: Yup.string().required('Tipo de usuário é obrigatório'),
});

const Register = () => {
  const { register, error } = useContext(AuthContext);
  const [registerError, setRegisterError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    setRegisterError(null);
    const success = await register(values);
    
    if (success) {
      navigate('/dashboard');
    } else {
      setRegisterError(error || 'Erro ao registrar usuário. Tente novamente.');
    }
    
    setSubmitting(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Registrar</h2>
        
        {registerError && (
          <div className="error-message">{registerError}</div>
        )}
        
        <Formik
          initialValues={{
            username: '',
            email: '',
            password: '',
            password2: '',
            first_name: '',
            last_name: '',
            user_type: 'regular', // Valor padrão
          }}
          validationSchema={RegisterSchema}
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
                <label htmlFor="email">Email</label>
                <Field type="email" name="email" id="email" className="form-control" />
                <ErrorMessage name="email" component="div" className="error-text" />
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label htmlFor="first_name">Nome</label>
                  <Field type="text" name="first_name" id="first_name" className="form-control" />
                  <ErrorMessage name="first_name" component="div" className="error-text" />
                </div>

                <div className="form-group half">
                  <label htmlFor="last_name">Sobrenome</label>
                  <Field type="text" name="last_name" id="last_name" className="form-control" />
                  <ErrorMessage name="last_name" component="div" className="error-text" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="user_type">Tipo de Usuário</label>
                <Field as="select" name="user_type" id="user_type" className="form-control">
                  <option value="regular">Usuário Regular</option>
                  <option value="project_manager">Gerente de Projeto</option>
                </Field>
                <ErrorMessage name="user_type" component="div" className="error-text" />
              </div>

              <div className="form-group">
                <label htmlFor="password">Senha</label>
                <Field type="password" name="password" id="password" className="form-control" />
                <ErrorMessage name="password" component="div" className="error-text" />
              </div>

              <div className="form-group">
                <label htmlFor="password2">Confirmar Senha</label>
                <Field type="password" name="password2" id="password2" className="form-control" />
                <ErrorMessage name="password2" component="div" className="error-text" />
              </div>

              <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                {isSubmitting ? 'Registrando...' : 'Registrar'}
              </button>
            </Form>
          )}
        </Formik>
        
        <div className="auth-links">
          <p>
            Já tem uma conta? <Link to="/login">Faça login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;