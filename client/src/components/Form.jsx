import React, { useEffect, useState } from "react";
import axios from "axios";
import FormSubmit from "./FormSubmit";
import "../App.css";

axios.defaults.baseURL = "http://localhost:8080";

function Form() {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
  });

  const [contactsList, setContactsList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertCreate, setAlertCreate] = useState(false);

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await axios.put(`/update/${currentId}`, formData);
      setIsEditing(false);
    } else {
      await axios.post("/create", formData);
    }
    setFormData({ name: "", phoneNumber: "", email: "" });
    getFetchData();

    setAlertCreate(true);
    setTimeout(() => {
      setAlertCreate(false);
    }, 3000);
  };

  const getFetchData = async () => {
    const response = await axios.get("/");
    setContactsList(response.data);
  };

  useEffect(() => {
    getFetchData();
  }, []);

  const handleDelete = async (id) => {
    await axios.delete(`/delete/${id}`);
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
    }, 3000); // Show alert for 3 seconds
    getFetchData();
  };

  const handleEdit = (contact) => {
    setFormData({
      name: contact.name,
      phoneNumber: contact.phoneNumber,
      email: contact.email,
    });
    setIsEditing(true);
    setCurrentId(contact._id);
  };

  return (
    <>
      {alertVisible && (
        <div
          class="fixed right-10 max-w-xs bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-neutral-800 dark:border-neutral-700"
          role="alert"
        >
          <div class="flex p-4">
            <div class="flex-shrink-0">
              <svg
                class="flex-shrink-0 size-4 text-red-500 mt-0.5"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"></path>
              </svg>
            </div>
            <div class="ms-3">
              <p class="text-sm text-gray-700 dark:text-neutral-400">
                Contact is deleted.
              </p>
            </div>
          </div>
        </div>
      )}
      {alertCreate && (
        <div
          class="fixed right-10 max-w-xs bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-neutral-800 dark:border-neutral-700"
          role="alert"
        >
          <div class="flex p-4">
            <div class="flex-shrink-0">
              <svg
                class="flex-shrink-0 size-4 text-teal-500 mt-0.5"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"></path>
              </svg>
            </div>
            <div class="ms-3">
              <p class="text-sm text-gray-700 dark:text-neutral-400">
                New Contact is created.
              </p>
            </div>
          </div>
        </div>
      )}

      <FormSubmit
        handleSubmit={handleSubmit}
        handleOnChange={handleOnChange}
        formData={formData}
        isEditing={isEditing}
      />

      <section className="text-gray-600 body-font">
        <div className="container px-5 mx-auto">
          <div className="flex flex-col text-center w-full mb-20">
            <h1 className="sm:text-4xl text-3xl font-medium title-font mb-2 text-gray-900">
              Contact List
            </h1>
          </div>
          <div className="lg:w-full w-full mx-auto overflow-auto">
            <table className="table-auto w-full text-left whitespace-no-wrap">
              <thead>
                <tr>
                  <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl">
                    Name
                  </th>
                  <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                    Phone Number
                  </th>
                  <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                    Email
                  </th>
                  <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"></th>
                </tr>
              </thead>
              <tbody>
                {contactsList.data && contactsList.data.length > 0 ? (
                  contactsList.data.map((contact) => (
                    <tr key={contact._id}>
                      <td className="border-t-2 border-gray-200 px-4 py-3">
                        {contact.name}
                      </td>
                      <td className="border-t-2 border-gray-200 px-4 py-3">
                        {contact.phoneNumber}
                      </td>
                      <td className="border-t-2 border-gray-200 px-4 py-3">
                        {contact.email}
                      </td>
                      <td>
                        <div className="border-t-2 border-gray-200 px-4 py-3">
                          <button
                            className="inline-flex text-white bg-yellow-500 border-0 py-2 px-6 focus:outline-none hover:bg-yellow-600 rounded text-lg"
                            onClick={() => handleEdit(contact)}
                          >
                            Edit
                          </button>
                          <button
                            className="ml-4 inline-flex text-white bg-red-600 border-0 py-2 px-6 focus:outline-none hover:bg-red-700 rounded text-lg"
                            onClick={() => handleDelete(contact._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="border-t-2 border-gray-200 px-4 py-3">
                      No Data Found in Contact List
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}

export default Form;
