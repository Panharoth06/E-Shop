interface HeroData {
  title: string
  subtitle: string
  description: string
  primaryButton: {
    text: string
    action: () => void
  }
  secondaryButton: {
    text: string
    action: () => void
  }
  features: string[]
  stats: Array<{
    number: string
    label: string
  }>
}

class HeroSection {
  private container: HTMLElement | null
  private data: HeroData

  constructor(containerId: string) {
    this.container = document.getElementById(containerId)
    this.data = {
      title: "Discover Amazing Products",
      subtitle: "Premium E-Commerce Experience",
      description:
        "Shop the latest trends with unbeatable prices and lightning-fast delivery. Your satisfaction is our priority.",
      primaryButton: {
        text: "Shop Now",
        action: () => this.scrollToProducts(),
      },
      secondaryButton: {
        text: "View Categories",
        action: () => this.showCategories(),
      },
      features: [
        "Free Shipping on Orders $50+",
        "30-Day Money Back Guarantee",
        "24/7 Customer Support",
        "Secure Payment Processing",
      ],
      stats: [
        { number: "50K+", label: "Happy Customers" },
        { number: "10K+", label: "Products" },
        { number: "99.9%", label: "Satisfaction Rate" },
      ],
    }
  }

  private createElement(tag: string, className = "", content = ""): HTMLElement {
    const element = document.createElement(tag)
    if (className) element.className = className
    if (content) element.textContent = content
    return element
  }

  private createButton(text: string, isPrimary = true, onClick?: () => void): HTMLElement {
    const button = this.createElement("button", "", text)

    if (isPrimary) {
      button.className = `
        gradient-bg text-white font-semibold py-3 px-8 rounded-lg
        transform transition-all duration-300 hover:scale-105 hover:shadow-lg
        focus:outline-none focus:ring-4 focus:ring-purple-300
        slide-in
      `
        .trim()
        .replace(/\s+/g, " ")
    } else {
      button.className = `
        glass-effect text-gray-800 font-semibold py-3 px-8 rounded-lg
        transform transition-all duration-300 hover:scale-105
        focus:outline-none focus:ring-4 focus:ring-white/30
        slide-in
      `
        .trim()
        .replace(/\s+/g, " ")
    }

    if (onClick) {
      button.addEventListener("click", onClick)
    }

    return button
  }

  private createFeaturesList(): HTMLElement {
    const featuresContainer = this.createElement("div", "grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 slide-in")

    this.data.features.forEach((feature, index) => {
      const featureItem = this.createElement("div", "flex items-center space-x-3")

      // Create checkmark icon
      const checkIcon = this.createElement(
        "div",
        "w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0",
      )
      checkIcon.innerHTML = `
        <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
        </svg>
      `

      const featureText = this.createElement("span", "text-gray-700 font-medium", feature)

      featureItem.appendChild(checkIcon)
      featureItem.appendChild(featureText)
      featuresContainer.appendChild(featureItem)

      // Add staggered animation delay
      setTimeout(() => {
        featureItem.classList.add("fade-in")
      }, index * 100)
    })

    return featuresContainer
  }

  private createStatsSection(): HTMLElement {
    const statsContainer = this.createElement("div", "grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12 slide-in")

    this.data.stats.forEach((stat, index) => {
      const statItem = this.createElement("div", "text-center glass-effect rounded-lg p-6 card-hover")

      const statNumber = this.createElement(
        "div",
        "text-3xl rounded-md font-bold gradient-bg bg-clip-text text-white",
        stat.number
      )
      const statLabel = this.createElement("div", "text-gray-600 mt-2 font-medium", stat.label)

      statItem.appendChild(statNumber)
      statItem.appendChild(statLabel)
      statsContainer.appendChild(statItem)

      // Add staggered animation
      setTimeout(() => {
        statItem.classList.add("fade-in")
      }, index * 150)
    })

    return statsContainer
  }

