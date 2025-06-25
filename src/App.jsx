import React, { useState } from "react";
import FamilyTree from "./components/familyTree/FamilyTree";

const App = () => {
  const [personId, setPersonId] = useState("");
  const [submittedId, setSubmittedId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (personId.trim()) {
      setSubmittedId(personId.trim());
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Family Tree Viewer</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter Person ID"
          value={personId}
          onChange={(e) => setPersonId(e.target.value)}
        />
        <button type="submit" style={{ marginLeft: "10px" }}>
          Show Tree
        </button>
      </form>

      {submittedId && (
        <FamilyTree chartId="family-tree" personId={submittedId} />
      )}
    </div>
  );
};

export default App;
