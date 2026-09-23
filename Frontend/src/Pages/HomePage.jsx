import { HeroComponent } from "../Components/HeroComponent";
import { NavBar } from "../Components/NavBar";
import './HomePage.css'
import { ProductsListComponent } from "../Components/ProductsListComponent";
import { useRef } from "react";

export function HomePage({products}) {

    const targetRef = useRef(null);

    const handleScroll = () => {
        targetRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    

    return (
        <>
            <NavBar />
            <HeroComponent handleScroll={handleScroll} />
            <ProductsListComponent filteredProducts={products} targetRef={targetRef}/>
        </>
    )

}