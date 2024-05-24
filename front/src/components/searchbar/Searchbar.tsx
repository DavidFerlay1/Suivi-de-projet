
import React, { ChangeEvent, useCallback, useContext, useEffect, useRef, useState } from "react"
import { QueryContext } from "../../contexts/QueryContext"
import { SearchContext } from "../../contexts/SearchContext"
import "./searchbar.scss"
import { useTranslation } from "react-i18next"

const Searchbar = ({renderItem}) => {
    const searchContext = useContext(SearchContext);
    const queryContext = useContext(QueryContext);
    const [focused, setFocused] = useState(false);
    const {t} = useTranslation();

    const searchWrapperRef = useRef<HTMLDivElement>(null);

    const [suggestions, setSuggestions] = useState<any[]>([])

    const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
        searchContext.update(e.target.value);
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleFocus);
        return () => document.removeEventListener('mousedown', handleFocus);
    }, [searchWrapperRef.current])

    const handleFocus = useCallback((e: MouseEvent) => {
        if(searchWrapperRef.current) {
            setFocused(searchWrapperRef.current.contains(e.target as Node))
        }
    }, [searchWrapperRef.current])

    useEffect(() => {
        if(searchContext.current)
            queryContext?.fetch().then((res: any[]) => setSuggestions(res));
        else
            setSuggestions([]);
    }, [searchContext.current])

    return (
        <div ref={searchWrapperRef} className="searchbar-wrapper">
            <input type="text" className="searchbar" onChange={onChange} />
            {focused && 
                <ul className="suggestions" tabIndex={0}>
                    {!suggestions.length && <span className="emptyMessage">{!searchContext.current ? t('searchbar.typeToSearch') : t('searchbar.noResult')}</span>}
                    {suggestions.map((suggestion, index) => <li key={index}>{renderItem(suggestion)}</li>)}
                </ul>
            }
        </div>
        
    )
}

export default Searchbar;