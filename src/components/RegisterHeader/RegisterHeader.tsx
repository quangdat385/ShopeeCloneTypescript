import { useTranslation } from 'react-i18next';
import { Link, useMatch } from 'react-router-dom';
import path from 'src/constants/path';
import avatar from 'src/assets/images/logo.png';

function RegisterHeader() {
  const { t } = useTranslation('user');
  const registerMatch = useMatch('/register');
  const isRegister = Boolean(registerMatch);
  return (
    <div className='py-5'>
      <div className='container'>
        <nav className='flex items-center'>
          <Link to={path.home}>
            <div className='flex items-center h-11 w-full gap-2 text-[#ee4d2d] font-semibold'>
              <img src={avatar} width={44} height={44} alt={'logo'} className=' rounded-full object-cover' />
              ĐN Shop
            </div>
          </Link>
          <div className='ml-5 text-xl lg:text-2xl'>{isRegister ? t('auth.register') : t('auth.login')}</div>
        </nav>
      </div>
    </div>
  );
}

export default RegisterHeader;
