import React, { useEffect, useState } from "react";
import FamilyTree from "./components/familyTree/FamilyTree";
import { setAuthToken } from "./utils/authToken";

const containerStyle = { padding: 0 };
const modeSelectorStyle = { marginBottom: 5 };
const mergeContainerStyle = {
  display: "flex",
  flexDirection: "row",
  gap: 30,
  flexWrap: "nowrap",
};
const halfWidthStyle = { width: "50%" };
const formStyle = { marginBottom: 5 };
const buttonMarginLeft = { marginLeft: 5 };

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
  const [freezeLeftTree, setFreezeLeftTree] = useState(false);
  const [freezeRightTree, setFreezeRightTree] = useState(false);
  const [maxLevelLeft, setMaxLevelLeft] = useState(3);
  const [maxLevelRight, setMaxLevelRight] = useState(3);
  const [makeWhiteWhenSelect, setMakeWhiteWhenSelect] = useState(false);


  // 📨 Flutter config receiver
  useEffect(() => {
    window.receiveMessageFromFlutter = (message) => {
      //console.log(" Received from Flutter:", message);
      try {
        const config = JSON.parse(message);

        if (config.token) {
          setAuthToken(config.token);
        }

        if (config.mode === "merge") {
          setMode("merge");
          setPersonId(config.personIdLeft || "");
          setSubmittedId(config.personIdLeft || "");
          setPersonId2(config.personIdRight || "");
          setSubmittedId2(config.personIdRight || "");
          setFreezeLeftTree(!!config.freezeLeftTree);
          setFreezeRightTree(!!config.freezeRightTree);
          setMaxLevelLeft(config.maxLevelLeft ?? 3);
          setMaxLevelRight(config.maxLevelRight ?? 3);
        } else {
          setMode("single");
          setMakeWhiteWhenSelect(config.makeWhiteWhenSelect)

          setPersonId(config.personIdLeft || "");
          setSubmittedId(config.personIdLeft || "");
          setFreezeSingle(!!config.freezeLeftTree);
          setMaxLevelLeft(config.maxLevelLeft ?? 3);
        }

        // Optional: reply back to Flutter
        window.flutter_inappwebview?.callHandler("FlutterBridge", "React received config");
      } catch (err) {
        console.error("Invalid JSON from Flutter:", err);
      }
    };

    return () => delete window.receiveMessageFromFlutter;
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
      <button onClick={() => {
        const testMergeConfig = JSON.stringify({
          token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNzE2YzEyOWVmNWEzMjM3OWEwZmVkMDgxNDA5MjZiOGYyZTk0YzY5NGU4ZWVkYTVmMGJjYjc4ZmFhNDhjNzY0Y2FiYzJhNGU4YmI1Y2MxYzQiLCJpYXQiOjE3NTQ4MTczMjguODkwMjUyLCJuYmYiOjE3NTQ4MTczMjguODkwMjU0LCJleHAiOjE3NTUwNzY1MjguODgwODY0LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.arOFbg9NszB_QIlXH_ggoUrEhZmHpAsmMpJu4Gl8_rvZF43RxTpgHR_9AC-5A9FeqFU2oQ1JJm_tiDP5pOxlnYK7jTzpjcpfFzzjMBqlABGTWP6f999UCFrY45AlAYu6INYNSVkieJ0yDDtzoBUOY-PkWXKon609cDoC38gymTaRwv48Av6LsXGnX3kpfByIv4YF_KQEApurZ1hM-Hmlcd-1orqfKBz-OHXO4IFb0VvoRsXn6p1IxYkszoJscod1uCvd2KuwGe3FYCQBUiQgSpRGg3M5S9B6hij29ElJukf_9Q2QCVL_OrOkckhFvgoaAVZoJuDO7WQ9nTJdQ4hhy1uROSuz9Kjp4rwwLTND-BO1gEXCgE8nrmsRdg4TpTCNOH4UJ5sfqK5TeRbTeXSJZmoT3pBZIYNBf47N3MLMOykRnJ9SJVn1DQcqH_oF0WU0iRF76nGCzoeXEPCA8peXC_Uu34ui2FHXXXSg4_WlEklG54VmlMCaxKf52d-LRhNIfaA1tSj1IaJKIAhqSWtAdPG4cRON8OeSmuRhzDsJpmgoWr_xsWuCy--9eVYe31UZMehPX7hcX5pUm7nWU5afN4iMjGr77rHsJ5DjsKSFn-UFyW-8Ut1pgOO4rQttVuhU1Lm4-bUsEoPWYIbkyobdhRuOwe9q1PjoTXmhaSCWSKs",
          mode: "single",
          personIdLeft: "520",
          personIdRight: "1",
          freezeLeftTree: true,
          freezeRightTree: true,
          maxLevelLeft: 130,
          maxLevelRight: 2,
          makeWhiteWhenSelect: true
        });

        window.receiveMessageFromFlutter?.(testMergeConfig);
      }}>
        🔄 Trigger Merge Mode Test
      </button>

      {/* <h2>Family Tree Viewer</h2> */}

      {/* Mode selector */}
      {/* <div style={modeSelectorStyle}>
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
      </div> */}

      {mode === "single" && (
        <>
          {/* <PersonForm
            personId={personId}
            setPersonId={setPersonId}
            onSubmit={handleSubmitSingle}
            placeholder="Enter Person ID"
            buttonText="Show Tree"
          /> */}
          {submittedId && (
            <FamilyTree
              chartId="family-tree-1"
              personId={submittedId}
              freeze={freezeSingle}
              maxLevel={maxLevelLeft}
              mode="single"
              makeWhiteWhenSelect={makeWhiteWhenSelect}

            />
          )}
        </>
      )}

      {mode === "merge" && (
        <div style={mergeContainerStyle}>
          <div style={halfWidthStyle}>
            {/* <PersonForm
              personId={personId}
              setPersonId={setPersonId}
              onSubmit={handleSubmitLeft}
              placeholder="Enter Person ID (Left)"
              buttonText="Show Left Tree"
            /> */}
            {submittedId && (
              <FamilyTree
                chartId="family-tree-left"
                personId={submittedId}
                freeze={freezeLeftTree}
                maxLevel={maxLevelLeft}
                mode="merge"
                makeWhiteWhenSelect={makeWhiteWhenSelect}

              />
            )}
          </div>

          <div style={halfWidthStyle}>
            {/* <PersonForm
              personId={personId2}
              setPersonId={setPersonId2}
              onSubmit={handleSubmitRight}
              placeholder="Enter Person ID (Right)"
              buttonText="Show Right Tree"
            /> */}
            {submittedId2 && (
              <FamilyTree
                chartId="family-tree-right"
                personId={submittedId2}
                freeze={freezeRightTree}
                maxLevel={maxLevelRight}
                mode="merge"
                makeWhiteWhenSelect={makeWhiteWhenSelect}

              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
