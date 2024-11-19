import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';
import { setOptions, setLoading } from './actions';


export const validateQuery = (specValue, query, validationConfig) => {
    if (!query) return false;

    const config = validationConfig[specValue];
    if (!config) return query.length >= 3; // Default validation: min length of 3

    switch (config.type) {
        case "regex":
            return config.pattern.test(query);

        case "length":
            return query.length >= (config.minLength || 3);

        case "combined":
            return (
                query.length >= (config.minLength || 3) && config.regex.test(query)
            );

        default:
            return query.length >= 3; // Default fallback
    }
};


// API call
const fetchOptionsApi = async (query, specValue) => {
    const response = await axios.get('http://universities.hipolabs.com/search', {
        params: { country: specValue, search: query },
    });
    return response.data;
};

// Saga worker
function* fetchOptionsSaga(action) {
    const { query, specValue, validationConfig } = action.payload;

    // Validate query
    const isValidQuery = validateQuery(specValue, query, validationConfig);
    if (!isValidQuery) return;

    yield put(setLoading(true));
    try {
        const data = yield call(fetchOptionsApi, query, specValue);
        yield put(setOptions(data));
    } catch (error) {
        console.error(error);
    } finally {
        yield put(setLoading(false));
    }
}

// Saga watcher
export function* watchFetchOptions() {
    yield takeLatest('FETCH_OPTIONS_REQUEST', fetchOptionsSaga);
}
