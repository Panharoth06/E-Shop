import { fetchAllProducts } from "./fetchAllProducts.js"
import type { Product } from "./Product.js"
import { createProductGridCard, createProductListCard } from "./product-card.js"

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
`

const getSearchValue = (): string => {
  const inputs = [
    document.getElementById("search-navbar") as HTMLInputElement | null,
    document.getElementById("mobile-search-navbar") as HTMLInputElement | null,
  ]
  const input = inputs.find((i) => i && i.value.trim() !== "")
  console.log(
    "Search inputs:",
    inputs.map((i) => i?.value),
  ) // Debug input values
  return input?.value.toLowerCase().trim() ?? ""
}

class ProductListPage {
  private container: HTMLElement
  private toastContainer: HTMLElement
  private allProducts: Product[] = []
  private debounceTimeout: number | null = null
  private viewMode: "grid" | "list" = "grid"

  constructor() {
    this.container = document.getElementById("product-container")!
    this.toastContainer = document.getElementById("toast-container")!
    if (!this.container) {
      console.error("Product container not found")
    }
    this.init()
  }

  private async init(): Promise<void> {
    this.showLoadingState()
    try {
      const products = await fetchAllProducts()
      this.allProducts = products // Rely on fetchAllProducts sanitization
      console.log("Fetched products:", this.allProducts.length) // Debug product count
      if (this.allProducts.length > 0) {
        this.renderProducts(this.allProducts)
      } else {
        this.showErrorState("No valid products found.")
      }
    } catch (error) {
      this.showErrorState("Failed to load products. Please try again later.")
      console.error("Error in init:", error)
    }
    this.setupNavbar()
  }

  private setupNavbar(): void {
    const navbarContainer = document.getElementById("navbar-container")
    if (navbarContainer) {
      navbarContainer.innerHTML = navbar()
      console.log("Navbar rendered") // Debug navbar
      this.setupSearchListeners()
      this.setupMenuToggle()
    } else {
      console.error("Navbar container not found")
    }
  }


  private updateViewButtons(): void {
    const gridBtn = document.getElementById("grid-view")
    const listBtn = document.getElementById("list-view")

    if (gridBtn && listBtn) {
      if (this.viewMode === "grid") {
        gridBtn.className = "px-4 py-2 rounded-lg border transition-all bg-purple-600 text-white"
        listBtn.className = "px-4 py-2 rounded-lg border transition-all bg-white text-gray-600 hover:bg-gray-50"
      } else {
        gridBtn.className = "px-4 py-2 rounded-lg border transition-all bg-white text-gray-600 hover:bg-gray-50"
        listBtn.className = "px-4 py-2 rounded-lg border transition-all bg-purple-600 text-white"
      }
    }
  }

  private setupSearchListeners(): void {
    ;["search-form", "mobile-search-form"].forEach((formId) => {
      const form = document.getElementById(formId) as HTMLFormElement | null
      if (form) {
        form.addEventListener("submit", (e) => {
          e.preventDefault()
          console.log("Form submitted:", formId) // Debug form submission
          this.handleSearch()
        })
      } else {
        console.warn(`Form ${formId} not found`)
      }
    })
    ;["search-navbar", "mobile-search-navbar"].forEach((id) => {
      const input = document.getElementById(id) as HTMLInputElement | null
      if (input) {
        input.addEventListener("input", () => {
          console.log("Input event on", id, "value:", input.value) // Debug input
          if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout)
          }
          this.debounceTimeout = setTimeout(() => {
            this.handleSearch()
          }, 300)
        })
      } else {
        console.warn(`Input ${id} not found`)
      }
    })
  }

  private setupMenuToggle(): void {
    const menuToggle = document.getElementById("menu-toggle") as HTMLButtonElement | null
    const mobileMenu = document.getElementById("mobile-menu") as HTMLElement | null
    if (menuToggle && mobileMenu) {
      menuToggle.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden")
        console.log("Mobile menu toggled") // Debug menu toggle
      })
    } else {
      console.warn("Menu toggle or mobile menu not found")
    }
  }

  private handleSearch(): void {
    const searchValue = getSearchValue()
    console.log("Search value:", searchValue) // Debug search value
    const filtered = this.allProducts.filter((product) => {
      try {
        return (
          (product.title?.toLowerCase() || "").includes(searchValue) ||
          (product.description?.toLowerCase() || "").includes(searchValue) ||
          (product.category?.toLowerCase() || "").includes(searchValue) ||
          (product.brand?.toLowerCase() || "").includes(searchValue) ||
          (Array.isArray(product.tags)
            ? product.tags.some((tag) => (tag?.toLowerCase() || "").includes(searchValue))
            : false) ||
          (product.sku?.toLowerCase() || "").includes(searchValue)
        )
      } catch (error) {
        console.warn("Error filtering product:", product, error)
        return false
      }
    })
    console.log("Filtered products:", filtered.length) // Debug filtered count
    if (filtered.length === 0 && searchValue) {
      this.showErrorState("No products match your search.")
    } else {
      this.renderProducts(filtered)
    }
  }

  private showLoadingState(): void {
    this.container.innerHTML = ""
    const loadingDiv = this.createElement("div", {
      className: "col-span-full text-center py-16",
    })

    const spinner = this.createElement("div", {
      className: "animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600 mx-auto",
    })

    const text = this.createElement("p", {
      className: "mt-4 text-gray-600 text-lg",
      textContent: "Loading products...",
    })

    loadingDiv.append(spinner, text)
    this.container.appendChild(loadingDiv)
  }

  private showErrorState(message: string): void {
    this.container.innerHTML = ""
    const errorDiv = this.createElement("div", {
      className: "col-span-full text-center py-16 text-red-600",
    })
    const errorText = this.createElement("p", {
      className: "text-lg font-medium",
      textContent: message,
    })
    const retryButton = this.createElement("button", {
      className: "mt-4 gradient-bg text-white px-6 py-2 rounded-full hover:opacity-90 transition-all",
      textContent: getSearchValue() ? "Clear Search" : "Try Again",
      onclick: () => {
        if (getSearchValue()) {
          const inputs = ["search-navbar", "mobile-search-navbar"]
          inputs.forEach((id) => {
            const input = document.getElementById(id) as HTMLInputElement | null
            if (input) input.value = ""
          })
          this.handleSearch()
        } else {
          this.init()
        }
      },
    })
    errorDiv.append(errorText, retryButton)
    this.container.appendChild(errorDiv)
  }

  private createElement<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    options: { className?: string; textContent?: string; [key: string]: any } = {},
  ): HTMLElementTagNameMap[K] {
    const element = document.createElement(tag)
    Object.assign(element, options)
    if (options.className) element.className = options.className
    if (options.textContent) element.textContent = options.textContent
    return element
  }

  private showToast(message: string, type: "success" | "error" = "success"): void {
    const toast = this.createElement("div", {
      className: `toast glass-effect px-6 py-3 rounded-lg shadow-lg ${type === "success" ? "bg-green-500 text-green-500" : "bg-red-500 text-red-500"}`,
      textContent: message,
    })
    this.toastContainer.appendChild(toast)
    setTimeout(() => toast.remove(), 3000)
  }

  private renderProducts(products: Product[]): void {
    this.container.innerHTML = ""
    if (products.length === 0) {
      this.showErrorState("No products available.")
      return
    }

    // Update container classes based on view mode
    if (this.viewMode === "grid") {
      this.container.className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    } else {
      this.container.className = "space-y-4"
    }

    const fragment = document.createDocumentFragment()
    products.forEach((product, index) => {
      let card: HTMLElement

      if (this.viewMode === "grid") {
        // Use the imported createProductGridCard function
        card = createProductGridCard(product)
      } else {
        // Use the imported createProductListCard function
        card = createProductListCard(product)
      }

      card.style.animationDelay = `${index * 0.1}s`
      fragment.appendChild(card)
    })
    this.container.appendChild(fragment)
  }
}

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  new ProductListPage()
})
