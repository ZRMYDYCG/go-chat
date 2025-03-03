export interface IRouteMeta {
  icon: string
  activeIcon: string
  title: string
}

export interface IRoute {
  name?: string
  path: string
  component?: () => Promise<any>
  meta?: IRouteMeta
  redirect?: string
  children?: IRoute[]
}
