import React, { useEffect, useRef, useState } from "react";
import f3 from "family-chart";
import "family-chart/styles/family-chart.css";
import useFamilyTreeData from "../../hooks/useFamilyTreeData";
import SettingsDialog from "./settingDialog/SettingsDialog";

import manTmp from "../../assets/images/1.jpg";
import womanTmp from "../../assets/images/2.jpg";
import avater_male from "../../assets/images/avater_male.jpg";
import avatar_female from "../../assets/images/avatar_female.jpg";

const MergeFamilyTree = ({ chartId, treeType = "left", messageFromFlutter }) => {
  const containerRef = useRef(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const [config, setConfig] = useState({
    token: "",
    personIdLeft: "1",
    personIdRight: "1",
    freezeLeftTree: false,
    freezeRightTree: false,
    maxLevelLeft: 3,
    maxLevelRight: 3,
    mode: "merge",
  });

  const [settings, setSettings] = useState({
    orientation: "vertical",
    cardXSpacing: 110,
    cardYSpacing: 160,
    transitionTime: 1000,
    miniTree: true,
    singleParentEmptyCard: true,
    emptyCardLabel: "ADD",
    enableEditMode: false,
    freezeTree: false,
    personId: "1",
    maxLevel: 3,
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
    if (!messageFromFlutter) return;

    try {
      const data = typeof messageFromFlutter === "string"
        ? JSON.parse(messageFromFlutter)
        : messageFromFlutter;

      if (data?.token) {
        setConfig({
          token: data.token,
          personIdLeft: data.personIdLeft || "1",
          personIdRight: data.personIdRight || "1",
          mode: data.mode || "merge",
          freezeLeftTree: !!data.freezeLeftTree,
          freezeRightTree: !!data.freezeRightTree,
          maxLevelLeft: data.maxLevelLeft || 3,
          maxLevelRight: data.maxLevelRight || 3,
        });

        console.log("✅ MergeFamilyTree config loaded:", data);
      }
    } catch (err) {
      console.error("❌ Error parsing MergeFamilyTree config:", err);
    }
  }, [messageFromFlutter]);

  useEffect(() => {
    const personId = treeType === "left" ? config.personIdLeft : config.personIdRight;
    const maxLevel = treeType === "left" ? config.maxLevelLeft : config.maxLevelRight;
    const freezeTree = treeType === "left" ? config.freezeLeftTree : config.freezeRightTree;

    setSettings((prev) => ({
      ...prev,
      token: config.token,
      personId,
      maxLevel,
      freezeTree,
    }));
  }, [config, treeType]);

  const { treeData, loading } = useFamilyTreeData(settings.personId, settings.maxLevel, config.token);

  useEffect(() => {
    if (loading || !containerRef.current || treeData.length === 0) return;

    const container = containerRef.current;
    container.innerHTML = "";

    const processedData = treeData.map((person) => {
      const { id, gender, avatar } = person.data;

      if (id === "1") person.data.avatar = manTmp;
      else if (id === "4") person.data.avatar = womanTmp;
      else if (!avatar) person.data.avatar = gender === "M" ? avater_male : avatar_female;

      return person;
    });

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

    if (Object.keys(dimOptions).length > 0) {
      f3Card.setCardDim(dimOptions);
    }

    const handleCardClick = (e, d) => {
      const person = d?.data?.data;
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
      f3Card.onCardClickDefault(e, d);
    };

    f3Card.setOnCardClick(handleCardClick);

    if (settings.enableEditMode) {
      const f3EditTree = f3Chart
        .editTree()
        .fixed(true)
        .setFields([
          "first_name", "last_name", "gender", "id",
          "avatar", "birth_date", "death_date", "is_owner", "status"
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

export default MergeFamilyTree;
