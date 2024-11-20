const initialState = {
  specValue: 'india',
  options: [],
  selectedValues: [],
  loading: false,
};

export default function autocompleteReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_SPEC_VALUE':
      return { ...state, specValue: action.payload };
    case 'SET_SELECTED_VALUES':
      return { ...state, selectedValues: action.payload };
    case 'SET_OPTIONS':
      return { ...state, options: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}
