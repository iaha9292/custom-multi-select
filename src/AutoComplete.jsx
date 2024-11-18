/* eslint-disable no-unused-vars */
import { useState, useCallback, useEffect } from 'react'
import PropTypes from "prop-types";
import { useAutocomplete } from "@mui/base/useAutocomplete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { autocompleteClasses } from "@mui/material/Autocomplete";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import _ from 'lodash';
import axios from "axios";

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



const Root = styled("div")(
  ({ theme }) => `
  color: ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,.85)"
    };
  font-size: 14px;
  display: flex;
  gap: 20px;
`
);


const InputWrapper = styled("div")(
  ({ theme }) => `
  max-height: 100px;
  overflow-y: auto;
  width: 300px;
  border: 1px solid ${theme.palette.mode === "dark" ? "#434343" : "#d9d9d9"};
  background-color: ${theme.palette.mode === "dark" ? "#141414" : "#fff"};
  border-radius: 4px;
  padding: 1px;
  display: flex;
  flex-wrap: wrap;

  &:hover {
    border-color: ${theme.palette.mode === "dark" ? "#177ddc" : "#40a9ff"};
  }

  &.focused {
    border-color: ${theme.palette.mode === "dark" ? "#177ddc" : "#40a9ff"};
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  & input {
    background-color: ${theme.palette.mode === "dark" ? "#141414" : "#fff"};
    color: ${theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.65)"
      : "rgba(0,0,0,.85)"
    };
    height: 30px;
    box-sizing: border-box;
    padding: 4px 6px;
    width: 0;
    min-width: 30px;
    flex-grow: 1;
    border: 0;
    margin: 0;
    outline: 0;
  }
`
);

function Tag(props) {
  const { label, onDelete, ...other } = props;
  return (
    <div {...other}>
      <span>{label}</span>
      <CloseIcon onClick={onDelete} />
    </div>
  );
}

Tag.propTypes = {
  label: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

const StyledTag = styled(Tag)(
  ({ theme }) => `
  display: flex;
  align-items: center;
  height: 24px;
  margin: 2px;
  line-height: 22px;
  background-color: ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "#fafafa"
    };
  border: 1px solid ${theme.palette.mode === "dark" ? "#303030" : "#e8e8e8"};
  border-radius: 2px;
  box-sizing: content-box;
  padding: 0 4px 0 10px;
  outline: 0;
  overflow: hidden;

  &:focus {
    border-color: ${theme.palette.mode === "dark" ? "#177ddc" : "#40a9ff"};
    background-color: ${theme.palette.mode === "dark" ? "#003b57" : "#e6f7ff"};
  }

  & span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & svg {
    font-size: 12px;
    cursor: pointer;
    padding: 4px;
  }
`
);

const Listbox = styled("ul")(
  ({ theme }) => `
  width: 300px;
  margin: 2px 0 0;
  padding: 0;
  position: absolute;
  list-style: none;
  background-color: ${theme.palette.mode === "dark" ? "#141414" : "#fff"};
  overflow: auto;
  max-height: 250px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1;

  & li {
    padding: 5px 12px;
    display: flex;

    & span {
      flex-grow: 1;
    }

    & svg {
      color: transparent;
    }
  }

  & li[aria-selected='true'] {
    background-color: ${theme.palette.mode === "dark" ? "#2b2b2b" : "#fafafa"};
    font-weight: 600;

    & svg {
      color: #1890ff;
    }
  }

  & li.${autocompleteClasses.focused} {
    background-color: ${theme.palette.mode === "dark" ? "#003b57" : "#e6f7ff"};
    cursor: pointer;

    & svg {
      color: currentColor;
    }
  }
`
);

const baseURL = "http://universities.hipolabs.com/search";
// eslint-disable-next-line react/prop-types
export default function CustomizedHook({ validationConfig }) {
  const [specValue, setSpecValue] = useState(Object.keys(validationConfig)[0]);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renderCount, setRenderCount] = useState(0);
  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    id: "customized-hook-demo",
    defaultValue: [],
    multiple: true,
    disableCloseOnSelect: true,
    options,
    getOptionLabel: (option) => option.name,
    onInputChange: (event, value) => {
      fetchOptions(value);
    },
  });

  console.log("[194] rerendered ")
  useEffect(() => {
    setRenderCount((prevCount) => prevCount + 1);
    console.log(`CustomizedHook re-rendered: ${renderCount} times`);
  }, []);



  const fetchOptions = useCallback(
    _.debounce(async (query) => {
      if (!specValue) {
        setOptions([]);
        return;
      }

      // Validate query using configuration
      const isValidQuery = validateQuery(specValue, query, validationConfig);
      if (!isValidQuery) {
        console.log("since not valid fetching")
        // setOptions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(baseURL, {
          params: { country: specValue, search: query },
        });
        setOptions(response.data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }, 1000),
    [specValue, validationConfig]
  );

  const handleSpecChange = (event) => {
    setSpecValue(event.target.value);
  };
  console.log({ groupedOptions })
  console.log({ value })


  return (
    <Root>
      <div>
        <InputWrapper>
          <select
            value={specValue}
            onChange={handleSpecChange}
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              padding: "8px",
              backgroundColor: "#f5f5f5",
              fontSize: "14px",
              borderRadius: "4px",
            }}
          >
            {Object.keys(validationConfig).map((country) => (
              <option key={country} value={country}>
                {country.charAt(0).toUpperCase() + country.slice(1)}
              </option>
            ))}
          </select>
        </InputWrapper>
      </div>
      <div>
        <div {...getRootProps()}>
          <InputWrapper ref={setAnchorEl} className={focused ? "focused" : ""}>
            {value.map((option, index) => {
              const { key, ...tagProps } = getTagProps({ index });
              return <StyledTag key={key} {...tagProps} label={option.name} />;
            })}
            <input {...getInputProps()} />
          </InputWrapper>
        </div>
        {loading && <div>Loading...</div>}
        {groupedOptions.length > 0 ? (
          <Listbox {...getListboxProps()}>
            {groupedOptions.map((option, index) => {
              const { key, ...optionProps } = getOptionProps({ option, index });
              const isSelected = value.some(
                (selectedOption) => selectedOption.name === option.name
              );
              return (
                <li
                  key={option.name}
                  {...optionProps}
                  style={{
                    backgroundColor: isSelected ? "#e6f7ff" : "transparent",
                    fontWeight: isSelected ? "bold" : "normal",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    if (isSelected) {
                      const newValue = value.filter(
                        (selectedOption) => selectedOption.name !== option.name
                      );
                      optionProps.onClick(e, false);
                      optionProps.setValue(newValue);
                    } else {
                      optionProps.onClick(e, true);
                    }
                  }}
                >
                  <span>{option.name}</span>
                  {/* <CheckIcon fontSize="small" /> */}
                </li>
              );
            })}
          </Listbox>
        ) : null}
      </div>
    </Root>
  );
}

