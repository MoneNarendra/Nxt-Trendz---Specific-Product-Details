import './index.css'

const SimilarProductItem = props => {
  const {eachProduct} = props
  const {title, brand, price, rating, imageUrl} = eachProduct
  return (
    <li className="similar-product-container">
      <img src={imageUrl} className="sim-pro-imgs" alt="similar product" />
      <h1 className="sim-pro-heading">{title}</h1>
      <p className="sim-pro-brand">by {brand}</p>
      <div className="price-rating-contianer">
        <p className="sim-pro-price">Rs {price}/-</p>
        <div className="rating-con">
          <p className="rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="rating-icon"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
