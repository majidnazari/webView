import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    CircularProgress,
    Box,
} from "@mui/material";
import useAncestryHeads from "../../hooks/user/useAncestryHeads";

const AncestrySelector = ({ rootPersonId, setRootPersonId }) => {
    const { heads, loading } = useAncestryHeads(10);

    const handleSelect = (e) => {
        const selectedId = e.target.value;
        setRootPersonId(selectedId);
    };

    return (
        <Box sx={{ my: 2 }}>
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <InputLabel id="ancestry-heads-label">Choose Ancestry Head</InputLabel>
                <Select
                    labelId="ancestry-heads-label"
                    value={rootPersonId || ""}
                    onChange={handleSelect}
                    label="Choose Ancestry Head"
                    disabled={loading}
                >
                    {loading ? (
                        <MenuItem disabled>
                            <CircularProgress size={20} />
                        </MenuItem>
                    ) : (
                        heads.map((head) => (
                            <MenuItem key={head.person_id} value={head.person_id}>
                                {head.first_name} {head.last_name} - Level {head.level}
                            </MenuItem>
                        ))
                    )}
                </Select>
            </FormControl>

            <TextField
                label="Root Person ID"
                fullWidth
                variant="outlined"
                value={rootPersonId || ""}
                onChange={(e) => setRootPersonId(e.target.value)}
            />
        </Box>
    );
};

export default AncestrySelector;
