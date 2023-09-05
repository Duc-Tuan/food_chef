export type ITimestamps = {
  timestamps: boolean;
};

export type IPaganition = {
  page: number;
  pageSize: number;
};

export const maxSize: number = 5;
export const maxSizeImage: number = maxSize * 1024 * 1024;

export const nameFile: { products: string; bannersCategories: string; users: string } = {
  products: 'products',
  bannersCategories: 'bannersCategories',
  users: 'users',
};

export const autoCode = (nameCode: string, data: number) => {
  const converIndex: string = data.toString().padStart(6, '0');
  return `${nameCode}${converIndex}`;
};