  private createHeroContent(): HTMLElement {
    const heroSection = this.createElement(
      "section",
      `
      relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8
      bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden
    `
        .trim()
        .replace(/\s+/g, " "),
    )

    // Background decorative elements
    const backgroundDecor = this.createElement("div", "absolute inset-0 overflow-hidden pointer-events-none")

    // Floating shapes with unique IDs for parallax
    const shape1 = this.createElement(
      "div",
      `
  parallax-shape-1 absolute top-1/4 left-1/4 w-64 h-64 gradient-bg rounded-full
  transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out
`
        .trim()
        .replace(/\s+/g, " "),
    )

    const shape2 = this.createElement(
      "div",
      `
  parallax-shape-2 absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-400 to-purple-400
  rounded-full transform translate-x-1/2 translate-y-1/2 transition-transform duration-75 ease-out
`
        .trim()
        .replace(/\s+/g, " "),
    )

    backgroundDecor.appendChild(shape1)
    backgroundDecor.appendChild(shape2)

    // Main content container
    const contentContainer = this.createElement("div", "relative z-10 max-w-6xl mx-auto text-center")

    // Subtitle badge
    const subtitleBadge = this.createElement(
      "div",
      `
      inline-flex items-center px-4 py-2 rounded-full glass-effect text-purple-700
      font-medium text-sm mb-6 fade-in
    `
        .trim()
        .replace(/\s+/g, " "),
      this.data.subtitle,
    )

    // Main title
    const title = this.createElement(
      "h1",
      `
      text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6
      leading-tight slide-in
    `
        .trim()
        .replace(/\s+/g, " "),
      this.data.title,
    )

    // Description
    const description = this.createElement(
      "p",
      `
      text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed slide-in
    `
        .trim()
        .replace(/\s+/g, " "),
      this.data.description,
    )

    // Button container
    const buttonContainer = this.createElement(
      "div",
      `
      flex flex-col sm:flex-row gap-4 justify-center items-center mb-8
    `
        .trim()
        .replace(/\s+/g, " "),
    )

    const primaryButton = this.createButton(this.data.primaryButton.text, true, this.data.primaryButton.action)
    const secondaryButton = this.createButton(this.data.secondaryButton.text, false, this.data.secondaryButton.action)

    buttonContainer.appendChild(primaryButton)
    buttonContainer.appendChild(secondaryButton)

    // Features list
    const featuresList = this.createFeaturesList()

    // Stats section
    const statsSection = this.createStatsSection()

    // Scroll indicator
    const scrollIndicator = this.createElement(
      "div",
      `
      absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer
    `
        .trim()
        .replace(/\s+/g, " "),
    )

    scrollIndicator.innerHTML = `
      <div class="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
        <div class="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
      </div>
    `

    scrollIndicator.addEventListener("click", () => {
      const productsSection = document.querySelector("#product-container")
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: "smooth" })
      }
    })

    // Assemble the hero section
    contentContainer.appendChild(subtitleBadge)
    contentContainer.appendChild(title)
    contentContainer.appendChild(description)
    contentContainer.appendChild(buttonContainer)
    contentContainer.appendChild(featuresList)
    contentContainer.appendChild(statsSection)

    heroSection.appendChild(backgroundDecor)
    heroSection.appendChild(contentContainer)
    heroSection.appendChild(scrollIndicator)

    return heroSection
  }

  private scrollToProducts(): void {
    const productsSection = document.querySelector("#product-container")
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" })
      this.showToast("Welcome to our product catalog!", "success")
    }
  }

  private showCategories(): void {
    // This would typically open a categories modal or navigate to categories page
    this.showToast("Categories feature coming soon!", "info")
  }

  private showToast(message: string, type: "success" | "error" | "info" = "info"): void {
    const toastContainer = document.getElementById("toast-container")
    if (!toastContainer) return

    const toast = this.createElement(
      "div",
      `
      toast glass-effect rounded-lg p-4 mb-2 text-violet-600 font-medium
      ${type === "success" ? "bg-green-500/80" : type === "error" ? "bg-red-500/80 text-red-500/80" : "bg-blue-500/80 text-blue-500/80"}
    `
        .trim()
        .replace(/\s+/g, " "),
      message,
    )

    toastContainer.appendChild(toast)

    // Remove toast after animation completes
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast)
      }
    }, 3000)
  }

  private addInteractiveEffects(): void {
    // Enhanced parallax effect for circles
    let ticking = false

    const updateParallax = () => {
      const scrolled = window.pageYOffset
      const windowHeight = window.innerHeight

      // Get the shapes
      const shape1 = document.querySelector(".parallax-shape-1") as HTMLElement
      const shape2 = document.querySelector(".parallax-shape-2") as HTMLElement

      if (shape1 && shape2) {
        // Calculate parallax movement (slower movement, bidirectional)
        const parallaxSpeed1 = 0.9
        const parallaxSpeed2 = 0.8

        // Calculate movement based on scroll position
        const moveY1 = scrolled * parallaxSpeed1
        const moveY2 = scrolled * parallaxSpeed2

        // Apply transforms (preserving original positioning)
        shape1.style.transform = `translate(-50%, -50%) translateY(${moveY1}px) rotate(${scrolled * 0.05}deg)`
        shape2.style.transform = `translate(50%, 50%) translateY(${-moveY2}px) rotate(${-scrolled * 0.05}deg)`
      }

      ticking = false
    }

    // Throttled scroll listener
    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax)
        ticking = true
      }
    })

    // Add typing effect to title
    setTimeout(() => {
      const title = document.querySelector("#hero-section h1")
      if (title && title.textContent) {
        const text = title.textContent
        title.textContent = ""
        let i = 0

        const typeWriter = () => {
          if (i < text.length) {
            title.textContent += text.charAt(i)
            i++
            setTimeout(typeWriter, 50)
          }
        }

        typeWriter()
      }
    }, 1000)
  }

  public render(): void {
    if (!this.container) {
      console.error("Hero section container not found")
      return
    }

    const heroContent = this.createHeroContent()
    this.container.appendChild(heroContent)

    // Add interactive effects
    this.addInteractiveEffects()

    // Show welcome toast
    setTimeout(() => {
      this.showToast("Welcome to our store! 🛍️", "success")
    }, 2000)
  }

  // Public method to update hero data
  public updateData(newData: Partial<HeroData>): void {
    this.data = { ...this.data, ...newData }
    if (this.container) {
      this.container.innerHTML = ""
      this.render()
    }
  }
}

// Initialize hero section when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const heroSection = new HeroSection("hero-section")
  heroSection.render()
})

// Export for potential use in other modules
export default HeroSection
