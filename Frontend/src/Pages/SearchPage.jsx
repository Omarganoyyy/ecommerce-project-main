import { useEffect, useState } from "react";
import axios from "axios";
import { NavBar } from "../Components/NavBar";
import { ProductsListComponent } from "../Components/ProductsListComponent";
import { SearchBarComponent } from "../Components/SearchBarComponent";

export function SearchPage({ products, loadCart, user }) {

    const [searchInput, setSearchInput] = useState("")
    const [filteredProducts, setFilteredProducts] = useState(products)

    useEffect(() => {
        const searchTerm = searchInput.trim()

        if (!searchTerm) {
            setFilteredProducts(products)
            return
        }

        const getFilteredProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/products?search=${encodeURIComponent(searchTerm)}`)
                setFilteredProducts(response.data)
            } catch (error) {
                console.error('Error searching products:', error)
                setFilteredProducts([])
            }
        }

        getFilteredProducts()
    }, [searchInput, products])

    function handleSearchInput(e) {
        return setSearchInput(e.target.value)
    }

    return (
        <>
            <NavBar user={user} />
            <SearchBarComponent handleSearchInput={handleSearchInput} products={products} />
            <ProductsListComponent filteredProducts={filteredProducts} loadCart={loadCart} />
        </>
    )
}