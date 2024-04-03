// Generate pdf on backend for download
export const downloadBase64PDF = (content, name) => {
    const linkSource = `data:application/pdf;base64,${content}`

    const downloadLink = document.createElement('a')

    const fileName = name

    downloadLink.href = linkSource

    downloadLink.download = fileName

    downloadLink.click()
}
