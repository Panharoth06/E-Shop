import { fetchAllProducts } from './fetchAllProducts.js';
import { Product } from './Product.js';

const navbar = (): string => `
    <nav class="navbar-transition bg-white shadow-lg">
        <div class="container mx-auto px-4 py-4 flex items-center justify-between">
                <a href="/" class="text-2xl font-bold text-black flex items-center space-x-2">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h18v18H3z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9l6 6"/>
                    </svg>
                    <span>E-Shop</span>
                </a>
            <form id="search-form" class="hidden md:flex items-center w-full max-w-md">
                <div class="relative w-full">
                    <input 
                        id="search-navbar"
                        type="text" 
                        placeholder="Search products..." 
                        class="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                        aria-label="Search products"
                    />
                    <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <button type="submit" class="ml-2 px-4 py-2 gradient-bg text-white rounded-full hover:opacity-90 transition-all duration-300" aria-label="Submit search">
                    Search
                </button>
            </form>
            <button id="menu-toggle" class="md:hidden text-gray-600 hover:text-purple-600" aria-label="Toggle menu">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
        </div>
        <div id="mobile-menu" class="hidden md:hidden bg-white border-t">
            <form id="mobile-search-form" class="p-4">
                <div class="relative">
                    <input 
                        id="mobile-search-navbar"
                        type="text" 
                        placeholder="Search products..." 
                        class="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                        aria-label="Search products"
                    />
                    <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <button type="submit" class="mt-2 w-full gradient-bg text-white px-4 py-2 rounded-full hover:opacity-90 transition-all duration-300" aria-label="Submit search">
                    Search
                </button>
            </form>
        </div>
    </nav>
`;

const getSearchValue = (): string => {
    const inputs = [
        document.getElementById('search-navbar') as HTMLInputElement | null,
        document.getElementById('mobile-search-navbar') as HTMLInputElement | null
    ];
    const input = inputs.find(i => i && i.value.trim() !== '');
    console.log('Search inputs:', inputs.map(i => i?.value)); // Debug input values
    return input?.value.toLowerCase().trim() ?? '';
};

class ProductListPage {
    private container: HTMLElement;
    private toastContainer: HTMLElement;
    private allProducts: Product[] = [];
    private debounceTimeout: number | null = null;

    constructor() {
        this.container = document.getElementById('product-container')!;
        this.toastContainer = document.getElementById('toast-container')!;
        if (!this.container) {
            console.error('Product container not found');
        }
        this.init();
    }

    private async init(): Promise<void> {
        this.showLoadingState();
        try {
            const products = await fetchAllProducts();
            this.allProducts = products; // Rely on fetchAllProducts sanitization
            console.log('Fetched products:', this.allProducts.length); // Debug product count
            if (this.allProducts.length > 0) {
                this.renderProducts(this.allProducts);
            } else {
                this.showErrorState('No valid products found.');
            }
        } catch (error) {
            this.showErrorState('Failed to load products. Please try again later.');
            console.error('Error in init:', error);
        }
        this.setupNavbar();
    }

    private setupNavbar(): void {
        const navbarContainer = document.getElementById('navbar-container');
        if (navbarContainer) {
            navbarContainer.innerHTML = navbar();
            console.log('Navbar rendered'); // Debug navbar
            this.setupSearchListeners();
            this.setupMenuToggle();
        } else {
            console.error('Navbar container not found');
        }
    }

