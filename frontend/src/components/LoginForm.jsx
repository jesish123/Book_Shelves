import {Link} from "react-router-dom";

function LoginForm() {
  return (
    <form className="flex flex-col justify-center max-w-lg mx-auto px-4 space-y-6 mt-10">

      <h1 className="text-3xl font-bold text-center text-blue-600">
        Login
      </h1>

      <div>
        <label
          htmlFor="email"
          className="mb-2 text-slate-900 font-medium text-lg inline-block"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          className="px-3.5 py-3 text-base text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
          required
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 text-slate-900 font-medium text-lg inline-block"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          placeholder="Enter your password"
          className="px-3.5 py-3 text-base text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
          required
        />
      </div>

      <div className="flex justify-between items-center">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" />
          Remember Me
        </label>

        <Link to="/forgot-password" className="text-blue-600 hover:underline text-sm">
          Forgot Password?
        </Link>
      </div>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold transition"
      >
        Login
      </button>

      <p className="text-center text-sm">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      </p>

    </form>
  );
}

export default LoginForm;