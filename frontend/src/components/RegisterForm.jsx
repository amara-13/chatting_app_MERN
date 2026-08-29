import { Link } from "react-router-dom";
function RegisterForm({ handleSubmit, loading, handleChange, formData, errors = {} }) {

    return (
        <div className="bg-gradient-to-r from-green-300 via-blue-200 to-sky-300  min-h-screen w-full py-5 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800">
                        Create Account
                    </h2>
                    <p className="text-gray-500">
                        Register Your Account to get started
                    </p>

                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="text-left w-full block text-sm font-medium text-gray-700  mb-2">
                            Full Name
                        </label>
                        <input type="text"
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleChange}
                            // className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" 
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.name ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-sky-500"
                                }`} />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}

                    </div>
                    {/* email */}
                    <div>
                        <label htmlFor="email" className="text-left w-full block text-sm font-medium text-gray-700  mb-2">
                            Email
                        </label>
                        <input type="email"
                            name="email"
                            placeholder="Enter Your Email"
                            value={formData.email}
                            onChange={handleChange}
                            // className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" 
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.email ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-sky-500"
                                }`}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}

                    </div>
                    {/* passowrd */}
                    {/* Name */}
                    <div>
                        <label htmlFor="password" className="text-left w-full block text-sm font-medium text-gray-700  mb-2">
                            Password
                        </label>
                        <input type="password"
                            name="password"
                            placeholder="Enter your Password"
                            value={formData.password}
                            onChange={handleChange}
                            // className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.password ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-sky-500"
                                }`}
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}

                    </div>
                    {/* confirm Password*/}
                    <div>
                        <label className="block w-full text-left text-sm font-medium text-gray-700 mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmpassword"
                            placeholder="Confirm your password"
                            value={formData.confirmpassword}
                            onChange={handleChange}
                            // className="w-full px-4 py-2 border border-gray-300 
                            // focus:outline-none focus:ring-2 focus:ring-sky-500 
                            // focus:border-transparent"
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.confirmpassword ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-sky-500"
                                }`}
                        />
                        {errors.confirmpassword && <p className="text-red-500 text-xs mt-1">{errors.confirmpassword}</p>}

                    </div>
                    {/* submit button */}

                    <button disabled={loading} type="submit" className="w-full bg-sky-600 text-white py-2 font-semibold hover:bg-sky-700 transition duration-200 shadow-md hover:shadow-lg">
                        {loading ? "Loading" : "Register"}</button>

                </form>
                <p className=" text-center py-4  text-gray-500 mt-6">
                    Already have any account? {"  "}
                    <Link to="/login" className="text-red-100  font-semibold hover:underline">
                        Login
                    </Link>
                    {" "}
                    here
                </p>
            </div>

        </div>

    );

}
export default RegisterForm;