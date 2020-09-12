import { useReducer, useCallback } from 'react';

const initialState = {
    loading: false,
    error: null,
    data: null,
    extra: null,
    identifier: null};

const httpReducer = (httpState, action) => {
    switch (action.type) {
        case 'SEND':
            return {loading: true, error: null, extra: null, data: null, identifier: action.identifier};
        case 'RESPONSE':
            return {...httpState, loading: false, data: action.resData, extra: action.extra};
        case 'ERROR':
            return {loading: false, error: action.error};
        case 'CLEAR':
            return initialState;
        default: throw new Error('http reducer err')
    }
};

const useFetch = () => {
    const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

    const clear = useCallback(() => dispatchHttp({type: 'CLEAR'}), []);

    const sendRequest = useCallback((url, method, body, reqExtra, reqIdentifier) => {
        dispatchHttp({type: 'SEND', identifier: reqIdentifier});
        fetch(url, {
                method, body,
            headers: {'Content-Type': 'application/json'}
            }
        ).then(res => {
            return res.json();
        })
            .then(resData => {
                dispatchHttp({type: 'RESPONSE', resData, extra: reqExtra});
            }
        ).catch(err => {
            dispatchHttp({type: 'ERROR', error: 'Something went wrong' });
        })
    }, []);
    return {
        loading: httpState.loading,
        data: httpState.data,
        error: httpState.error,
        sendRequest,
        reqExtra: httpState.extra,
        reqIdentifier: httpState.identifier,
        clear
    }
};

export default useFetch;