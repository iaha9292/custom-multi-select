import CustomizedHook from "./AutoComplete";

const validationConfig = {
  singapore: {
    type: "regex",
    pattern: /^[a-zA-Z\s]*$/,
  },
  india: {
    type: "length",
    minLength: 4,
  },
  italy: {
    type: "combined",
    regex: /^[a-zA-Z]{3,}$/,
    minLength: 3,
  },
};

function App() {
  return (
    <>
      <CustomizedHook validationConfig={validationConfig} />

    </>
  )
}

export default App;
