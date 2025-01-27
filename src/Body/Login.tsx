//로그인 페이지
import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobal, useRefresh } from '../contexts/GlobalContext';
import '../CSS/Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { globalVariable, setGlobalVariable } = useGlobal();
  const [user_id, setuser_id] = useState('');
  const [user_password, setuser_password] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/services/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id, user_password }), // 입력 데이터를 JSON으로 전달
      });

      if (!response.ok) {
        console.error('HTTP Error:', response.status); // 상태 코드 출력
        // throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (response.ok && data.success) {
        navigate('/'); // 홈으로 이동
        setGlobalVariable(user_id);
        sessionStorage.setItem("user_id", user_id);
        //setRefresh(true);
        alert(user_id+'님, 환영합니다.');
      } else {
        setError(data.message || '로그인 실패');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('서버와의 통신 중 문제가 발생했습니다.');
    }
  };

  return (
    <div className='logincontainer'>
    <form className="loginform" onSubmit={handleLogin}>
      <h1 className='logintitle'>로그인</h1>
      <div className='loginbox'>
      <div className='loginlabels'>
        <label>아이디</label>
        <input
          className='logininput'
          type="text"
          value={user_id}
          onChange={(e) => setuser_id(e.target.value)}
          placeholder="Enter your ID"
          required
        />
      </div>
      <br />

      <div className='loginlabels'>
        <label>비밀번호</label>
        <input
          className='logininput'
          type="password"
          value={user_password}
          onChange={(e) => setuser_password(e.target.value)}
          placeholder="Enter your Password"
          required
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button className='loginbuttons' id='loginbutton' type="submit">로그인</button>
      <br/>
      <button className="loginbuttons" id='registerbutton' onClick={() => navigate('/join')}>회원가입</button>
      <button className='loginbuttons' id='backbutton' onClick={() => navigate('/')}>뒤로가기</button>
      </div>
    </form>
    </div>
  );
};

 export default Login;
