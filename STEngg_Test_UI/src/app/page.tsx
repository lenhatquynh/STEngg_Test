// ** MUI Imports
import { Stack } from '@mui/material'

// ** Constants Imports
import { colors } from '@/constants/color'

const Home = () => {
  return (
    <Stack
      alignItems="center"
      sx={{
        width: '100%',
        position: 'relative',
        backgroundColor: colors.lightGray,
      }}
    >
      Hello World
    </Stack>
  )
}

export default Home
