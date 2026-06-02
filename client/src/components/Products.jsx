import { useEffect, useState } from 'react';
import { getProducts } from '../api.js';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <section className="page-section">
      <div className="page-header">
        <h2>Product Catalog</h2>
      </div>

      {loading && <p>Loading products...</p>}
      {!loading && products.length === 0 && <p>No products are available at this time.</p>}

      <div className="product-grid">
        {products.map((product) => (
          <article key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <span className="category-label">{product.category}</span>
            <p className="price">Price: {product.price}</p>
            <p>{product.description}</p>
            <div className="spec-block">
              <strong>Specifications:</strong>
              <ul>
                <li>CPU: {product.specs.cpu}</li>
                <li>RAM: {product.specs.ram}</li>
                <li>Storage: {product.specs.storage}</li>
                <li>Display: {product.specs.display}</li>
              </ul>
            </div>
            <div className="recommended-block">
              <strong>Recommended for:</strong>
              <p>{product.recommendedFor.join(', ')}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Products;
