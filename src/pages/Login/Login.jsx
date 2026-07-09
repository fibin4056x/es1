import "./Login.css";

function Login() {
  return (
    <div className="login-container">
      <div className="login-card">

        <div className="login-header">
          <h1>EduTrack</h1>
          <p>School Management System</p>
        </div>

        <form className="login-form">

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
            />
          </div>

          <button type="submit">
            Login
          </button>

        </form>

      </div>
    </div>
  );
}

export default Login;