    private setupSearchListeners(): void {
        ['search-form', 'mobile-search-form'].forEach(formId => {
            const form = document.getElementById(formId) as HTMLFormElement | null;
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    console.log('Form submitted:', formId); // Debug form submission
                    this.handleSearch();
                });
            } else {
                console.warn(`Form ${formId} not found`);
            }
        });

        ['search-navbar', 'mobile-search-navbar'].forEach(id => {
            const input = document.getElementById(id) as HTMLInputElement | null;
            if (input) {
                input.addEventListener('input', () => {
                    console.log('Input event on', id, 'value:', input.value); // Debug input
                    if (this.debounceTimeout) {
                        clearTimeout(this.debounceTimeout);
                    }
                    this.debounceTimeout = setTimeout(() => {
                        this.handleSearch();
                    }, 300);
                });
            } else {
                console.warn(`Input ${id} not found`);
            }
        });
    }

    private setupMenuToggle(): void {
        const menuToggle = document.getElementById('menu-toggle') as HTMLButtonElement | null;
        const mobileMenu = document.getElementById('mobile-menu') as HTMLElement | null;
        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
                console.log('Mobile menu toggled'); // Debug menu toggle
            });
        } else {
            console.warn('Menu toggle or mobile menu not found');
        }
    }

    private handleSearch(): void {
        const searchValue = getSearchValue();
        console.log('Search value:', searchValue); // Debug search value
        const filtered = this.allProducts.filter(product => {
            try {
                return (
                    (product.title?.toLowerCase() || '').includes(searchValue) ||
                    (product.description?.toLowerCase() || '').includes(searchValue) ||
                    (product.category?.toLowerCase() || '').includes(searchValue) ||
                    (product.brand?.toLowerCase() || '').includes(searchValue) ||
                    (Array.isArray(product.tags) ? product.tags.some(tag => (tag?.toLowerCase() || '').includes(searchValue)) : false) ||
                    (product.sku?.toLowerCase() || '').includes(searchValue)
                );
            } catch (error) {
                console.warn('Error filtering product:', product, error);
                return false;
            }
        });
        console.log('Filtered products:', filtered.length); // Debug filtered count
        if (filtered.length === 0 && searchValue) {
            this.showErrorState('No products match your search.');
        } else {
            this.renderProducts(filtered);
        }
    }

    private showLoadingState(): void {
        this.container.innerHTML = '';
        const loadingDiv = this.createElement('div', {
            className: 'col-span-full text-center py-16'
        });
        
        const spinner = this.createElement('div', {
            className: 'animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600 mx-auto'
        });
        
        const text = this.createElement('p', {
            className: 'mt-4 text-gray-600 text-lg',
            textContent: 'Loading products...'
        });
        
        loadingDiv.append(spinner, text);
        this.container.appendChild(loadingDiv);
    }

    private showErrorState(message: string): void {
        this.container.innerHTML = '';
        const errorDiv = this.createElement('div', {
            className: 'col-span-full text-center py-16 text-red-600'
        });
        const errorText = this.createElement('p', {
            className: 'text-lg font-medium',
            textContent: message
        });
        const retryButton = this.createElement('button', {
            className: 'mt-4 gradient-bg text-white px-6 py-2 rounded-full hover:opacity-90 transition-all',
            textContent: getSearchValue() ? 'Clear Search' : 'Try Again',
            onclick: () => {
                if (getSearchValue()) {
                    const inputs = ['search-navbar', 'mobile-search-navbar'];
                    inputs.forEach(id => {
                        const input = document.getElementById(id) as HTMLInputElement | null;
                        if (input) input.value = '';
                    });
                    this.handleSearch();
                } else {
                    this.init();
                }
            }
        });
        errorDiv.append(errorText, retryButton);
        this.container.appendChild(errorDiv);
    }

    private createElement<K extends keyof HTMLElementTagNameMap>(
        tag: K,
        options: { className?: string; textContent?: string; [key: string]: any } = {}
    ): HTMLElementTagNameMap[K] {
        const element = document.createElement(tag);
        Object.assign(element, options);
        if (options.className) element.className = options.className;
        if (options.textContent) element.textContent = options.textContent;
        return element;
    }

    private showToast(message: string, type: 'success' | 'error' = 'success'): void {
        const toast = this.createElement('div', {
            className: `toast glass-effect px-6 py-3 rounded-lg shadow-lg ${type === 'success' ? 'bg-green-500 text-green-500' : 'bg-red-500 text-red-500'}`,
            textContent: message
        });
        this.toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    private calculateDiscountedPrice(price: number, discountPercentage: number): number {
        return price * (1 - discountPercentage / 100);
    }

    private createStarElement(filled: boolean = true, size: string = 'w-4 h-4'): SVGElement {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', `${size} ${filled ? 'text-yellow-400' : 'text-gray-300'} transition-colors duration-300`);
        svg.setAttribute('fill', 'currentColor');
        svg.setAttribute('viewBox', '0 0 20 20');
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z');
        
        svg.appendChild(path);
        return svg;
    }

    private createStarsContainer(rating: number, size: string = 'w-4 h-4'): HTMLElement {
        const container = this.createElement('div', { className: 'flex gap-1' });
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        for (let i = 0; i < fullStars; i++) container.appendChild(this.createStarElement(true, size));
        if (hasHalfStar) {
            const halfStar = this.createStarElement(true, size);
            halfStar.style.clipPath = 'inset(0 50% 0 0)';
            container.appendChild(halfStar);
        }
        for (let i = 0; i < emptyStars; i++) container.appendChild(this.createStarElement(false, size));
        
        return container;
    }

    private productCard(product: Product): HTMLElement {
        const card = this.createElement('div', {
            className: 'bg-white border border-gray-100 rounded-2xl overflow-hidden card slide-in'
        });
        
        const imageLink = this.createElement('a', {
            href: `pages/product-detail.html?id=${product.id}`,
            className: 'block'
        });
        
        const imageContainer = this.createElement('div', {
            className: 'aspect-square overflow-hidden bg-white p-4 relative'
        });
        
        const stockIndicator = this.createElement('span', {
            className: `absolute top-4 left-4 px-2 py-1 rounded-full text-xs font-medium ${product.availabilityStatus === 'In Stock' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`,
            textContent: product.availabilityStatus
        });
        
        const image = this.createElement('img', {
            src: product.images[0] || product.thumbnail || 'https://via.placeholder.com/300',
            alt: product.title,
            className: 'w-full h-full object-contain group-hover:scale-105 transition-transform duration-500',
            loading: 'lazy'
        });
        
        imageContainer.append(stockIndicator, image);
        imageLink.appendChild(imageContainer);
        
        const content = this.createElement('div', {
            className: 'p-6 space-y-4'
        });
        
        const titleLink = this.createElement('a', {
            href: `pages/product-detail.html?id=${product.id}`,
            className: 'block'
        });
        
        const title = this.createElement('h3', {
            className: 'text-lg font-medium text-gray-900 line-clamp-1 hover:text-purple-600 transition-colors',
            textContent: product.title
        });
        titleLink.appendChild(title);
        
        const ratingContainer = this.createElement('div', {
            className: 'flex items-center space-x-2'
        });
        ratingContainer.appendChild(this.createStarsContainer(product.rating));
        
        const reviewCount = this.createElement('span', {
            className: 'text-gray-600 text-sm',
            textContent: `(${product.reviews.length})`
        });
        ratingContainer.appendChild(reviewCount);
        
        const description = this.createElement('p', {
            className: 'text-sm text-gray-600 line-clamp-2 sm:line-clamp-3 leading-relaxed',
            textContent: product.description || 'No description available.'
        });
        
        const priceContainer = this.createElement('div', {
            className: 'flex items-center justify-between pt-2'
        });
        
        const discountedPrice = this.calculateDiscountedPrice(product.price, product.discountPercentage);
        const priceWrapper = this.createElement('div', {
            className: 'flex items-center space-x-2'
        });
        
        const price = this.createElement('span', {
            className: 'text-xl sm:text-2xl font-semibold text-purple-600',
            textContent: `$${discountedPrice.toFixed(2)}`
        });
        
        if (product.discountPercentage > 0) {
            const originalPrice = this.createElement('span', {
                className: 'text-sm text-gray-500 line-through',
                textContent: `$${product.price.toFixed(2)}`
            });
            priceWrapper.append(price, originalPrice);
        } else {
            priceWrapper.appendChild(price);
        };
        
        const addToCartBtn = this.createElement('button', {
            className: `px-4 py-2 gradient-bg text-white text-sm font-medium rounded-full hover:opacity-90 transition-all duration-300 ${product.availabilityStatus !== 'In Stock' ? 'opacity-50 cursor-not-allowed' : ''}`,
            textContent: product.availabilityStatus === 'In Stock' ? 'Add to Cart' : 'Out of Stock',
            disabled: product.availabilityStatus !== 'In Stock',
            onclick: product.availabilityStatus === 'In Stock' ? () => {
                this.showToast(`${product.title} added to cart!`, 'success');
            } : undefined
        });
        
        priceContainer.append(priceWrapper, addToCartBtn);
        content.append(titleLink, ratingContainer, description, priceContainer);
        card.append(imageLink, content);
        
        return card;
    }

    private renderProducts(products: Product[]): void {
        this.container.innerHTML = '';
        if (products.length === 0) {
            this.showErrorState('No products available.');
            return;
        }
        const fragment = document.createDocumentFragment();
        products.forEach((product, index) => {
            const card = this.productCard(product);
            card.style.animationDelay = `${index * 0.1}s`;
            fragment.appendChild(card);
        });
        this.container.appendChild(fragment);
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    new ProductListPage();
});