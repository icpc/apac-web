interface DividerProps {
  className?: string;
}

const Divider = ({ className = "" }: DividerProps) => {
  return <hr className={`w-full my-4 border-gray-300 dark:border-gray-600 ${className}`} />;
};

export default Divider;
