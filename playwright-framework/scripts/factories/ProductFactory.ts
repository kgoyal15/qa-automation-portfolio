import { faker } from '@faker-js/faker';

export interface ProductData {
  id?: number;
  name: string;
  sku: string;
  price: number;
  category: string;
  description: string;
  inStock: boolean;
  quantity: number;
  imageUrl: string;
}

/**
 * ProductFactory — generates realistic product test data using Faker.
 */
export class ProductFactory {
  private readonly categories = [
    'Electronics',
    'Clothing',
    'Home & Garden',
    'Books',
    'Sports',
    'Toys',
    'Beauty',
    'Automotive',
  ];

  build(overrides: Partial<ProductData> = {}): ProductData {
    const price = parseFloat(faker.commerce.price({ min: 5, max: 500 }));

    return {
      name: faker.commerce.productName(),
      sku: `SKU-${faker.string.alphanumeric(8).toUpperCase()}`,
      price,
      category: faker.helpers.arrayElement(this.categories),
      description: faker.commerce.productDescription(),
      inStock: faker.datatype.boolean({ probability: 0.8 }),
      quantity: faker.number.int({ min: 0, max: 999 }),
      imageUrl: faker.image.urlPicsumPhotos({ width: 640, height: 480 }),
      ...overrides,
    };
  }

  buildMany(count: number, overrides: Partial<ProductData> = {}): ProductData[] {
    return Array.from({ length: count }, () => this.build(overrides));
  }

  buildOutOfStock(overrides: Partial<ProductData> = {}): ProductData {
    return this.build({ inStock: false, quantity: 0, ...overrides });
  }
}
