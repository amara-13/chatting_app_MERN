function ProductList({ products, handleEdit, handleDelete }) {
   if(!products || products.length===0)
     {
    return (
      <div className="max-w-6xl mx-auto text-center py-16">

        <div className="text-5xl mb-3">
          📦
        </div>

        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">
          No Products Found
        </h3>

        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Add your first product using the form above.
        </p>

      </div>
    );
  }

  return (
    
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          Product List
        </h2>
        <span className="text-xs font-semibold px-3 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 rounded-full">
          Total: {products.length} items
        </span>
      </div>

      {/* Table Column Headers */}
      <div className="hidden md:grid grid-cols-12 gap-4  py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        <div className="col-span-2">Product</div>
        <div className="col-span-2">Category</div>
        <div className="col-span-2">Price</div>
        <div className="col-span-1">Stock</div>
        <div className="col-span-2">Description</div>
        <div className="col-span-3 text-center">Actions</div>
      </div>

      <div className="space-y-3">
        {products.map((product) => (
          <div
            key={product._id}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800  shadow-sm hover:shadow-md transition duration-200"
          >
            {/* Name */}
            <div className="col-span-2 font-semibold text-slate-900 dark:text-white">
              {product.name}
            </div>

            {/* Category */}
            <div className="col-span-2 text-sm text-slate-600 dark:text-slate-300">
              <span className="px-2.5 py-1 text-xs  ">
                {product.category}
              </span>
            </div>

            {/* Price */}
            <div className="col-span-2 font-sm text-slate-600 dark:text-slate-300 text-sm">
              {Number(product.price).toFixed(2)}
            </div>

            {/* Stock */}
            <div className="col-span-1 text-sm text-slate-600 dark:text-slate-300">
              {product.stock}
            </div>

            {/* Description */}
            <div className="col-span-2 text-sm text-slate-500 dark:text-slate-400 truncate">
              {product.description || "No description"}
            </div>

            {/* Actions */}
            <div className="col-span-3 flex justify-center gap-2">
              <button
                onClick={() => handleEdit(product)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        
      </div>
    </div>
  );
}


export default ProductList;
