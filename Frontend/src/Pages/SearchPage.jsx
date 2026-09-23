import { useState } from "react";
import { NavBar } from "../Components/NavBar";
import { ProductsListComponent } from "../Components/ProductsListComponent";
import { SearchBarComponent } from "../Components/SearchBarComponent";

export function SearchPage({ products }) {

    const [searchInput, setSearchInput] = useState("")
    console.log(searchInput)

    function handleSearchInput(e) {
        return setSearchInput(e.target.value)
    }


    const filteredProducts = products.filter((product) => {
        const matchingName = product.name.toLowerCase().includes(searchInput.toLowerCase())
        const matchingKey = product.keywords.some((keyword) => keyword.toLowerCase().includes(searchInput.toLowerCase()))
   
        return matchingName || matchingKey
    })
    
    return (
        <>
            <NavBar />
            <SearchBarComponent handleSearchInput={handleSearchInput} products={products} />
            <ProductsListComponent filteredProducts={filteredProducts} />
        </>
    )
}