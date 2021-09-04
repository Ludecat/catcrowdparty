import { NextPage } from 'next'
import { MainLayout } from './Layout'

type PageWithMainLayoutType = NextPage & { layout: typeof MainLayout }

export type PageWithLayoutType = PageWithMainLayoutType
