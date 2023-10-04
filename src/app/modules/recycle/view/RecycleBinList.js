import React from 'react'
import { useNavigate } from 'react-router-dom'
import { IconFileText } from "@tabler/icons-react"

const RecycleList = () => {

    const navigate = useNavigate();

  return (
    <div>

        <div
        style={{
            display : 'flex',
            alignItems : 'center',
            gap : 10
        }}
        >

            <div style={{ 
                width : '200px',
                display : 'flex',
                alignItems : 'center',
                gap : 10,
                backgroundColor : '#f4fa9c',
                color : '#3f3b3b',
                padding : '0 10px',
                borderRadius : '20px',
                cursor: 'pointer'
                }}
                onClick={() => navigate('/bin/media')}
            >
                <IconFileText/>
                <p>Media</p>
            </div>

            <div style={{ 
                width : '200px',
                display : 'flex',
                alignItems : 'center',
                gap : 10,
                backgroundColor : '#f4fa9c',
                color : '#3f3b3b',
                padding : '0 10px',
                borderRadius : '20px',
                cursor: 'pointer'
                }}
                onClick={() => navigate('/bin/query')
                }>
                
                <IconFileText/>
                <p>Query Form</p>
            </div>

        </div>

    </div>
  )
}

export default RecycleList;