import React, { useState } from "react";

import Select, { SelectOptions } from "./components/Select";

const options = [
  { label: "Hello", value: "hello" },
  { label: "Hello2", value: "hello2" },
  { label: "Hello2", value: "hello2" },
  { label: "Hello2", value: "hello2" },
  { label: "Hello2", value: "hello2" },
  { label: "Hello2", value: "hello2" },
  { label: "Hello2", value: "hello2" },
  { label: "Hello2", value: "hello2" },
  { label: "Hello2", value: "hello2" },
  { label: "Hello2", value: "hello2" },
  { label: "Hello2", value: "hello2" },
];

const App: React.FC = () => {
  const [testState, setTestState] = useState<SelectOptions | undefined>(
    options[0]
  );

  return (
    <div className="w-full h-[100svh] flex ">
      <Select
        options={options}
        onChange={(value) => setTestState(value)}
        value={testState}
        label="Hello"
        id="Hello"
      />
    </div>
  );
};

export default App;
