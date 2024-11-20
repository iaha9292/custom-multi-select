export const setSpecValue = (ruleId, subRuleId, value) => ({
    type: 'SET_SPEC_VALUE',
    payload: { ruleId, subRuleId, value },
});

export const setSelectedValues = (ruleId, subRuleId, values) => ({
    type: 'SET_SELECTED_VALUES',
    payload: { ruleId, subRuleId, values },
});

export const setOptions = (ruleId, subRuleId, options) => ({
    type: 'SET_OPTIONS',
    payload: { ruleId, subRuleId, options },
});

export const setLoading = (ruleId, subRuleId, loading) => ({
    type: 'SET_LOADING',
    payload: { ruleId, subRuleId, loading },
});

export const fetchOptionsRequest = (ruleId, subRuleId, query, specValue, validationConfig) => ({
    type: 'FETCH_OPTIONS_REQUEST',
    payload: { ruleId, subRuleId, query, specValue, validationConfig },
});

export const addSubRule = (ruleId, subRule) => ({
    type: "ADD_SUB_RULE",
    payload: { ruleId, subRule },
});

export const removeSubRule = (ruleId, subRuleId) => ({
    type: "REMOVE_SUB_RULE",
    payload: { ruleId, subRuleId },
});

export const addRule = (rule) => ({
    type: "ADD_RULE",
    payload: rule,
});

export const removeRule = (ruleId) => ({
    type: "REMOVE_RULE",
    payload: ruleId,
});

