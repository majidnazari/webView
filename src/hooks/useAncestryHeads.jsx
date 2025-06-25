import { useEffect, useState } from "react";
import { getAuthToken } from "../utils/authToken";
import { toast } from "react-toastify";
import config from "../utils/config";

const useAncestryHeads = (depth = 10) => {
    const [heads, setHeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = getAuthToken();

    useEffect(() => {
        const fetchHeads = async () => {
            setLoading(true);

            const query = `
        query getBloodyPersonAncestry {
          getBloodyPersonAncestry(depth: ${depth}) {
            heads {
              person_id
              first_name
              last_name
              level
              order
              path
            }
          }
        }
      `;

            try {
                const response = await fetch(config.GRAPHQL_ENDPOINT, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ query }),
                });

                const result = await response.json();

                if (result?.data?.getBloodyPersonAncestry?.heads) {
                    setHeads(result.data.getBloodyPersonAncestry.heads);
                } else {
                    toast.error("Failed to fetch ancestry heads.");
                }
            } catch (error) {
                console.error("Ancestry heads fetch error:", error);
                toast.error("An error occurred while fetching ancestry heads.");
            } finally {
                setLoading(false);
            }
        };

        fetchHeads();
    }, [depth]);

    return { heads, loading };
};

export default useAncestryHeads;
