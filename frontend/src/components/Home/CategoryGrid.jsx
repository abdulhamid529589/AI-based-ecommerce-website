import { Link } from 'react-router-dom'
import { categories } from '../../data/products'
const CategoryGrid = () => {
  return (
    <section className="py-8 md:py-12 lg:py-16 px-4 md:px-6 lg:px-0">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 md:mb-4">
          Shop by Category
        </h2>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
          Discover our wide range of products across different categories
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/products?category=${category.name}`}
            className="group glass-card p-4 sm:p-5 md:p-6 text-center hover:glow-on-hover animate-smooth"
          >
            <div className="relative overflow-hidden rounded-lg mb-3 sm:mb-4">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-20 sm:h-24 md:h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {category.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default CategoryGrid
