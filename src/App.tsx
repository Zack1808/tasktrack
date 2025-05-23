import React, { useState } from "react";

import Modal from "./components/Modal";
import Button from "./components/Button";

const App: React.FC = () => {
  const [testState, setTestState] = useState<boolean>(false);

  return (
    <div className="">
      <Button
        variant="contained"
        onClick={() => setTestState((prevState) => !prevState)}
      >
        Open Modal
      </Button>
      <Button
        variant="contained"
        onClick={() => setTestState((prevState) => !prevState)}
      >
        Open Modal
      </Button>
      <Button
        variant="contained"
        onClick={() => setTestState((prevState) => !prevState)}
      >
        Open Modal
      </Button>
      <Modal
        title="Title"
        isOpen={testState}
        closeModal={() => setTestState(false)}
      >
        <Button variant="contained">click</Button>
        <Button variant="contained">click</Button>
        <Button variant="contained">click</Button>
        <Button variant="contained">click</Button>
        <Button variant="contained">click</Button>
        <Button variant="contained">click</Button>
      </Modal>
    </div>
  );
};

export default App;
