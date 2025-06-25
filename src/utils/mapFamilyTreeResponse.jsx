const mapFamilyTreeResponse = (personData) => {
    const nodes = new Map();

    const addPerson = (person, gender) => {
        if (!person || !person.id) return;

        gender = person.gender === 0 ? "F" : person.gender === 1 ? "M" : defaultGender;

        if (!nodes.has(person.id)) {

            nodes.set(person.id, {
                id: person.id,
                data: {
                    "id": person.id,
                    "first_name": person.first_name,
                    "last_name": person.last_name,
                    "birth_date": person.birth_date,
                    "death_date": person.death_date,
                    "is_owner": person.is_owner,
                    "status": person.status,
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

        addPerson(child, "M"); // Default. Use actual gender if available.
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

        // Recursively process child's marriages
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

    // Ensure root person is included
    addPerson(personData, personData.gender);

    return Array.from(nodes.values());
};

export default mapFamilyTreeResponse;
