import React from 'react'
import { Spinner } from 'flowbite-react'

function Loader({size="lg", color="info"}) {
  return (
    <Spinner aria-label="Medium sized spinner example" size={size || "lg"} color={color}/>
  )
}

export default Loader
