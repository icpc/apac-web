interface WideContainerProps {
  children: React.ReactNode;
  className?: string;
}

const WideContainer: React.FC<WideContainerProps> = ({ children, className }) => {
  return <div className={`container mx-auto px-5 xl:w-3/4 overflow-x-clip ${className}`} style={{ maxWidth: '1600px' }}>{children}</div>;
};

export default WideContainer;
