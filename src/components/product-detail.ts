import { Product, ProductDimensions, ProductReview, ProductMeta } from "./Product.js";

class ProductDetailPage {
    private product: Product | null = null;
    private currentImageIndex: number = 0;
    private quantity: number = 1;
    private activeTab: string = 'shipping';
    private container: HTMLElement;
    private toastContainer: HTMLElement;

    constructor() {
        this.container = document.getElementById('product-detail-container')!;
        this.toastContainer = document.getElementById('toast-container')!;
        this.init();
    }

    private async init(): Promise<void> {
        this.showLoadingState();
        try {
            await this.loadProduct();
            if (this.product) {
                console.log('render in product details');
                this.render();
            } else {
                this.showErrorState('Product not found.');
            }
        } catch (error) {
            this.showErrorState('Failed to load product details. Please try again later.');
            console.error('Error loading product:', error);
        }
    }

    private showLoadingState(): void {
        this.container.innerHTML = '';
        const loadingDiv = this.createElement('div', {
            className: 'text-center py-16'
        });
        
        const spinner = this.createElement('div', {
            className: 'animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600 mx-auto'
        });
        
        const text = this.createElement('p', {
            className: 'mt-4 text-gray-600 text-lg',
            textContent: 'Loading product details...'
        });
        
        loadingDiv.append(spinner, text);
        this.container.appendChild(loadingDiv);
    }

    private showErrorState(message: string): void {
        this.container.innerHTML = '';
        const errorDiv = this.createElement('div', {
            className: 'text-center py-16 text-red-600'
        });
        const errorText = this.createElement('p', {
            className: 'text-lg font-medium',
            textContent: message
        });
        const backButton = this.createElement('button', {
            className: 'mt-4 gradient-bg text-white px-6 py-2 rounded-xl hover:opacity-90 transition-all',
            textContent: 'Back to Products',
            onclick: () => history.back()
        });
        errorDiv.append(errorText, backButton);
        this.container.appendChild(errorDiv);
    }

