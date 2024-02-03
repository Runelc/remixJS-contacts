import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, Form, useFetcher } from "@remix-run/react";
import invariant from "tiny-invariant";
import { useState } from "react";

export const loader = async ({ request, params }) => {
  invariant(params.contactId, "Missing contactId param");
  const contactId = params.contactId;
  const apiUrl = `${new URL(request.url).origin}/api/contacts/${contactId}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Response("Failed to fetch", { status: response.status });
    }
    const data = await response.json();
    return json(data);
  } catch (error) {
    console.error("Fetch Error:", error);
    throw new Response("Network error", { status: 500 });
  }
};

/* Action for the Favorite handling */
export const action = async ({ request, params }) => {
  invariant(params.contactId, "Missing contactId param");
  const contactId = params.contactId;
  const requestUrl = new URL(request.url);
  const apiUrl = `${requestUrl.origin}/api/contacts/${contactId}/favorite`;
  try {
    const response = await fetch(apiUrl, {
      method: "PUT",
    });

    if (!response.ok) {
      throw new Response("Failed to fetch", { status: response.status });
    }

    const data = await response.json();
    return json(data);
  } catch (error) {
    console.error("Fetch Error:", error);
    throw new Response("Network error", { status: 500 });
  }
};

export default function Contact() {
  const contact = useLoaderData();

  const Favorite = ({ contact }) => {
    const favorite = contact.favorite;

    return (
      <Form method="post" className="inline">
        <button
          className={`ml-2 px-4 py-2 text-sm font-semibold rounded-lg ${
            favorite ? "bg-red-500 text-white" : "bg-gray-200 text-gray-800"
          }`}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          name="favorite"
          value={favorite ? "false" : "true"}
        >
          {favorite ? "★" : "☆"}
        </button>
      </Form>
    );
  };

  return (
    <div
      id="contact"
      className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl max-h-64 mt-10"
    >
      <div className="md:flex">
        <div className="md:flex-shrink-0">
          <img
            className="h-48 w-full object-cover md:w-48"
            src={contact.avatar}
            alt={`${contact.first} ${contact.last} avatar`}
          />
        </div>
        <div className="p-8">
          <h1 className="block mt-1 text-lg leading-tight font-medium text-black">
            {contact.first || contact.last ? (
              <>
                {contact.first} {contact.last}
              </>
            ) : (
              <i>No Name</i>
            )}
            <Favorite contact={contact} />
          </h1>
          {contact.twitter && (
            <p className="mt-2 text-gray-500">
              Twitter:{" "}
              <a
                href={`https://twitter.com/${contact.twitter}`}
                className="text-blue-500"
              >
                {contact.twitter}
              </a>
            </p>
          )}
        </div>
      </div>

      <div className="px-8 py-4 bg-gray-100">
        <Form action="edit" className="inline">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Edit
          </button>
        </Form>

        <Form
          action="destroy"
          method="post"
          className="inline ml-4"
          onSubmit={(event) => {
            if (!confirm("Please confirm you want to delete this record.")) {
              event.preventDefault();
            }
          }}
        >
          <button
            type="submit"
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Delete
          </button>
        </Form>
      </div>
    </div>
  );
}
