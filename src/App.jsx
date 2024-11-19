import CustomizedHook from "./AutoComplete";

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
  return (
    <>
      <CustomizedHook validationConfig={validationConfig} />

    </>
  )
}

export default App;
