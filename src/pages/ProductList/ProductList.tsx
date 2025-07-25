import AsideFilter from './components/AsideFilter';
import SortProductList from './components/SortProductList';
import Product from './components/Product';
import Pagination from 'src/components/Pagination';
import useQueryConfig from 'src/hooks/useQueryConfig';
import { useQuery } from '@tanstack/react-query';
import productApi from 'src/apis/product.api';
import { ProductListConfig } from 'src/types/product.type';
import categoryApi from 'src/apis/category.api';
import { Helmet } from 'react-helmet-async';

function ProductList() {
  const queryConfig = useQueryConfig();

  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig);
    },
    keepPreviousData: true,
    staleTime: 3 * 60 * 1000
  });
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategories();
    }
  });

  return (
    <div className='bg-200 py-6'>
      <Helmet>
        <title>Trang chủ | Dạt Nguyễn Shop</title>
        <meta name='description' content='Trang chủ dự án Dạt Nguyễn Shop' />
      </Helmet>
      <div className='container'>
        {productsData && (
          <div className='grid grid-cols-12 gap-6 '>
            <div className='col-span-3'>
              <AsideFilter queryConfig={queryConfig} categories={categoriesData?.data.data || []} />
            </div>
            <div className='col-span-9'>
              <SortProductList queryConfig={queryConfig} pageSize={productsData.data.data.pagination.page_size} />
              <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {productsData.data.data.products.map((product) => {
                  return (
                    <div className='col-span-1' key={product._id}>
                      <Product product={product} />
                    </div>
                  );
                })}
              </div>
              <Pagination queryConfig={queryConfig} pageSize={productsData.data.data.pagination.page_size} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductList;
