import React from 'react';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { LoginForm, Loading } from '../components';

const LOGIN_USER = gql`
  mutation login($email: String!) {
    login(email: $email)
  }
`;

const Login = () => {
  const client = useApolloClient();
  const [login, { loading, error }] = useMutation(LOGIN_USER, {
    onCompleted({ login }) {
      localStorage.setItem('token', login);
      client.writeData({ data: { isLoggedIn: true } });
    },
  });

  if (loading) return <Loading />;
  if (error) return <p>An error occured</p>;

  return <LoginForm login={login} />;
};

export default Login;