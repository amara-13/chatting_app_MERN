function ProductForm({ formData, handleChange, handleSubmit, editingId }) {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 max-w-xl mx-auto mb-10 transition-all">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                    {editingId ? " Edit Product" : "Add New Product"}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {editingId
                        ? "Update the product details below"
                        : "Fill in the details to list a new product in your inventory"}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Product Name */}
                    <div>
                        <label className="block w-full  text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                            Product Name
                        </label>
                        <input
                            name="name"
                            type="text"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5  border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        />
                    </div>

                    <div>
                        <label className="block w-full text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                            Price ($)
                        </label>
                        <input
                            name="price"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div>
                        <label className="block w-full text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                            Stock Quantity
                        </label>
                        <input
                            name="stock"
                            type="number"
                            min="0"
                            placeholder="Stock"
                            value={formData.stock}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        />
                    </div>


                    {/* Category */}
                    <div>
                        <label className="block text-xs w-full text-left font-semibold text-slate-600 dark:text-slate-300 uppercase mb-1">
                            Category
                        </label>
                        <input
                            name="category"
                            type="text"
                            placeholder="Category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5  border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        />
                    </div>
                </div>
                {/* Description */}
                <div>
                    <label className="block text-xs w-full text-left font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                        Description
                    </label>
                    <textarea
                        name="description"
                        rows="3"
                        placeholder="Description.."
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className={`w-full py-3.5 px-6  font-semibold text-white shadow-md transition-all duration-200 transform active:scale-[0.98] ${editingId
                            ? "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-amber-500/25 hover:shadow-lg"
                            : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-indigo-500/25 hover:shadow-lg"
                        }`}
                >
                    {editingId ? "Update Product" : "+ Add Product"}
                </button>
            </form>
        </div>
    );
}

export default ProductForm;
