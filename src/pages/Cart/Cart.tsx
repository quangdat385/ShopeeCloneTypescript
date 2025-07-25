import { useMutation, useQuery } from '@tanstack/react-query';
import keyBy from 'lodash/keyBy';
import { useContext, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import purchaseApi from 'src/apis/purchase.api';
import Button from 'src/components/Button/Button';
import QuantityController from 'src/components/QuantityController';
import path from 'src/constants/path';
import { purchasesStatus } from 'src/constants/purchase';
import { AppContext } from 'src/contexts/app.context';
import { formatCurrency, generateNameId } from 'src/utils/utils';

import noproduct from 'src/assets/images/no-product.png';
import { produce } from 'immer';
import { Purchase } from 'src/types/purchase.type';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

function Cart() {
  const { t } = useTranslation('user');
  const { extendedPurchases, setExtendedPurchases } = useContext(AppContext);
  const { data: purchasesInCartData, refetch } = useQuery({
    queryKey: ['purchases', { status: purchasesStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.inCart })
  });

  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    onSuccess: () => {
      refetch();
    }
  });

  const buyProductsMutation = useMutation({
    mutationFn: purchaseApi.buyProducts,
    onSuccess: (data) => {
      refetch();
      toast.success(data.data.message, {
        position: 'top-center',
        autoClose: 1000
      });
    }
  });
  const deletePurchasesMutation = useMutation({
    mutationFn: purchaseApi.deletePurchase,
    onSuccess: () => {
      refetch();
    }
  });
  const location = useLocation();
  const choosenPurchaseIdFromLocation = (location.state as { purchaseId: string } | null)?.purchaseId;
  const purchasesInCart = purchasesInCartData?.data.data;

  const isAllChecked = useMemo(() => {
    return extendedPurchases.every((purchase) => {
      return purchase.checked;
    });
  }, [extendedPurchases]);
  const checkedPurchases = useMemo(() => extendedPurchases.filter((purchase) => purchase.checked), [extendedPurchases]);
  const checkedPurchasesCount = checkedPurchases.length;
  const totalCheckedPurchasePrice = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return result + current.product.price * current.buy_count;
      }, 0),
    [checkedPurchases]
  );
  const totalCheckedPurchaseSavingPrice = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return result + (current.product.price_before_discount - current.product.price) * current.buy_count;
      }, 0),
    [checkedPurchases]
  );
  useEffect(() => {
    setExtendedPurchases((prev) => {
      const extendedPurchasesObject = keyBy(prev, '_id');
      return (
        purchasesInCart?.map((purchase) => {
          const isChoosenPurchaseFromLocation = choosenPurchaseIdFromLocation === purchase._id;
          return {
            ...purchase,
            disabled: false,
            checked: isChoosenPurchaseFromLocation || Boolean(extendedPurchasesObject[purchase._id]?.checked)
          };
        }) || []
      );
    });
  }, [purchasesInCart]);

  useEffect(() => {
    return () => {
      history.replaceState(null, '');
    };
  }, []);

  const handleCheck = (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].checked = event.target.checked;
      })
    );
  };
  const handleCheckAll = () => {
    setExtendedPurchases((prev) =>
      prev.map((purchase) => ({
        ...purchase,
        checked: !isAllChecked
      }))
    );
  };
  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].buy_count = value;
      })
    );
  };
  const handleQuantity = (purchaseIndex: number, value: number, enable: boolean) => {
    if (enable) {
      const purchase = extendedPurchases[purchaseIndex];
      setExtendedPurchases(
        produce((draft) => {
          draft[purchaseIndex].disabled = true;
        })
      );
      updatePurchaseMutation.mutate({ product_id: purchase.product._id, buy_count: value });
    }
  };

  const handleDelete = (purchaseIndex: number) => () => {
    const purchaseId = extendedPurchases[purchaseIndex]._id;
    deletePurchasesMutation.mutate([purchaseId]);
  };

  const handleDeleteManyPurchases = () => {
    const purchasesIds = checkedPurchases.map((purchase) => purchase._id);
    deletePurchasesMutation.mutate(purchasesIds);
  };
  const handleBuyPurchases = () => {
    if (checkedPurchases.length > 0) {
      const body = checkedPurchases.map((purchase) => ({
        product_id: purchase.product._id,
        buy_count: purchase.buy_count
      }));
      buyProductsMutation.mutate(body);
    }
  };

  return (
    <div className='bg-neutral-100 py-16'>
      <Helmet>
        <title>{t('cart.title')} | Đạt Nguyễn Shop</title>
        <meta name='description' content={'Giỏ hàng của bạn'} />
      </Helmet>
      <div className='container'>
        {extendedPurchases.length > 0 ? (
          <>
            <div className='overflow-auto'>
              <div className='min-w-[1000px]'>
                <div className='grid grid-cols-12 capitalize shadow rounded-sm bg-white py-5 px-9 text-gray-500  '>
                  <div className='col-span-6'>
                    <div className='flex items-center'>
                      <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                        <input
                          type='checkbox'
                          checked={isAllChecked}
                          onChange={handleCheckAll}
                          className='h-5 w-5 accent-orange'
                        />
                      </div>
                      <div className='flex-grow text-black'>{t('cart.product')}</div>
                    </div>
                  </div>
                  <div className='col-span-6'>
                    <div className='grid grid-cols-5 text-center'>
                      <div className='col-span-2'>{t('cart.unit_price')}</div>
                      <div className='col-span-1'>{t('cart.quantity')}</div>
                      <div className='col-span-1'>{t('cart.totalPrice')}</div>
                      <div className='col-span-1'>{t('cart.actions')}</div>
                    </div>
                  </div>
                </div>
                {extendedPurchases.length > 0 &&
                  extendedPurchases.map((purchase, index) => {
                    return (
                      <div className='my-3 rounded-sm bg-white p-5 shadow' key={purchase._id}>
                        <div className='mb-5 grid grid-cols-12 items-center rounded-sm border border-gray-200 bg-white py-5 px-4 text-center text-sm text-gray-500 first:mt-0'>
                          <div className='col-span-6'>
                            <div className='flex'>
                              <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                                <input
                                  type='checkbox'
                                  checked={purchase.checked}
                                  onChange={handleCheck(index)}
                                  className='h-5 w-5 accent-orange'
                                />
                              </div>
                              <div className='flex-grow'>
                                <div className='flex'>
                                  <Link
                                    className='h-20 w-20 flex-shrink-0'
                                    to={`${path.home}${generateNameId({
                                      name: purchase.product.name,
                                      id: purchase.product._id
                                    })}`}
                                  >
                                    <img alt={purchase.product.name} src={purchase.product.image} />
                                  </Link>
                                  <div className='flex-grow px-2 pt-1 pb-2'>
                                    <Link
                                      to={`${path.home}${generateNameId({
                                        name: purchase.product.name,
                                        id: purchase.product._id
                                      })}`}
                                      className='text-left line-clamp-2'
                                    >
                                      {purchase.product.name}
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='col-span-6'>
                            <div className='grid grid-cols-5 items-center'>
                              <div className='col-span-2'>
                                <div className='flex items-center justify-center'>
                                  <span className='text-gray-300 line-through'>
                                    ₫{formatCurrency(purchase.product.price_before_discount)}
                                  </span>
                                  <span className='ml-3'>₫{formatCurrency(purchase.product.price)}</span>
                                </div>
                              </div>
                              <div className='col-span-1'>
                                <QuantityController
                                  max={purchase.product.quantity}
                                  value={purchase.buy_count}
                                  classNameWrapper='flex items-center'
                                  onIncrease={(value) =>
                                    handleQuantity(index, value, value <= purchase.product.quantity)
                                  }
                                  onDecrease={(value) => handleQuantity(index, value, value >= 1)}
                                  onType={handleTypeQuantity(index)}
                                  onFocusOut={(value) =>
                                    handleQuantity(
                                      index,
                                      value,
                                      value >= 1 &&
                                        value <= purchase.product.quantity &&
                                        value !== (purchasesInCart as Purchase[])[index].buy_count
                                    )
                                  }
                                  disabled={purchase.disabled}
                                />
                              </div>
                              <div className='col-span-1'>
                                <span className='text-orange'>
                                  ₫{formatCurrency(purchase.product.price * purchase.buy_count)}
                                </span>
                              </div>
                              <div className='col-span-1'>
                                <button
                                  onClick={handleDelete(index)}
                                  className='bg-none text-black transition-colors hover:text-orange'
                                >
                                  {t('cart.delete')}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className='sticky bottom-0 z-10 mt-8 flex flex-col rounded-sm border border-gray-100 bg-white p-9 shadow sm:flex-row sm:items-center'>
              <div className='flex items-center'>
                <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                  <input
                    type='checkbox'
                    checked={isAllChecked}
                    onChange={handleCheckAll}
                    className='h-5 w-5 accent-orange'
                  />
                </div>
                <button onClick={handleCheckAll} className='mx-3 border-none bg-none'>
                  {t('cart.selectAll')} ({extendedPurchases.length})
                </button>
                <button onClick={handleDeleteManyPurchases} className='mx-3 border-none bg-none'>
                  {t('cart.delete')}
                </button>
              </div>

              <div className='mt-5 flex flex-col sm:ml-auto sm:mt-0 sm:flex-row sm:items-center'>
                <div>
                  <div className='flex items-center sm:justify-end'>
                    <div>
                      {t('cart.total')} ({checkedPurchasesCount} sản phẩm):
                    </div>
                    <div className='ml-2 text-2xl text-orange'>₫{formatCurrency(totalCheckedPurchasePrice)}</div>
                  </div>
                  <div className='flex items-center text-sm sm:justify-end'>
                    <div className='text-gray-500'>{t('cart.save')}:</div>
                    <div className='ml-6 text-orange'>₫{formatCurrency(totalCheckedPurchaseSavingPrice)}</div>
                  </div>
                </div>
                <Button
                  onClick={handleBuyPurchases}
                  disabled={buyProductsMutation.isLoading}
                  className='mt-5 flex h-10 w-52 items-center justify-center bg-red-500 text-sm uppercase text-white hover:bg-red-600 sm:ml-4 sm:mt-0'
                >
                  {t('cart.purchase')}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className='text-center'>
            <img src={noproduct} alt='no purchase' className='mx-auto h-24 w-24' />
            <div className='mt-5 font-bold text-gray-400'>Giỏ hàng của bạn còn trống</div>
            <div className='mt-5 text-center'>
              <Link
                to={path.home}
                className=' rounded-sm bg-orange px-10 py-2  uppercase text-white transition-all hover:bg-orange/80'
              >
                Mua ngay
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
