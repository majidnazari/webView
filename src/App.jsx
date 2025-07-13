import React, { useEffect, useState } from "react";
import FamilyTree from "./components/familyTree/FamilyTree";
import { setAuthToken } from "./utils/authToken";

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

  // 📨 Flutter config receiver
  useEffect(() => {
    window.receiveMessageFromFlutter = (message) => {
      console.log(" Received from Flutter:", message);
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
      {/* <button onClick={() => {
        const testMergeConfig = JSON.stringify({
          token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNjJhNDU0M2YwNTk0NjUwMWE0NzhlMjBlNmM1ODI1NjhlZTI2ZjllNWJkMjBlNzY0NWRmY2JkNWRkNDJjMTU1MDBhYzU5ZDgzMDVmZDg5MmIiLCJpYXQiOjE3NTIzODg1MzguMzMyODAxLCJuYmYiOjE3NTIzODg1MzguMzMyODAyLCJleHAiOjE3NTI2NDc3MzguMzE2MDgsInN1YiI6IjEiLCJzY29wZXMiOltdfQ.YfIuvTJPrnW3FSsQipHpXpqp_uVvDtJs-gNsZqnic169MDW8v9T0_GaybxBx-mrIK7VowEMOLPgNo9Z1KGaOo7W5jDwXbI6RisNPgwZmDhxy4SBDAcCEvYMrvGwQRls9YoCF4fFE-zNSHrtPdjowie99yjjwI5BTaG9uwRLBQJtOj2R-qg91LU0wQcFPsk24Loo5imUUMIBlBPTOsvPQ_3-68NKlMyvIB6gbfySVK38SHRVgrwiLe-yeC2_Rj3BS3Zg7OryfeWGD6HFpZvx1xN1-qtni0axtN8kT8xUkK2Qh6BGGk6ukTc4RuCTZIJj8IFtDbqUNkOvS6EQ2t0IfMopMh7cdUyLEo0dffMkQR7v28Wo8FNeKk0xnnkIWsfDtas8wnGvwfAK9xdkcCdvN3HqNkjh5dnDFP7Q9T6nXuUhkMmZ74XyTjp4fRhiWhiEWE9nfDv8PWzBDr1edI87GKMPKzTlNQm2cCPROjea7M1CltENsSgulwwRNODiwQDhKg7AE5sLSq9CZifX2M-kotjMi1oXz0BaHvPvtCG4A7wsg2MdNxwVDrdSUY8k9E7r_aSOqiJZVH-EJV182bgi841jLYka2ctPSVr8iOh5k6ILLCMIoCwxv-hgGJClAqRYiVBmWmULR7ceJ07dVD5Qw4W4IN1r9Jz1G01kFiSOZgkY",
          mode: "single",
          personIdLeft: "103",
          personIdRight: "103",
          freezeLeftTree: true,
          freezeRightTree: true,
          maxLevelLeft: 4,
          maxLevelRight: 6
        });

        window.receiveMessageFromFlutter?.(testMergeConfig);
      }}>
        🔄 Trigger Merge Mode Test
      </button> */}

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
              treeType="single"
            />
          )}
        </>
      )}

      {mode === "merge" && (
        <div style={mergeContainerStyle}>
          <div style={halfWidthStyle}>
            <PersonForm
              personId={personId}
              setPersonId={setPersonId}
              onSubmit={handleSubmitLeft}
              placeholder="Enter Person ID (Left)"
              buttonText="Show Left Tree"
            />
            {submittedId && (
              <FamilyTree
                chartId="family-tree-left"
                personId={submittedId}
                freeze={freezeLeftTree}
                maxLevel={maxLevelLeft}
                treeType="left"
              />
            )}
          </div>

          <div style={halfWidthStyle}>
            <PersonForm
              personId={personId2}
              setPersonId={setPersonId2}
              onSubmit={handleSubmitRight}
              placeholder="Enter Person ID (Right)"
              buttonText="Show Right Tree"
            />
            {submittedId2 && (
              <FamilyTree
                chartId="family-tree-right"
                personId={submittedId2}
                freeze={freezeRightTree}
                maxLevel={maxLevelRight}
                treeType="right"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
