import { Outlet } from 'react-router-dom';
import { memo } from 'react';

import RegisterHeader from 'src/components/RegisterHeader';
import Footer from 'src/components/Footer';

interface Props {
  children?: React.ReactNode;
}
function RegisterLayoutInner({ children }: Props) {
  return (
    <div>
      <RegisterHeader />
      {children}
      <Outlet />
      <Footer />
    </div>
  );
}
const RegisterLayout = memo(RegisterLayoutInner);
export default RegisterLayout;
