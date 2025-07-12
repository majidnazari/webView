import React, { useState, useEffect } from "react";
import FamilyTree from "./components/familyTree/FamilyTree";
import { setAuthToken, getAuthToken } from "./utils/authToken";

const containerStyle = { padding: 20 };
const mergeContainerStyle = {
  display: "flex",
  flexDirection: "row",
  gap: 30,
  flexWrap: "nowrap",
};
const halfWidthStyle = { width: "50%" };

const App = () => {
  const [configFromFlutter, setConfigFromFlutter] = useState(null);
  const [messageFromFlutter, setMessageFromFlutter] = useState("");

  useEffect(() => {
    window.receiveMessageFromFlutter = (message) => {
      console.log("📨 Received from Flutter:", message);

      try {
        const parsed = JSON.parse(message);

        if (parsed.token) {
          setAuthToken(parsed.token);
        }

        setConfigFromFlutter(parsed);

        // Send a reply back to Flutter
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

  const mode = configFromFlutter?.mode;

  return (
    <div style={containerStyle}>
      {mode === "single" && (
        <FamilyTree
          chartId="family-tree-left"
          treeType="left"
          messageFromFlutter={messageFromFlutter}
        />
      )}

      {mode === "merge" && (
        <div style={mergeContainerStyle}>
          <div style={halfWidthStyle}>
            <FamilyTree
              chartId="family-tree-left"
              treeType="left"
              messageFromFlutter={messageFromFlutter}
            />
          </div>

          <div style={halfWidthStyle}>
            <FamilyTree
              chartId="family-tree-right"
              treeType="right"
              messageFromFlutter={messageFromFlutter}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
