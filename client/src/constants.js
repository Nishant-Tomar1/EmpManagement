export const Server = "http://localhost:8000/api/v1"

export function extractErrorMessage(html) {
    const regex = /<pre>(.*?)<br>/;
    const match = html.match(regex);
    return match ? match[1] : "Something went wrong. Please try again";
  }


