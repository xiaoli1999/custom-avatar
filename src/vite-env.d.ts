declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{string, unknown}, {string, unknown}, any>
  export default component
}
