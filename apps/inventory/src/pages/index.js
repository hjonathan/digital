import { defineAsyncComponent } from 'vue'

export default {
    Main: defineAsyncComponent(() => import('./main/Main.vue')),
    Packaging: defineAsyncComponent(() => import('./packaging/Packaging.vue')),

    // Cultivation pages
    Propagate: defineAsyncComponent(() => import('./cultivation/Propagate.vue')),
    CreateMom: defineAsyncComponent(() => import('./cultivation/CreateMom.vue')),
    SeedUp: defineAsyncComponent(() => import('./cultivation/SeedUp.vue')),
    MakeClone: defineAsyncComponent(() => import('./cultivation/MakeClone.vue')),
    Harvest: defineAsyncComponent(() => import('./cultivation/Harvest.vue')),
    BeginVegetation: defineAsyncComponent(() => import('./cultivation/BeginVegetation.vue')),
    BeginFlower: defineAsyncComponent(() => import('./cultivation/BeginFlower.vue')),
    SubitemList: defineAsyncComponent(() => import('./subitemList/SubitemList.vue')),
    Split: defineAsyncComponent(() => import('./split/Split.vue')),
    Combine: defineAsyncComponent(() => import('./combine/Combine.vue')),
    Subdivide: defineAsyncComponent(() => import('./subdivide/Subdivide.vue')),
    // Processing pages
    DeStem: defineAsyncComponent(() => import('./processing/DeStem.vue')),
    Debud: defineAsyncComponent(() => import('./processing/Debud.vue')),
    MachineTrim: defineAsyncComponent(() => import('./processing/MachineTrim.vue'))
}
