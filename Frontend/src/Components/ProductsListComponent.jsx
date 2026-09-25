import { Product } from './Product'

export function ProductsListComponent({filteredProducts,targetRef,loadCart})
{
    return (
        <div ref={targetRef} className="home-page">
                <h1 className="explore-collection">EXPLORE COLLECTION</h1>
                <div className="products-grid">

                    {filteredProducts.map((product) =>
                        <Product product={product} loadCart={loadCart}/>)}

                </div>
            </div>
    )
}