/**
 * Data example for JsonLogic
 */
export const data = {
    id: '317da878-5340-4185-937e-62e325115b37',
    parent_id: null,
    vendor_id: 2,
    vendor_product_id: 'RE774',
    batch_id: '3cf2f12d-9a67-4bb8-b29b-58f2565670c1',
    product_invoice_status_id: 1,
    brand_id: 10,
    category_id: 19,
    location_id: 73,
    measure_id: 256,
    origin_id: null,
    stage_id: 157,
    status_id: 267,
    strain_id: 180,
    type_id: 55,
    container_id: null,
    product_type_id: null,
    product_lock_type_id: 1,
    finished_good_types_id: null,
    name: null,
    locked: 0,
    subdivide: 0,
    subdivide_child: 0,
    user_id: 1,
    user_name: 'Tenant Name',
    json: null,
    created_at: '2023-09-28T00:00:00.000000Z',
    updated_at: '2023-09-28T00:00:00.000000Z',
    deleted_at: null,
    start_date: '2023-09-28T00:00:00Z',
    days_in_stage: 5,
    increase_quantity: 2200,
    decrease_quantity: 0,
    waste_quantity: 0,
    evaporation_quantity: 0,
    absorb_quantity: 0,
    lock_reason: '',
    quantity: 2200,
    is_father: false,
    is_child: false,
    children_quantity_sum: 0,
    children_count: 0,
    price: 14,
    batch: {
        id: '3cf2f12d-9a67-4bb8-b29b-58f2565670c1',
        created_at: '2023-10-03T19:50:02.000000Z',
        updated_at: '2023-10-03T19:50:02.000000Z',
        deleted_at: null
    },
    status: {
        id: 267,
        area_id: null,
        parent_id: 264,
        name: 'In quarantine',
        slug: 'in-quarantine',
        order: null,
        description: null,
        icon: null,
        created_at: '2023-10-03T19:49:50.000000Z',
        updated_at: '2023-10-03T19:49:50.000000Z',
        deleted_at: null
    },
    type: {
        id: 55,
        area_id: null,
        parent_id: 54,
        name: 'Lot',
        slug: 'lot',
        order: null,
        description: null,
        icon: null,
        created_at: '2023-10-03T19:49:49.000000Z',
        updated_at: '2023-10-03T19:49:49.000000Z',
        deleted_at: null
    },
    strain: {
        id: 180,
        area_id: null,
        parent_id: 178,
        name: 'Afghani',
        slug: 'afghani',
        order: null,
        description: null,
        icon: null,
        created_at: '2023-10-03T19:49:50.000000Z',
        updated_at: '2023-10-03T19:49:50.000000Z',
        deleted_at: null
    },
    location: {
        id: 73,
        area_id: 3,
        parent_id: 72,
        name: 'final X1 Y1',
        slug: 'final-x1-y1',
        order: null,
        description: null,
        icon: null,
        created_at: '2023-10-03T19:49:49.000000Z',
        updated_at: '2023-10-03T19:49:49.000000Z',
        deleted_at: null
    },
    stage: {
        id: 157,
        area_id: 3,
        parent_id: 155,
        name: 'Final',
        slug: 'final',
        order: 1,
        description: null,
        icon: null,
        created_at: '2023-10-03T19:49:49.000000Z',
        updated_at: '2023-10-03T19:49:49.000000Z',
        deleted_at: null
    },
    brand: {
        id: 10,
        area_id: null,
        parent_id: 8,
        name: 'Canvas',
        slug: 'canvas',
        order: null,
        description: null,
        icon: null,
        created_at: '2023-10-03T19:49:49.000000Z',
        updated_at: '2023-10-03T19:49:49.000000Z',
        deleted_at: null
    },
    category: {
        id: 19,
        area_id: 4,
        parent_id: 15,
        name: 'Clone',
        slug: 'clone',
        order: null,
        description: null,
        icon: null,
        created_at: '2023-10-03T19:49:49.000000Z',
        updated_at: '2023-10-03T19:49:49.000000Z',
        deleted_at: null
    },
    measure: {
        id: 256,
        area_id: null,
        parent_id: 255,
        name: 'units',
        slug: 'units',
        order: null,
        description: null,
        icon: null,
        created_at: '2023-10-03T19:49:50.000000Z',
        updated_at: '2023-10-03T19:49:50.000000Z',
        deleted_at: null
    },
    container: null,
    invoice_products: [],
    finished_good_type: null,
    product_type: null,
    product_invoice_status: {
        id: 1,
        name: 'Not register',
        slug: 'not-register',
        order: null,
        description: null,
        created_at: '2023-10-03T19:49:50.000000Z',
        updated_at: '2023-10-03T19:49:50.000000Z',
        deleted_at: null
    },
    products: [
        { name: 'prod1', value: 'test', prop: 'id' },
        { name: 'prod1', prop: 'id' },
        { name: 'prod1', prop: 'id' },
    ]
}
