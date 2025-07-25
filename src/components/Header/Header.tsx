import { Link } from 'react-router-dom';

import Popover from '../Popover';
import NavHeader from '../NavHeader';
import noproduct from 'src/assets/images/no-product.png';
import path from 'src/constants/path';
import { useQuery } from '@tanstack/react-query';
import { purchasesStatus } from 'src/constants/purchase';
import purchaseApi from 'src/apis/purchase.api';
import { useContext } from 'react';
import { AppContext } from 'src/contexts/app.context';
import useSearchProducts from 'src/hooks/useSearchProducts';
import { formatCurrency } from 'src/utils/utils';
import { useTranslation } from 'react-i18next';
import avatar from 'src/assets/images/logo.png';

const MAX_PURCHASES = 5;

function Header() {
  const { t } = useTranslation('user');
  const { isAuthenticated } = useContext(AppContext);
  const { onSubmitSearch, register } = useSearchProducts();

  const { data: purchasesInCartData } = useQuery({
    queryKey: ['purchases', { status: purchasesStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.inCart }),
    enabled: isAuthenticated
  });

  const purchasesInCart = purchasesInCartData?.data.data;

  return (
    <div className='bg-[linear-gradient(-180deg,#f53d2d,#f63)] pb-5 pt-2 text-white'>
      <div className='container'>
        <NavHeader />
        <div className='mt-4 grid grid-cols-12 items-end gap-4'>
          <Link to={path.home} className='md:col-span-2 sm:col-span-3 col-span-4 '>
            <div className='flex items-center h-11 gap-2 text-white font-semibold'>
              <img src={avatar} width={44} height={44} alt={'logo'} className=' rounded-full object-cover' />
              ĐN Shop
            </div>
          </Link>
          <form onSubmit={onSubmitSearch} className='md:col-span-9 sm:col-span-7 col-span-7'>
            <div className='flex rounded-sm p-1 bg-white '>
              <input
                type='text'
                className='flex-grow border-none bg-transparent px-3 py-2 text-black outline-none'
                placeholder='Free Ship Order From O Đ'
                {...register('name')}
              />
              <button className='flex-shrink-0 rounded-sm bg-orange py-2 sm:px-6 hover:opacity-90 px-3'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-6 w-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
                  />
                </svg>
              </button>
            </div>
          </form>
          <div className='md:col-span-1 sm:col-span-1 col-span-1 justify-self-end'>
            <Popover
              hasArrow={true}
              renderPopover={
                <div className='relative  max-w-[400px] rounded-sm border border-gray-200 bg-white text-sm shadow-md'>
                  {purchasesInCart && purchasesInCart.length > 0 ? (
                    <div className='p-2'>
                      <div className='capitalize text-gray-400'>{t('cart.recent')}</div>
                      <div className='mt-5'>
                        {purchasesInCart.slice(0, MAX_PURCHASES).map((purchase) => (
                          <div className='mt-2 flex py-2 hover:bg-gray-100' key={purchase._id}>
                            <div className='flex-shrink-0'>
                              <img
                                src={purchase.product.image}
                                alt={purchase.product.name}
                                className='h-11 w-11 object-cover'
                              />
                            </div>
                            <div className='ml-2 flex-grow overflow-hidden'>
                              <div className='truncate'>{purchase.product.name}</div>
                            </div>
                            <div className='ml-2 flex-shrink-0'>
                              <span className='text-orange'>₫{formatCurrency(purchase.product.price)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className='mt-6 flex items-center justify-between'>
                        <div className='text-xs capitalize text-gray-500'>
                          {purchasesInCart.length > MAX_PURCHASES ? purchasesInCart.length - MAX_PURCHASES : ''}
                          {t('cart.add')}
                        </div>
                        <Link
                          to={path.cart}
                          className='rounded-sm bg-orange px-4 py-2 capitalize text-white hover:bg-opacity-90'
                        >
                          {t('cart.viewCart')}
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className='flex h-[300px] w-[300px] flex-col items-center justify-center p-2'>
                      <img src={noproduct} alt='no purchase' className='h-24 w-24' />
                      <div className='mt-3 capitalize'>{t('cart.noProduct')}</div>
                    </div>
                  )}
                </div>
              }
            >
              <Link to={path.home} className='relative'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-8 w-8'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'
                  />
                </svg>
                {purchasesInCart && purchasesInCart.length > 0 && (
                  <span className='absolute top-[-5px] left-[17px] rounded-full bg-white px-[9px] py-[1px] text-xs text-orange '>
                    {purchasesInCart?.length}
                  </span>
                )}
              </Link>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
