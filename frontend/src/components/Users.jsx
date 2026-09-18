import { useState } from "react";

function AllUsers({allUsers}) {
 
  const [search, setSearch] = useState("");

  const filteredUsers = allUsers.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto w-full max-w-3xl px-4">

        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Find People
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Search for people and send them a friend request.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
              />
            </svg>
          </span>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Users Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between border-b border-gray-100 px-5 py-4 last:border-b-0"
              >
                {/* User Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />

                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {user.name}
                    </h2>

                    <p className="text-sm text-gray-500">
                      {user.username}
                    </p>
                  </div>
                </div>
               <button
  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
>
  Send Request
</button>
              </div>
            ))
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500">
                No users found.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default AllUsers;