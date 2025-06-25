import React, { useEffect, useRef, useState } from "react";
import f3 from "family-chart";
import "family-chart/styles/family-chart.css";
import useFamilyTreeData from "../../hooks/useFamilyTreeData";
import SettingsDialog from "../familyTree/settingDialog/SettingsDialog";

const FamilyTree = ({ chartId, personId, onSelect, treeType = "left" }) => {
  const containerRef = useRef(null);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [settings, setSettings] = useState({
    orientation: "vertical",
    cardXSpacing: 250,
    cardYSpacing: 150,
    transitionTime: 1000,
    miniTree: true,
    singleParentEmptyCard: true,
    emptyCardLabel: "ADD",
    enableEditMode: true,
    personId: personId || "1",
    maxLevel: 2,
    cardStyle: "imageRect",
    cardWidth: "",
    cardHeight: "",
    imageWidth: "",
    imageHeight: "",
    imageX: "",
    imageY: "",
    cardDisplayLines: ["first_name,last_name", "status", ""],
  });

  const { treeData, loading } = useFamilyTreeData(settings.personId, settings.maxLevel);

  useEffect(() => {
    if (loading || !containerRef.current || treeData.length === 0) return;

    const container = containerRef.current;
    container.innerHTML = "";

    const f3Chart = f3
      .createChart(container, treeData)
      .setTransitionTime(settings.transitionTime)
      .setCardXSpacing(settings.cardXSpacing)
      .setCardYSpacing(settings.cardYSpacing)
      .setSingleParentEmptyCard(settings.singleParentEmptyCard, {
        label: settings.emptyCardLabel,
      });

    settings.orientation === "vertical"
      ? f3Chart.setOrientationVertical()
      : f3Chart.setOrientationHorizontal();

    const f3Card = f3Chart
      .setCard(f3.CardHtml)
      .setCardDisplay(
        settings.cardDisplayLines.map(line =>
          line.split(",").map(f => f.trim()).filter(Boolean)
        )
      )
      .setMiniTree(settings.miniTree)
      .setStyle(settings.cardStyle)
      .setOnHoverPathToMain();

    const dimOptions = {};
    if (settings.cardWidth) dimOptions.width = +settings.cardWidth;
    if (settings.cardHeight) dimOptions.height = +settings.cardHeight;
    if (settings.imageWidth) dimOptions.img_width = +settings.imageWidth;
    if (settings.imageHeight) dimOptions.img_height = +settings.imageHeight;
    if (settings.imageX) dimOptions.img_x = +settings.imageX;
    if (settings.imageY) dimOptions.img_y = +settings.imageY;
    if (settings.textX) dimOptions.text_x = +settings.textX;
    if (settings.textY) dimOptions.text_y = +settings.textY;

    if (Object.keys(dimOptions).length > 0) {
      f3Card.setCardDim(dimOptions);
    }

    f3Card.setOnCardClick((e, d) => {
      if (!d || !d.data) return;
      const person = d.data?.data;
      if (!person || !person.id) return;

      setSelectedId(person.id);
      onSelect?.(person.id);

      // Remove existing highlights
      container.querySelectorAll(".card.selected-card").forEach(card => {
        card.classList.remove("selected-card");
      });

      // Highlight clicked card by data-id
      const clickedCard = container.querySelector(`.card[data-id="${person.id}"]`);
      if (clickedCard) {
        clickedCard.classList.add("selected-card");
      }
    });

    f3Chart.updateTree({ initial: true });
  }, [treeData, loading, settings]);

  return (
    <>
      <div style={{ textAlign: "right", marginBottom: 10, marginRight: 20 }}>
        <button onClick={() => setShowSettings(true)}>⚙️ Settings</button>
      </div>

      <div className="f3 f3-cont" id={chartId} ref={containerRef}></div>

      <SettingsDialog
        open={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onChange={setSettings}
      />

      <style>
        {`
          .card.selected-card {
            border: 3px solid red;
            box-shadow: 0 0 10px red;
          }

          .f3-card[data-gender="male"] {
            background-color: white !important;
          }
          .f3-card[data-gender="female"] {
            background-color: white !important;
          }
        `}
      </style>
    </>
  );
};

export default FamilyTree;
