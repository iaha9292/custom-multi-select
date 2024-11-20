import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';
import { setOptions, setLoading } from './actions';

const fetchOptionsApi = async (query, specValue) => {
    const response = await axios.get('http://universities.hipolabs.com/search', {
        params: { country: specValue, search: query },
    });
    return response.data;
};

function* fetchOptionsSaga(action) {
    const { ruleId, subRuleId, query, specValue } = action.payload;

    yield put(setLoading(ruleId, subRuleId, true));

    try {
        const data = yield call(fetchOptionsApi, query, specValue);

        yield put(setOptions(ruleId, subRuleId, data));
    } catch (error) {
        console.error(`Error fetching options for ruleId ${ruleId} and subRuleId ${subRuleId}:`, error);
    } finally {
        yield put(setLoading(ruleId, subRuleId, false));
    }
}

export function* watchFetchOptions() {
    yield takeLatest('FETCH_OPTIONS_REQUEST', fetchOptionsSaga);
}
