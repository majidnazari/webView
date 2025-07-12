import React, { useState, useEffect } from "react";
import FamilyTree from "./components/familyTree/FamilyTree";
import { setAuthToken, getAuthToken } from "./utils/authToken";

const containerStyle = { padding: 20 };
const modeSelectorStyle = { marginBottom: 10 };
const mergeContainerStyle = {
  display: "flex",
  flexDirection: "row",
  gap: 30,
  flexWrap: "nowrap",
};
const halfWidthStyle = { width: "50%" };
const formStyle = { marginBottom: 10 };
const buttonMarginLeft = { marginLeft: 10 };
const messageStyle = {
  background: "#e0f7fa",
  padding: 10,
  marginBottom: 20,
  borderRadius: 4,
  fontWeight: "bold",
};

const PersonForm = ({ personId, setPersonId, onSubmit, placeholder, buttonText }) => (
  <form onSubmit={onSubmit} style={formStyle}>
    <input
      type="text"
      placeholder={placeholder}
      value={personId}
      onChange={(e) => setPersonId(e.target.value)}
    />
    <button type="submit" style={buttonMarginLeft}>
      {buttonText}
    </button>
  </form>
);

const App = () => {
  const [mode, setMode] = useState("single");

  const [personId, setPersonId] = useState("");
  const [submittedId, setSubmittedId] = useState(null);

  const [personId2, setPersonId2] = useState("");
  const [submittedId2, setSubmittedId2] = useState(null);

  const [freezeSingle, setFreezeSingle] = useState(false);
  const [messageFromFlutter, setMessageFromFlutter] = useState("");
  const [configFromFlutter, setConfigFromFlutter] = useState(null);

  // Show current token
  const [tokenDisplay, setTokenDisplay] = useState("");

  useEffect(() => {
    window.receiveMessageFromFlutter = (message) => {
      console.log("📨 Received from Flutter:", message);

      try {
        const parsed = JSON.parse(message);

        // Set token globally
        if (parsed.token) {
          setAuthToken(parsed.token);
          setTokenDisplay(parsed.token);
        }

        // Save the whole config object
        setConfigFromFlutter(parsed);

        // Respond back to Flutter
        if (window.flutter_inappwebview?.callHandler) {
          window.flutter_inappwebview.callHandler(
            "FlutterBridge",
            `${message} and add react to returning back`
          );
        }

      } catch (err) {
        console.error("Invalid JSON from Flutter:", err);
        setMessageFromFlutter(message);
      }
    };

    return () => {
      delete window.receiveMessageFromFlutter;
    };
  }, []);

  const handleSubmitSingle = (e) => {
    e.preventDefault();
    if (personId.trim()) setSubmittedId(personId.trim());
  };

  const handleSubmitLeft = (e) => {
    e.preventDefault();
    if (personId.trim()) setSubmittedId(personId.trim());
  };

  const handleSubmitRight = (e) => {
    e.preventDefault();
    if (personId2.trim()) setSubmittedId2(personId2.trim());
  };

  return (
    <div style={containerStyle}>
      {/* Flutter Message */}
      {messageFromFlutter && (
        <div style={messageStyle}>
          Raw Message from Flutter: {messageFromFlutter}
        </div>
      )}

      {/* Token Display */}
      <div style={messageStyle}>
        Current Auth Token: {getAuthToken() || "No token set"}
      </div>

      <h2>Family Tree Viewer</h2>

      {/* Mode selector */}
      <div style={modeSelectorStyle}>
        <label>
          <input
            type="radio"
            name="mode"
            value="single"
            checked={mode === "single"}
            onChange={() => setMode("single")}
          />{" "}
          Single Tree
        </label>{" "}
        <label>
          <input
            type="radio"
            name="mode"
            value="merge"
            checked={mode === "merge"}
            onChange={() => setMode("merge")}
          />{" "}
          Merge Trees
        </label>
      </div>

      {mode === "single" && (
        <>
          <PersonForm
            personId={personId}
            setPersonId={setPersonId}
            onSubmit={handleSubmitSingle}
            placeholder="Enter Person ID"
            buttonText="Show Tree"
          />
          {(submittedId || configFromFlutter?.personIdLeft) && (
            <FamilyTree
              chartId="family-tree-1"
              personId={configFromFlutter?.personIdLeft || submittedId}
              freeze={configFromFlutter?.freezeLeftTree ?? freezeSingle}
              maxLevel={configFromFlutter?.maxLevelLeft}
              messageFromFlutter={messageFromFlutter}
              mode={configFromFlutter?.mode}
            />
          )}
        </>
      )}

      {mode === "merge" && (
        <div style={mergeContainerStyle}>
          {/* Left Tree */}
          <div style={halfWidthStyle}>
            <PersonForm
              personId={personId}
              setPersonId={setPersonId}
              onSubmit={handleSubmitLeft}
              placeholder="Enter Person ID (Left)"
              buttonText="Show Left Tree"
            />
            {(submittedId || configFromFlutter?.personIdLeft) && (
              <FamilyTree
                chartId="family-tree-left"
                treeType="left"
                personId={configFromFlutter?.personIdLeft || submittedId}
                freeze={configFromFlutter?.freezeLeftTree ?? true}
                maxLevel={configFromFlutter?.maxLevelLeft}
                mode={configFromFlutter?.mode}
                messageFromFlutter={messageFromFlutter}
              />
            )}
          </div>

          {/* Right Tree */}
          <div style={halfWidthStyle}>
            <PersonForm
              personId={personId2}
              setPersonId={setPersonId2}
              onSubmit={handleSubmitRight}
              placeholder="Enter Person ID (Right)"
              buttonText="Show Right Tree"
            />
            {(submittedId2 || configFromFlutter?.personIdRight) && (
              <FamilyTree
                chartId="family-tree-right"
                treeType="right"
                personId={configFromFlutter?.personIdRight || submittedId2}
                freeze={configFromFlutter?.freezeRightTree ?? true}
                maxLevel={configFromFlutter?.maxLevelRight}
                mode={configFromFlutter?.mode}
                messageFromFlutter={messageFromFlutter}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
