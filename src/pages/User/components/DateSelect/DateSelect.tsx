import range from 'lodash/range';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  onChange: (value: Date) => void;
  value?: Date;
  errorMessage?: string;
}

function DateSelect({ value, onChange, errorMessage }: Props) {
  const { t } = useTranslation('user');
  const [date, setDate] = useState({
    date: value?.getDate() || 1,
    month: value?.getMonth() || 0,
    year: value?.getFullYear() || 1970
  });

  useEffect(() => {
    if (value) {
      setDate({
        date: value.getDate(),
        month: value.getMonth(),
        year: value.getFullYear()
      });
    }
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value: valueFromSelect, name } = event.target;
    const newDate = {
      date: value?.getDate() || date.date,
      month: value?.getMonth() || date.month,
      year: value?.getFullYear() || date.year,
      [name]: Number(valueFromSelect)
    };
    setDate(newDate);
    onChange && onChange(new Date(newDate.year, newDate.month, newDate.date));
  };

  return (
    <div className='mt-2 flex flex-column flex-wrap sm:flex-row '>
      <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>{t('user details.birthday')}</div>
      <div className='sm:w-[80%] sm:pl-5'>
        <div className='flex justify-between'>
          <select
            onChange={handleChange}
            name='date'
            className='h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3 hover:border-orange'
            value={value?.getDate() || date.date}
          >
            <option disabled>{t('user details.day')}</option>
            {range(1, 32).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            onChange={handleChange}
            name='month'
            className='h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3 hover:border-orange'
            value={value?.getMonth() || date.month}
          >
            <option disabled>{t('user details.month')}</option>
            {range(0, 11).map((item) => (
              <option key={item} value={item}>
                {item + 1}
              </option>
            ))}
          </select>
          <select
            onChange={handleChange}
            name='year'
            className='h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3 hover:border-orange'
            value={value?.getFullYear() || date.year}
          >
            <option disabled>{t('user details.year')}</option>
            {range(1950, 2050).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className='mt-1 min-h-[1.25rem] text-sm text-red-600'>{errorMessage}</div>
      </div>
    </div>
  );
}

export default DateSelect;
