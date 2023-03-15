import LockClosedIcon from "@heroicons/react/20/solid/LockClosedIcon";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Input from "../Input";

const LoginForm: React.FC = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  return (
    <form className="mt-8 space-y-6">
      <div className="-space-y-px rounded-md shadow-sm">
        <Input
          placeholder="E-Mail"
          type="email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
        <Input
          placeholder="Password"
          type="password"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
      </div>
      <div>
        <button
          className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={(e) => {
            e.preventDefault();
            void signIn("credentials", { ...data, callbackUrl: "/" });
          }}
        >
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
          </span>
          Sign in
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
