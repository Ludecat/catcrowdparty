import { NextPage } from 'next'
import Layout from './Layout'

type PageWithMainLayoutType = NextPage & { layout: typeof Layout }

type PageWithLayoutType = PageWithMainLayoutType

export default PageWithLayoutType
