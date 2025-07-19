import React, { useEffect, useState } from "react";
import FamilyTree from "./components/familyTree/FamilyTree";
import { setAuthToken } from "./utils/authToken";

const containerStyle = { padding: 5 };
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
      {/* <button onClick={() => {
        const testMergeConfig = JSON.stringify({
          token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMjY1NGEzMjAzYTYxMjU4NTg4Njc5M2E1MTlkOWI0MDRjNzllMzZkY2QyNTBhYjViODNkODcyMTViMTE5Nzk5MWY5OTI2OWE5Yzc1YWQyNzMiLCJpYXQiOjE3NTI5MjI1MzIuODE5MzcyLCJuYmYiOjE3NTI5MjI1MzIuODE5MzczLCJleHAiOjE3NTMxODE3MzIuODE2NjUzLCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.JDFVeisBsYgfNz94XyaJveOT-POzFbxVT2V-ySK1VVP7YRLaPt2MB8gAoAuYMXiNepn3qHA_xTriMRcN8vKuGvrwzPqC5Aj0Zy4VNF6m7J5e1YE5MTKX4jwnGPruIECwQ1wzugJA0IpvT661roo5rJnZat7ocy5h80CAzxTF3DHemkwoSyGZMRvLS47xeqLyqDVc5yFayGjyrhHNE3FReeO7qD2ueQBkqtCxTX56ERzIj4etwyi4EnWfMc68FLqTIEsYNV4Fch1UmABaTmQhN3MEFDcw8BYj6TMn_uuFUykYGUxpaRa8Iwc17o8Nh5JUJIo9gYrU_LRLth_c3IpoeLtpml2_EApaa3-9sbTGXBGCaMwuT33Hw5ruBRtIaNCoR-LH-bQlSZ19-Aw7GYzJgQ7DMZVCGSAS_DqiZG79HJi_uzyB5M0_fPUB_pi3d5qoeXiov95It_9Pe9b1oPSD43PN1qqVz-BzygUNr39176FDwMNd8sEqBAlfY-qqIlZiwj_4JymMe-Kfe3y43KnraFcNKtJ_p4yP4UzJZj3etVoTxbBUL-E_XdETqOhVuZAJxPA0BGI3woNG_2OE_jUYL7NR288B1Oxi5v1egximflZ5fbyw5zkJGGVgd2zyonnQv4aadFe4SB5C1yEFsUeReG8LRwbqBMXYS2uXc6TlxGg",
          mode: "single",
          personIdLeft: "1",
          personIdRight: "1",
          freezeLeftTree: true,
          freezeRightTree: true,
          maxLevelLeft: 4,
          maxLevelRight: 6,
          makeWhiteWhenSelect: true
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
