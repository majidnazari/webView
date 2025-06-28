import React, { useEffect, useRef, useState } from "react";
import f3 from "family-chart";
import "family-chart/styles/family-chart.css";
import useFamilyTreeData from "../../hooks/useFamilyTreeData";
import SettingsDialog from "./settingDialog/SettingsDialog";

const FamilyTree_deletemode = ({ chartId, personId, onSelect, treeType = "left" }) => {
  const containerRef = useRef(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [treeData, setTreeData] = useState([]);

  const [settings, setSettings] = useState({
    orientation: "vertical",
    cardXSpacing: 110,
    cardYSpacing: 150,
    transitionTime: 1000,
    miniTree: true,
    singleParentEmptyCard: true,
    emptyCardLabel: "ADD",
    enableEditMode: true,
    personId: personId || "1",
    maxLevel: 2,
    cardStyle: "imageCircle",
    cardWidth: "",
    cardHeight: "",
    imageWidth: "",
    imageHeight: "",
    imageX: "",
    imageY: "",
    cardDisplayLines: ["first_name", ""],
  });

  const { treeData: initialTreeData, loading } = useFamilyTreeData(settings.personId, settings.maxLevel);

  useEffect(() => {
    setTreeData(initialTreeData);
  }, [initialTreeData]);

  useEffect(() => {
    if (!settings.enableEditMode) {
      setSelectedPerson(null);
    }
  }, [settings.enableEditMode]);

  useEffect(() => {
    if (loading || !containerRef.current || treeData.length === 0) return;

    const container = containerRef.current;
    container.innerHTML = "";

    const f3Chart = f3
      .createChart(container, treeData)
      .setTransitionTime(settings.transitionTime)
      .setCardXSpacing(settings.cardXSpacing)
      .setCardYSpacing(settings.cardYSpacing)
      .setSingleParentEmptyCard(settings.singleParentEmptyCard, { label: settings.emptyCardLabel });

    settings.orientation === "vertical"
      ? f3Chart.setOrientationVertical()
      : f3Chart.setOrientationHorizontal();

    const f3Card = f3Chart
      .setCard(f3.CardHtml)
      .setCardDisplay(
        settings.cardDisplayLines.map(line => line.split(",").map(f => f.trim()).filter(Boolean))
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

    let f3EditTree = null;

    const handleCardClick = (e, d) => {
      if (!d || !d.data) return;

      const person = d.data?.data;
      if (!person || !person.id) return;

      const idToRemove = person.id;
      //if (!window.confirm(`Are you sure you want to delete this person?`)) return;

      // Deep copy to avoid mutating existing state
      let updatedTreeData = JSON.parse(JSON.stringify(treeData));

      // Remove person entirely
      updatedTreeData = updatedTreeData.filter(node => node.id !== idToRemove);

      // Cleanup references from others
      updatedTreeData = updatedTreeData.map(node => {
        if (node.rels) {
          const rels = { ...node.rels };

          if (rels.father === idToRemove) delete rels.father;
          if (rels.mother === idToRemove) delete rels.mother;

          if (Array.isArray(rels.spouses)) {
            rels.spouses = rels.spouses.filter(spouseId => spouseId !== idToRemove);
            if (rels.spouses.length === 0) delete rels.spouses;
          }

          if (Array.isArray(rels.children)) {
            rels.children = rels.children.filter(childId => childId !== idToRemove);
            if (rels.children.length === 0) delete rels.children;
          }

          return { ...node, rels };
        }
        return node;
      });

      setTreeData(updatedTreeData);
      setSelectedPerson(null);
      onSelect?.(person);

      f3Card.onCardClickDefault(e, d);
    };

    f3Card.setOnCardClick(handleCardClick);

    if (settings.enableEditMode) {
      f3EditTree = f3Chart
        .editTree()
        .fixed(true)
        .setFields([
          "first_name", "last_name", "gender", "id",
          "avatar", "birth_date", "death_date", "is_owner", "status"
        ])
        .setEditFirst(true)
        .setNoEdit();

      const mainDatum = f3Chart.getMainDatum();
      if (mainDatum && mainDatum.data) {
        f3EditTree.open(mainDatum);
      }
    }

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
    </>
  );
};

export default FamilyTree_deletemode;
