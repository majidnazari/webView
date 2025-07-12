import React, { useState, useEffect } from "react";
import FamilyTree from "./components/familyTree/FamilyTree";
import { setAuthToken, getAuthToken } from "./utils/authToken";

const containerStyle = { padding: 20 };
const messageStyle = {
  background: "#e0f7fa",
  padding: 10,
  marginBottom: 20,
  borderRadius: 4,
  fontWeight: "bold",
};
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

        // Save token
        if (parsed.token) {
          setAuthToken(parsed.token);
        }

        // Save config
        setConfigFromFlutter(parsed);

        // Respond to Flutter
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

  const tokenDisplay = getAuthToken() || "No token set";

  const mode = configFromFlutter?.mode;

  return (
    <div style={containerStyle}>
      {/* Display token */}
      <div style={messageStyle}>Current Auth Token: {tokenDisplay}</div>

      {/* Display raw message if not JSON */}
      {messageFromFlutter && (
        <div style={messageStyle}>
          Raw Message from Flutter: {messageFromFlutter}
        </div>
      )}

      <h2>Family Tree Viewer</h2>

      {/* Render tree(s) only when config is available */}
      {mode === "single" && configFromFlutter?.personIdLeft && (
        <FamilyTree
          chartId="family-tree-1"
          personId={configFromFlutter.personIdLeft}
          freeze={configFromFlutter.freezeLeftTree ?? false}
          maxLevel={configFromFlutter.maxLevelLeft}
          mode="single"
          messageFromFlutter={messageFromFlutter}
        />
      )}

      {mode === "merge" && (
        <div style={mergeContainerStyle}>
          {/* Left Tree */}
          {configFromFlutter?.personIdLeft && (
            <div style={halfWidthStyle}>
              <FamilyTree
                chartId="family-tree-left"
                treeType="left"
                personId={configFromFlutter.personIdLeft}
                freeze={configFromFlutter.freezeLeftTree ?? true}
                maxLevel={configFromFlutter.maxLevelLeft}
                mode="merge"
                messageFromFlutter={messageFromFlutter}
              />
            </div>
          )}

          {/* Right Tree */}
          {configFromFlutter?.personIdRight && (
            <div style={halfWidthStyle}>
              <FamilyTree
                chartId="family-tree-right"
                treeType="right"
                personId={configFromFlutter.personIdRight}
                freeze={configFromFlutter.freezeRightTree ?? true}
                maxLevel={configFromFlutter.maxLevelRight}
                mode="merge"
                messageFromFlutter={messageFromFlutter}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
