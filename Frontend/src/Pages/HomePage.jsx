import { HeroComponent } from "../Components/HeroComponent";
import { NavBar } from "../Components/NavBar";
import './HomePage.css'
import { ProductsListComponent } from "../Components/ProductsListComponent";
import { useRef } from "react";

export function HomePage({ products, loadCart, user }) {

    const targetRef = useRef(null);

    const targetHeroRef = useRef(null);


    const handleScroll = () => {
        targetRef.current?.scrollIntoView({ behavior: 'smooth' });
    };


    const handleScrollToHero = () => {
        targetHeroRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    };


    return (
        <>
            <NavBar handleScrollToHero={handleScrollToHero} user={user} />
            <HeroComponent handleScroll={handleScroll} targetHeroRef={targetHeroRef} />
            <ProductsListComponent filteredProducts={products} targetRef={targetRef} loadCart={loadCart} />
        </>
    )

}