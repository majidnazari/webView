import React from "react";
import { Dialog, Input, InputLabel, Box } from "@mui/material";
import { FiPlus, FiX } from "react-icons/fi";
import useAncestryHeads from "../../../hooks/useAncestryHeads";


const SettingsDialog = ({ open, onClose, settings, onChange }) => {

  const { heads, loading } = useAncestryHeads(10);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const parsedValue =
      type === "checkbox"
        ? checked
        : type === "number" || type === "range"
          ? parseInt(value)
          : value;
    onChange({ ...settings, [name]: parsedValue });
  };

  const handleCardLineChange = (index, value) => {
    const updated = [...settings.cardDisplayLines];
    updated[index] = value;
    onChange({ ...settings, cardDisplayLines: updated });
  };

  const addCardLine = () => {
    onChange({ ...settings, cardDisplayLines: [...settings.cardDisplayLines, ""] });
  };

  const removeCardLine = (index) => {
    const updated = settings.cardDisplayLines.filter((_, i) => i !== index);
    onChange({ ...settings, cardDisplayLines: updated });
  };

  const resetCardAndImageSettings = () => {
    onChange({
      ...settings,
      cardWidth: "",
      cardHeight: "",
      imageWidth: "",
      imageHeight: "",
      imageX: "",
      imageY: "",
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <div style={{ position: "relative", padding: "20px", display: "flex", flexWrap: "wrap", gap: "40px" }}>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "",
            border: "none",
            cursor: "pointer"
          }}
          aria-label="Close"
        >
          <FiX size={24} />
        </button>
        {/* Left Column */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          <h2>Chart Settings</h2>

          {/* Root Person ID with optional dropdown */}
          <label>Root Person ID:</label>
          {loading ? (
            <p>Loading heads...</p>
          ) : (
            <select
              name="personId"
              value={settings.personId?.toString() || ""}
              onChange={(e) => onChange({ ...settings, personId: e.target.value })}
              style={{ width: "100%", marginBottom: "10px" }}
            >
              <option value="">-- Select Root Person --</option>
              {heads.map((head) => (
                <option key={head.person_id} value={head.person_id.toString()}>
                  {head.full_name || `${head.first_name} ${head.last_name || ""}`}
                </option>
              ))}
            </select>
          )}
          {/* Manual override option */}
          <input
            type="text"
            name="personId"
            placeholder="Or enter ID manually"
            value={settings.personId?.toString() || ""}
            onChange={(e) => onChange({ ...settings, personId: e.target.value })}
            style={{ width: "100%", marginTop: "5px" }}
          />

          <br /><br />

          {/* Repeat Count (compact input) */}
          <Box display="flex" alignItems="center" gap={1}>
            <InputLabel htmlFor="repeat-count" shrink>Max Level:</InputLabel>
            <Input
              id="repeat-count"
              type="number"
              value={settings.maxLevel}
              onChange={(e) =>
                onChange({
                  ...settings,
                  maxLevel: Math.max(0, Math.min(99, parseInt(e.target.value) || 0)),
                })
              }
              inputProps={{ min: 0, max: 99 }}
              size="small"
              sx={{ width: 60 }}
            />
          </Box>

          <br /><br />

          <label>
            <input
              type="checkbox"
              name="enableEditMode"
              checked={settings.enableEditMode}
              onChange={handleInputChange}
            />
            Enable Edit Mode
          </label>

          <br /><br />

          <label>Orientation:</label>
          <select name="orientation" value={settings.orientation} onChange={handleInputChange}>
            <option value="vertical">Vertical</option>
            <option value="horizontal">Horizontal</option>
          </select>

          <br /><br />

          <label>Card X Spacing:</label>
          <input
            type="number"
            name="cardXSpacing"
            value={settings.cardXSpacing}
            onChange={handleInputChange}
          />

          <br /><br />

          <label>Card Y Spacing:</label>
          <input
            type="number"
            name="cardYSpacing"
            value={settings.cardYSpacing}
            onChange={handleInputChange}
          />

          <br /><br />

          <label>Transition Time (ms):</label>
          <input
            type="number"
            name="transitionTime"
            value={settings.transitionTime}
            onChange={handleInputChange}
          />

          <br /><br />

          <label>
            <input
              type="checkbox"
              name="miniTree"
              checked={settings.miniTree}
              onChange={handleInputChange}
            />
            Enable Mini Tree
          </label>

          <br /><br />

          <label>
            <input
              type="checkbox"
              name="singleParentEmptyCard"
              checked={settings.singleParentEmptyCard}
              onChange={handleInputChange}
            />
            Show "Add" for single parents
          </label>

          <br /><br />

          <label>Empty Card Label:</label>
          <input
            type="text"
            name="emptyCardLabel"
            value={settings.emptyCardLabel}
            onChange={handleInputChange}
          />

          <br /><br />

          <h4>Card Dimensions</h4>

          <label>Card Width:</label>
          <input
            type="range"
            name="cardWidth"
            min="100"
            max="600"
            step="10"
            value={settings.cardWidth || 250}
            onChange={handleInputChange}
          />
          <span>{settings.cardWidth ? `${settings.cardWidth}px` : "auto"}</span>

          <br /><br />

          <label>Card Height:</label>
          <input
            type="range"
            name="cardHeight"
            min="60"
            max="400"
            step="10"
            value={settings.cardHeight || 150}
            onChange={handleInputChange}
          />
          <span>{settings.cardHeight ? `${settings.cardHeight}px` : "auto"}</span>

          <br /><br />

          <h4>Image Dimensions</h4>

          <label>Image Width:</label>
          <input
            type="range"
            name="imageWidth"
            min="20"
            max="300"
            step="1"
            value={settings.imageWidth || 100}
            onChange={handleInputChange}
          />
          <span>{settings.imageWidth ? `${settings.imageWidth}px` : "auto"}</span>

          <br /><br />

          <label>Image Height:</label>
          <input
            type="range"
            name="imageHeight"
            min="20"
            max="300"
            step="1"
            value={settings.imageHeight || 100}
            onChange={handleInputChange}
          />
          <span>{settings.imageHeight ? `${settings.imageHeight}px` : "auto"}</span>

          <br /><br />

          <label>Image X Position:</label>
          <input
            type="range"
            name="imageX"
            min="-100"
            max="200"
            step="1"
            value={settings.imageX || 0}
            onChange={handleInputChange}
          />
          <span>{settings.imageX || 0}px</span>

          <br /><br />

          <label>Image Y Position:</label>
          <input
            type="range"
            name="imageY"
            min="-100"
            max="200"
            step="1"
            value={settings.imageY || 0}
            onChange={handleInputChange}
          />
          <span>{settings.imageY || 0}px</span>

          <br /><br />

          <button onClick={resetCardAndImageSettings}>
            🔄 Reset Card & Image Settings
          </button>
        </div>

        {/* Right Column */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          <h4>Card Display Fields</h4>
          {settings.cardDisplayLines.map((line, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
              <input
                type="text"
                value={line}
                onChange={(e) => handleCardLineChange(index, e.target.value)}
                placeholder="e.g., first_name,last_name"
                style={{ flex: 1, marginRight: 8 }}
              />
              <button onClick={() => removeCardLine(index)} style={{ background: "none", border: "none" }}>
                <FiX size={18} />
              </button>
            </div>
          ))}

          <button onClick={addCardLine} style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 10 }}>
            <FiPlus /> Add Line
          </button>

          <br /><br />

          <h4>Card Style</h4>
          <div>
            <label>
              <input
                type="radio"
                name="cardStyle"
                value="imageRect"
                checked={settings.cardStyle === "imageRect"}
                onChange={handleInputChange}
              />
              Image Rectangle
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="cardStyle"
                value="imageCircle"
                checked={settings.cardStyle === "imageCircle"}
                onChange={handleInputChange}
              />
              Image Circle
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="cardStyle"
                value="rect"
                checked={settings.cardStyle === "rect"}
                onChange={handleInputChange}
              />
              Rectangle (No Image)
            </label>
          </div>
        </div>

        {/* Footer */}
        <div style={{ width: "100%", textAlign: "right", marginTop: 20 }}>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </Dialog>
  );
};

export default SettingsDialog;
