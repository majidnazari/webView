import React, { useEffect, useState } from "react";
import FamilyTree from "../src/components/familyTree/FamilyTree";
import MergeFamilyTree from "../src/components/familyTree/MergeFamilyTree";
import { setAuthToken, getAuthToken } from "./utils/authToken";

const App = () => {
  const [configFromFlutter, setConfigFromFlutter] = useState(null);
  const [messageFromFlutter, setMessageFromFlutter] = useState("");

  useEffect(() => {
    window.receiveMessageFromFlutter = (message) => {
      console.log("📨 Received from Flutter:", message);

      try {
        const parsed = JSON.parse(message);

        // Save token globally
        if (parsed.token) {
          setAuthToken(parsed.token);
          console.log(" token from flutter is :", getAuthToken());

        }

        // Store parsed config
        setConfigFromFlutter(parsed);

        // Optional: respond back to Flutter
        if (window.flutter_inappwebview?.callHandler) {
          window.flutter_inappwebview.callHandler(
            "FlutterBridge",
            `${message} and add react to returning back`
          );
        }

        setMessageFromFlutter(message);
      } catch (err) {
        console.error("Invalid JSON from Flutter:", err);
        setMessageFromFlutter(message);
      }
    };

    return () => {
      delete window.receiveMessageFromFlutter;
    };
  }, []);

  const handleSelect = (person) => {
    const message = `Selected person: ${JSON.stringify(person)}`;
    if (window.flutter_inappwebview?.callHandler) {
      window.flutter_inappwebview.callHandler("FlutterBridge", message);
    }
  };

  if (!configFromFlutter) {
    return <div>Waiting for configuration from Flutter...</div>;
  }

  const {
    mode = "single",
    token,
    personIdLeft,
    personIdRight,
    freezeLeftTree = false,
    freezeRightTree = false,
    maxLevelLeft = 2,
    maxLevelRight = 2,
  } = configFromFlutter;

  return (
    <div>
      {mode === "single" ? (
        <FamilyTree
          chartId="singleTree"
          personId={personIdLeft}
          freeze={freezeLeftTree}
          maxLevel={maxLevelLeft}
          onSelect={handleSelect}
        />
      ) : (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <MergeFamilyTree
            chartId="leftTree"
            personId={personIdLeft}
            freeze={freezeLeftTree}
            maxLevel={maxLevelLeft}
            onSelect={handleSelect}
            treeType="left"
          />
          <MergeFamilyTree
            chartId="rightTree"
            personId={personIdRight}
            freeze={freezeRightTree}
            maxLevel={maxLevelRight}
            onSelect={handleSelect}
            treeType="right"
          />
        </div>
      )}
    </div>
  );
};

export default App;
