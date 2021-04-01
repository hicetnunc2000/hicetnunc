import { Feeds } from './feeds'

export const Latest = () => {
  console.log('latest feed')
  return <Feeds type={0} />
}

export const Hdao = () => {
  return <Feeds type={1} />
}

export const Random = () => {
  return <Feeds type={2} />
}
