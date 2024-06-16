import React, { ChangeEventHandler, useRef} from "react"
import './fileSelector.scss'

type FileSelectorProps = {
    onChange: ChangeEventHandler<HTMLInputElement>,
    label: string,
    accept: string
}

const FileSelector = ({onChange, label, accept}: FileSelectorProps) => {

    const inputRef = useRef<HTMLInputElement>(null);

    const onClick = () => {
        if(inputRef.current)
            inputRef.current.click();
    }

    return (
        <div className="file-group">
            <input accept={accept} type="file" ref={inputRef} onChange={onChange} />
            <div>
                <button onClick={onClick}>{label}</button>{inputRef.current && inputRef.current.files && inputRef.current.files[0]!.name}
            </div>
            
        </div>
    )
}

export default FileSelector