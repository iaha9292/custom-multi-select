/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef, useCallback } from 'react'
import PropTypes from "prop-types";
import { useAutocomplete } from "@mui/base/useAutocomplete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { autocompleteClasses } from "@mui/material/Autocomplete";
import _ from 'lodash';



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


// eslint-disable-next-line react/prop-types
export default function CustomizedHook({ specValue,
  setSpecValue,
  selectedValues,
  setSelectedValues,
  cachedOptions,
  loading,
  fetchOptions,
  validationConfig, clearOptions }) {

  const [options, setOptions] = useState(cachedOptions)
  const [searchedValue, setSearchedValue] = useState("")
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const lastFetchKey = useRef({});

  const { getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    setAnchorEl,
    focused,
    getTagProps } =
    useAutocomplete({
      id: 'customized-hook-demo',
      multiple: true,
      options,
      value: selectedValues,
      onChange: (event, newValue) => {
        dispatch(setSelectedValues(newValue));
      },
      onInputChange: (event, value, reason) => {
      },
      getOptionLabel: (option) => option.name,
      open,
      onOpen: () => setOpen(true),
      onClose: () => setOpen(false),
    });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (options.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [options]);

  const memoizedFetchOptions = useCallback(
    (searchedValue, specValue, validationConfig) => {
      const cacheKey = `${specValue}:${searchedValue}`;
      if (lastFetchKey.current === cacheKey) return;

      lastFetchKey.current = cacheKey;
      fetchOptions(searchedValue, specValue, validationConfig);
    },
    [fetchOptions]
  );

  useEffect(() => {
    if (validationConfig[specValue]['minLength'] === searchedValue.length) {
      memoizedFetchOptions(searchedValue, specValue, validationConfig);
    }
  }, [searchedValue, specValue, validationConfig, memoizedFetchOptions]);

  useEffect(() => {
    if (cachedOptions.length === 0) {
      setOptions([]);
      return;
    }
    const filteredData = cachedOptions.filter(item =>
      item.name.toLowerCase().includes(searchedValue.toLowerCase())
    )
    setOptions(filteredData)
  }, [cachedOptions, searchedValue]);


  const handleSpecChange = (event) => {
    setSpecValue(event.target.value);
  };



  return (
    <Root ref={wrapperRef}>
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
            {selectedValues.map((option, index) => {
              const { key, ...tagProps } = getTagProps({ index });
              return <StyledTag key={key} {...tagProps} label={option.name}
                onDelete={() => {
                  // Remove the option from selectedValues
                  const updatedSelectedValues = selectedValues.filter(
                    (selectedOption) => selectedOption.name !== option.name
                  );
                  setSelectedValues(updatedSelectedValues);
                }} />;
            })}
            <input {...getInputProps()} value={searchedValue}
              onChange={(e) => {
                console.log("searched value ", e.target.value)
                console.log("options ", options)
                setSearchedValue(e.target.value)
              }}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === 'Backspace') {
                  if (searchedValue.length > 0) {
                    // Delete character from searchedValue
                    setSearchedValue(searchedValue.slice(0, -1));
                    e.preventDefault();
                  } else if (selectedValues.length > 0) {
                    // Remove last item from selectedValues when searchedValue is empty
                    const updatedSelectedValues = [...selectedValues];
                    updatedSelectedValues.pop();
                    setSelectedValues(updatedSelectedValues);
                    e.preventDefault();
                  }
                }
              }}
            />
          </InputWrapper>
        </div>
        {searchedValue.length > 0 &&
          validationConfig[specValue]['minLength'] > searchedValue.length &&
          <div>{`for ${specValue} need ${validationConfig[specValue]['minLength']} chars `}</div>}
        {loading && <div>Fetching data...</div>}
        {!loading && options.length === 0 && validationConfig[specValue]['minLength'] < searchedValue.length && <div>No data</div>}
        {!loading && open && options.length > 0 ? (
          <Listbox {...getListboxProps()}>
            {options.map((option, index) => {
              const { key, ...optionProps } = getOptionProps({ option, index });
              const isSelected = selectedValues.some(
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
                  onClick={() => {
                    if (isSelected) {

                      setSelectedValues(
                        selectedValues.filter(
                          (selectedOption) => selectedOption.name !== option.name
                        )
                      )
                        ;
                    } else {
                      setSelectedValues([...selectedValues, option]);
                    }
                    setSearchedValue("")
                  }
                  }
                >
                  <span>{option.name}</span>
                  {isSelected && <CheckIcon fontSize="small" style={{ color: "#1890ff" }} />}
                </li>
              );
            })}
          </Listbox>
        ) : null}
      </div>
    </Root>
  );
}

