import { Product, ProductDimensions, ProductReview, ProductMeta } from "./Product.js";

interface res {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

export const fetchAllProducts = async (): Promise<Product[]> => {
    try {
        const response = await fetch('https://dummyjson.com/products');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: res = await response.json();
        // Sanitize products to ensure all required fields are valid
        const sanitizedProducts = data.products.map(product => {
            const sanitized: Product = {
                id: typeof product.id === 'number' ? product.id : 0,
                title: product.title || 'Unknown Product',
                description: product.description || 'No description available',
                price: typeof product.price === 'number' ? product.price : 0,
                images: Array.isArray(product.images) ? product.images : [],
                category: product.category || 'Uncategorized',
                rating: typeof product.rating === 'number' ? product.rating : 0,
                discountPercentage: typeof product.discountPercentage === 'number' ? product.discountPercentage : 0,
                stock: typeof product.stock === 'number' ? product.stock : 0,
                tags: Array.isArray(product.tags) ? product.tags : [],
                brand: product.brand || 'Unknown Brand',
                sku: product.sku || 'UNKNOWN-SKU',
                weight: typeof product.weight === 'number' ? product.weight : 0,
                dimensions: product.dimensions && typeof product.dimensions === 'object'
                    ? {
                        width: typeof product.dimensions.width === 'number' ? product.dimensions.width : 0,
                        height: typeof product.dimensions.height === 'number' ? product.dimensions.height : 0,
                        depth: typeof product.dimensions.depth === 'number' ? product.dimensions.depth : 0
                    }
                    : { width: 0, height: 0, depth: 0 },
                warrantyInformation: product.warrantyInformation || 'No warranty information',
                shippingInformation: product.shippingInformation || 'No shipping information',
                availabilityStatus: product.availabilityStatus || 'Unknown',
                reviews: Array.isArray(product.reviews) ? product.reviews : [],
                returnPolicy: product.returnPolicy || 'No return policy',
                minimumOrderQuantity: typeof product.minimumOrderQuantity === 'number' ? product.minimumOrderQuantity : 1,
                meta: product.meta && typeof product.meta === 'object'
                    ? {
                        createdAt: product.meta.createdAt || new Date().toISOString(),
                        updatedAt: product.meta.updatedAt || new Date().toISOString(),
                        barcode: product.meta.barcode || 'UNKNOWN-BARCODE',
                        qrCode: product.meta.qrCode || 'UNKNOWN-QRCODE'
                    }
                    : {
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        barcode: 'UNKNOWN-BARCODE',
                        qrCode: 'UNKNOWN-QRCODE'
                    },
                thumbnail: product.thumbnail || 'https://via.placeholder.com/300'
            };
            // Log any product with missing critical fields for debugging
            if (!product.title || !product.description || !product.category || !product.brand || !product.tags) {
                console.warn('Incomplete product data:', product);
            }
            return sanitized;
        });
        console.log('Sanitized products:', sanitizedProducts.length); // Debug sanitized count
        return sanitizedProducts;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};