import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";

export const action = async ({ params, request }) => {
  invariant(params.contactId, "Missing contactId param");
  const contactId = params.contactId;

  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  console.log(updates, "updates");

  const requestUrl = new URL(request.url);
  const apiUrl = `${requestUrl.origin}/api/contacts/${contactId}`;
  try {
    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Response("Failed to fetch", { status: response.status });
    }

    // const data = await response.json();
    // return json(data);

    return redirect(`/contacts/${params.contactId}`);
  } catch (error) {
    console.error("Fetch Error:", error);
    throw new Response("Network error", { status: 500 });
  }
};

export const loader = async ({ params }) => {
  invariant(params.contactId, "Missing contactId param");
  const contact = params.contactId;
  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ contact });
};

export default function EditContact() {
  const contact = useLoaderData();
  const navigate = useNavigate();

  return (
    <Form
      key={contact.id}
      id="contact-form"
      method="post"
      className="space-y-6 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
    >
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="first"
        >
          Name
        </label>
        <div className="flex gap-4">
          <input
            defaultValue={contact.first}
            aria-label="First name"
            name="first"
            type="text"
            placeholder="First"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <input
            aria-label="Last name"
            defaultValue={contact.last}
            name="last"
            placeholder="Last"
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="twitter"
        >
          Twitter
        </label>
        <input
          defaultValue={contact.twitter}
          name="twitter"
          placeholder="@jack"
          type="text"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-6">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="avatar"
        >
          Avatar URL
        </label>
        <input
          aria-label="Avatar URL"
          defaultValue={contact.avatar}
          name="avatar"
          placeholder="https://example.com/avatar.jpg"
          type="text"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Save
        </button>
        <button
          onClick={() => navigate(-1)}
          type="button"
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cancel
        </button>
      </div>
    </Form>
  );
}
