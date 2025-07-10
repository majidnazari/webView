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

const FamilyTree = ({ chartId, onSelect }) => {
  const containerRef = useRef(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const [config, setConfig] = useState({
    token: "",
    personIdLeft: "1",
    personIdRight: "",
    freezeLeftTree: false,
    freezeRightTree: false,
    maxLevelLeft: 3,
    maxLevelRight: 3,
    mode: "single", // or "merged"
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
    // const onReady = () => {
    //   window.flutter_inappwebview.addJavaScriptHandler({
    //     handlerName: 'fromFlutter',
    //     handler: (args) => {
    //       console.log("Received args from Flutter:", args);
    //       try {
    //         const rawData = args[0];
    //         const data = typeof rawData === "string" ? JSON.parse(rawData) : rawData;

    //         const newConfig = {
    //           token: data.token,
    //           personIdLeft: data.personIdLeft,
    //           personIdRight: data.personIdRight || "",
    //           freezeLeftTree: !!data.freezeLeftTree,
    //           freezeRightTree: !!data.freezeRightTree,
    //           maxLevelLeft: data.maxLevelLeft || 5,
    //           maxLevelRight: data.maxLevelRight || 3,
    //           mode: data.mode || "single",
    //         };

    //         setConfig(newConfig);

    //         return newConfig; // return config synchronously
    //       } catch (err) {
    //         console.error("Error parsing from Flutter:", err);
    //         return { error: "Invalid JSON" };
    //       }
    //     },
    //   });
    // };

    // window.addEventListener("flutterInAppWebViewPlatformReady", function () {
    //   console.log("hello from react");
    // });
    //return () => window.removeEventListener("flutterInAppWebViewPlatformReady", onReady);
  }, []);


  // Sync config to settings
  useEffect(() => {
    const activePersonId =
      config.mode === "left" || config.mode === "single"
        ? config.personIdLeft
        : config.personIdRight;

    const activeMaxLevel =
      config.mode === "left" || config.mode === "single"
        ? config.maxLevelLeft
        : config.maxLevelRight;

    const activeFreeze =
      config.mode === "left" || config.mode === "single"
        ? config.freezeLeftTree
        : config.freezeRightTree;

    setSettings((prev) => ({
      ...prev,
      token: config.token,
      personId: activePersonId,
      maxLevel: activeMaxLevel,
      freezeTree: activeFreeze,
    }));
  }, [config]);

  const { treeData, loading } = useFamilyTreeData(
    settings.personId,
    settings.maxLevel,
    settings.token
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
        if (gender === "M") {
          person.data.avatar = avater_male;
        } else if (gender === "F") {
          person.data.avatar = avatar_female;
        }
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

    // const handleCardClick = (e, d) => {
    //   if (!d || !d.data) return;
    //   const person = d.data?.data;
    //   if (!person || !person.id) return;

    //   if (settings.freezeTree) return;

    //   // Show ID and name on card click
    //   onSelect?.({ id: person.id, name: person.first_name + " " + person.last_name });
    //   setSelectedPerson(d);

    //   if (settings.enableEditMode && f3EditTree && !f3EditTree.isAddingRelative()) {
    //     f3EditTree.open(d);
    //   }

    //   f3Card.onCardClickDefault(e, d);
    // };

    const handleCardClick = (e, d) => {
      if (!d || !d.data) return;
      const person = d.data?.data;
      if (!person || !person.id) return;


      // window.FlutterBridge?.postMessage(JSON.stringify({
      //   type: "personSelected",
      //   personId: person.id,
      //   fullName: person.first_name + " " + person.last_name,
      //   gender: person.gender,
      //   img: person.avatar,
      //   spouse_ids: null
      // }));


      window.flutter_inappwebview.callHandler("FlutterBridge", JSON.stringify({
        type: "personSelected",
        personId: person.id,
        fullName: person.first_name + " " + person.last_name,
        gender: person.gender,
        img: person.avatar,
        spouse_ids: null
      }));


      if (settings.freezeTree) return;


      setSelectedPerson(d);

      if (settings.enableEditMode && f3EditTree && !f3EditTree.isAddingRelative()) {
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

      {/* Settings dialog kept for potential future use */}
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
