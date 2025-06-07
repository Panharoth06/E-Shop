var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { fetchAllProducts } from "./fetchAllProducts.js";
class ProductListPage {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentView = "grid";
        this.currentSort = "default";
        this.currentFilters = {
            category: null,
            priceRange: null,
            rating: null,
            inStock: false,
        };
        this.container = document.getElementById("product-container");
        this.toastContainer = document.getElementById("toast-container");
        // Create filter and sort containers
        this.createControlsContainer();
        this.filterContainer = document.getElementById("filter-container");
        this.sortContainer = document.getElementById("sort-container");
        this.searchInput = document.getElementById("product-search");
        this.init();
        this.setupEventListeners();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.showLoadingState();
            try {
                this.products = yield fetchAllProducts();
                if (this.products && this.products.length > 0) {
                    this.filteredProducts = [...this.products];
                    this.renderFilters();
                    this.renderProducts();
                }
                else {
                    this.showErrorState("No products found.");
                }
            }
            catch (error) {
                this.showErrorState("Failed to load products. Please try again later.");
                console.error("Error fetching products:", error);
            }
        });
    }
    createControlsContainer() {
        var _a;
        // Create controls container before the product container
        const controlsContainer = this.createElement("div", {
            className: "container mx-auto px-4 py-6 max-w-7xl",
        });
        controlsContainer.innerHTML = `
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div class="hidden w-full md:w-auto">
                    <div class="relative">
                        <input 
                            type="text" 
                            id="product-search" 
                            placeholder="Search products..." 
                            class="hidden w-full md:w-80 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                        <svg class=" w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                </div>
                
                <div class="flex items-center gap-4 w-full md:w-auto">
                    <div id="filter-container" class="relative">
                        <button id="filter-button" class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                            </svg>
                            <span>Filter</span>
                        </button>
                        <div id="filter-dropdown" class="hidden absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg z-10 p-4 glass-effect">
                            <!-- Filter options will be rendered here -->
                        </div>
                    </div>
                    
                    <div id="sort-container" class="relative">
                        <button id="sort-button" class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path>
                            </svg>
                            <span>Sort</span>
                        </button>
                        <div id="sort-dropdown" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 glass-effect">
                            <ul class="py-2">
                                <li class="sort-option px-4 py-2 hover:bg-gray-100 cursor-pointer" data-sort="default">Default</li>
                                <li class="sort-option px-4 py-2 hover:bg-gray-100 cursor-pointer" data-sort="price-asc">Price: Low to High</li>
                                <li class="sort-option px-4 py-2 hover:bg-gray-100 cursor-pointer" data-sort="price-desc">Price: High to Low</li>
                                <li class="sort-option px-4 py-2 hover:bg-gray-100 cursor-pointer" data-sort="rating">Highest Rated</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="flex border border-gray-300 rounded-lg overflow-hidden">
                        <button id="grid-view" class="p-2 bg-purple-600 text-white">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                            </svg>
                        </button>
                        <button id="list-view" class="p-2 bg-white text-gray-700">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div id="active-filters" class="flex flex-wrap gap-2 mb-4"></div>
            <div id="results-count" class="text-sm text-gray-600 mb-4"></div>
        `;
        // Insert before the product container
        (_a = this.container.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(controlsContainer, this.container);
    }
    setupEventListeners() {
        var _a, _b, _c, _d;
        // Toggle filter dropdown
        (_a = document.getElementById("filter-button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            var _a;
            const dropdown = document.getElementById("filter-dropdown");
            dropdown === null || dropdown === void 0 ? void 0 : dropdown.classList.toggle("hidden");
            (_a = document.getElementById("sort-dropdown")) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
        });
        // Toggle sort dropdown
        (_b = document.getElementById("sort-button")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
            var _a;
            const dropdown = document.getElementById("sort-dropdown");
            dropdown === null || dropdown === void 0 ? void 0 : dropdown.classList.toggle("hidden");
            (_a = document.getElementById("filter-dropdown")) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
        });
        // View toggle
        (_c = document.getElementById("grid-view")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => this.changeView("grid"));
        (_d = document.getElementById("list-view")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => this.changeView("list"));
        // Sort options
        document.querySelectorAll(".sort-option").forEach((option) => {
            option.addEventListener("click", (e) => {
                var _a;
                const sortType = e.currentTarget.dataset.sort;
                this.sortProducts(sortType);
                (_a = document.getElementById("sort-dropdown")) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
            });
        });
        // Search input - real-time search while typing and on Enter
        this.searchInput.addEventListener("input", this.debounce(() => {
            this.applySearchFilter();
        }, 300));
        // Search on Enter key press
        this.searchInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                this.applySearchFilter();
            }
        });
        // Close dropdowns when clicking outside
        document.addEventListener("click", (e) => {
            var _a, _b;
            if (!e.target.closest("#filter-container") &&
                !e.target.closest("#sort-container")) {
                (_a = document.getElementById("filter-dropdown")) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
                (_b = document.getElementById("sort-dropdown")) === null || _b === void 0 ? void 0 : _b.classList.add("hidden");
            }
        });
    }
    applySearchFilter() {
        const searchTerm = this.searchInput.value.toLowerCase().trim();
        this.filteredProducts = this.products.filter((product) => {
            // Search filter
            const matchesSearch = searchTerm === "" ||
                product.title.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm);
            // Apply existing filters if any are active
            const matchesCategory = !this.currentFilters.category || this.currentFilters.category.split(",").includes(product.category);
            const productPrice = this.calculateDiscountedPrice(product.price, product.discountPercentage);
            const matchesPrice = !this.currentFilters.priceRange ||
                (productPrice >= this.currentFilters.priceRange[0] && productPrice <= this.currentFilters.priceRange[1]);
            const matchesRating = !this.currentFilters.rating || product.rating >= this.currentFilters.rating;
            const matchesStock = !this.currentFilters.inStock || product.stock > 0;
            return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesStock;
        });
        // Apply current sort
        this.sortProducts(this.currentSort, false);
        this.renderProducts();
    }
    renderFilters() {
        var _a, _b;
        const filterDropdown = document.getElementById("filter-dropdown");
        if (!filterDropdown)
            return;
        // Get unique categories
        const categories = [...new Set(this.products.map((p) => p.category))];
        // Get min and max prices
        const prices = this.products.map((p) => this.calculateDiscountedPrice(p.price, p.discountPercentage));
        const minPrice = Math.floor(Math.min(...prices));
        const maxPrice = Math.ceil(Math.max(...prices));
        filterDropdown.innerHTML = `
            <div class="mb-4">
                <h3 class="font-medium text-gray-900 mb-2">Categories</h3>
                <div class="space-y-2 max-h-40 overflow-y-auto">
                    ${categories
            .map((category) => `
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" class="category-filter rounded text-purple-600 focus:ring-purple-500" value="${category}">
                            <span class="text-sm text-gray-700">${this.capitalizeFirstLetter(category)}</span>
                        </label>
                    `)
            .join("")}
                </div>
            </div>
            
            <div class="mb-4">
                <h3 class="font-medium text-gray-900 mb-2">Price Range</h3>
                <div class="px-2">
                    <input type="range" min="${minPrice}" max="${maxPrice}" value="${minPrice}" class="price-range w-full" id="price-range">
                    <div class="flex justify-between mt-2">
                        <span class="text-sm text-gray-600">$${minPrice}</span>
                        <span class="text-sm text-gray-600" id="price-value">$${minPrice}</span>
                        <span class="text-sm text-gray-600">$${maxPrice}</span>
                    </div>
                </div>
            </div>
            
            <div class="mb-4">
                <h3 class="font-medium text-gray-900 mb-2">Rating</h3>
                <div class="space-y-2">
                    ${[5, 4, 3, 2, 1]
            .map((rating) => `
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="rating" class="rating-filter rounded-full text-purple-600 focus:ring-purple-500" value="${rating}">
                            <div class="flex items-center">
                                ${Array(rating)
            .fill(0)
            .map(() => `
                                    <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                    </svg>
                                `)
            .join("")}
                                ${Array(5 - rating)
            .fill(0)
            .map(() => `
                                    <svg class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                    </svg>
                                `)
            .join("")}
                                <span class="ml-1 text-sm text-gray-600">& Up</span>
                            </div>
                        </label>
                    `)
            .join("")}
                </div>
            </div>
            
            <div class="mb-4">
                <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" id="in-stock-filter" class="rounded text-purple-600 focus:ring-purple-500">
                    <span class="text-sm text-gray-700">In Stock Only</span>
                </label>
            </div>
            
            <div class="flex justify-between mt-4">
                <button id="clear-filters" class="text-sm text-gray-600 hover:text-purple-600">Clear All</button>
                <button id="apply-filters" class="px-4 py-2 gradient-bg text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all">Apply</button>
            </div>
        `;
        const priceRange = document.getElementById("price-range");
        const priceValue = document.getElementById("price-value");
        // Price range event - only update display, don't filter immediately
        if (priceRange && priceValue) {
            priceRange.addEventListener("input", () => {
                priceValue.textContent = `$${priceRange.value}`;
                // Remove immediate filtering - only update display
            });
        }
        // Apply filters - only trigger filtering when Apply button is clicked
        (_a = document.getElementById("apply-filters")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            var _a, _b;
            // Get selected categories
            const selectedCategories = Array.from(document.querySelectorAll(".category-filter:checked")).map((checkbox) => checkbox.value);
            // Get price range
            const selectedPrice = Number.parseInt((priceRange === null || priceRange === void 0 ? void 0 : priceRange.value) || "0");
            // Get rating
            const selectedRating = document.querySelector(".rating-filter:checked");
            // Get in stock only
            const inStockOnly = (_a = document.getElementById("in-stock-filter")) === null || _a === void 0 ? void 0 : _a.checked;
            // Update filters
            this.currentFilters = {
                category: selectedCategories.length > 0 ? selectedCategories.join(",") : null,
                priceRange: selectedPrice > Number.parseInt((priceRange === null || priceRange === void 0 ? void 0 : priceRange.min) || "0") ? [0, selectedPrice] : null,
                rating: selectedRating ? Number.parseInt(selectedRating.value) : null,
                inStock: inStockOnly,
            };
            this.filterProducts();
            (_b = document.getElementById("filter-dropdown")) === null || _b === void 0 ? void 0 : _b.classList.add("hidden");
            this.renderActiveFilters();
        });
        // Clear filters
        (_b = document.getElementById("clear-filters")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
            // Reset checkboxes and radio buttons
            document.querySelectorAll(".category-filter").forEach((checkbox) => {
                ;
                checkbox.checked = false;
            });
            document.querySelectorAll(".rating-filter").forEach((radio) => {
                ;
                radio.checked = false;
            });
            document.getElementById("in-stock-filter").checked = false;
            // Reset price range
            if (priceRange && priceValue) {
                priceRange.value = priceRange.min;
                priceValue.textContent = `$${priceRange.min}`;
            }
            // Reset filters
            this.currentFilters = {
                category: null,
                priceRange: null,
                rating: null,
                inStock: false,
            };
            this.applySearchFilter();
            this.renderActiveFilters();
        });
    }
    renderActiveFilters() {
        const activeFiltersContainer = document.getElementById("active-filters");
        if (!activeFiltersContainer)
            return;
        activeFiltersContainer.innerHTML = "";
        // Categories
        if (this.currentFilters.category) {
            this.currentFilters.category.split(",").forEach((category) => {
                const pill = this.createElement("div", {
                    className: "flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm",
                });
                pill.innerHTML = `
                    <span>Category: ${this.capitalizeFirstLetter(category)}</span>
                    <button class="remove-filter" data-type="category" data-value="${category}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                `;
                activeFiltersContainer.appendChild(pill);
            });
        }
        // Price range
        if (this.currentFilters.priceRange) {
            const pill = this.createElement("div", {
                className: "flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm",
            });
            pill.innerHTML = `
                <span>Price: Up to $${this.currentFilters.priceRange[1]}</span>
                <button class="remove-filter" data-type="price">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            `;
            activeFiltersContainer.appendChild(pill);
        }
        // Rating
        if (this.currentFilters.rating) {
            const pill = this.createElement("div", {
                className: "flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm",
            });
            pill.innerHTML = `
                <span>Rating: ${this.currentFilters.rating}+ Stars</span>
                <button class="remove-filter" data-type="rating">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            `;
            activeFiltersContainer.appendChild(pill);
        }
        // In stock
        if (this.currentFilters.inStock) {
            const pill = this.createElement("div", {
                className: "flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm",
            });
            pill.innerHTML = `
                <span>In Stock Only</span>
                <button class="remove-filter" data-type="stock">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            `;
            activeFiltersContainer.appendChild(pill);
        }
        // Add event listeners to remove filters
        document.querySelectorAll(".remove-filter").forEach((button) => {
            button.addEventListener("click", (e) => {
                const type = e.currentTarget.dataset.type;
                const value = e.currentTarget.dataset.value;
                if (type === "category" && value && this.currentFilters.category) {
                    const categories = this.currentFilters.category.split(",").filter((c) => c !== value);
                    this.currentFilters.category = categories.length > 0 ? categories.join(",") : null;
                }
                else if (type === "price") {
                    this.currentFilters.priceRange = null;
                }
                else if (type === "rating") {
                    this.currentFilters.rating = null;
                }
                else if (type === "stock") {
                    this.currentFilters.inStock = false;
                }
                this.applySearchFilter();
                this.renderActiveFilters();
            });
        });
    }
    filterProducts() {
        const searchTerm = this.searchInput.value.toLowerCase().trim();
        this.filteredProducts = this.products.filter((product) => {
            // Search filter
            const matchesSearch = searchTerm === "" ||
                product.title.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm);
            // Category filter
            const matchesCategory = !this.currentFilters.category || this.currentFilters.category.split(",").includes(product.category);
            // Price filter
            const productPrice = this.calculateDiscountedPrice(product.price, product.discountPercentage);
            const matchesPrice = !this.currentFilters.priceRange ||
                (productPrice >= this.currentFilters.priceRange[0] && productPrice <= this.currentFilters.priceRange[1]);
            // Rating filter
            const matchesRating = !this.currentFilters.rating || product.rating >= this.currentFilters.rating;
            // Stock filter
            const matchesStock = !this.currentFilters.inStock || product.stock > 0;
            return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesStock;
        });
        // Apply current sort
        this.sortProducts(this.currentSort, false);
        this.renderProducts();
    }
    sortProducts(sortType, render = true) {
        this.currentSort = sortType;
        switch (sortType) {
            case "price-asc":
                this.filteredProducts.sort((a, b) => {
                    const priceA = this.calculateDiscountedPrice(a.price, a.discountPercentage);
                    const priceB = this.calculateDiscountedPrice(b.price, b.discountPercentage);
                    return priceA - priceB;
                });
                break;
            case "price-desc":
                this.filteredProducts.sort((a, b) => {
                    const priceA = this.calculateDiscountedPrice(a.price, a.discountPercentage);
                    const priceB = this.calculateDiscountedPrice(b.price, b.discountPercentage);
                    return priceB - priceA;
                });
                break;
            case "rating":
                this.filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            default:
                // Default sort (by id or any other default order)
                this.filteredProducts.sort((a, b) => a.id - b.id);
                break;
        }
        if (render) {
            this.renderProducts();
        }
    }
    changeView(view) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        this.currentView = view;
        // Update UI
        if (view === "grid") {
            (_a = document.getElementById("grid-view")) === null || _a === void 0 ? void 0 : _a.classList.add("bg-purple-600", "text-white");
            (_b = document.getElementById("grid-view")) === null || _b === void 0 ? void 0 : _b.classList.remove("bg-white", "text-gray-700");
            (_c = document.getElementById("list-view")) === null || _c === void 0 ? void 0 : _c.classList.add("bg-white", "text-gray-700");
            (_d = document.getElementById("list-view")) === null || _d === void 0 ? void 0 : _d.classList.remove("bg-purple-600", "text-white");
        }
        else {
            (_e = document.getElementById("list-view")) === null || _e === void 0 ? void 0 : _e.classList.add("bg-purple-600", "text-white");
            (_f = document.getElementById("list-view")) === null || _f === void 0 ? void 0 : _f.classList.remove("bg-white", "text-gray-700");
            (_g = document.getElementById("grid-view")) === null || _g === void 0 ? void 0 : _g.classList.add("bg-white", "text-gray-700");
            (_h = document.getElementById("grid-view")) === null || _h === void 0 ? void 0 : _h.classList.remove("bg-purple-600", "text-white");
        }
        this.renderProducts();
    }
    showLoadingState() {
        this.container.innerHTML = "";
        // Create a more visually appealing loading state with skeleton cards
        if (this.currentView === "grid") {
            for (let i = 0; i < 8; i++) {
                const skeletonCard = this.createElement("div", {
                    className: "bg-white border border-gray-100 rounded-2xl overflow-hidden",
                });
                skeletonCard.innerHTML = `
                    <div class="aspect-square loading-skeleton"></div>
                    <div class="p-6 space-y-4">
                        <div class="h-6 loading-skeleton rounded"></div>
                        <div class="flex gap-1">
                            ${Array(5).fill('<div class="w-4 h-4 loading-skeleton rounded-full"></div>').join("")}
                        </div>
                        <div class="h-4 loading-skeleton rounded w-3/4"></div>
                        <div class="h-4 loading-skeleton rounded w-full"></div>
                        <div class="flex justify-between items-center pt-2">
                            <div class="h-6 loading-skeleton rounded w-1/3"></div>
                            <div class="h-8 loading-skeleton rounded-full w-1/4"></div>
                        </div>
                    </div>
                `;
                this.container.appendChild(skeletonCard);
            }
        }
        else {
            for (let i = 0; i < 5; i++) {
                const skeletonCard = this.createElement("div", {
                    className: "bg-white border border-gray-100 rounded-2xl overflow-hidden mb-4 flex",
                });
                skeletonCard.innerHTML = `
                    <div class="w-1/4 loading-skeleton"></div>
                    <div class="p-6 space-y-4 w-3/4">
                        <div class="h-6 loading-skeleton rounded"></div>
                        <div class="flex gap-1">
                            ${Array(5).fill('<div class="w-4 h-4 loading-skeleton rounded-full"></div>').join("")}
                        </div>
                        <div class="h-4 loading-skeleton rounded w-3/4"></div>
                        <div class="h-4 loading-skeleton rounded w-full"></div>
                        <div class="flex justify-between items-center pt-2">
                            <div class="h-6 loading-skeleton rounded w-1/3"></div>
                            <div class="h-8 loading-skeleton rounded-full w-1/4"></div>
                        </div>
                    </div>
                `;
                this.container.appendChild(skeletonCard);
            }
        }
    }
    showErrorState(message) {
        this.container.innerHTML = "";
        const errorDiv = this.createElement("div", {
            className: "col-span-full text-center py-16",
        });
        errorDiv.innerHTML = `
            <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 class="text-xl font-medium text-gray-900 mb-2">${message}</h3>
            <p class="text-gray-600 mb-6">We couldn't load the products at this time.</p>
            <button class="gradient-bg text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all font-medium">
                Try Again
            </button>
        `;
        const retryButton = errorDiv.querySelector("button");
        if (retryButton) {
            retryButton.addEventListener("click", () => this.init());
        }
        this.container.appendChild(errorDiv);
    }
    createElement(tag, options = {}) {
        const element = document.createElement(tag);
        Object.assign(element, options);
        if (options.className)
            element.className = options.className;
        if (options.textContent)
            element.textContent = options.textContent;
        return element;
    }
    showToast(message, type = "success") {
        const toast = this.createElement("div", {
            className: `toast glass-effect px-6 py-3 rounded-lg shadow-lg text-white ${type === "success" ? "bg-green-500/80" : "bg-red-500/80"}`,
        });
        toast.innerHTML = `
            <div class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    ${type === "success"
            ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>'
            : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>'}
                </svg>
                <span>${message}</span>
            </div>
        `;
        this.toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
    calculateDiscountedPrice(price, discountPercentage) {
        return price * (1 - discountPercentage / 100);
    }
    createStarElement(filled = true, size = "w-4 h-4") {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("class", `${size} ${filled ? "text-yellow-400" : "text-gray-300"} transition-colors duration-300`);
        svg.setAttribute("fill", "currentColor");
        svg.setAttribute("viewBox", "0 0 20 20");
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z");
        svg.appendChild(path);
        return svg;
    }
    createStarsContainer(rating, size = "w-4 h-4") {
        const container = this.createElement("div", { className: "flex gap-1" });
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < fullStars; i++)
            container.appendChild(this.createStarElement(true, size));
        if (hasHalfStar)
            container.appendChild(this.createStarElement(true, size));
        for (let i = 0; i < emptyStars; i++)
            container.appendChild(this.createStarElement(false, size));
        return container;
    }
    productGridCard(product) {
        const card = this.createElement("div", {
            className: "bg-white border border-gray-100 rounded-2xl overflow-hidden card-hover slide-in",
        });
        // Add wishlist button
        const wishlistButton = this.createElement("button", {
            className: "absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors",
            onclick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showToast(`Added ${product.title} to wishlist!`);
                e.currentTarget.classList.toggle("text-red-500");
            },
        });
        wishlistButton.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
        `;
        const imageLink = this.createElement("a", {
            href: `/E-Shop/pages/product-detail.html?id=${product.id}`,
            className: "block relative",
        });
        const imageContainer = this.createElement("div", {
            className: "aspect-square overflow-hidden bg-white p-4 relative group",
        });
        // Discount badge
        if (product.discountPercentage > 0) {
            const discountBadge = this.createElement("span", {
                className: "absolute top-4 left-4 z-10 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full",
                textContent: `-${Math.round(product.discountPercentage)}%`,
            });
            imageContainer.appendChild(discountBadge);
        }
        // Stock indicator
        const stockIndicator = this.createElement("span", {
            className: `absolute bottom-4 left-4 px-2 py-1 rounded-full text-xs font-medium ${product.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`,
            textContent: product.stock > 0 ? "In Stock" : "Out of Stock",
        });
        const image = this.createElement("img", {
            src: product.images[0] || product.thumbnail || "https://via.placeholder.com/300",
            alt: product.title,
            className: "w-full h-full object-contain group-hover:scale-105 transition-transform duration-500",
            loading: "lazy",
        });
        // Quick view button
        const quickViewButton = this.createElement("button", {
            className: "absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 bg-gray-900 text-white text-xs rounded-full",
            textContent: "Quick View",
            onclick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showToast(`Quick view for ${product.title}`);
            },
        });
        imageContainer.append(stockIndicator, image, quickViewButton);
        imageLink.appendChild(imageContainer);
        const content = this.createElement("div", {
            className: "p-6 space-y-3",
        });
        // Category badge
        const category = this.createElement("span", {
            className: "text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full",
            textContent: this.capitalizeFirstLetter(product.category),
        });
        const titleLink = this.createElement("a", {
            href: `/E-Shop/pages/product-detail.html?id=${product.id}`,
            className: "block",
        });
        const title = this.createElement("h3", {
            className: "text-lg font-medium text-gray-900 line-clamp-1 hover:text-purple-600 transition-colors mt-2",
            textContent: product.title,
        });
        titleLink.appendChild(title);
        const ratingContainer = this.createElement("div", {
            className: "flex items-center space-x-2",
        });
        ratingContainer.appendChild(this.createStarsContainer(product.rating));
        const reviewCount = this.createElement("span", {
            className: "text-gray-600 text-sm",
            textContent: `(${product.reviews.length})`,
        });
        ratingContainer.appendChild(reviewCount);
        const description = this.createElement("p", {
            className: "text-sm text-gray-600 line-clamp-2 leading-relaxed",
            textContent: product.description || "No description available.",
        });
        const priceContainer = this.createElement("div", {
            className: "flex items-center justify-between pt-2",
        });
        const discountedPrice = this.calculateDiscountedPrice(product.price, product.discountPercentage);
        const priceWrapper = this.createElement("div", {
            className: "flex flex-col",
        });
        const price = this.createElement("span", {
            className: "text-xl font-semibold text-purple-600",
            textContent: `$${discountedPrice.toFixed(2)}`,
        });
        if (product.discountPercentage > 0) {
            const originalPrice = this.createElement("span", {
                className: "text-sm text-gray-500 line-through",
                textContent: `$${product.price.toFixed(2)}`,
            });
            priceWrapper.append(price, originalPrice);
        }
        else {
            priceWrapper.appendChild(price);
        }
        const addToCartBtn = this.createElement("button", {
            className: `px-4 py-2 gradient-bg text-white text-sm font-medium rounded-full hover:opacity-90 transition-all duration-300 ${product.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}`,
            textContent: "Add to Cart",
            onclick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (product.stock > 0) {
                    this.showToast(`Added ${product.title} to cart!`);
                }
                else {
                    this.showToast("This product is out of stock.", "error");
                }
            },
            disabled: product.stock <= 0,
        });
        priceContainer.append(priceWrapper, addToCartBtn);
        content.append(category, titleLink, ratingContainer, description, priceContainer);
        card.append(imageLink, wishlistButton, content);
        return card;
    }
    productListCard(product) {
        const card = this.createElement("div", {
            className: "bg-white border border-gray-100 rounded-2xl overflow-hidden card-hover slide-in flex flex-col md:flex-row mb-4",
        });
        const imageContainer = this.createElement("div", {
            className: "md:w-1/4 aspect-square md:aspect-auto relative group",
        });
        // Discount badge
        if (product.discountPercentage > 0) {
            const discountBadge = this.createElement("span", {
                className: "absolute top-4 left-4 z-10 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full",
                textContent: `-${Math.round(product.discountPercentage)}%`,
            });
            imageContainer.appendChild(discountBadge);
        }
        // Wishlist button
        const wishlistButton = this.createElement("button", {
            className: "absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors",
            onclick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showToast(`Added ${product.title} to wishlist!`);
                e.currentTarget.classList.toggle("text-red-500");
            },
        });
        wishlistButton.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
        `;
        imageContainer.appendChild(wishlistButton);
        const imageLink = this.createElement("a", {
            href: `/E-Shop/pages/product-detail.html?id=${product.id}`,
            className: "block h-full",
        });
        const image = this.createElement("img", {
            src: product.images[0] || product.thumbnail || "https://via.placeholder.com/300",
            alt: product.title,
            className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500",
            loading: "lazy",
        });
        imageLink.appendChild(image);
        imageContainer.appendChild(imageLink);
        const content = this.createElement("div", {
            className: "p-6 md:w-3/4 flex flex-col",
        });
        const headerContainer = this.createElement("div", {
            className: "flex flex-col md:flex-row md:justify-between md:items-start mb-3",
        });
        const titleContainer = this.createElement("div", {
            className: "mb-2 md:mb-0",
        });
        // Category badge
        const category = this.createElement("span", {
            className: "text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full",
            textContent: this.capitalizeFirstLetter(product.category),
        });
        const titleLink = this.createElement("a", {
            href: `/E-Shop/pages/product-detail.html?id=${product.id}`,
            className: "block",
        });
        const title = this.createElement("h3", {
            className: "text-xl font-medium text-gray-900 hover:text-purple-600 transition-colors mt-2",
            textContent: product.title,
        });
        titleLink.appendChild(title);
        titleContainer.append(category, titleLink);
        const priceContainer = this.createElement("div", {
            className: "flex items-center",
        });
        const discountedPrice = this.calculateDiscountedPrice(product.price, product.discountPercentage);
        const price = this.createElement("span", {
            className: "text-xl font-semibold text-purple-600",
            textContent: `$${discountedPrice.toFixed(2)}`,
        });
        if (product.discountPercentage > 0) {
            const originalPrice = this.createElement("span", {
                className: "text-sm text-gray-500 line-through ml-2",
                textContent: `$${product.price.toFixed(2)}`,
            });
            priceContainer.append(price, originalPrice);
        }
        else {
            priceContainer.appendChild(price);
        }
        headerContainer.append(titleContainer, priceContainer);
        const ratingContainer = this.createElement("div", {
            className: "flex items-center space-x-2 mb-3",
        });
        ratingContainer.appendChild(this.createStarsContainer(product.rating, "w-5 h-5"));
        const reviewCount = this.createElement("span", {
            className: "text-gray-600 text-sm",
            textContent: `(${product.reviews.length})`,
        });
        ratingContainer.appendChild(reviewCount);
        const description = this.createElement("p", {
            className: "text-gray-600 line-clamp-3 leading-relaxed mb-4 flex-grow",
            textContent: product.description || "No description available.",
        });
        const footerContainer = this.createElement("div", {
            className: "flex flex-wrap items-center justify-between mt-auto pt-4 border-t border-gray-100",
        });
        const stockContainer = this.createElement("div", {
            className: "flex items-center",
        });
        const stockIndicator = this.createElement("span", {
            className: `inline-block w-3 h-3 rounded-full mr-2 ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`,
        });
        const stockText = this.createElement("span", {
            className: "text-sm text-gray-600",
            textContent: product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock",
        });
        stockContainer.append(stockIndicator, stockText);
        const actionsContainer = this.createElement("div", {
            className: "flex items-center gap-2 mt-3 md:mt-0",
        });
        const quickViewBtn = this.createElement("button", {
            className: "px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-50 transition-colors",
            textContent: "Quick View",
            onclick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showToast(`Quick view for ${product.title}`);
            },
        });
        const addToCartBtn = this.createElement("button", {
            className: `px-4 py-2 gradient-bg text-white text-sm font-medium rounded-full hover:opacity-90 transition-all duration-300 ${product.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}`,
            textContent: "Add to Cart",
            onclick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (product.stock > 0) {
                    this.showToast(`Added ${product.title} to cart!`);
                }
                else {
                    this.showToast("This product is out of stock.", "error");
                }
            },
            disabled: product.stock <= 0,
        });
        actionsContainer.append(quickViewBtn, addToCartBtn);
        footerContainer.append(stockContainer, actionsContainer);
        content.append(headerContainer, ratingContainer, description, footerContainer);
        card.append(imageContainer, content);
        return card;
    }
    renderProducts() {
        this.container.innerHTML = "";
        if (this.filteredProducts.length === 0) {
            const noResultsDiv = this.createElement("div", {
                className: "col-span-full text-center py-16",
            });
            noResultsDiv.innerHTML = `
                <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 class="text-xl font-medium text-gray-900 mb-2">No products found</h3>
                <p class="text-gray-600">Try adjusting your search or filter criteria</p>
            `;
            this.container.appendChild(noResultsDiv);
            return;
        }
        // Update container class based on view
        if (this.currentView === "grid") {
            this.container.className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6";
        }
        else {
            this.container.className = "flex flex-col gap-4";
        }
        const fragment = document.createDocumentFragment();
        this.filteredProducts.forEach((product, index) => {
            const card = this.currentView === "grid" ? this.productGridCard(product) : this.productListCard(product);
            card.style.animationDelay = `${index * 0.05}s`;
            fragment.appendChild(card);
        });
        this.container.appendChild(fragment);
        // Update results count in the dedicated container
        const resultsCountElement = document.getElementById("results-count");
        if (resultsCountElement) {
            resultsCountElement.textContent = `Showing ${this.filteredProducts.length} of ${this.products.length} products`;
        }
    }
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    debounce(func, wait) {
        let timeout = null;
        return (...args) => {
            const later = () => {
                timeout = null;
                func(...args);
            };
            if (timeout !== null) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(later, wait);
        };
    }
}
// Initialize the page
export const productListPage = new ProductListPage();
