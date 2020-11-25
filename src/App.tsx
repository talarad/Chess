import React from "react";
import "./App.css";
import { Board } from "./Board";
import Login from "./Login";

export default function App() {
  const [currentTurn, updateTurn] = React.useState("white");

  const callBackendAPI = async () => {
    const response = await fetch("/express_backend");
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }

    console.log(body);

    return body;
  };

  // callBackendAPI();

  return (
    <div>
      <Login />
      <Board
        currentTurn={currentTurn}
        updateTurn={(turn: string) => updateTurn(turn)}
      />
    </div>
  );
}
