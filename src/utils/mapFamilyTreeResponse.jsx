import jalaali from 'jalaali-js';

const mapFamilyTreeResponse = (personData) => {
  const nodes = new Map();
  const defaultGender = "U";

  // Updated calendar-based formatter
  const formatDate = (calendar, year, dateStr) => {
    if ((calendar === "BH" || calendar === 2) && year) {
      return `${year}`;
    } else if ((calendar === "Gregorian" || calendar === 1) && dateStr) {
      const date = new Date(dateStr);
      if (isNaN(date)) return null;

      const { jy, jm, jd } = jalaali.toJalaali(date);
      // return `${jy}/${jm.toString().padStart(2, '0')}/${jd.toString().padStart(2, '0')}`;
      return `${jy}`;
    }
    return null;
  };

  const addPerson = (person, gender) => {
    if (!person || !person.id) return;

    gender = person.gender === 0 ? "F" : person.gender === 1 ? "M" : defaultGender;

    if (!nodes.has(person.id)) {
      //console.log("the person of ${person.id} is :", person);
      const birthDisplay = formatDate(person.birth_calendar, person.birth_year, person.birth_date);
      const deathDisplay = formatDate(person.death_calendar, person.death_year, person.death_date);

      //console.log("the birthDisplay is :", birthDisplay);


      nodes.set(person.id, {
        id: person.id,
        data: {
          id: person.id,
          first_name: person.first_name,
          last_name: person.last_name,
          birth_date: person.birth_date,
          death_date: person.death_date,
          birth_date_display: birthDisplay || 100,
          death_date_display: deathDisplay || 100,
          is_owner: person.is_owner,
          status: person.status,
          avatar: null,
          gender,
        },
        rels: {},
      });
    }
  };

  const addSpouseRelation = (id1, id2) => {
    const p1 = nodes.get(id1);
    const p2 = nodes.get(id2);

    if (p1 && id2) {
      p1.rels.spouses = Array.from(new Set([...(p1.rels.spouses || []), id2]));
    }
    if (p2 && id1) {
      p2.rels.spouses = Array.from(new Set([...(p2.rels.spouses || []), id1]));
    }
  };

  const addChildRelation = (fatherId, motherId, child) => {
    if (!child || !child.id) return;

    addPerson(child, child.gender);
    const childNode = nodes.get(child.id);
    if (fatherId) childNode.rels.father = fatherId;
    if (motherId) childNode.rels.mother = motherId;

    const father = nodes.get(fatherId);
    const mother = nodes.get(motherId);

    if (father) {
      father.rels.children = Array.from(new Set([...(father.rels.children || []), child.id]));
    }
    if (mother) {
      mother.rels.children = Array.from(new Set([...(mother.rels.children || []), child.id]));
    }

    if (child.PersonMarriages?.length) {
      child.PersonMarriages.forEach(pm => processMarriage(pm));
    }
  };

  const processMarriage = (marriage) => {
    if (!marriage) return;

    const man = marriage.Man;
    const woman = marriage.Woman;
    const children = marriage.Children || [];

    addPerson(man, "M");
    addPerson(woman, "F");

    if (man && woman) {
      addSpouseRelation(man.id, woman.id);
    }

    children.forEach(child => {
      addChildRelation(man?.id, woman?.id, child);
    });
  };

  if (personData.PersonMarriages?.length) {
    personData.PersonMarriages.forEach(pm => processMarriage(pm));
  }

  addPerson(personData, personData.gender);

  return Array.from(nodes.values());
};

export default mapFamilyTreeResponse;
