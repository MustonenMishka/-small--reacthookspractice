import React, {useReducer, useEffect, useCallback, useMemo} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import useFetch from '../../hooks/http';

const ingredientReducer = (currentIngr, action) => {
    switch (action.type) {
        case 'SET':
            return action.ingredients;
        case 'ADD':
            return [...currentIngr, action.ingredient];
        case 'DELETE':
            return currentIngr.filter(ingr => ingr.id !== action.id);
        default: throw new Error('ingr reducer err')
    }
};


const Ingredients = () => {
    const [ingredients, dispatchIngr] = useReducer(ingredientReducer, []);
    const { loading, error, data, sendRequest, reqExtra, reqIdentifier, clear } = useFetch();

    useEffect(() => {
        if (!loading && !error && reqIdentifier === 'REMOVE_INGREDIENT') {
            dispatchIngr({type: 'DELETE', id: reqExtra})
        } else if (!loading && !error && reqIdentifier === 'ADD_INGREDIENT'){
            dispatchIngr({type: 'ADD', ingredient: {id: data.name, ...reqExtra}})
        }
    }, [data, reqExtra, loading, error, reqIdentifier]);

    const addIngredientHandler = useCallback(ingredient => {
        sendRequest('https://react-hook-practice-cdd38.firebaseio.com/ingredients.json', 'POST',
            JSON.stringify({...ingredient}), ingredient, 'ADD_INGREDIENT')
    }, [sendRequest]);

    const removeIngredientHandler = useCallback(ingrId => {
        sendRequest(`https://react-hook-practice-cdd38.firebaseio.com/ingredients/${ingrId}.json`, 'DELETE', null, ingrId, 'REMOVE_INGREDIENT')
    }, [sendRequest]);

    const filteredIngrHandler = useCallback(filteredIngr => {
        dispatchIngr({type: 'SET', ingredients: filteredIngr})
    }, []);


    const ingrList = useMemo(() => {
        return <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>
    }, [ingredients, removeIngredientHandler]);

    return (
        <div className="App">
            {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
            <IngredientForm onAddIngr={addIngredientHandler} loading={loading}/>

            <section>
                <Search onLoadIngr={filteredIngrHandler}/>
                {ingrList}
            </section>
        </div>
    );
};

export default Ingredients;
