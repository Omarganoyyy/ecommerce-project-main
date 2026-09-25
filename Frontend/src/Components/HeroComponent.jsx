import { Link } from "react-router-dom";
import './HeroComponent.css'

export function HeroComponent({handleScroll,targetHeroRef}) {
    return (

        <div ref={targetHeroRef} className="hero-container-fullheight">
            <div className="hero-component">
                <div className="leftside-herosection">
                    <img className="HeroImg" src="Balenciaga.jpg"></img>
                </div>

                <div className="rightside-herosection">
                    <h2>REFINED ESSENTIALS FOR EVERYDAY ELEVATION.</h2>

                    <p>Pure lines, premium fabrics, and timeless design.
                        Discover a curated collection made to seamlessly
                        integrate into your daily wardrobe.
                    </p>

                    <Link onClick={handleScroll} className="shopnow">
                        SHOP NEW ARRIVALS
                    </Link>
                </div>
            </div>
        </div>
    )
}