import type { HTMLInputTypeAttribute, ChangeEventHandler } from "react";

const Input: React.FC<{
  placeholder: string;
  type: HTMLInputTypeAttribute;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}> = ({ placeholder, type, value, onChange }) => {
  return (
    <div>
      <label className="sr-only">{placeholder}</label>
      <input
        value={value}
        onChange={onChange}
        type={type}
        required
        className="relative m-1 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;
