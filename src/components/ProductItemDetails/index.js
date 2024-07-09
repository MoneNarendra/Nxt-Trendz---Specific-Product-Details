import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productDetails: {},
    similarProducts: [],
    quentity: 1,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.renderProductDetails()
  }

  renderProducts = () => {
    const {history} = this.props
    history.replace('/products')
  }

  modifuedData = eachPrd => ({
    id: eachPrd.id,
    imageUrl: eachPrd.image_url,
    title: eachPrd.title,
    price: eachPrd.price,
    description: eachPrd.description,
    brand: eachPrd.brand,
    totalReviews: eachPrd.total_reviews,
    rating: eachPrd.rating,
    availability: eachPrd.availability,
  })

  renderProductDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()

      const modifuedData = this.modifuedData(data)
      const similarProducts = data.similar_products.map(eachPrd =>
        this.modifuedData(eachPrd),
      )

      this.setState({
        productDetails: modifuedData,
        similarProducts,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  quentityIncer = () => {
    this.setState(prevState => ({quentity: prevState.quentity + 1}))
  }

  quentityDecr = () => {
    const {quentity} = this.state
    if (quentity > 1) {
      this.setState(prevState => ({quentity: prevState.quentity - 1}))
    }
  }

  renderProductView = () => {
    const {productDetails, similarProducts, quentity} = this.state
    const {
      imageUrl,
      title,
      price,
      rating,
      totalReviews,
      description,
      availability,
      brand,
    } = productDetails
    return (
      <>
        {' '}
        <div className="product">
          <div className="image-con">
            <img src={imageUrl} alt="product" className="product-imag" />
          </div>
          <div className="content-container">
            <h1 className="title">{title}</h1>
            <p className="price">Rs {price}/-</p>
            <div className="rating-rewiew-container">
              <div className="rating-con">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="rating-icon"
                />
              </div>
              <p className="reviews">{totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <div className="availability-brand-con">
              <p className="availability-brand-title">Availability:</p>
              <p className="availability-brand">{availability}</p>
            </div>
            <div className="availability-brand-con">
              <p className="availability-brand-title">Brand:</p>
              <p className="availability-brand">{brand}</p>
            </div>
            <hr />
            <div className="quentity-container">
              <button
                data-testid="plus"
                onClick={this.quentityIncer}
                type="button"
                className="plus-minus-btn"
                aria-label="minus"
              >
                <BsPlusSquare className="plus-minus-icon" />
              </button>
              <p>{quentity}</p>
              <button
                onClick={this.quentityDecr}
                data-testid="minus"
                type="button"
                className="plus-minus-btn"
                aria-label="plus"
              >
                <BsDashSquare className="plus-minus-icon" />
              </button>
            </div>
            <button className="add-cart-btn" type="button">
              Add to Cart
            </button>
          </div>
        </div>
        <div className="similar-products">
          <h1 className="similar-products-heading">Similar Products</h1>
          <ul className="similar-products-lists">
            {similarProducts.map(eachProduct => (
              <SimilarProductItem
                eachProduct={eachProduct}
                key={eachProduct.id}
              />
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderFailureView = () => (
    <div className="product-loader-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-img"
      />
      <h1 className="products-error-heading">Product Not Found</h1>
      <button
        type="button"
        className="continue-btn"
        onClick={this.renderProducts}
      >
        Continue Shopping
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="product-loader-failure-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderAllProducts = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="products-details-con">{this.renderAllProducts()}</div>
      </>
    )
  }
}

export default ProductItemDetails
