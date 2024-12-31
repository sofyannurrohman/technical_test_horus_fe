import api from './api'
import type { Voucher } from '@/model/voucher'

const resource = '/vouchers'


export const getAllVouchers = async (): Promise<Voucher[]> => {
  const response = await api.get<Voucher[]>(resource)
  return response.data
}

export const createVoucher = async (voucher: Voucher): Promise<Voucher> => {
  const response = await api.post<Voucher>(resource, voucher)
  return response.data
}

export const getVoucherByID = async (id: string): Promise<Voucher> => {
  const response = await api.get<Voucher>(`${resource}/${id}`)
  return response.data
}


export const removeVoucher = async (id: string): Promise<any> => {
  const response = await api.delete(`${resource}/${id}`)
  return response
}

