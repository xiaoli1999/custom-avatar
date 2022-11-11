import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import progress from '../tools/config/progress'

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(() => {
    progress.start()
})

router.afterEach(() => {
    progress.close()
})
export default router
