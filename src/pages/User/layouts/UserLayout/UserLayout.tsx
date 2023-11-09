import { Outlet } from 'react-router-dom';
import UserSideNav from '../../components/UserSideNav';

function UserLayout() {
  return (
    <div className='bg-neutral-100 text-sm py-16 text-gray-600 '>
      <div className='container'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-12'>
          <div className='md:col-span-4 lg:col-span-3'>
            <UserSideNav />
          </div>
          <div className='md:col-span-8 lg:col-span-9'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserLayout;
