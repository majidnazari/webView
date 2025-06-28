// FamilyTree.jsx
import React, { useEffect, useRef, useState } from "react";
import f3 from "family-chart";  // npm install family-chart@0.7.0 or yarn add family-chart@0.7.0
import "family-chart/styles/family-chart.css";
import useFamilyTreeData from "../../hooks/useFamilyTreeData";
// import PersonDialog from "./components/personDialog/PersonDialog";
import SettingsDialog from "./settingDialog/SettingsDialog";

const MergeFamilyTree = ({ chartId, personId, onSelect, treeType = "left" }) => {
  const containerRef = useRef(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

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
    cardDisplayLines: [
      "first_name,last_name",
      "status",
      ""
    ],
  });

  const { treeData, loading } = useFamilyTreeData(settings.personId, settings.maxLevel);

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



    let f3EditTree = null;

    const handleCardClick = (e, d) => {
      console.warn(" node selected:", d);

      if (!d || !d.data) {
        console.warn("Invalid node clicked:", d);
        return;
      }

      const person = d.data?.data;
      if (!person || !person.id) {
        console.warn("Invalid person object");
        return;
      }

      onSelect?.(person); // pass full person object

      if (settings.enableEditMode) {
        setSelectedPerson(d);

        if (f3EditTree && !f3EditTree.isAddingRelative()) {
          f3EditTree.open(d);
        }
      }

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
        .setEditFirst(true);

      //f3EditTree.setEdit();
      f3EditTree.setNoEdit();
      //f3EditTree.open(f3Chart.getMainDatum());

      const mainDatum = f3Chart.getMainDatum();
      if (mainDatum && mainDatum.data) {
        f3EditTree.open(mainDatum);
      } else {
        console.warn("getMainDatum returned invalid data:", mainDatum);
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

      {/* {settings.enableEditMode && selectedPerson && (
        <PersonDialog
          personData={selectedPerson}
          onClose={() => setSelectedPerson(null)}
        />
      )} */}

      <SettingsDialog
        open={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onChange={setSettings}
      />
    </>
  );
};

export default MergeFamilyTree;
