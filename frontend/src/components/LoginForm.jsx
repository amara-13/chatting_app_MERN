import { Link } from "react-router-dom";
function LoginForm({ handleSubmit, handleChange, formData, loading, errors = {} }) {
    return (
        <div className="bg-gradient-to-r from-green-300 via-blue-200 to-sky-300  min-h-screen w-full py-5 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800">
                        Login Here
                    </h2>
                    <p className="text-gray-500">
                        Please enter a valid Email and Password
                    </p>

                </div>
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* email */}
                    <div>
                        <label htmlFor="email" className="text-left w-full block text-sm font-medium text-gray-700  mb-2">
                            Email
                        </label>
                        <input type="email"
                            name="email"
                            placeholder="Enter Your Email"
                            onChange={handleChange}
                            value={formData.email}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.email ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-sky-500"}`}
                        // className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" 
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}

                    </div>
                    {/* passowrd */}
                    <div>
                        <label htmlFor="password" className="text-left w-full block text-sm font-medium text-gray-700  mb-2">
                            Password
                        </label>
                        <input type="password"
                            name="password"
                            onChange={handleChange}
                            value={formData.password}
                            placeholder="Enter your Password"
                            // className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.password ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-sky-500"
                                }`}

                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}

                    </div>
                    {/* submit button */}
                    <button disabled={loading} type="submit" className="w-full bg-sky-600 text-white py-2 font-semibold hover:bg-sky-700 transition duration-200 shadow-md hover:shadow-lg">
                        Login</button>
                        <Link to = "/forgot-password" className="text-sm text-emerald-600 hover:underline">
                        Forgot Password? 
                        </Link>

                </form>
                <p className=" text-center py-4  text-gray-500 mt-6">
                    Don't have an account? {"  "}
                    <Link to="/register" className="text-red-100  font-semibold hover:underline">
                        Signup
                    </Link>
                    {" "}
                    here
                </p>
            </div>

        </div>

    );

}
export default LoginForm;