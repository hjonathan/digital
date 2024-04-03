import { defineAsyncComponent } from 'vue'

export default {
    Main: defineAsyncComponent(() => import('./main/Main.vue')),
    Buttons: defineAsyncComponent(() => import('./main/ActionButtonsExample.vue')),
    ButtonsWithRules: defineAsyncComponent(() => import('./examples/ActionButtonsRulesExample.vue')),
    TitleExample: defineAsyncComponent(() => import('./examples/TitleExample.vue')),
    SlideoverExample: defineAsyncComponent(() => import('./examples/SlideoverExample.vue')),
    AlertExample: defineAsyncComponent(() => import('./examples/AlertExample.vue')),
    ButtonExample: defineAsyncComponent(() => import('./examples/ButtonExample.vue')),
    CardExample: defineAsyncComponent(() => import('./main/CardExample.vue')),
    StepperExample: defineAsyncComponent(() => import('./examples/StepperExample.vue')),
    BadgeExample: defineAsyncComponent(() => import('./examples/BadgeExample.vue')),
    SliderExample: defineAsyncComponent(() => import('./examples/SliderExample/SliderExample.vue')),
    TimelineExample: defineAsyncComponent(() => import('./examples/TimelineExample.vue')),
    TableUIExample: defineAsyncComponent(() => import('./examples/TableUIExample.vue')),
    ConnectorExample: defineAsyncComponent(() => import('./examples/ConnectorExample.vue')),
    GridLayoutExample: defineAsyncComponent(() => import('./examples/GridLayoutExample.vue'))
}
