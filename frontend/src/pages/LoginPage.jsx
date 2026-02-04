import Login from '../components/Login.jsx';

export default function LoginPage({ onLogin }) {
  return (
    <div>
      <Login onLogin={onLogin} />
    </div>
  );
}