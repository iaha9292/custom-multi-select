import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';
import { setOptions, setLoading } from './actions';



// API call
const fetchOptionsApi = async (query, specValue) => {
    const response = await axios.get('http://universities.hipolabs.com/search', {
        params: { country: specValue, search: query },
    });
    return response.data;
};

// Saga worker
function* fetchOptionsSaga(action) {
    const { query, specValue } = action.payload;

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
