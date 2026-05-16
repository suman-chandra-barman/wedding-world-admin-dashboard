export interface CategoryImage {
  id: number;
  image_url: string;
  uploaded_at: string;
}

export interface CategoryItem {
  category_id: number;
  category_type: string;
  images: CategoryImage[];
  created_at: string;
  updated_at: string;
}

export interface CategoriesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: CategoryItem[];
}

export interface CategoryResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: CategoryItem;
}

export interface CategoryImageResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: CategoryImage | null;
}

export interface CategoryDeleteResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: null;
}