    private async loadProduct(): Promise<void> {
        const productId = this.getProductIdFromURL();
        if (productId === null) {
            throw new Error('Invalid product ID');
        }

        try {
            const response = await fetch(`https://dummyjson.com/products/${productId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const product: Product = await response.json();
            // Sanitize product data
            this.product = {
                ...product,
                title: product.title || 'Unknown Product',
                description: product.description || 'No description available',
                category: product.category || 'Uncategorized',
                price: typeof product.price === 'number' ? product.price : 0,
                discountPercentage: typeof product.discountPercentage === 'number' ? product.discountPercentage : 0,
                rating: typeof product.rating === 'number' ? product.rating : 0,
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
                images: Array.isArray(product.images) ? product.images : [],
                thumbnail: product.thumbnail || 'https://via.placeholder.com/300'
            };
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    }

    private getProductIdFromURL(): number | null {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        return id ? parseInt(id, 10) : null;
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
            className: `toast glass-effect px-6 py-3 rounded-lg shadow-lg text-green-500 ${type === 'success' ? 'bg-green-500 text-green-500' : 'bg-red-500 text-red-500'}`,
            textContent: message
        });
        this.toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    private calculateDiscountedPrice(price: number, discountPercentage: number): number {
        return price * (1 - discountPercentage / 100);
    }

    private createStarElement(filled: boolean = true, size: string = 'w-5 h-5'): SVGElement {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', `${size} ${filled ? 'text-yellow-400' : 'text-gray-300'} transition-colors duration-300`);
        svg.setAttribute('fill', 'currentColor');
        svg.setAttribute('viewBox', '0 0 20 20');
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z');
        
        svg.appendChild(path);
        return svg;
    }

    private createStarsContainer(rating: number, size: string = 'w-5 h-5'): HTMLElement {
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

    private formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    private changeImage(index: number): void {
        this.currentImageIndex = index;
        const mainImage = document.getElementById('main-image') as HTMLImageElement;
        mainImage.src = this.product!.images[index];
        mainImage.classList.add('fade-in');
        setTimeout(() => mainImage.classList.remove('fade-in'), 500);
        
        document.querySelectorAll('.thumbnail-btn').forEach((btn, i) => {
            btn.classList.toggle('border-purple-500', i === index);
            btn.classList.toggle('border-gray-200', i !== index);
        });
    }

    private updateQuantityButtons(): void {
        const decreaseBtn = document.getElementById('decrease-btn') as HTMLButtonElement;
        const increaseBtn = document.getElementById('increase-btn') as HTMLButtonElement;
        if (decreaseBtn && increaseBtn) {
            decreaseBtn.disabled = this.quantity <= 1;
            increaseBtn.disabled = this.quantity >= this.product!.stock;
            console.log(`Quantity: ${this.quantity}, Decrease disabled: ${decreaseBtn.disabled}, Increase disabled: ${increaseBtn.disabled}`); // Debug
        }
    }

    private increaseQuantity(): void {
        if (this.product && this.quantity < this.product.stock) {
            this.quantity++;
            (document.getElementById('quantity-display') as HTMLElement).textContent = this.quantity.toString();
            this.updateQuantityButtons();
        } else {
            this.showToast('Maximum stock quantity reached', 'error');
        }
    }

    private decreaseQuantity(): void {
        if (this.quantity > 1) {
            this.quantity--;
            (document.getElementById('quantity-display') as HTMLElement).textContent = this.quantity.toString();
            this.updateQuantityButtons();
        }
    }

    private addToCart(): void {
        this.showToast(`Added ${this.quantity} item${this.quantity > 1 ? 's' : ''} to cart!`, 'success');
    }

    private switchTab(tabId: string): void {
        this.activeTab = tabId;
        document.querySelectorAll('[id^="tab-"]').forEach(btn => {
            btn.className = `py-4 px-2 border-b-2 ${btn.id === `tab-${tabId}` ? 'border-purple-500 text-purple-600 font-semibold' : 'border-transparent text-gray-500 hover:text-purple-600 hover:border-purple-200'} transition-all duration-300`;
        });
        document.querySelectorAll('[id^="content-"]').forEach(content => {
            content.classList.toggle('hidden', content.id !== `content-${tabId}`);
        });
    }

    private createBackNavigation(): HTMLElement {
        const nav = this.createElement('nav', { className: 'mb-8 slide-in' });
        const button = this.createElement('button', {
            className: 'flex items-center text-purple-600 hover:text-purple-800 transition-colors font-medium',
            onclick: () => history.back()
        });
        
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'w-5 h-5 mr-2');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('viewBox', '0 0 24 24');
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('d', 'M15 19l-7-7 7-7');
        
        svg.appendChild(path);
        button.append(svg, document.createTextNode('Back to Products'));
        nav.appendChild(button);
        return nav;
    }

    private createProductImages(): HTMLElement {
        const container = this.createElement('div', { className: 'space-y-4 fade-in' });
        const mainImageContainer = this.createElement('div', {
            className: 'aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-lg'
        });
        
        const mainImage = this.createElement('img', {
            id: 'main-image',
            src: this.product!.images[0] || this.product!.thumbnail,
            alt: this.product!.title,
            className: 'w-full h-full object-cover hover:scale-105 transition-transform duration-500 ease-out'
        });
        
        mainImageContainer.appendChild(mainImage);
        container.appendChild(mainImageContainer);
        
        if (this.product!.images.length > 1) {
            const thumbnailContainer = this.createElement('div', {
                className: 'flex space-x-3 overflow-x-auto py-2'
            });
            
            this.product!.images.forEach((img, index) => {
                const button = this.createElement('button', {
                    className: `thumbnail-btn flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 ${index === 0 ? 'border-purple-500' : 'border-gray-200'} hover:border-purple-400 transition-all duration-300`,
                    onclick: () => this.changeImage(index)
                });
                
                const thumbImg = this.createElement('img', {
                    src: img,
                    alt: `Product view ${index + 1}`,
                    className: 'w-full h-full object-cover'
                });
                
                button.appendChild(thumbImg);
                thumbnailContainer.appendChild(button);
            });
            
            container.appendChild(thumbnailContainer);
        }
        
        return container;
    }

    private createProductInfo(): HTMLElement {
        const container = this.createElement('div', { className: 'space-y-6 slide-in' });
        
        const badgesContainer = this.createElement('div', { className: 'flex items-center space-x-3 mb-3' });
        const brandBadge = this.createElement('span', {
            className: 'bg-purple-100 text-purple-800 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm',
            textContent: this.product!.brand || 'Unknown Brand'
        });
        const categoryBadge = this.createElement('span', {
            className: 'bg-gray-100 text-gray-800 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm',
            textContent: this.product!.category
        });
        
        badgesContainer.append(brandBadge, categoryBadge);
        container.appendChild(badgesContainer);
        
        const title = this.createElement('h1', {
            className: 'text-4xl font-bold text-gray-900 tracking-tight',
            textContent: this.product!.title
        });
        container.appendChild(title);
        
        const ratingContainer = this.createElement('div', { className: 'flex items-center space-x-3' });
        ratingContainer.appendChild(this.createStarsContainer(this.product!.rating));
        
        const reviewCount = this.createElement('span', {
            className: 'text-gray-600 text-sm',
            textContent: `(${this.product!.reviews.length} reviews)`
        });
        ratingContainer.appendChild(reviewCount);
        container.appendChild(ratingContainer);
        
        const description = this.createElement('p', {
            className: 'text-gray-700 leading-relaxed text-lg',
            textContent: this.product!.description || 'No description available.'
        });
        container.appendChild(description);
        
        container.appendChild(this.createPriceSection());
        container.appendChild(this.createStockSection());
        container.appendChild(this.createQuantitySection());
        container.appendChild(this.createProductDetailsGrid());
        
        return container;
    }

    private createPriceSection(): HTMLElement {
        const container = this.createElement('div', {
            className: 'glass-effect p-6 rounded-2xl shadow-lg'
        });
        
        const discountedPrice = this.calculateDiscountedPrice(this.product!.price, this.product!.discountPercentage);
        const savings = this.product!.price - discountedPrice;
        
        const priceContainer = this.createElement('div', { className: 'flex items-center space-x-4 mb-3' });
        
        const currentPrice = this.createElement('span', {
            className: 'text-3xl font-bold text-purple-600',
            textContent: `$${discountedPrice.toFixed(2)}`
        });
        
        const originalPrice = this.createElement('span', {
            className: 'text-lg text-gray-500 line-through',
            textContent: `$${this.product!.price.toFixed(2)}`
        });
        
        const discountBadge = this.createElement('span', {
            className: 'bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm',
            textContent: `${this.product!.discountPercentage.toFixed(0)}% OFF`
        });
        
        priceContainer.append(currentPrice, originalPrice, discountBadge);
        
        const savingsText = this.createElement('p', {
            className: 'text-green-600 font-medium text-sm',
            textContent: `You save $${savings.toFixed(2)}`
        });
        
        container.append(priceContainer, savingsText);
        return container;
    }

    private createStockSection(): HTMLElement {
        const container = this.createElement('div', { className: 'flex items-center space-x-4' });
        const statusContainer = this.createElement('div', { className: 'flex items-center space-x-2' });
        
        const statusDot = this.createElement('div', {
            className: `w-3 h-3 rounded-full animate-pulse ${this.product!.availabilityStatus === 'In Stock' ? 'bg-green-500' : 'bg-red-500'}`
        });
        
        const statusText = this.createElement('span', {
            className: this.product!.availabilityStatus === 'In Stock' ? 'text-green-700 font-medium' : 'text-red-700 font-medium',
            textContent: this.product!.availabilityStatus
        });
        
        const stockText = this.createElement('span', {
            className: 'text-gray-600 text-sm',
            textContent: `${this.product!.stock} units available`
        });
        
        statusContainer.append(statusDot, statusText);
        container.append(statusContainer, stockText);
        
        return container;
    }

    private createQuantitySection(): HTMLElement {
        const container = this.createElement('div', { className: 'flex items-center space-x-4' });
        const quantityContainer = this.createElement('div', {
            className: 'flex items-center border rounded-xl overflow-hidden'
        });
        
        const decreaseBtn = this.createElement('button', {
            id: 'decrease-btn',
            className: 'px-4 py-2 hover:bg-gray-100 transition-colors text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed',
            textContent: '-',
            onclick: () => this.decreaseQuantity(),
            disabled: this.quantity <= 1
        });
        
        const quantityDisplay = this.createElement('span', {
            id: 'quantity-display',
            className: 'px-6 py-2 border-x text-lg font-medium',
            textContent: this.quantity.toString()
        });
        
        const increaseBtn = this.createElement('button', {
            id: 'increase-btn',
            className: 'px-4 py-2 hover:bg-gray-100 transition-colors text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed',
            textContent: '+',
            onclick: () => this.increaseQuantity(),
            disabled: this.quantity >= this.product!.stock
        });
        
        quantityContainer.append(decreaseBtn, quantityDisplay, increaseBtn);
        
        const addToCartBtn = this.createElement('button', {
            className: 'flex-1 gradient-bg text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-all duration-300 bounce-in text-lg disabled:opacity-50 disabled:cursor-not-allowed',
            textContent: 'Add to Cart',
            onclick: () => this.addToCart(),
            disabled: this.product!.stock === 0
        });
        
        container.append(quantityContainer, addToCartBtn);
        return container;
    }

    private createProductDetailsGrid(): HTMLElement {
        const container = this.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200' });
        
        const details = [
            { label: 'SKU:', value: this.product!.sku },
            { label: 'Weight:', value: `${this.product!.weight}g` },
            { 
                label: 'Dimensions:', 
                value: `${this.product!.dimensions.width} × ${this.product!.dimensions.height} × ${this.product!.dimensions.depth} cm`,
                fullWidth: true 
            }
        ];
        
        details.forEach(detail => {
            const div = this.createElement('div', { className: detail.fullWidth ? 'col-span-2' : '' });
            const label = this.createElement('span', {
                className: 'text-gray-600 text-sm',
                textContent: detail.label
            });
            const value = this.createElement('span', {
                className: 'font-medium ml-2 text-gray-900',
                textContent: detail.value
            });
            
            div.append(label, value);
            container.appendChild(div);
        });
        
        return container;
    }

    private createTabsSection(): HTMLElement {
        const container = this.createElement('div', { className: 'bg-white rounded-2xl shadow-xl overflow-hidden slide-in' });
        const tabNav = this.createElement('div', { className: 'border-b border-gray-200' });
        const navContainer = this.createElement('nav', { className: 'flex space-x-8 px-8' });
        
        const tabs = [
            { id: 'shipping', label: 'Shipping & Returns' },
            { id: 'reviews', label: `Reviews (${this.product!.reviews.length})` },
            { id: 'specs', label: 'Specifications' }
        ];
        
        tabs.forEach(tab => {
            const button = this.createElement('button', {
                id: `tab-${tab.id}`,
                className: `py-4 px-2 border-b-2 ${this.activeTab === tab.id ? 'border-purple-500 text-purple-600 font-semibold' : 'border-transparent text-gray-500 hover:text-purple-600 hover:border-purple-200'} transition-all duration-300`,
                textContent: tab.label,
                onclick: () => this.switchTab(tab.id)
            });
            navContainer.appendChild(button);
        });
        
        tabNav.appendChild(navContainer);
        container.appendChild(tabNav);
        
        const contentContainer = this.createElement('div', { className: 'p-8' });
        contentContainer.append(
            this.createShippingContent(),
            this.createReviewsContent(),
            this.createSpecsContent()
        );
        
        container.appendChild(contentContainer);
        return container;
    }

    private createShippingContent(): HTMLElement {
        const container = this.createElement('div', {
            id: 'content-shipping',
            className: `space-y-6 ${this.activeTab !== 'shipping' ? 'hidden' : ''}`
        });
        
        const grid = this.createElement('div', { className: 'grid md:grid-cols-3 gap-6' });
        
        const shippingItems = [
            { 
                icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
                title: 'Shipping',
                description: this.product!.shippingInformation || 'No shipping information available.',
                color: 'purple'
            },
            {
                icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
                title: 'Returns',
                description: this.product!.returnPolicy || 'No return policy specified.',
                color: 'green'
            },
            {
                icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
                title: 'Warranty',
                description: this.product!.warrantyInformation || 'No warranty information available.',
                color: 'blue'
            }
        ];
        
        shippingItems.forEach(item => {
            const itemDiv = this.createElement('div', { className: 'flex items-start space-x-4 bg-gray-50 p-4 rounded-xl transition-all duration-300 hover:shadow-md' });
            
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('class', `w-8 h-8 text-${item.color}-500 mt-1 flex-shrink-0`);
            svg.setAttribute('fill', 'none');
            svg.setAttribute('stroke', 'currentColor');
            svg.setAttribute('viewBox', '0 0 24 24');
            
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('stroke-linecap', 'round');
            path.setAttribute('stroke-linejoin', 'round');
            path.setAttribute('stroke-width', '2');
            path.setAttribute('d', item.icon);
            
            svg.appendChild(path);
            
            const textDiv = this.createElement('div');
            const title = this.createElement('h3', {
                className: 'font-semibold text-gray-900 text-lg',
                textContent: item.title
            });
            const description = this.createElement('p', {
                className: 'text-gray-600',
                textContent: item.description
            });
            
            textDiv.append(title, description);
            itemDiv.append(svg, textDiv);
            grid.appendChild(itemDiv);
        });
        
        container.appendChild(grid);
        return container;
    }

    private createReviewsContent(): HTMLElement {
        const container = this.createElement('div', {
            id: 'content-reviews',
            className: `space-y-6 ${this.activeTab !== 'reviews' ? 'hidden' : ''}`
        });
        
        const header = this.createElement('div', { className: 'flex items-center justify-between' });
        const title = this.createElement('h3', {
            className: 'text-xl font-semibold text-gray-900',
            textContent: 'Customer Reviews'
        });
        
        const ratingContainer = this.createElement('div', { className: 'flex items-center space-x-2' });
        ratingContainer.appendChild(this.createStarsContainer(this.product!.rating));
        
        const ratingText = this.createElement('span', {
            className: 'font-medium text-gray-900',
            textContent: this.product!.rating.toFixed(1)
        });
        ratingContainer.appendChild(ratingText);
        
        header.append(title, ratingContainer);
        container.appendChild(header);
        
        const reviewsList = this.createElement('div', { className: 'space-y-4' });
        
        if (this.product!.reviews.length === 0) {
            const noReviews = this.createElement('p', {
                className: 'text-gray-600 text-center',
                textContent: 'No reviews yet for this product.'
            });
            reviewsList.appendChild(noReviews);
        } else {
            this.product!.reviews.forEach(review => {
                const reviewDiv = this.createElement('div', {
                    className: 'border rounded-xl p-5 bg-gray-50 transition-all duration-300 hover:shadow-md'
                });
                
                const reviewHeader = this.createElement('div', { className: 'flex items-center justify-between mb-3' });
                const reviewerInfo = this.createElement('div', { className: 'flex items-center space-x-3' });
                
                const reviewerName = this.createElement('span', {
                    className: 'font-medium text-gray-900',
                    textContent: review.reviewerName
                });
                
                reviewerInfo.append(reviewerName, this.createStarsContainer(review.rating, 'w-4 h-4'));
                
                const reviewDate = this.createElement('span', {
                    className: 'text-gray-500 text-sm',
                    textContent: this.formatDate(review.date)
                });
                
                reviewHeader.append(reviewerInfo, reviewDate);
                
                const reviewComment = this.createElement('p', {
                    className: 'text-gray-700',
                    textContent: review.comment
                });
                
                reviewDiv.append(reviewHeader, reviewComment);
                reviewsList.appendChild(reviewDiv);
            });
        }
        
        container.appendChild(reviewsList);
        return container;
    }

    private createSpecsContent(): HTMLElement {
        const container = this.createElement('div', {
            id: 'content-specs',
            className: `space-y-6 ${this.activeTab !== 'specs' ? 'hidden' : ''}`
        });
        
        const grid = this.createElement('div', { className: 'grid md:grid-cols-2 gap-8' });
        
        const detailsSection = this.createElement('div');
        const detailsTitle = this.createElement('h3', {
            className: 'text-lg font-semibold text-gray-900 mb-4',
            textContent: 'Product Details'
        });
        
        const detailsList = this.createElement('dl', { className: 'space-y-3' });
        
        const specs = [
            { label: 'SKU', value: this.product!.sku },
            { label: 'Weight', value: `${this.product!.weight}g` },
            { label: 'Dimensions', value: `${this.product!.dimensions.width} × ${this.product!.dimensions.height} × ${this.product!.dimensions.depth} cm` },
            { label: 'Brand', value: this.product!.brand || 'Unknown' },
            { label: 'Category', value: this.product!.category },
            { label: 'Minimum Order', value: `${this.product!.minimumOrderQuantity} units` }
        ];
        
        specs.forEach(spec => {
            const specDiv = this.createElement('div', { className: 'flex justify-between py-2' });
            const dt = this.createElement('dt', {
                className: 'text-gray-600',
                textContent: spec.label
            });
            const dd = this.createElement('dd', {
                className: 'font-medium text-gray-900',
                textContent: spec.value
            });
            specDiv.append(dt, dd);
            detailsList.appendChild(specDiv);
        });
        
        detailsSection.append(detailsTitle, detailsList);
        grid.appendChild(detailsSection);
        
        const metaSection = this.createElement('div');
        const metaTitle = this.createElement('h3', {
            className: 'text-lg font-semibold text-gray-900 mb-4',
            textContent: 'Additional Information'
        });
        
        const metaList = this.createElement('dl', { className: 'space-y-3' });
        const metaItems = [
            { label: 'Created', value: this.formatDate(this.product!.meta.createdAt) },
            { label: 'Updated', value: this.formatDate(this.product!.meta.updatedAt) },
            { label: 'Barcode', value: this.product!.meta.barcode }
        ];
        
        metaItems.forEach(item => {
            const itemDiv = this.createElement('div', { className: 'flex justify-between py-2' });
            const dt = this.createElement('dt', {
                className: 'text-gray-600',
                textContent: item.label
            });
            const dd = this.createElement('dd', {
                className: 'font-medium text-gray-900',
                textContent: item.value
            });
            itemDiv.append(dt, dd);
            metaList.appendChild(itemDiv);
        });
        
        metaSection.append(metaTitle, metaList);
        grid.appendChild(metaSection);
        
        container.appendChild(grid);
        return container;
    }

    private render(): void {
        this.container.innerHTML = '';
        const mainContainer = this.createElement('div', { className: 'grid md:grid-cols-2 gap-8' });
        
        mainContainer.appendChild(this.createProductImages());
        mainContainer.appendChild(this.createProductInfo());
        
        this.container.append(
            this.createBackNavigation(),
            mainContainer,
            this.createTabsSection()
        );
        // Update button states after rendering
        this.updateQuantityButtons();
    }

    public loadProductData(productData: Product): void {
        this.product = productData;
        this.currentImageIndex = 0;
        this.quantity = 1;
        this.activeTab = 'shipping';
        this.render();
    }
}

// Initialize the page
export const productPage = new ProductDetailPage();