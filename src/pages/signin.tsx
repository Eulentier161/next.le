import clsx from "clsx";
import { useState } from "react";
import LoginForm from "~/components/auth/forms/LoginForm";
import RegisterForm from "~/components/auth/forms/RegisterForm";

const tabs = ["Log in", "Register"];

export default function Example() {
  const [currentTab, setCurrentTab] = useState("Log in");

  return (
    <>
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex justify-evenly space-x-8">
              {tabs.map((tab) => (
                <button
                  onClick={() => {
                    setCurrentTab(tab);
                  }}
                  key={tab}
                  className={clsx(
                    tab === currentTab
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                    "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium"
                  )}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
          {currentTab === "Log in" ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </>
  );
}
