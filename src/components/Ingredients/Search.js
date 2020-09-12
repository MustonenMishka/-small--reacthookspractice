import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import ErrorModal from "../UI/ErrorModal";
import useFetch from "../../hooks/http";
import './Search.css';


const Search = React.memo(props => {
    const { onLoadIngr } = props;
    const [filter, setFilter] = useState('');
    const filterRef = useRef();
    const { loading, data, error, sendRequest, clear } = useFetch();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (filter === filterRef.current.value) { // if user stopped typing
                const query = filter.length === 0 ? '' : `?orderBy="title"&equalTo="${filter}"`;
                sendRequest('https://react-hook-practice-cdd38.firebaseio.com/ingredients.json' + query, 'GET', )};
        },500);
        return () => {clearTimeout(timer)}
    }, [filter, sendRequest, filterRef]);

    useEffect(() => {
        if (!loading && !error && data) {
            const loadedIngr = [];
            for (const key in data) {
                loadedIngr.push({
                    id: key,
                    title: data[key].title,
                    amount: data[key].amount
                })
            }
            onLoadIngr(loadedIngr)
        }
    }, [data, loading, error, onLoadIngr]);

  return (
    <section className="search">
        {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
            {loading && <span>...Loading</span>}
          <input type="text" value={filter} onChange={e => setFilter(e.target.value)} ref={filterRef} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
