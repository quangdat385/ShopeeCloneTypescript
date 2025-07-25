import { UserSchema, userSchema } from 'src/utils/rules';
import DateSelect from 'src/pages/User/components/DateSelect';
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from 'src/components/Button/Button';
import { Fragment, useContext, useEffect, useMemo, useState } from 'react';
import Input from 'src/components/Input';
import InputNumber from 'src/components/InputNumber';
import { AppContext } from 'src/contexts/app.context';
import { useMutation, useQuery } from '@tanstack/react-query';
import userApi from 'src/apis/user.api';
import { getAvatarUrl, isAxiosUnprocessableEntityError } from 'src/utils/utils';
import InputFile from 'src/components/InputFile';
import { setProfileToLS } from 'src/utils/auth';
import { toast } from 'react-toastify';
import { ErrorResponse } from 'src/types/utils.type';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

type FormData = Pick<UserSchema, 'name' | 'address' | 'phone' | 'date_of_birth' | 'avatar'>;
type FormDataError = Omit<FormData, 'date_of_birth'> & {
  date_of_birth?: string;
};
const profileSchema = userSchema.pick(['name', 'address', 'phone', 'date_of_birth', 'avatar']);
function Info() {
  const { t } = useTranslation('user');
  const {
    register,
    control,
    formState: { errors }
  } = useFormContext<FormData>();

  return (
    <Fragment>
      <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
        <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>{t('user details.name')}</div>
        <div className='sm:w-[80%] sm:pl-5'>
          <Input
            classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
            register={register}
            name='name'
            placeholder='Tên'
            errorMessage={errors.name?.message}
          />
        </div>
      </div>
      <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
        <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>{t('user details.phone')}</div>
        <div className='sm:w-[80%] sm:pl-5'>
          <Controller
            control={control}
            name='phone'
            render={({ field }) => (
              <InputNumber
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                placeholder='Số điện thoại'
                errorMessage={errors.phone?.message}
                {...field}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>
    </Fragment>
  );
}

function Profile() {
  const { t } = useTranslation('user');
  const { setProfile } = useContext(AppContext);
  const [file, setFile] = useState<File>();

  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : '';
  }, [file]);

  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: userApi.getProfile
  });
  const profile = profileData?.data.data;
  const updateProfileMutation = useMutation(userApi.updateProfile);
  const uploadAvatarMutaion = useMutation(userApi.uploadAvatar);

  const methods = useForm<FormData>({
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      avatar: '',
      date_of_birth: new Date(1990, 0, 1)
    },
    resolver: yupResolver<FormData>(profileSchema)
  });
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    setError
  } = methods;
  const avatar = watch('avatar');
  const onSubmit = handleSubmit(async (data) => {
    try {
      let avatarName = avatar;
      if (file) {
        const form = new FormData();
        form.append('image', file);
        const uploadRes = await uploadAvatarMutaion.mutateAsync(form);
        avatarName = uploadRes.data.data;
        setValue('avatar', avatarName);
      }
      const res = await updateProfileMutation.mutateAsync({
        ...data,
        date_of_birth: data.date_of_birth?.toISOString(),
        avatar: avatarName
      });
      setProfile(res.data.data);
      setProfileToLS(res.data.data);
      // refetch()
      toast.success(res.data.message);
    } catch (error) {
      if (isAxiosUnprocessableEntityError<ErrorResponse<FormDataError>>(error)) {
        const formError = error.response?.data.data;
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormDataError, {
              message: formError[key as keyof FormDataError],
              type: 'Server'
            });
          });
        }
      }
    }
  });
  useEffect(() => {
    if (profile) {
      setValue('name', profile.name || '');
      setValue('phone', profile.phone || '');
      setValue('address', profile.address || '');
      setValue('avatar', profile.avatar || '');
      setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(1970, 0, 1));
    }
  }, [profile, setValue]);

  const handleChangeFile = (file?: File) => {
    setFile(file);
  };

  return (
    <div className='rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20'>
      <Helmet>
        <title>{t('user details.profile')} | Đạt Nguyễn Shop</title>
        <meta name='description' content={t('user details.policy')} />
      </Helmet>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>{t('user details.profile')}</h1>
        <div className='mt-1 text-sm text-gray-700'>{t('user details.policy')}</div>
      </div>
      <FormProvider {...methods}>
        <form onSubmit={onSubmit} className='mt-8 flex flex-col-reverse md:flex-row md:items-start'>
          <div className='mt-6 flex-grow md:mt-0 md:pr-12'>
            <div className='flex flex-col flex-wrap sm:flex-row'>
              <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Email</div>
              <div className='sm:w-[80%] sm:pl-5'>
                <div className='pt-3 text-gray-700'>{profile?.email}</div>
              </div>
            </div>
            <Info />
            <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
              <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>{t('user details.address')}</div>
              <div className='sm:w-[80%] sm:pl-5'>
                <Input
                  classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                  register={register}
                  name='address'
                  placeholder='Địa chỉ'
                  errorMessage={errors.address?.message}
                />
              </div>
            </div>
            <Controller
              control={control}
              name='date_of_birth'
              render={({ field }) => (
                <DateSelect
                  errorMessage={errors.date_of_birth?.message}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
              <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right' />
              <div className='sm:w-[80%] sm:pl-5'>
                <Button
                  className='flex h-9 items-center rounded-sm bg-orange px-5 text-center text-sm text-white hover:bg-orange/80'
                  type='submit'
                >
                  {t('user details.saveBtn')}
                </Button>
              </div>
            </div>
          </div>
          <div className='flex justify-center md:w-72 md:border-l md:border-l-gray-200'>
            <div className='flex flex-col items-center'>
              <div className='my-5 h-24 w-24'>
                <img
                  src={previewImage || getAvatarUrl(avatar)}
                  alt={profile?.name}
                  className='h-full w-full rounded-full object-cover'
                />
              </div>
              <InputFile onChange={handleChangeFile} />
              <div className='mt-3 text-gray-400'>
                <div>{t('user details.size')}</div>
                <div>{t('user details.extension')}</div>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default Profile;
