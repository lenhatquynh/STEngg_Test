// ** Next Imports
import Image, { ImageProps } from 'next/image'

const CustomImage = (props: ImageProps) => {
  // eslint-disable-next-line jsx-a11y/alt-text
  return <Image quality={100} {...props} />
}

export default CustomImage
