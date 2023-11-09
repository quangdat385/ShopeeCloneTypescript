import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Link, createSearchParams, useNavigate } from 'react-router-dom';
import Button from 'src/components/Button/Button';
import InputNumber from 'src/components/InputNumber';
import { NoUndefinedField } from 'src/types/utils.type';
import { Schema, schema } from 'src/utils/rules';
import { ObjectSchema } from 'yup';
import RatingStars from '../RatingStars';
import { QueryConfig } from 'src/hooks/useQueryConfig';
import { Category } from 'src/types/category.type';
import path from 'src/constants/path';
import omit from 'lodash/omit';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

interface Props {
  queryConfig: QueryConfig;
  categories: Category[];
}

const priceSchema = schema.pick(['price_min', 'price_max']);

type FormData = NoUndefinedField<Pick<Schema, 'price_max' | 'price_min'>>;

function AsideFilter({ queryConfig, categories }: Props) {
  const { t } = useTranslation('home');
  const { category } = queryConfig;
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
    reset
  } = useForm<FormData>({
    defaultValues: {
      price_min: '',
      price_max: ''
    },
    resolver: yupResolver<FormData>(priceSchema as ObjectSchema<FormData>)
  });
  const navigate = useNavigate();
  const onSubmit = handleSubmit((data) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        price_max: data.price_max,
        price_min: data.price_min
      }).toString()
    });
  });

  const handleRemoveAll = () => {
    reset();
    navigate({
      pathname: path.home,
      search: createSearchParams(omit(queryConfig, ['price_min', 'price_max', 'rating_filter', 'category'])).toString()
    });
  };
  return (
    <div className='py-4'>
      <Link
        to={path.home}
        className={classNames('flex items-center font-bold capitalize', {
          'text-orange': !category
        })}
      >
        <svg viewBox='0 0 12 10' className='mr-3 h-4 w-3 fill-current'>
          <g fillRule='evenodd' stroke='none' strokeWidth={1}>
            <g transform='translate(-373 -208)'>
              <g transform='translate(155 191)'>
                <g transform='translate(218 17)'>
                  <path d='m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                </g>
              </g>
            </g>
          </g>
        </svg>
        {t('aside filter.all categories')}
      </Link>
      <div className='my-4 h-[1px] bg-gray-300' />
      <ul>
        {categories.map((item) => {
          const isActive = category === item._id;
          return (
            <li className='py-2 pl-2' key={item._id}>
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    category: item._id
                  }).toString()
                }}
                className={classNames('relative px-2', {
                  'font-semibold text-orange': isActive
                })}
              >
                <svg viewBox='0 0 4 7' className='absolute top-[25%] left-[-10px] h-2 w-2 fill-orange'>
                  <polygon points='4 3.5 0 0 0 7' />
                </svg>
                {item.name === 'Đồng hồ'
                  ? t('aside filter.watch')
                  : item.name === 'Áo thun'
                  ? t('aside filter.t_shirt')
                  : t('aside filter.phone')}
              </Link>
            </li>
          );
        })}
      </ul>
      <Link to={path.home} className='mt-4 flex items-center font-bold uppercase '>
        <svg
          enableBackground='new 0 0 15 15'
          viewBox='0 0 15 15'
          x={0}
          y={0}
          className='mr-3 h-4 w-3 fill-current stroke-current'
        >
          <g>
            <polyline
              fill='none'
              points='5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeMiterlimit={10}
            />
          </g>
        </svg>
        {t('aside filter.filter search')}
      </Link>
      <div className='my-4 h-[1px] bg-gray-300' />
      <div className='my-5'>
        <div className='capitalize'>{t('aside filter.range_price')}</div>
        <form className='mt-2' onSubmit={onSubmit}>
          <div className='flex items-start'>
            <Controller
              control={control}
              name='price_min'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    placeholder={`₫ ${t('aside filter.from')}`}
                    classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                    classNameError='hidden'
                    {...field}
                    onChange={(event) => {
                      field.onChange(event);
                      trigger('price_max');
                    }}
                  />
                );
              }}
            />
            <div className='mx-2 my-auto  shrink-0'>-</div>
            <Controller
              control={control}
              name='price_max'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    placeholder={`₫ ${t('aside filter.to')}`}
                    classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                    classNameError='hidden'
                    {...field}
                    onChange={(event) => {
                      field.onChange(event);
                      trigger('price_min');
                    }}
                  />
                );
              }}
            />
          </div>
          <div className='mt-1 min-h-[1.25rem] text-center text-sm text-red-600'>{errors.price_min?.message}</div>
          <Button className='flex w-full items-center justify-center bg-orange p-2 text-sm uppercase text-white hover:bg-orange/80'>
            {t('aside filter.apply')}
          </Button>
        </form>
      </div>
      <div className='my-4 h-[1px] bg-gray-300'></div>
      <div className='text-sm'>{t('aside filter.rating')}</div>
      <RatingStars queryConfig={queryConfig} />
      <div className='my-4 h-[1px] bg-gray-300' />
      <Button
        onClick={handleRemoveAll}
        className='flex w-full items-center justify-center bg-orange p-2 text-sm uppercase text-white hover:bg-orange/80'
      >
        {t('aside filter.clearAll')}
      </Button>
    </div>
  );
}

export default AsideFilter;
