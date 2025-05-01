import React, { useContext, useState, FormEvent } from "react";
import api from "../../services/api";
import Cookies from "js-cookie";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

type ValidationError = {
  path: string;
  msg: string;
};

type ValidationResponse = {
  errors?: ValidationError[];
  message?: string;
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [validation, setValidation] = useState<ValidationResponse>({});
  const [loginFailed, setLoginFailed] = useState<ValidationResponse>({});

  const login = async (e: FormEvent) => {
    e.preventDefault();

    try {
      interface LoginResponse {
        data: {
          token: string;
          is_logged_in: object;
        };
      }

      const response = (await api.post("/auth/login", {
        username,
        password,
      })) as LoginResponse;

      Cookies.set("token", response.data.token);
      Cookies.set("is_logged_in", JSON.stringify(response.data.is_logged_in));

      setIsAuthenticated(true);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const error = err as AxiosError;

      if (error.response && error.response.data) {
        setValidation(error.response.data as ValidationResponse);
        setLoginFailed(error.response.data as ValidationResponse);
      }
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="/vite.svg"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      {validation.errors && (
        <div className="alert alert-danger mt-2 pb-0">
          {validation.errors.map((error, index) => (
            <p key={index}>
              {error.path} : {error.msg}
            </p>
          ))}
        </div>
      )}
      {loginFailed.message && (
        <div className="alert alert-danger mt-2">{loginFailed.message}</div>
      )}

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={login} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
