import React, { useEffect, useState } from 'react'
import ProductCard from '../components/productCard'
import axios from 'axios'
import { server } from '../App'
import PageIcon from '../components/pageIcon'
import { photoUrl } from './home'

const search = () => {
  const [range, setRange] = useState(100000)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('')
  const [products, setProducts] = useState([])
  const [pageArray, setPageArray] = useState([])
  const [page, setPage] = useState(1)
  const [categoriesArr,setCategoriesArr] = useState([])

  useEffect(() => {
    filteringFunction()
    allCategory()
  }, [search,range,category,sort,page])

  const filteringFunction = async () => {
    const filteredProducts = await axios.get(`${server}/products/all?search=${search}&price=${range}&category=${category}&sort=${sort}&page=${page}`)
    setProducts(filteredProducts.data.products)
    let pages = []
    for (let i = 1; i <= filteredProducts.data.totalPage; i++) {
      pages.push(i)
    }
    setPageArray(pages)
  }

  const allCategory = async () => {
    const categories = await axios.get(`${server}/products/all-categories`)
    if (categories) return setCategoriesArr(categories.data.allCategory)
  }

  return (
    <div>
      <aside className='flex flex-col w-72 gap-6 border border-black m-8 p-8 fixed
    '>
        <p className=' text-4xl font-thin'>Filters</p>
        <b className=' text-2xl'>Sort</b>
        <select name="pricesorting" className='
        border border-black rounded h-9' onChange={(e) => {
            setSort(e.target.value)
          }}>
          <option value="">None</option>
          <option value="asc">Price(Low to High)</option>
          <option value="dsc">Price(High to Low)</option>
        </select>
        <b className=' text-2xl'>Max Price:₹{range}</b>
        <input type="range" name="range" id="range" value={range} max={100000} onChange={(e) => {
          setRange(e.target.value)
        }} />
        <b className=' text-2xl'>Category</b>
        <select name="productSorting" id="" className=' border border-black rounded h-9' onChange={(e) => {
          setCategory(e.target.value)
        }}>
          <option value="">All</option>
        {
          categoriesArr.map((category,index)=>{
            return <option value={category} key={index}>{category}</option>
          })
        }
        </select>
      </aside>
      <br />
      <section className=' ml-96 mt-8 mr-4'>
        <p className=' text-4xl'>Products</p>
        <br />
        <input type="text" placeholder='Search...' className='border border-black w-96 h-10 text-xl pl-2 rounded' onChange={(e) => {
          setSearch(e.target.value)
        }
        } />
        <br />
        <br />
        <div className='flex flex-wrap'>
          {
            products.map((product) => {
              let imgLoc = String(product.photo).split('\\').pop()
              return (
                <ProductCard image={`${photoUrl}/uploads/${imgLoc}`} itemName={product.name} price={product.price} key={product._id} productId={product._id} />
              )
            })
          }
        </div>
        <div className='flex flex-row'>
          {
            pageArray.map((page) => {
              return <PageIcon page={page} key={page} onClick={()=>setPage(page)}/>
            })
          }
        </div>
      </section>
    </div>
  )
}
export default search
