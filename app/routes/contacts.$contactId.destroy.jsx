import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

export const action = async ({ request, params }) => {
  invariant(params.contactId, "Missing contactId param");
  const contactId = params.contactId;

  const requestUrl = new URL(request.url);
  const apiUrl = `${requestUrl.origin}/api/contacts/${contactId}`;
  try {
    const response = await fetch(apiUrl, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Response("Failed to fetch", { status: response.status });
    }

    // const data = await response.json();
    // return json(data);

    return redirect(`/`);
  } catch (error) {
    console.error("Fetch Error:", error);
    throw new Response("Network error", { status: 500 });
  }
};
