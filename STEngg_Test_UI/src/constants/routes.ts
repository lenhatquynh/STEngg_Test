export const ROUTES = {
  ROOT: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id: string) => `/products/${id}`,
  PRODUCT_CREATE: '/products/create',
  PRODUCT_EDIT: (id: string) => `/products/${id}/edit`,
  CATEGORIES: '/categories',
}
