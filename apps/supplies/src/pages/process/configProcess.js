import { intersection, isArray, isFunction } from 'lodash'

export const getStageByDocumentType = (process, type) => {
    let stageResult

    for (const stage of process.process_stages) {
        const res = stage.process_stage_document_types.find(e => e.slug === type)

        if (res) {
            stageResult = stage

            break
        }
    }

    return stageResult
}

export const getDocumentType = (process, type) => {
    let document

    for (const stage of process.process_stages) {
        const res = stage.process_stage_document_types.find(e => e.slug === type)

        if (res) {
            document = res

            break
        }
    }

    return document
}

export const getStage = (process, idStage) => {
    const response = process.process_stages.find()

    return response
}

const getType = (stage, type) => {
    return stage.process_stage_document_types.find(e => e.slug === type)
}
