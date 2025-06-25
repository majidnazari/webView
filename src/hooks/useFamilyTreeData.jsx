import { useEffect, useState } from "react";
import mapFamilyTreeResponse from "../utils/mapFamilyTreeResponse";
import { getAuthToken } from "../utils/authToken";
import { toast } from "react-toastify";
import config from "../utils/config";


//  Change this to however many levels you want
//const REPEAT_COUNT = 2;

const generatePersonMarriageFragment = (depth) => {
    if (depth === 0) return '';
    return `
        PersonMarriages {
            id
            Man {
                id
                first_name
                last_name
                gender
                birth_date
                death_date
                is_owner
                status
            }
            Woman {
                id
                first_name
                last_name
                gender
                birth_date
                death_date
                is_owner
                status
            }
            Children {
                id
                first_name
                last_name
                gender
                birth_date
                death_date
                is_owner
                status
                ${generatePersonMarriageFragment(depth - 1)}
            }
        }
    `;
};

const useFamilyTreeData = (personId, maxLevel = 2) => {
    const [treeData, setTreeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = getAuthToken();

    console.log("the token is :", token)

    useEffect(() => {


        const fetchFamilyTree = async () => {
            try {

                const query = `
                    query getPerson {
                        getPerson(id: "${personId}") {
                            id
                            first_name
                            gender
                            mobile
                            birth_date
                            death_date
                            is_owner
                            status
                            ${generatePersonMarriageFragment(maxLevel)}
                        }
                    }
                `;
                {
                    // console.log("the final query is :" , query)
                }
                const response = await fetch(config.GRAPHQL_ENDPOINT, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        query,
                        variables: { personId },
                    }),
                });

                const result = await response.json();


                if (result?.data?.getPerson) {
                    const mapped = mapFamilyTreeResponse(result.data.getPerson);
                    console.log("mapped is:", mapped);
                    setTreeData(mapped);
                }
            } catch (error) {
                console.error("Failed to fetch family tree:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFamilyTree();
    }, [personId, maxLevel]);

    return { treeData, loading };
};

export default useFamilyTreeData;
