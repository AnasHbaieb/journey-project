import React from 'react';

interface CheckboxFieldProps {
  label: string;
  id: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  id,
  checked,
  onChange,
}) => {
  return (
    <div className="space-y-1 flex items-center">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
      />
      <label htmlFor={id} className="text-sm font-semibold text-gray-700 block">
        {label}
      </label>
    </div>
  );
};

export default CheckboxField; 