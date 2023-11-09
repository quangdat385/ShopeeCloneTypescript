import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation('home');
  return (
    <footer className='bg-neutral-100 py-16'>
      <div className='container'>
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
          <div className='lg:col-span-1'>
            <div>{t('footer.rignt')}</div>
          </div>
          <div className='lg:col-span-2'>
            <div>{t('footer.countries')}</div>
          </div>
        </div>
        <div className='mt-10 text-center text-sm'>
          <div>{t('footer.company')}</div>
          <div className='mt-6'>{t('footer.countries')}</div>
          <div className='mt-2'>{t('footer.response')}</div>
          <div className='mt-2'>{t('footer.cef')}</div>
          <div className='mt-2'>{t('footer.copyright')}</div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
