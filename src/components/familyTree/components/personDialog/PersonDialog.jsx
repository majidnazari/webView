import React, { useEffect, useState } from "react";
import "./PersonDialog.css";
import useCreateSpouse from "../../hooks/useCreateSpouse";
import useCreateParent from "../../hooks/useCreateParent";
import useCreateChild from "../../hooks/useCreateChild";
import useGetBloodyPersonAncestry from "../../hooks/useGetBloodyPersonAncestry";
import useGetSpouses from "../../hooks/useGetSpouses";
import { toast } from "react-toastify";

const PersonDialog = ({ personData, onClose }) => {
    if (!personData) return null;
    const { data } = personData;
    {
        //console.log("the gender of seleted node is :" , data.data.gender)
    }
    const today = new Date().toISOString().split("T")[0];
    const fullName = `${data?.data?.first_name || ""} ${data?.data?.last_name || ""}`.trim() || "NA";

    const [relationship, setRelationship] = useState("Spouse");
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        birth_date: "",
        death_date: "",
        gender: "Male",
        status: "Active",
        marriage_date: "",
        divorce_date: "",
        child_kind: "AdoptedChild",
        child_status: "Separated",
        mobile: "",
        is_owner: false,
        spouse_id: "",
    });

    const [bloodyHeads, setBloodyHeads] = useState([]);
    const [spousesList, setSpousesList] = useState([]);
    const { fetchAncestry } = useGetBloodyPersonAncestry();
    const { fetchSpouses } = useGetSpouses();
    const { createSpouse } = useCreateSpouse();
    const { createParent } = useCreateParent();
    const { createChild } = useCreateChild();

    const isHead = bloodyHeads?.some((head) => head.person_id === data.id);

    useEffect(() => {
        if (!personData) return;

        const loadAncestry = async () => {
            console.log("Fetching ancestry...");
            try {
                const heads = await fetchAncestry();
                console.log("Fetched heads:", heads);
                setBloodyHeads(heads);
            } catch (err) {
                console.error("Failed to load ancestry heads", err);
            }
        };

        loadAncestry();
    }, [personData]);

    useEffect(() => {
        const loadSpouses = async () => {
            //alert("the relationship is :" + relationship);
            if (relationship !== "Child") {
                setSpousesList([]);
                return;
            }
            try {
                const result = await fetchSpouses(+data.id);
                setSpousesList(result?.data || []);
                console.log("all spouses in useeffect  are :", result);
                console.log("the spousesList  in useeffect  is  :", spousesList);
            } catch (err) {
                console.error("Failed to fetch spouses for child", err);
            }
        };

        loadSpouses();
    }, [relationship, data.id]);


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
       
        try {
            if (relationship === "Spouse") {
                {
                    console.log("form in spouse:", form);
                }
                const input = {
                    person_id: data.id,
                    marriage_date: form.marriage_date || today,
                    spouse: {
                        first_name: form.first_name,
                        last_name: form.last_name,
                        birth_date: form.birth_date,
                        mobile: form.mobile,
                    },
                    status: form.status || "Active",
                    marriage_status: form.marriage_status || "Related",
                };

                await createSpouse(input);

            } else if (relationship === "Parents") {
                {
                    console.log("form in parent:", form);
                }
                if (!isHead) {
                    toast.error("You can only add parents to head nodes.");
                    return;
                }

                const input = {
                    person_id: data.id,
                    marriage_date: form.marriage_date || today,
                    divorce_date: form.divorce_date || today,
                    father: {
                        first_name: form.first_name,
                        last_name: form.last_name,
                        birth_date: form.birth_date,
                        death_date: form.death_date || today,
                    },
                    mother: {
                        first_name: `${form.mother_first_name} Mother`,
                        last_name: form.mother_last_name,
                        birth_date: form.mother_birth_date,
                        death_date: form.mother_death_date || today,
                    },
                    status: form.status || "Active",
                };

                await createParent( input );

            } else if (relationship === "Child") {

                {
                    console.log("form in child:", form);
                }
                const genderVal = form.gender === "Male" ? 1 : 0;
                const selectedPersonGender = data.data.gender; // "M" or "F"

                {
                    console.log("selectedPersonGender:", selectedPersonGender);
                }
                //const isMale = personData?.data?.gender === "Male";
                //const isFemale = personData?.data?.gender === "Female";

                const input = {
                    man_id: selectedPersonGender === "M" ? data.id : form.spouse_id || null,
                    woman_id: selectedPersonGender === "F" ? data.id : form.spouse_id || null,
                    child: {
                        first_name: form.first_name,
                        last_name: form.last_name,
                        birth_date: form.birth_date,
                        gender: genderVal,
                        is_owner: form.is_owner || false,
                        mobile: form.mobile,
                    },
                    child_kind: form.child_kind,
                    child_status: form.child_status,
                    status: form.status || "Active",
                };

                await createChild(input);

            }

            toast.success("Submitted successfully");
            onClose();

        } catch (error) {
            // console.error("Error submitting form:", error);
            console.error("GraphQL Error details:", JSON.stringify(error, null, 2));
            const validation = error?.message?.includes("Validation Error")
                ? error?.response?.errors?.[0]?.extensions?.validation
                : null;

            if (validation) {
                Object.entries(validation).forEach(([field, messages]) => {
                    toast.error(`${field}: ${messages.join(", ")}`);
                });
            } else if (error.message) {
                toast.error("Error: " + error.message);
            } else {
                toast.error("Failed to submit");
            }
        }
    };

    return (
        <div className="dialog-backdrop">
            <div className="dialog-box">
                <h2>Add {relationship}</h2>
                <p><strong>ID:</strong> {data?.id}</p>
                <p><strong>Selected Node:</strong> {fullName || "N/A"}</p>

                <form onSubmit={handleSubmit}>
                    <label>
                        Relationship:
                        <select
                            name="relationship"
                            value={relationship}
                            onChange={(e) => setRelationship(e.target.value)}
                        >
                            <option>Spouse</option>
                            <option>Parents</option>
                            <option>Child</option>
                        </select>
                    </label>

                    {/* === Parents Two-Column Layout === */}
                    {relationship === "Parents" ? (
                        <>
                            <div className="parent-form">
                                <div className="parent-section">
                                    <h3><span role="img" aria-label="male">👨</span> Father</h3>
                                    <label>
                                        First Name:
                                        <input name="first_name" value={form.first_name} onChange={handleChange} />
                                    </label>
                                    <label>
                                        Last Name:
                                        <input name="last_name" value={form.last_name} onChange={handleChange} />
                                    </label>
                                    <label>
                                        Birth Date:
                                        <input type="date" name="birth_date" value={form.birth_date ?? today} onChange={handleChange} />
                                    </label>
                                    <label>
                                        Death Date:
                                        <input type="date" name="death_date" value={form.death_date} onChange={handleChange} />
                                    </label>
                                </div>

                                <div className="parent-section">
                                    <h3><span role="img" aria-label="female">👩</span> Mother</h3>
                                    <label>
                                        First Name:
                                        <input name="mother_first_name" value={form.mother_first_name || ""} onChange={handleChange} />
                                    </label>
                                    <label>
                                        Last Name:
                                        <input name="mother_last_name" value={form.mother_last_name || ""} onChange={handleChange} />
                                    </label>
                                    <label>
                                        Birth Date:
                                        <input type="date" name="mother_birth_date" value={form.mother_birth_date || ""} onChange={handleChange} />
                                    </label>
                                    <label>
                                        Death Date:
                                        <input type="date" name="mother_death_date" value={form.mother_death_date || ""} onChange={handleChange} />
                                    </label>
                                </div>
                            </div>

                            <label>
                                Marriage Date:
                                <input type="date" name="marriage_date" value={form.marriage_date ?? today} onChange={handleChange} />
                            </label>
                            <label>
                                Divorce Date:
                                <input type="date" name="divorce_date" value={form.divorce_date} onChange={handleChange} />
                            </label>
                        </>
                    ) : (
                        <>
                            {/* === Default Form for Spouse or Child === */}
                            <label>
                                First Name:
                                <input name="first_name" value={form.first_name} onChange={handleChange} />
                            </label>

                            <label>
                                Last Name:
                                <input name="last_name" value={form.last_name} onChange={handleChange} />
                            </label>

                            <label>
                                Birth Date:
                                <input type="date" name="birth_date" value={form.birth_date ?? today} onChange={handleChange} />
                            </label>

                            {(relationship === "Child") && (
                                <label>
                                    Death Date:
                                    <input type="date" name="death_date" value={form.death_date} onChange={handleChange} />
                                </label>
                            )}

                            {(relationship === "Spouse") && (
                                <label>
                                    Marriage Date:
                                    <input type="date" name="marriage_date" value={form.marriage_date ?? today} onChange={handleChange} />
                                </label>
                            )}
                        </>
                    )}

                    {/* === Child-specific Fields === */}
                    {relationship === "Child" && (
                        <>
                            {spousesList.length > 0 && (
                                <label>
                                    Select Spouse:
                                    <select
                                        name="spouse_id"
                                        value={form.spouse_id || ""}
                                        onChange={handleChange}
                                    >
                                        <option value="">-- Select Spouse --</option>
                                        {spousesList.map((spouse) => (
                                            <option key={spouse.id} value={spouse.id}>
                                                {spouse.first_name} {spouse.last_name}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            )}

                            <label>
                                Gender:
                                <select name="gender" value={form.gender} onChange={handleChange}>
                                    <option>Male</option>
                                    <option>Female</option>
                                </select>
                            </label>

                            <label>
                                Child Kind:
                                <select name="child_kind" value={form.child_kind} onChange={handleChange}>
                                    <option>AdoptedChild</option>
                                    <option>BiologicalChild</option>
                                </select>
                            </label>

                            <label>
                                Child Status:
                                <select name="child_status" value={form.child_status} onChange={handleChange}>
                                    <option>Separated</option>
                                    <option>LivingTogether</option>
                                </select>
                            </label>

                            <label>
                                Status:
                                <select name="status" value={form.status} onChange={handleChange}>
                                    <option>Active</option>
                                    <option>Inactive</option>
                                </select>
                            </label>

                            <label>
                                Mobile:
                                <input name="mobile" value={form.mobile} onChange={handleChange} />
                            </label>
                        </>
                    )}

                    <div className="dialog-actions">
                        <button type="submit">Add</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );

}
export default PersonDialog;
