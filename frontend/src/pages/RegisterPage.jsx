import Register from '../components/Register.jsx';

export default function RegisterPage({ onRegister }) {
  return (
    <div>
      <Register onRegister={onRegister} />
    </div>
  );
}