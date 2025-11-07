import type { ChangeEvent } from 'react';

type InputFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'number';
};

export function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: InputFieldProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-[#001E2B]/80">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="mt-1 block w-full rounded-lg border border-gray-300 bg-white/95 px-3 py-2 text-sm shadow-sm 
          placeholder-gray-400 transition-all duration-200 
          focus-visible:outline-none focus:ring-2 focus:ring-[#00ED64]/80 focus:border-[#00ED64]"
      />
    </div>
  );
}
