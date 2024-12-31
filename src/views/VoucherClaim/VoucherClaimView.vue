<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AlertSuccess from '@/components/Alerts/AlertSuccess.vue'
import { getVoucherByID } from '@/http/voucher'
import { getAllVoucherClaims, removeVoucherClaim } from '@/http/voucher_claim'
import type { VoucherClaim } from '@/model/voucher_claim'

// Page states
const error = ref<string | null>(null)
const isLoading = ref(true)
const showAlert = ref(false)
const alertMessage = ref('')
const voucherClaimData = ref<VoucherClaim[]>([])

// Fetching voucher claims and associated voucher details
const fetchVoucherClaim = async () => {
  try {
    const response = await getAllVoucherClaims()
    const claimVouchers = Array.isArray(response.data) ? response.data : [response.data] // Ensure it's an array

   
    const vouchersWithDetails = await Promise.all(
      claimVouchers.map(async (voucherClaim: VoucherClaim, index: number) => {
        const voucher = await getVoucherByID(voucherClaim.VoucherID) // Access VoucherID from the claim
        return {
          ...voucherClaim,
          voucher_name: voucher.data.name, // Fetch voucher name
          voucher_image: `http://localhost:8000/${voucher.data.foto}`, // Fetch voucher image
          index: index + 1, // Add index for display
          action: 'Delete', // Add the delete action for each row
        }
      })
    )
    voucherClaimData.value = vouchersWithDetails
    console.log(voucherClaimData.value)  // Log the array of voucher claims

  } catch (err) {
    console.error('Error fetching voucher claims:', err)
    error.value = 'Network Error'
  } finally {
    isLoading.value = false
  }
}

// Handle delete action
const handleDeleteVoucherClaim = async (voucherId: number) => {
  try {
    await removeVoucherClaim(voucherId) // Delete voucher claim by ID
    alertMessage.value = 'Voucher claim successfully deleted'
    showAlert.value = true
    // Refresh data after deletion
    await fetchVoucherClaim()
  } catch (err) {
    console.error('Error deleting voucher claim:', err)
    error.value = 'Failed to delete voucher claim'
  }
}

// Handle image error and fallback
const handleImageError = (row: any) => {
  row.voucher_image = 'http://localhost:8000/images/default-placeholder.png'; // Fallback image URL
}

// Fetch data when the component is mounted
onMounted(fetchVoucherClaim)

// Define the routes for create, edit, delete actions
</script>

<template>
  <DefaultLayout>
    <!-- Alerts -->
    <AlertSuccess v-if="showAlert" :message="alertMessage" class="mb-4" />

    <!-- Error Message -->
    <div v-if="error" class="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
      {{ error }}
      <button @click="fetchVoucherClaim" class="ml-2 text-sm underline hover:no-underline">
        Try again
      </button>
    </div>

    <!-- Loading Spinner -->
    <div v-if="isLoading" class="flex justify-center items-center p-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>

    <!-- Data Table -->
    <div v-else class="flex flex-col gap-10">
      <table class="min-w-full table-auto border-collapse">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-2 text-left">No.</th>
            <th class="px-4 py-2 text-left">Image</th>
            <th class="px-4 py-2 text-left">Voucher Name</th>
            <th class="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in voucherClaimData" :key="row.index" class="border-b">
            <td class="px-4 py-2">{{ row.index }}</td>
            <td class="px-4 py-2">
              <img 
                :src="row.voucher_image" 
                alt="Voucher Image" 
                class="w-12 h-12 rounded-md" 
                @error="handleImageError(row)" />
            </td>
            <td class="px-4 py-2">{{ row.voucher_name }}</td>
            <td class="px-4 py-2">
              <button 
                @click="handleDeleteVoucherClaim(row.ID)" 
                class="text-red-500 hover:underline">
                {{ row.action }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </DefaultLayout>
</template>

<style scoped>
/* Add any custom styling for the table here */
table {
  width: 100%;
  border-spacing: 0;
}

th, td {
  padding: 10px;
  border: 1px solid #ddd;
}

th {
  background-color: #f9fafb;
  text-align: left;
}

tr:hover {
  background-color: #f1f5f9;
}

button {
  cursor: pointer;
}
</style>
