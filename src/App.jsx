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
          token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNzYyYmY1NDljYzQxMmNjYTNjYWU5MGVjMGQwZDQ5OTYwZTI2OGI1MzJmZWExMzJiNzE3OTFmYWVjYjIwZTFhZDQzNmVlZDVkOGU0YWMyOWQiLCJpYXQiOjE3NTM2OTM5MTcuMTA2NjQ5LCJuYmYiOjE3NTM2OTM5MTcuMTA2NjQ5LCJleHAiOjE3NTM5NTMxMTcuMDkxNzIsInN1YiI6IjEiLCJzY29wZXMiOltdfQ.DIjvtiQto2jSct_4zlBUwHqPA1Wpsgwr3Q7Vfv29UbifKZsWQ9IO8qmrGwSn-CCU1VnHMG6cCTw6tjlUaZlVOqCgx6ouoqxjLqujpZzJlLNsm-TRfCcAjkL3d2fYvSaOMgIZrBpyRk6wkUfj4ArQcCpKcIEUsdwOP7HGFrCxR0pLbYqHOFdtDx33KWpSgak6mQmXU9x11bkwSYzD8X210qUb1YJQBdx-BLx2tw0UCbP3-K1Hnu4soG7mPuw041Gz3ch10rrDdrzl5xXBrGcfOnoKSgqIRQbEG8pSW5SVL-untxpCJVlQgAT1zqE19ArsRJe5iIeT0XcCqgF98kQzmCE8WBCEnrkpjaPZ0HGn6VUJfLL9rv7Cc-psZHINX8yyY9H10IXwfKgs5eYYN2TJtmUypN42PGKFI4Y2PRYzizG8QwXVllbPK_41yLfIdcWviwfhZRDPrBCAaEeHDDKwsSYLz1qGQTHNeYfwd-XFkGpuPuXGFbvmLqx8eFfeiWzFY4HwBqO_5CbT0aDwpRYPAQLG04S3nBIE8kGaOpki88vVB8ChQzo00Tf72V3MrJrSYIstQOhWNN711jr_KTlMxYSc7Urh-tyOicijgo7nFZczdXexjK0nSJrQ4rM2Y98Ny8FfX3aVaj-2k0EFi7AazFVe8dNEfJR3FsRUTTuwO78",
          mode: "single",
          personIdLeft: "4",
          personIdRight: "1",
          freezeLeftTree: true,
          freezeRightTree: true,
          maxLevelLeft: 99,
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
