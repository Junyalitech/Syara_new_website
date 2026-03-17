import React from 'react'
import { topRatedProducts } from '../../data/products';
import './SidebarTopProducts.css'

const SidebarTopProducts = () => {
    return (
        <div>
            <div className="sidebar-section-top-product">
                <h3 className="sidebar-section__title-top-product">Top Rated Products</h3>
                <div className="sidebar-top-rated">
                    {topRatedProducts.map((product) => (<div key={product.id} className="sidebar-top-rated__item">
                        <img src={product.image} alt={product.name} className="sidebar-top-rated__image" />
                        <div>
                            <p className="sidebar-top-rated__name">{product.name}</p>
                            <span className="sidebar-top-rated__price">${product.price.toFixed(2)}</span>
                        </div>
                    </div>))}
                </div>
            </div>
            
        </div>
    )
}

export default SidebarTopProducts