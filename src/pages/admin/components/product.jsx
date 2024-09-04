import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { server } from '../../../App'
import { photoUrl } from '../../home'
import toast from 'react-hot-toast'
import { MdDelete } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

const product = () => {

  const [product, setProduct] = useState(true)
  const [all, setAll] = useState('bg-gray-700 text-white')
  const [add, setAdd] = useState('bg-white text-black')

  function allButtonHandler() {
    setAll('bg-gray-700 text-white')
    setAdd('bg-white text-black')
    setProduct(true)
  }

  function addButtonHandler() {
    setAll('bg-white text-black')
    setAdd('bg-gray-700 text-white')
    setProduct(false)
  }
  return (
    <div>
      <div className='text-4xl mb-2'>
        Products
      </div>
      <div className='mb-6'>
        <button className={`border ${all} p-2 rounded mr-2`} onClick={allButtonHandler}>All Products</button>
        <button className={`border ${add} p-2 rounded`} onClick={addButtonHandler}>Add Products</button>
      </div>
      {product ? <AllProducts /> : <AddProducts />}
    </div>
  )
}

const AddProducts = () => {

  const Navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    stock: JSON.stringify({ 'XS': 0, 'S': 0, 'M': 0, 'L': 0, 'XL': 0, 'XXL': 0 }),
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else if (name in JSON.parse(formData.stock)) {
      setFormData({ ...formData, stock: JSON.stringify({ ...JSON.parse(formData.stock), [name]: Number(value) }) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(JSON.parse(formData.stock)).every(value => value === 0)) {
      alert("Product should have atleast one stock...")
      return;
    }
    if (Object.values(JSON.parse(formData.stock)).find(value => value < 0)) {
      alert("Oops... Negative Stock...?");
      return;
    }
    if (formData.price < 0 ){
      alert("Price can't be negetive")
      return;
    }

    axios.postForm(`${server}/products/new`, formData, {
      withCredentials: true
    }).then(res => {
      toast.success(res.data.message)
    window.location.reload()
    })
      .catch(err => {
        console.log(err)
        toast.error(err.response.data.message)
      })
  };

  return (
    <form className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-md space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Price in ₹</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Stock</label>
        <div className="grid grid-cols-3 gap-4 mt-2">
          {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
            <div key={size}>
              <label className="block text-sm font-medium text-gray-700">{size}</label>
              <input
                type="number"
                name={size}
                value={formData.stock[size]}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Photo</label>
        <input
          type="file"
          name="photo"
          onChange={handleChange}
          className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
          accept="image/*"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
       >
        Submit
      </button>
    </form>
  )
}

const AllProducts = () => {

  const [allProducts, setAllProducts] = useState([])
  const [updateAllProducts,setUpdateAllProducts] = useState(false)

  async function deleteProductHandler(id) {
    const confirm = window.confirm("Do you want to delete this product?")
    if (confirm) {
      axios.delete(`${server}/products/${id}`, {
        withCredentials: true
      }).then(res => {
        toast.success(res.data.message)
        setUpdateAllProducts(!updateAllProducts)
      })
        .catch(err => toast.error(err.response.data.message))
    }
  }

  async function AllProductsFetch() {
    axios.get(`${server}/products/admin-products`, {
      withCredentials: true
    }).then((res) => {
      setAllProducts(res.data.adminProducts)
    }).catch((err) => console.log(err))
  }

  useEffect(() => {
    AllProductsFetch()
  }, [updateAllProducts])

  return (
    <div className='border rounded flex justify-center shadow-lg w-full'>
      <table>
        <thead>
          <tr>
            <th className='p-4'>Product Id</th>
            <th className='p-4'>Image</th>
            <th className='p-4'>Name</th>
            <th className='p-4'>Category</th>
            <th className='p-4'>Price</th>
            <th className='p-4'>Stock</th>
            <th className='p-4'>Delete</th>
          </tr>
        </thead>
        <tbody>
          {
            allProducts.map((product, index) => {
              let imgLoc = String(product.photo).split('\\').pop()
              let stocks = JSON.parse(product.stock)
              return (
                <tr key={index}>
                  <td className='p-4 text-center'>{product._id}</td>
                  <td className='p-4 text-center'><img src={`${photoUrl}/uploads/${imgLoc}`} alt={product.name} width={80} /></td>
                  <td className='p-4 text-center'>{product.name}</td>
                  <td className='p-4 text-center'>{product.category}</td>
                  <td className='p-4 text-center'>₹{product.price}</td>
                  <td className='p-4 text-center'>
                    <select>
                      <option>XS: {stocks.XS}</option>
                      <option>S: {stocks.S}</option>
                      <option>M:{stocks.M}</option>
                      <option>L: {stocks.L}</option>
                      <option>XL: {stocks.XL}</option>
                      <option>XXL: {stocks.XXL}</option>
                    </select>
                  </td>
                  <td className='flex justify-center p-5 mt-2'><MdDelete size={20} className='hover:text-red-600 cursor-pointer' onClick={() => deleteProductHandler(product._id)} /></td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )
}

export default product