import { useState } from 'react';
import { useContext } from 'react';
import { useEffect } from 'react';
import { createContext } from 'react';
import { useNavigate } from 'react-router-dom';

import QuestionsContext from './QuestionsContext'

const AuthenticationContext = createContext();

const AuthenticationProvider = ({ children }) => {
  let navigate = useNavigate();

  const {resultQuestions,setResultQuestions,setQuestionsState} = useContext(QuestionsContext)

  const [doneStatus, setDoneStatus] = useState(false)

  const KEY = 'AIzaSyBEpE0pAKS_Omypin8quNkwnxu_XszZvCA';

  const [userToken, setUserToken] = useState(
    JSON.parse(localStorage.getItem('user')) || ''
  );

  const [user, setUser] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [username, setUsername] = useState('');

  const [closeSesion, setCloseSesion] = useState(false);

  const registerData = async () => {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${KEY}`,
      {
        method: 'POST',
        body: JSON.stringify({
          email: user.email,
          password: user.password,
          returnSecureToken: true
        })
      }
    );

    const data = await res.json();

    localStorage.setItem('user', JSON.stringify(data));
    localStorage.setItem('username', user.username);

    setUsername(user.username);

    navigate('/home');
  };

  const loginData = async () => {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${KEY}`,
      {
        method: 'POST',
        body: JSON.stringify({
          email: user.email,
          password: user.password,
          returnSecureToken: true
        })
      }
    );

    const data = await res.json();

    console.log(data);

    localStorage.setItem('user', JSON.stringify(data));
    localStorage.setItem('username', user.username);

    setUsername(user.username);

    navigate('/home');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (Object.values(user).includes('')) {
      console.log('campos vacios');
    } else if (user.password === user.password2) {
      registerData();
    } else {
      console.log('campos incorrectos');
    }
    console.log('user', user);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    console.log(user);

    if (Object.values(user).includes('')) {
      console.log('campos vacios');
      return;
    } else if (user.password) {
      loginData();
    } else {
      console.log('los campos no coinciden');
    }
    setCloseSesion(false);
  };

  const handleClose = () => {
    localStorage.clear();

    setUsername(null);
    setCloseSesion(true);
    setUser({
      username: '',
      email: '',
      password: ''
    });
    navigate('/');
  };

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const getResponses = async () => {
    // console.log('Ejecutando', userToken.idToken)
    try {
      let user = JSON.parse(localStorage.getItem('user'))

      const res = await fetch(`https://video-record-19df8-default-rtdb.firebaseio.com/users.json?auth=${user.idToken}`)
      // const res = await fetch(                                                   //userToken.idToken
      //   `https://video-record-19df8-default-rtdb.firebaseio.com/users.json?auth=${userToken.idToken}`
      // );

      const data = await res.json();

      console.log(data, 'dataaa');

      for (let i in data) {
        console.log(i);
        let info = data[i].resultQuestions

        setResultQuestions(info)
        // setResultQuestions([])
        console.log(data[i].done, 'infoo');
        setDoneStatus(data[i].done)

      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setUsername(localStorage.getItem('username'));
  });

  return (
    <AuthenticationContext.Provider
      value={{
        handleRegister,
        handleChange,
        username,
        handleClose,
        handleLogin,
        userToken,
        getResponses,
        setDoneStatus,
        doneStatus
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

export { AuthenticationProvider };

export default AuthenticationContext;
