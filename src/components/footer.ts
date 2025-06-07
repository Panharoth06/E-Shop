export const footer = () => {
    return `
<footer id="footer" class="gradient-bg text-white py-12 mt-12 slide-in">
    <div class="container mx-auto px-4 max-w-7xl">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <!-- Brand Section -->
            <div class="space-y-4">
                <a href="/" class="text-2xl font-bold text-white flex items-center space-x-2">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h18v18H3z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9l6 6"/>
                    </svg>
                    <span>E-Shop</span>
                </a>
                <p class="text-sm text-gray-200">
                    Discover quality products with seamless shopping experiences. Join our community today!
                </p>
                <div class="flex space-x-4">
                    <a href="https://twitter.com" target="_blank" class="hover:text-gray-200 transition-colors">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                    </a>
                    <a href="https://facebook.com" target="_blank" class="hover:text-gray-200 transition-colors">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9.197 7.353v3.061h-1.79v3.684h1.79v9.552h3.897v-9.552h2.682l.357-3.684h-3.039v-2.108c0-.868.238-1.46 1.468-1.46h1.571V4.5c-.272-.037-1.206-.116-2.294-.116-2.267 0-3.815 1.384-3.815 3.969z"/>
                        </svg>
                    </a>
                    <a href="https://instagram.com" target="_blank" class="hover:text-gray-200 transition-colors">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.336 3.608 1.311.975.975 1.249 2.242 1.311 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.336 2.633-1.311 3.608-.975.975-2.242 1.249-3.608 1.311-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.336-3.608-1.311-.975-.975-1.249-2.242-1.311-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.336-2.633 1.311-3.608.975-.975 2.242-1.249 3.608-1.311 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.395.063-2.864.344-4.017 1.497S1.66 3.758 1.597 5.153c-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.063 1.395.344 2.864 1.497 4.017s2.622 1.434 4.017 1.497c1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.395-.063 2.864-.344 4.017-1.497s1.434-2.622 1.497-4.017c.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.063-1.395-.344-2.864-1.497-4.017s-2.622-1.434-4.017-1.497c-1.28-.058-1.688-.072-4.947-.072zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/>
                        </svg>
                    </a>
                </div>
            </div>

            <!-- Navigation Links -->
            <div>
                <h3 class="text-lg font-semibold mb-4">Shop</h3>
                <ul class="space-y-2 text-sm">
                    <li><a href="/products" class="hover:text-gray-200 transition-colors">All Products</a></li>
                    <li><a href="/categories" class="hover:text-gray-200 transition-colors">Categories</a></li>
                    <li><a href="/deals" class="hover:text-gray-200 transition-colors">Deals</a></li>
                </ul>
            </div>
            <div>
                <h3 class="text-lg font-semibold mb-4">Support</h3>
                <ul class="space-y-2 text-sm">
                    <li><a href="/faq" class="hover:text-gray-200 transition-colors">FAQ</a></li>
                    <li><a href="/contact" class="hover:text-gray-200 transition-colors">Contact Us</a></li>
                    <li><a href="/returns" class="hover:text-gray-200 transition-colors">Returns</a></li>
                </ul>
            </div>

            <!-- Newsletter Signup -->
            <div>
                <h3 class="text-lg font-semibold mb-4">Stay Updated</h3>
                <p class="text-sm text-gray-200 mb-4">Subscribe for exclusive offers and updates.</p>
                <form id="newsletter-form" class="flex">
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        class="w-full px-4 py-2 rounded-l-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                    />
                    <button 
                        type="submit"
                        class="px-4 py-2 bg-purple-600 rounded-r-xl hover:bg-purple-700 transition-colors"
                    >
                        Subscribe
                    </button>
                </form>
            </div>
        </div>

        <!-- Copyright -->
        <div class="mt-12 border-t border-gray-600 pt-6 text-center text-sm text-gray-200">
            <p>© 2025 Your Shop. All Rights Reserved.</p>
            <p class="mt-2">
                <a href="/privacy" class="hover:text-gray-200 transition-colors mx-2">Privacy Policy</a> |
                <a href="/terms" class="hover:text-gray-200 transition-colors mx-2">Terms of Service</a> |
                <a href="/licensing" class="hover:text-gray-200 transition-colors mx-2">Licensing</a>
            </p>
        </div>
    </div>
</footer>
    `;
};

export const renderFooter = () => {
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        footerContainer.innerHTML = footer();
        // Add newsletter form event listener
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const emailInput = newsletterForm.querySelector('input[type="email"]') as HTMLInputElement | null;
                if (emailInput && emailInput.value.trim()) {
                    const toast = document.createElement('div');
                    toast.className = 'toast glass-effect px-6 py-3 rounded-lg shadow-lg text-white bg-green-500';
                    toast.textContent = 'Subscribed successfully!';
                    const toastContainer = document.getElementById('toast-container');
                    if (toastContainer) {
                        toastContainer.appendChild(toast);
                    }
                    setTimeout(() => toast.remove(), 3000);
                    emailInput.value = '';
                }
            });
        }
        console.log('Footer rendered');
    } else {
        console.warn('Footer container not found');
    }
};

// Auto-render footer on page load
document.addEventListener('DOMContentLoaded', renderFooter);