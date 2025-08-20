import React from "react";
import { TimelineContainer } from "./features/timeline";
import { TimelineProvider } from "./features/timeline/context/TimelineContext";
import "./styles/globals.css";
import "./styles/variables.css";

function App() {
  return (
    <div className="app">
      <TimelineProvider>
        <TimelineContainer />
      </TimelineProvider>
    </div>
  );
}

export default App;
