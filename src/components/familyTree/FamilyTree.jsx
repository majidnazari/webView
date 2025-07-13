import React, { useEffect, useRef, useState } from "react";
import f3 from "family-chart";
import "family-chart/styles/family-chart.css";
import "../../assets/familyTreeCustom.css";
import useFamilyTreeData from "../../hooks/useFamilyTreeData";
import SettingsDialog from "./settingDialog/SettingsDialog";

import manTmp from "../../assets/images/1.jpg";
import womanTmp from "../../assets/images/2.jpg";
import avater_male from "../../assets/images/avater_male.jpg";
import avatar_female from "../../assets/images/avatar_female.jpg";

const FamilyTree = ({ chartId, personId, freeze, maxLevel }) => {
  { console.log("the params in familytree are:", chartId, personId, freeze, maxLevel); }
  const containerRef = useRef(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const [settings, setSettings] = useState({
    orientation: "vertical",
    cardXSpacing: 110,
    cardYSpacing: 160,
    transitionTime: 1000,
    miniTree: true,
    singleParentEmptyCard: true,
    emptyCardLabel: "ADD",
    enableEditMode: false,
    freezeTree: freeze || false,
    personId: personId || "1",
    maxLevel: maxLevel || 3,
    cardStyle: "imageRectangular",
    cardWidth: 90,
    cardHeight: 130,
    imageWidth: 90,
    imageHeight: 90,
    imageX: "",
    imageY: "",
    cardDisplayLines: ["first_name", "birth_date,death_date"],
  });

  useEffect(() => {
    setSettings((prev) => ({
      ...prev,
      freezeTree: freeze,
      personId: personId,
      maxLevel: maxLevel,
    }));
  }, [freeze, personId, maxLevel]);

  const { treeData, loading } = useFamilyTreeData(
    settings.personId,
    settings.maxLevel
  );

  useEffect(() => {
    if (settings.freezeTree) {
      setSelectedPerson(null);
    }
  }, [settings.freezeTree]);

  useEffect(() => {
    if (loading || !containerRef.current || treeData.length === 0) return;

    const processedData = treeData.map((person) => {
      const { id, gender, avatar } = person.data;

      if (id === "1") {
        person.data.avatar = manTmp;
      } else if (id === "4") {
        person.data.avatar = womanTmp;
      } else if (!avatar) {
        person.data.avatar = gender === "M" ? avater_male : avatar_female;
      }

      return person;
    });

    const container = containerRef.current;
    container.innerHTML = "";

    const f3Chart = f3
      .createChart(container, processedData)
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
        settings.cardDisplayLines.map((line) =>
          line.split(",").map((f) => f.trim()).filter(Boolean)
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
      if (!d || !d.data) return;
      const person = d.data?.data;
      if (!person || !person.id) return;

      window.flutter_inappwebview.callHandler("FlutterBridge", JSON.stringify({
        type: "personSelected",
        personId: person.id,
        fullName: `${person.first_name} ${person.last_name}`,
        gender: person.gender,
        img: person.avatar,
        spouse_ids: null,
      }));

      if (settings.freezeTree) return;

      setSelectedPerson(d);

      if (
        settings.enableEditMode &&
        f3EditTree &&
        !f3EditTree.isAddingRelative()
      ) {
        f3EditTree.open(d);
      }

      f3Card.onCardClickDefault(e, d);
    };

    f3Card.setOnCardClick(handleCardClick);

    if (settings.enableEditMode) {
      f3EditTree = f3Chart
        .editTree()
        .fixed(true)
        .setFields([
          "first_name",
          "last_name",
          "gender",
          "id",
          "avatar",
          "birth_date",
          "death_date",
          "is_owner",
          "status",
        ])
        .setEditFirst(true)
        .setNoEdit();

      const mainDatum = f3Chart.getMainDatum();
      if (mainDatum && mainDatum.data) f3EditTree.open(mainDatum);
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

export default FamilyTree;
