import React from 'react'
import { Spinner , DarkThemeToggle, Flowbite} from 'flowbite-react'

function Loader({size="lg", color="info"}) {
  return (
    <div >
      <Flowbite>
        <Spinner aria-label="Medium sized spinner example" size={size || "lg"} light="on" color={color}/>
      </Flowbite>
    </div>
  )
}

export default Loader
