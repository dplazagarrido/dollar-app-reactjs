import axios from 'axios'
import { sbifApi } from './appisUrlConfig'

const appisSbif = axios.create({
  baseURL: sbifApi
})

export default appisSbif
