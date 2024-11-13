import Header from "./Header";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className="h-full">
      <Header />
      <div className="w-full mx-auto">{children}</div>
    </div>
  );
};

export default Layout;
