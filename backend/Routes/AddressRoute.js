import express from 'express'
import { deleteAddress, getAddress, setAddress } from '../Controller/AddressController.js';

const route = express.Router();

route.post('/setAddress',setAddress)
route.get('/getAddress/:userId',getAddress)
route.delete("/delete/:addressId", deleteAddress);

export default route;