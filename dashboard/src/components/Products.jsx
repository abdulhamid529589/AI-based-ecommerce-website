import React, { useState, useEffect } from 'react'
import { LoaderCircle, Plus, Edit2, Trash2, Eye, Search } from 'lucide-react'
import CreateProductModal from '../modals/CreateProductModal'
import { useDispatch, useSelector } from 'react-redux'
import Header from './Header'
import UpdateProductModal from '../modals/UpdateProductModal'
import ViewProductModal from '../modals/ViewProductModal'
import axios from 'axios'
import { toast } from 'react-toastify'
import './Products.css'

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const itemsPerPage = 10

  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/product/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      setProducts(response.data.products || [])
    } catch (error) {
      toast.error('Failed to fetch products')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('token')
        await axios.delete(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/product/admin/delete/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        toast.success('Product deleted successfully')
        fetchProducts()
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete product')
        console.error(error)
      }
    }
  }

  const handleEditProduct = (product) => {
    setSelectedProduct(product)
    setShowUpdateModal(true)
  }

  const handleViewProduct = (product) => {
    setSelectedProduct(product)
    setShowViewModal(true)
  }

  const handleCreateSuccess = () => {
    setShowCreateModal(false)
    fetchProducts()
  }

  const handleUpdateSuccess = () => {
    setShowUpdateModal(false)
    fetchProducts()
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id?.toString().includes(searchTerm),
  )

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="products-container">
      <Header title="Products Management" />

      <div className="products-content">
        {/* Header Section */}
        <div className="products-header">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="btn-create"
            aria-label="Add new product"
          >
            <Plus className="w-5 h-5" />
            Add New Product
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by product name or ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="search-input"
          />
        </div>

        {/* Table Section */}
        <div className="table-wrapper">
          {loading ? (
            <div className="loading-state">
              <LoaderCircle className="w-8 h-8 animate-spin" />
              <p>Loading products...</p>
            </div>
          ) : paginatedProducts.length > 0 ? (
            <>
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="product-name">
                        <div className="product-cell">
                          {product.image && (
                            <img src={product.image} alt={product.name} className="product-img" />
                          )}
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {product.name}
                            </p>
                            <p className="text-sm text-gray-500">ID: {product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td>{product.category || 'N/A'}</td>
                      <td className="font-semibold">৳ {product.price}</td>
                      <td>
                        <span
                          className={`stock-badge ${
                            product.stock > 20
                              ? 'in-stock'
                              : product.stock > 0
                                ? 'low-stock'
                                : 'out-of-stock'
                          }`}
                        >
                          {product.stock} units
                        </span>
                      </td>
                      <td>
                        <span
                          className={`status-badge ${
                            product.status === 'active' ? 'status-active' : 'status-inactive'
                          }`}
                        >
                          {product.status || 'Active'}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button
                          onClick={() => handleViewProduct(product)}
                          className="action-btn view-btn"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="action-btn edit-btn"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="action-btn delete-btn"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Card View */}
              <div className="table-cards-container">
                {paginatedProducts.map((product) => (
                  <div key={product.id} className="table-card mobile-product-card">
                    <div className="card-header-compact">
                      <div className="card-title-compact">{product.name}</div>
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="product-img-compact"
                        />
                      )}
                    </div>
                    <div className="card-content-compact">
                      <div className="card-row-compact">
                        <span className="card-label-compact">Price</span>
                        <span className="card-value-compact font-semibold">৳ {product.price}</span>
                      </div>
                      <div className="card-row-compact">
                        <span className="card-label-compact">Stock</span>
                        <span
                          className={`stock-badge-compact ${
                            product.stock > 20
                              ? 'in-stock'
                              : product.stock > 0
                                ? 'low-stock'
                                : 'out-of-stock'
                          }`}
                        >
                          {product.stock}
                        </span>
                      </div>
                      <div className="card-row-compact">
                        <span className="card-label-compact">Status</span>
                        <span
                          className={`status-badge-compact ${
                            product.status === 'active' ? 'status-active' : 'status-inactive'
                          }`}
                        >
                          {product.status || 'Active'}
                        </span>
                      </div>
                    </div>
                    <div className="card-footer-compact">
                      <button
                        onClick={() => handleViewProduct(product)}
                        className="action-btn-compact view-btn-compact"
                        title="View Product"
                        aria-label="View product details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="action-btn-compact edit-btn-compact"
                        title="Edit Product"
                        aria-label="Edit product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="action-btn-compact delete-btn-compact"
                        title="Delete Product"
                        aria-label="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  Previous
                </button>
                <div className="pagination-info">
                  Page {currentPage} of {totalPages} ({filteredProducts.length} items)
                </div>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <p>No products found</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateProductModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
      {showUpdateModal && selectedProduct && (
        <UpdateProductModal
          product={selectedProduct}
          onClose={() => setShowUpdateModal(false)}
          onSuccess={handleUpdateSuccess}
        />
      )}
      {showViewModal && selectedProduct && (
        <ViewProductModal product={selectedProduct} onClose={() => setShowViewModal(false)} />
      )}
    </div>
  )
}

export default Products
