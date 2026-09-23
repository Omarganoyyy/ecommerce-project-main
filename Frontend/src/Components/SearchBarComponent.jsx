import './SearchBarComponent.css'

export function SearchBarComponent({handleSearchInput,searchInput})
{
    
    return (
        <div className="search-container">
            <input className="search" value={searchInput} onChange={handleSearchInput} type="text" placeholder="Search For Products..."></input>
        </div>
    )
}