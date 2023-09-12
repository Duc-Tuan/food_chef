export type ITimestamps = {
  timestamps: boolean;
};

export type IPaganition = {
  page: number;
  pageSize: number;
};

export const maxSize: number = 3;
export const maxSizeImage: number = maxSize * 1024 * 1024;

export const nameFile: {
  products: string; banners: string; users: string, merchant: string, categories: string,
  productDetails: string,
  shippers: string,
} = {
  shippers: 'shippers',
  products: 'products',
  banners: 'banners',
  merchant: 'merchant',
  categories: 'categories',
  productDetails: 'productDetails',
  users: 'users',
};

export const autoCode = (nameCode: string, data: number) => {
  const converIndex: string = data.toString().padStart(6, '0');
  return `${nameCode}${converIndex}`;
};
