import { all } from 'redux-saga/effects';
import { watchFetchOptions } from './saga';

export default function* rootSaga() {
    yield all([
        watchFetchOptions(),
    ]);
}
