type ButtonProps = {
  onClick: () => void;
  label: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
};

export function Button({
  onClick,
  label,
  disabled = false,
  variant = 'primary',
}: ButtonProps) {
  const baseStyle =
    'inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const styles = {
    primary:
      'bg-[#00ED64] text-[#001E2B] hover:bg-[#00C755] focus:ring-[#00ED64]',
    secondary:
      'bg-[#023430] text-white hover:bg-[#035B41] focus:ring-[#035B41]',
    outline:
      'border border-[#00ED64] text-[#00ED64] hover:bg-[#00ED64]/10 focus:ring-[#00ED64]',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${styles[variant]}`}
    >
      {label}
    </button>
  );
}
