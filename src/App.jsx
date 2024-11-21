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
  removeRule,
  clearOptions as clearOptionsAction,
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
  }
};

function App() {
  const dispatch = useDispatch();
  // redux state for  rule sub rule spec options screen
  const rules = useSelector((state) => state.rules);

  const fetchOptions = (ruleId, subRuleId, value, specValue) => {
    // Fetch options for a sub-rule implementation here
    dispatch(fetchOptionsRequest(ruleId, subRuleId, value, specValue, validationConfig));
  };

  const handleAddRule = () => {
    // Add a new rule implementation here
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
    // Remove an existing rule implementation here
    dispatch(removeRule(ruleId));
  };

  const handleAddSubRule = (ruleId) => {
    // Add a new sub-rule to a specific rule implementation here
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
    // Remove a sub-rule from a specific rule implementation here
    dispatch(removeSubRule(ruleId, subRuleId));
  };

  const setSpecValueForSubRule = (ruleId, subRuleId, value) => {
    // Set the specValue for a sub-rule implementation here
    dispatch(setSpecValue(ruleId, subRuleId, value));
  };

  const setSelectedValuesForSubRule = (ruleId, subRuleId, values) => {
    // Set selected values for a sub-rule implementation here
    dispatch(setSelectedValues(ruleId, subRuleId, values));
  };

  const clearOptions = (ruleId, subRuleId) => {
    // Clear options for a sub-rule implementation here
    dispatch(clearOptionsAction(ruleId, subRuleId));
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
                setSpecValue={(value) => setSpecValueForSubRule(rule.id, sub_rule.id, value)}
                selectedValues={sub_rule.selectedValues}
                setSelectedValues={(values) => setSelectedValuesForSubRule(rule.id, sub_rule.id, values)}
                cachedOptions={sub_rule.options}
                loading={sub_rule.loading}
                fetchOptions={(value) => fetchOptions(rule.id, sub_rule.id, value, sub_rule.specValue)}
                validationConfig={validationConfig}
                clearOptions={() => clearOptions(rule.id, sub_rule.id)}
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
