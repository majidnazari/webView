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
          token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYTRjMWQ0ZTE3ZjQ1ODc1MGY5MDc4YjUyMWE1NGU3N2Q4NTJkNTQ5M2MxZmMyMWRkOWQ4NTE3ZmFjNTk3MmUxNDMwMzJlYjE2MjliYjE5ZWQiLCJpYXQiOjE3NTU4NzkzNDMuMDQyOTMxLCJuYmYiOjE3NTU4NzkzNDMuMDQyOTMzLCJleHAiOjE3NTYxMzg1NDMuMDM1NDYyLCJzdWIiOiIxMCIsInNjb3BlcyI6W119.B3gWwqSaNUO9UnAsHLwmbLd2zqwLBcBsV4iX015cRu0C3kJ5U-4PgZgLTO8UsgNJArc9U_61Ss2wC05pV90-bujeuR3U1jELcak_-W8SU2Me6Gjzg3Ol9oOgDdehM1Hm441AvBLa6bxlcF7jrBpOI7k_Kb05VIeFldDDxbcfexGlkUpwZUgJfz3YBb2Anyi_NgUpk8rODdo7yp5Leep1Xchk_GffsCX2VtoMiBAj4QGOhB_Cu0JqwG7ML2NfqCNQbo_dKCAprFYPBtRwKNlri6CKkcCZ2ekjoNSLjGx6r-kHJPVEA7HGzGMEcT7aZ9drenneggbtytjiLzHLAq9GqUZ2c9PhPKiuDeax6UdBKM2A0S4PvjRZP0jriyQgqSCQWCNLx3nI_SmzgoxL1WwlxdvMr4Vwn2vFLiXk1vxerQFhc6v1tzxx4g-fdcg3aLg-WnTJZ8TnTYiSUyPS5C4PCNCj20nW1SMbQPbmjiUk0esIHRV1UEiV9s-PmFKNTLTPdIGKa78dGkIJsKIPKo0Af2R2u2K17DyZpYqGVfVfxnGVgfKRWuYQCAZgXk4hORhuMijFWC9FoG3zghQgNwrfs3SeHF7IGIWcZW8vOhVZ6GynGGnqvJ4Ewd6bif3L4NaLejOJiCYOFlMdfWjWMJTjRVrCJfYMFwlK8PLS9mD3cwE",
          mode: "single",
          personIdLeft: "614",
          personIdRight: "1",
          freezeLeftTree: true,
          freezeRightTree: true,
          maxLevelLeft: 4,
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
