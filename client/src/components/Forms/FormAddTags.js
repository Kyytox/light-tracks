import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";

//  function for add tags to album
// 1 textflied , 1 button for add tags to album
// /display tags in album
function FormAddTags({ album, setAlbum }) {
    const [inputTag, setInputTag] = useState("");

    const handleAddTag = (e) => {
        e.preventDefault();
        const newTag = inputTag;
        if (newTag) {
            setAlbum({
                ...album,
                tags: { value: [...album.tags.value, newTag], error: false, helperText: "" },
            });
        }
        setInputTag("");

        // focus on input
        document.getElementById("tag").focus();
    };

    const handleDeleteTag = (tag) => {
        const newTags = album.tags.value.filter((t) => t !== tag);
        setAlbum({
            ...album,
            tags: { value: newTags, error: false, helperText: "" },
        });
    };

    return (
        <div>
            <TextField
                id="tag"
                label="tag"
                variant="outlined"
                value={inputTag}
                onChange={(e) => setInputTag(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleAddTag}>
                Add Tag
            </Button>
            <div>
                {album.tags.value.map((tag) => (
                    <Chip
                        key={tag}
                        label={tag}
                        onDelete={() => handleDeleteTag(tag)}
                        style={{ margin: "5px" }}
                    />
                ))}
            </div>
        </div>
    );
}

export default FormAddTags;
