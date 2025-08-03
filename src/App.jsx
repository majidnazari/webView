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
          token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMjllZGMwYWUzOTJhYWE3Mzg0YTFmZDJmZGVhOWMyOGNhNGQ1M2JkM2QyMGQ2ZGU0NThlNTEzNmIxMGJjYmQxZDFiYmU3MGM5ZjFiMjllZGIiLCJpYXQiOjE3NTQyMDYyOTIuNDQwNTQyLCJuYmYiOjE3NTQyMDYyOTIuNDQwNTQzLCJleHAiOjE3NTQ0NjU0OTIuNDMxOTI2LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.JCUQJBoidHpi9YPyThNB6RlIpIfvvF8Z_QXCj7eFAGt45MaWeCeoVunqaszGDd5IUva4PKaw0pYSZI92R4cHl3eId9yQyYAMtrX6s5qLzjPnYPhEhRScajBCUdE82iDE28hYg_4NuGcKLxPMVoXcYHAwETKqDyjdVNePXxLk4SPwj14ydPcSBvYH2mSk5sNaOAvPtZ1oI39lfw6gzvaBq0fVgcxN3ptJiXA7fcpaHg7W1DJ0pa1Fz7i6AMyuzmsVnWU4CxFtjhbMACVTSFedP4w-OTSjWoknTfBo-T3Pv3gfyc_2hcvROXZgKciHRJ0qwjPoC8cXMEvm_pUlfe1zuGpUfLV3OE_v5o_EWy_RSLYYu63U6Iq08Yq-EZBnyYW_UduiOFk7c2Y_A5dmLPMGEwAelkoAhfxtEw0shz0BK9yUd8T4JfHOUuXShUsi41HwyuBBz0mfgcLmHteqr1CYPu-u7TrlQgk4aVWEXylnzG5BTRHP6jjCfjzOWnbnGjUEHXBD22Q6n3osP8fkugYRjgnJwKnYajlJi5s9YEx4owBfuJ7-uBvmchX7Lx_pNeQMt4CKkfAd5NCZISEis9bdT8VJRD3h3e7TRo6jM-Snnk7NRIjxgFZEwyyAK2_nf8SRrJv0bIorie9s4EEiPXrAN2vmiSjETpPXpsNleyhsugk",
          mode: "single",
          personIdLeft: "298",
          personIdRight: "1",
          freezeLeftTree: true,
          freezeRightTree: true,
          maxLevelLeft: 2,
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
