type Props = {
  children?: React.ReactNode;
};

const Container = ({ children }: Props) => {
  return <div className="container mx-auto px-5 xl:w-3/4 overflow-x-clip" style={{ maxWidth: '1200px' }}>{children}</div>;
};

export default Container;
