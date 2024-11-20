import React from "react";
import { useSelector, useDispatch } from "react-redux";
import CustomizedHook from "./AutoComplete";
import {
  fetchOptionsRequest,
  setSelectedValues,
  setSpecValue,
  addSubRule,
  removeSubRule,
  addRule,
  removeRule
} from "./redux/actions";

const validationConfig = {
  singapore: {
    type: "length",
    minLength: 6,
  },
  india: {
    type: "length",
    minLength: 4,
  },
  italy: {
    type: "length",
    minLength: 2,
  },
  Srilanka: {
    type: "length",
    minLength: 3,
  },
  US: {
    type: "length",
    minLength: 2,
  },
};

function App() {
  const dispatch = useDispatch();

  const rules = useSelector((state) => state.rules);

  const fetchOptions = (ruleId, subRuleId, value, specValue) => {
    dispatch(fetchOptionsRequest(ruleId, subRuleId, value, specValue, validationConfig));
  };

  const handleAddRule = () => {
    const newRule = {
      id: Date.now(),
      sub_rules: [
        {
          id: `${Date.now()}_1`,
          specValue: "india",
          options: [],
          selectedValues: [],
          loading: false,
        },
      ],
    };
    dispatch(addRule(newRule));
  };

  const handleRemoveRule = (ruleId) => {
    dispatch(removeRule(ruleId));
  };


  const handleAddSubRule = (ruleId) => {
    const newSubRule = {
      id: `${ruleId}_${Date.now()}`,
      specValue: "india",
      options: [],
      selectedValues: [],
      loading: false,
    };
    dispatch(addSubRule(ruleId, newSubRule));
  };

  const handleRemoveSubRule = (ruleId, subRuleId) => {
    dispatch(removeSubRule(ruleId, subRuleId));
  };

  return (
    <div>
      <button
        onClick={handleAddRule}
        style={{
          marginBottom: "20px",
          backgroundColor: "#344242",
          color: "white",
          border: "none",
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Add Rule
      </button>

      {rules.map((rule) => (
        <div key={rule.id} style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
          <h3>
            Rule ID: {rule.id}
            <button
              onClick={() => handleRemoveRule(rule.id)}
              style={{
                marginLeft: "10px",
                backgroundColor: "#112277",
                color: "white",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              Remove Rule
            </button>
          </h3>
          {rule.sub_rules.map((sub_rule) => (
            <div key={sub_rule.id} style={{ marginBottom: "10px" }}>
              <h4>Sub-Rule ID: {sub_rule.id}</h4>
              <CustomizedHook
                specValue={sub_rule.specValue}
                setSpecValue={(value) =>
                  dispatch(setSpecValue(rule.id, sub_rule.id, value))
                }
                selectedValues={sub_rule.selectedValues}
                setSelectedValues={(values) =>
                  dispatch(setSelectedValues(rule.id, sub_rule.id, values))
                }
                cachedOptions={sub_rule.options}
                loading={sub_rule.loading}
                fetchOptions={(value) =>
                  fetchOptions(rule.id, sub_rule.id, value, sub_rule.specValue)
                }
                validationConfig={validationConfig}
              />
              <button
                onClick={() => handleRemoveSubRule(rule.id, sub_rule.id)}
                style={{
                  marginTop: "10px",
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  cursor: "pointer",
                }}
              >
                Remove Sub-Rule
              </button>
            </div>
          ))}
          <button
            onClick={() => handleAddSubRule(rule.id)}
            style={{
              marginTop: "10px",
              backgroundColor: "green",
              color: "white",
              border: "none",
              padding: "5px 10px",
              cursor: "pointer",
            }}
          >
            Add Sub-Rule
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
