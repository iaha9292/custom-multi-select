import CustomizedHook from "./AutoComplete";
import { useSelector, useDispatch } from 'react-redux';
import { fetchOptionsRequest, setSelectedValues, setSpecValue } from "./redux/actions";


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
};

function App() {
  const dispatch = useDispatch();

  // Access the relevant Redux state
  const { specValue, loading, selectedValues, options } = useSelector((state) => state);

  const fetchOptions = (value, specValue, validationConfig) => {
    dispatch(fetchOptionsRequest(value, specValue, validationConfig));
  };

  return (
    <div>
      <CustomizedHook
        specValue={specValue}
        setSpecValue={(value) => dispatch(setSpecValue(value))}
        selectedValues={selectedValues}
        setSelectedValues={(values) => dispatch(setSelectedValues(values))}
        cachedOptions={options}
        loading={loading}
        fetchOptions={fetchOptions}
        validationConfig={validationConfig}
      />

    </div>
  );
}

export default App;

