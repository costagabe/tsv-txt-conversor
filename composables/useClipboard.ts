export function useClipboard() {
  const copyToClipboard = async (elementId: string) => {
    try {
      const html = document.getElementById(elementId)!.innerHTML
      const blob = new Blob([html], { type: "text/html" })
      const clipboardItem = new ClipboardItem({ "text/html": blob })
      await navigator.clipboard.write([clipboardItem])
      return true
    } catch (err) {
      return false
    }
  }

  return {
    copyToClipboard
  }
}
