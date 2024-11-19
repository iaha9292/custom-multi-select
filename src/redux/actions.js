export const setSpecValue = (value) => ({ type: 'SET_SPEC_VALUE', payload: value });
export const setSelectedValues = (values) => ({ type: 'SET_SELECTED_VALUES', payload: values });
export const setSearchedValue = (value) => ({ type: 'SET_SEARCHED_VALUE', payload: value });
export const setOptions = (options) => ({ type: 'SET_OPTIONS', payload: options });
export const setLoading = (loading) => ({ type: 'SET_LOADING', payload: loading });

// Action to trigger Saga
export const fetchOptionsRequest = (query, specValue, validationConfig) => ({
    type: 'FETCH_OPTIONS_REQUEST',
    payload: { query, specValue, validationConfig },
});
