export const shortenUrl = async (url: string): Promise<string> => {
    const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
    if (!response.ok) {
      throw new Error('Failed to shorten URL');
    }
    return response.text();
  };