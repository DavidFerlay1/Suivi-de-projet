import { Tag } from "../../interfaces/Tag"
import React from "react"

type TagProps = {
    tag: Tag
}

const Tag = ({tag}: TagProps) => {
    return (
        <span className="tag" style={{backgroundColor: tag.color}}>
            {tag.label}
        </span>
    )
}

export default Tag;