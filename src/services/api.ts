//import axios
import axios from 'axios'

const Api = axios.create({
  //set default endpoint API
  baseURL: import.meta.env.VITE_PUBLIC_API
})

export const LocalApi = axios.create({
  //set default endpoint API
  baseURL: import.meta.env.VITE_LOCAL_API
})

export default Api
