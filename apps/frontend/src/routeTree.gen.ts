/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as PublicImport } from './routes/_public'
import { Route as ProtectedImport } from './routes/_protected'
import { Route as PublicLoginImport } from './routes/_public/login'
import { Route as ProtectedCasinoImport } from './routes/_protected/casino'
import { Route as ProtectedCasinoHomeImport } from './routes/_protected/casino/home'
import { Route as ProtectedCasinoGamesImport } from './routes/_protected/casino/games'
import { Route as ProtectedCasinoGamesGameIdImport } from './routes/_protected/casino/games/$gameId'

// Create/Update Routes

const PublicRoute = PublicImport.update({
  id: '/_public',
  getParentRoute: () => rootRoute,
} as any)

const ProtectedRoute = ProtectedImport.update({
  id: '/_protected',
  getParentRoute: () => rootRoute,
} as any)

const PublicLoginRoute = PublicLoginImport.update({
  path: '/login',
  getParentRoute: () => PublicRoute,
} as any)

const ProtectedCasinoRoute = ProtectedCasinoImport.update({
  path: '/casino',
  getParentRoute: () => ProtectedRoute,
} as any)

const ProtectedCasinoHomeRoute = ProtectedCasinoHomeImport.update({
  path: '/home',
  getParentRoute: () => ProtectedCasinoRoute,
} as any)

const ProtectedCasinoGamesRoute = ProtectedCasinoGamesImport.update({
  path: '/games',
  getParentRoute: () => ProtectedCasinoRoute,
} as any)

const ProtectedCasinoGamesGameIdRoute = ProtectedCasinoGamesGameIdImport.update(
  {
    path: '/$gameId',
    getParentRoute: () => ProtectedCasinoGamesRoute,
  } as any,
)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_protected': {
      id: '/_protected'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof ProtectedImport
      parentRoute: typeof rootRoute
    }
    '/_public': {
      id: '/_public'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof PublicImport
      parentRoute: typeof rootRoute
    }
    '/_protected/casino': {
      id: '/_protected/casino'
      path: '/casino'
      fullPath: '/casino'
      preLoaderRoute: typeof ProtectedCasinoImport
      parentRoute: typeof ProtectedImport
    }
    '/_public/login': {
      id: '/_public/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof PublicLoginImport
      parentRoute: typeof PublicImport
    }
    '/_protected/casino/games': {
      id: '/_protected/casino/games'
      path: '/games'
      fullPath: '/casino/games'
      preLoaderRoute: typeof ProtectedCasinoGamesImport
      parentRoute: typeof ProtectedCasinoImport
    }
    '/_protected/casino/home': {
      id: '/_protected/casino/home'
      path: '/home'
      fullPath: '/casino/home'
      preLoaderRoute: typeof ProtectedCasinoHomeImport
      parentRoute: typeof ProtectedCasinoImport
    }
    '/_protected/casino/games/$gameId': {
      id: '/_protected/casino/games/$gameId'
      path: '/$gameId'
      fullPath: '/casino/games/$gameId'
      preLoaderRoute: typeof ProtectedCasinoGamesGameIdImport
      parentRoute: typeof ProtectedCasinoGamesImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  ProtectedRoute: ProtectedRoute.addChildren({
    ProtectedCasinoRoute: ProtectedCasinoRoute.addChildren({
      ProtectedCasinoGamesRoute: ProtectedCasinoGamesRoute.addChildren({
        ProtectedCasinoGamesGameIdRoute,
      }),
      ProtectedCasinoHomeRoute,
    }),
  }),
  PublicRoute: PublicRoute.addChildren({ PublicLoginRoute }),
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_protected",
        "/_public"
      ]
    },
    "/_protected": {
      "filePath": "_protected.tsx",
      "children": [
        "/_protected/casino"
      ]
    },
    "/_public": {
      "filePath": "_public.tsx",
      "children": [
        "/_public/login"
      ]
    },
    "/_protected/casino": {
      "filePath": "_protected/casino.jsx",
      "parent": "/_protected",
      "children": [
        "/_protected/casino/games",
        "/_protected/casino/home"
      ]
    },
    "/_public/login": {
      "filePath": "_public/login.tsx",
      "parent": "/_public"
    },
    "/_protected/casino/games": {
      "filePath": "_protected/casino/games.tsx",
      "parent": "/_protected/casino",
      "children": [
        "/_protected/casino/games/$gameId"
      ]
    },
    "/_protected/casino/home": {
      "filePath": "_protected/casino/home.tsx",
      "parent": "/_protected/casino"
    },
    "/_protected/casino/games/$gameId": {
      "filePath": "_protected/casino/games/$gameId.tsx",
      "parent": "/_protected/casino/games"
    }
  }
}
ROUTE_MANIFEST_END */
