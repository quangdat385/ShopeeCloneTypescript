import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import omit from 'lodash/omit';

import { schema, Schema } from 'src/utils/rules';
import Input from 'src/components/Input';
import authApi from 'src/apis/auth.api';
import { isAxiosUnprocessableEntityError } from 'src/utils/utils';
import { ErrorResponse } from 'src/types/utils.type';
import Button from 'src/components/Button/Button';
import { useContext } from 'react';
import { AppContext } from 'src/contexts/app.context';
import path from 'src/constants/path';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

// import { useContext } from 'react';
// import { AppContext } from 'src/contexts/app.context';

// interface FormData {
//   email: string;
//   password: string;
//   confirm_password: string;
// }

type FormData = Pick<Schema, 'email' | 'password' | 'confirm_password'>;
const registerSchema = schema.pick(['email', 'password', 'confirm_password']);

function Register() {
  const { t } = useTranslation('user');
  const { setIsAuthenticated, setProfile } = useContext(AppContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    // getValues,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema)
  });
  // const rules = getRules(getValues);
  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.registerAccount(body)
  });
  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ['confirm_password']);
    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        setIsAuthenticated(true);
        setProfile(data.data.data.user);
        navigate('/');
      },
      onError: (error) => {
        console.log(error);
        if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<FormData, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data;
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<FormData, 'confirm_password'>, {
                message: formError[key as keyof Omit<FormData, 'confirm_password'>],
                type: 'Server'
              });
            });
          }
          // if (formError?.email) {
          //   setError('email', {
          //     message: formError.email,
          //     type: 'Server'
          //   })
          // }
          // if (formError?.password) {
          //   setError('password', {
          //     message: formError.password,
          //     type: 'Server'
          //   })
          // }
        }
      }
    });
  });
  return (
    <div className='bg-orange'>
      <Helmet>
        <title>Đăng ký | Shopee Clone</title>
        <meta name='description' content='Đăng ký tài khoản vào dự án Shopee Clone' />
      </Helmet>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'>{t('auth.register')}</div>
              <Input
                name='email'
                type='email'
                register={register}
                // rules={rules.email}
                className='mt-2'
                placeholder='Enter Email'
                errorMessage={errors.email?.message}
              />
              <Input
                name='password'
                type='password'
                register={register}
                // rules={rules.password}
                className='mt-2'
                placeholder='Enter Password'
                errorMessage={errors.password?.message}
              />
              <Input
                name='confirm_password'
                type='password'
                register={register}
                // rules={rules.confirm_password}
                className='mt-2'
                placeholder='Enter Confirm Password'
                errorMessage={errors.confirm_password?.message}
              />
              <div className='mt-2'>
                <Button
                  type='submit'
                  className='flex  w-full items-center justify-center bg-red-500 py-4 px-2 text-sm uppercase text-white hover:bg-red-600'
                  isLoading={registerAccountMutation.isLoading}
                  disabled={registerAccountMutation.isLoading}
                >
                  {t('auth.register')}
                </Button>
              </div>
              <div className='mt-8 flex items-center justify-center'>
                <span className='text-gray-400'>{t('auth.haveAccount')}</span>
                <Link className='ml-1 text-red-400' to={path.login}>
                  {t('auth.login')}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
