/**
 * Reliable 1-click ZIP downloader that works across browser iframes and sandbox environments.
 * Uses Fetch -> Blob -> Object URL -> synthetic click, with Base64 and direct window fallback.
 */

export async function downloadSingleZip(
  onStateChange?: (state: 'idle' | 'downloading' | 'success' | 'error', message?: string) => void
): Promise<boolean> {
  onStateChange?.('downloading', 'Downloading bove-ai.zip...');

  try {
    // Primary approach: Fetch binary blob from server
    const response = await fetch('/download-zip', {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const blob = await response.blob();
    if (!blob || blob.size === 0) {
      throw new Error('Received empty zip file');
    }

    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = blobUrl;
    link.download = 'bove-ai.zip';
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    }, 2000);

    onStateChange?.('success', 'bove-ai.zip downloaded successfully! (Check Downloads folder)');
    return true;
  } catch (primaryErr) {
    console.warn('Primary blob download encountered error, trying Base64 fallback:', primaryErr);

    try {
      // Fallback 1: Base64 JSON endpoint (works even if iframe intercepts direct file streams)
      const res = await fetch('/api/download-zip-base64');
      const data = await res.json();

      if (data && data.base64) {
        const byteCharacters = atob(data.base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const fallbackBlob = new Blob([byteArray], { type: 'application/zip' });
        const fallbackUrl = window.URL.createObjectURL(fallbackBlob);

        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = fallbackUrl;
        link.download = 'bove-ai.zip';
        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(fallbackUrl);
        }, 2000);

        onStateChange?.('success', 'bove-ai.zip downloaded successfully via fallback!');
        return true;
      }
    } catch (fallbackErr) {
      console.error('Base64 fallback failed:', fallbackErr);
    }

    // Fallback 2: Direct URL trigger
    try {
      window.location.href = '/download-zip';
      onStateChange?.('success', 'Download initiated in browser!');
      return true;
    } catch (finalErr) {
      console.error('All download methods failed:', finalErr);
      onStateChange?.('error', 'Download was blocked by browser. Please use the direct link button.');
      return false;
    }
  }
}
