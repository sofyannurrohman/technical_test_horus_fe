import type { VoucherClaim } from '@/model/voucher_claim'
import api from './api'

const resource = '/claim-vouchers'

export const getAllVoucherClaims = async (): Promise<VoucherClaim[]> => {
    const token = localStorage.getItem('token'); // Or use Vuex, depending on where you store the token

    if (!token) {
      throw new Error('No token found');
    }
    try {
    const response = await api.get('/claim-vouchers', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching voucher claims:', error);
    throw error;
  }
}

export const createVoucherClaim = async (
  voucherID: number,
  voucherClaim: VoucherClaim
): Promise<VoucherClaim> => {
  // Get the token from localStorage
  const token = localStorage.getItem('token')

  if (!token) {
    throw new Error('No token found. Please log in again.') // Optionally handle the error here
  }
  const response = await api.post<any>(`/vouchers/${voucherID}/claim-vouchers`, voucherClaim, {
    headers: {
      Authorization: `Bearer ${token}` // Attach the token in the Authorization header
    }
  })
  return response.data
}

export const removeVoucherClaim = async (id: number): Promise<any> => {
  const response = await api.delete(`${resource}/${id}`)
  return response
}
