import { getSessionJSON } from 'shared'
import { configTable as config } from 'table'

/**
 * Table configuration object for AgGrid, uses the interfaces of the 'Table' library,
 * here we control selected fields, clickable cells, row style validation and other properties accepted by AGGRID.
 */
export const configTable = ({ idThread }) => {
    const currentFacilityId = getSessionJSON('facility_id')

    return config({
        rowClassRules: {
            'disabled-row': (params) => params.data?.id === currentFacilityId && idThread
        }
    })
}
