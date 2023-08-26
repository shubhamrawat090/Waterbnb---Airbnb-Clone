import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Perks from "../Perks";
import axios from "axios";

export default function PlacesPage() {
  const { action } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [photoLink, setPhotoLink] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState([]);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);

  function inputHeader(text) {
    return <h2 className="text-2xl mt-4">{text}</h2>;
  }

  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }

  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  async function addPhotoByLink(ev) {
    ev.preventDefault();

    // If no link is pasted then just return
    if (!photoLink || !photoLink.trim()) {
      return;
    }

    const { data: fileName } = await axios.post("/upload-by-link", {
      link: photoLink,
    });
    setAddedPhotos((prev) => {
      return [...prev, fileName];
    });

    // Reset the link
    setPhotoLink("");
  }

  function uploadPhoto(ev) {
    const files = ev.target.files;

    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }

    axios
      .post("/upload", data, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then((response) => {
        const { data: fileNames } = response;
        setAddedPhotos((prev) => {
          return [...prev, ...fileNames];
        });
      });
  }

  return (
    <div>
      {/* If the route has "new" => we will show button to add new places */}
      {action !== "new" && (
        <div className="text-center">
          <Link
            className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
            to={"/account/places/new"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Add new place
          </Link>
        </div>
      )}

      {/* If the route has new then we show the form to add new places */}
      {action === "new" && (
        <div>
          <form>
            {/* Title */}
            {preInput(
              "Title",
              "Title for your place. Keep it short and catchy."
            )}
            <input
              type="text"
              value={title}
              onChange={(ev) => setTitle(ev.target.value)}
              placeholder="title, for example: My lovely apt"
            />

            {/* Address */}
            {preInput("Address", "Address to this place.")}
            <input
              type="text"
              value={address}
              onChange={(ev) => setAddress(ev.target.value)}
              placeholder="address, for example: 221B, Baker Street, London"
            />

            {/* Photos */}
            {preInput("Photos", "The more, the better.")}
            <div className="flex gap-2">
              <input
                type="text"
                value={photoLink}
                onChange={(ev) => setPhotoLink(ev.target.value)}
                placeholder="Add using a link ......jpg"
              />
              {/* &nbsp; is no-breaking space character */}
              <button
                onClick={addPhotoByLink}
                className="bg-gray-200 px-4 rounded-2xl"
              >
                Add&nbsp;photo
              </button>
            </div>

            <div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {/* Display the added photos */}
              {addedPhotos.length > 0 &&
                addedPhotos.map((link, index) => (
                  <div className="h-32 flex" key={index}>
                    <img
                      className="rounded-2xl w-full object-cover"
                      src={`http://localhost:4000/uploads/${link}`}
                      alt={link}
                    />
                  </div>
                ))}

              <label className="h-32 flex gap-1 justify-center items-center border bg-transparent rounded-2xl p-2 text-2xl text-gray-600 cursor-pointer">
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={uploadPhoto}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                  />
                </svg>
                Upload
              </label>
            </div>

            {/* Description */}
            {preInput("Description", "Description of the place.")}
            <textarea
              value={description}
              onChange={(ev) => setDescription(ev.target.value)}
            />

            {/* Perks */}
            {preInput("Perks", "Select all the perks of your place.")}
            <div className="mt-2 grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              <Perks selected={perks} onChange={setPerks} />
            </div>

            {/* Extra info */}
            {preInput("Extra info", "House rules, etc.")}
            <textarea
              value={extraInfo}
              onChange={(ev) => setExtraInfo(ev.target.value)}
            />

            {/* Check in/out times */}
            {preInput(
              "Check in&out times",
              "Add check in and out times, remember to have some time window for cleaning the room between guests."
            )}
            <div className="grid gap-2 sm:grid-cols-3">
              <div>
                <h3 className="mt-2 -mb-1">Check in time</h3>
                <input
                  type="text"
                  placeholder="2:00 pm"
                  value={checkIn}
                  onChange={(ev) => setCheckIn(ev.target.value)}
                />
              </div>
              <div>
                <h3 className="mt-2 -mb-1">Check out time</h3>
                <input
                  type="text"
                  placeholder="11:00 pm"
                  value={checkOut}
                  onChange={(ev) => setCheckOut(ev.target.value)}
                />
              </div>
              <div>
                <h3 className="mt-2 -mb-1">Max number of guests</h3>
                <input
                  type="number"
                  value={maxGuests}
                  onChange={(ev) => setMaxGuests(ev.target.value)}
                />
              </div>
            </div>

            {/* Save Button */}
            <button className="primary my-4">Save</button>
          </form>
        </div>
      )}
    </div>
  );
}
