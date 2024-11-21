const initialState = {
  rules: [
    {
      id: 1,
      sub_rules: [
        {
          id: '1_1',
          specValue: 'india',
          options: [],
          selectedValues: [{
            'state-province': 'Haryana',
            domains: [
              'ashoka.edu.in'
            ],
            web_pages: [
              'https://www.ashoka.edu.in'
            ],
            country: 'India',
            alpha_two_code: 'IN',
            name: 'Ashoka University'
          }],
          loading: false,
        },
        {
          id: '1_2',
          specValue: 'singapore',
          options: [],
          selectedValues: [],
          loading: false,
        },
      ],
    },
    {
      id: 2,
      sub_rules: [
        {
          id: '2_1',
          specValue: 'india',
          options: [],
          selectedValues: [],
          loading: false,
        },
        {
          id: '2_2',
          specValue: 'india',
          options: [],
          selectedValues: [],
          loading: false,
        },
      ],
    },
  ],
};

export default function autocompleteReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_SPEC_VALUE':
      return {
        ...state,
        rules: state.rules.map((rule) =>
          rule.id === action.payload.ruleId
            ? {
              ...rule,
              sub_rules: rule.sub_rules.map((sub_rule) =>
                sub_rule.id === action.payload.subRuleId
                  ? {
                    ...sub_rule, specValue: action.payload.value,
                    selectedValues: [],
                    options: []
                  }
                  : sub_rule
              ),
            }
            : rule
        ),
      };

    case 'SET_SELECTED_VALUES':
      return {
        ...state,
        rules: state.rules.map((rule) =>
          rule.id === action.payload.ruleId
            ? {
              ...rule,
              sub_rules: rule.sub_rules.map((sub_rule) =>
                sub_rule.id === action.payload.subRuleId
                  ? { ...sub_rule, selectedValues: action.payload.values }
                  : sub_rule
              ),
            }
            : rule
        ),
      };

    case 'SET_OPTIONS':
      return {
        ...state,
        rules: state.rules.map((rule) =>
          rule.id === action.payload.ruleId
            ? {
              ...rule,
              sub_rules: rule.sub_rules.map((sub_rule) =>
                sub_rule.id === action.payload.subRuleId
                  ? { ...sub_rule, options: action.payload.options }
                  : sub_rule
              ),
            }
            : rule
        ),
      };

    case "CLEAR_OPTIONS":
      return {
        ...state,
        rules: state.rules.map((rule) =>
          rule.id === action.payload.ruleId
            ? {
              ...rule,
              sub_rules: rule.sub_rules.map((sub_rule) =>
                sub_rule.id === action.payload.subRuleId
                  ? { ...sub_rule, options: [] }
                  : sub_rule
              ),
            }
            : rule
        ),
      };

    case 'SET_LOADING':
      return {
        ...state,
        rules: state.rules.map((rule) =>
          rule.id === action.payload.ruleId
            ? {
              ...rule,
              sub_rules: rule.sub_rules.map((sub_rule) =>
                sub_rule.id === action.payload.subRuleId
                  ? { ...sub_rule, loading: action.payload.loading }
                  : sub_rule
              ),
            }
            : rule
        ),
      };

    case "ADD_SUB_RULE":
      return {
        ...state,
        rules: state.rules.map((rule) =>
          rule.id === action.payload.ruleId
            ? { ...rule, sub_rules: [...rule.sub_rules, action.payload.subRule] }
            : rule
        ),
      };
    case "REMOVE_SUB_RULE":
      return {
        ...state,
        rules: state.rules.map((rule) =>
          rule.id === action.payload.ruleId
            ? {
              ...rule,
              sub_rules: rule.sub_rules.filter(
                (sub_rule) => sub_rule.id !== action.payload.subRuleId
              ),
            }
            : rule
        ),
      };

    case "ADD_RULE":
      return {
        ...state,
        rules: [...state.rules, action.payload],
      };
    case "REMOVE_RULE":
      return {
        ...state,
        rules: state.rules.filter((rule) => rule.id !== action.payload),
      };

    default:
      return state;
  }
}
