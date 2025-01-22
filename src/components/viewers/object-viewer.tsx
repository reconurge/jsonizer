"use client"
import React from 'react'
import ReactJson from 'react-json-view'

const ObjectViewer = ({ file }: { file: any }) => {
    return (
        <div>
            <div className='p-4'>
                <ReactJson src={file.content} />
            </div>
        </div>
    )
}

export default ObjectViewer