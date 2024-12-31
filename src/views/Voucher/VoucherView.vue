<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AlertSuccess from '@/components/Alerts/AlertSuccess.vue'
import { getAllVouchers } from '@/http/voucher'
import { createVoucherClaim, getAllVoucherClaims } from '@/http/voucher_claim'
import type { VoucherClaim } from '@/model/voucher_claim'
import { jwtDecode } from 'jwt-decode'
import type { Voucher } from '@/model/voucher'

// Page states
const error = ref<string | null>(null)
const isLoading = ref(true)
const showAlert = ref(false)
const successMessage = ref<string>(''); // Success message
const errorMessage = ref<string>(''); // Error message
const alertMessage = ref('')

// Table data
const voucherData = ref<Voucher[]>([])
const filteredVouchers = ref<Voucher[]>([])
  const claimedVouchers = ref<Set<string>>(new Set()) // A Set to store claimed voucher IDs

const user_id = ref<string>('')
const baseImageUrl = 'http://localhost:8000/' // Replace with your actual base URL
const selectedCategory = ref<string>('') // Category selected by the user
const availableCategories = ref<string[]>([]) // Dynamically populate categories

// Function to extract user_id from the JWT token
const extractUserId = () => {
  try {
    const token = localStorage.getItem('token') // Or use cookies/session storage
    if (token) {
      const decodedToken: JwtPayload = jwtDecode(token)
      user_id.value = decodedToken.sub // Adjust to match the user ID field in your JWT payload
    } else {
      throw new Error('No token found')
    }
  } catch (error) {
    console.error('Failed to decode token:', error)
    errorMessage.value = 'Failed to retrieve user information. Please log in again.'
  }
}

// Fetching vouchers with user names
const fetchVouchers = async () => {
  try {
    const response = await getAllVouchers()
    voucherData.value = response.data
    const claimedResponse = await getAllVoucherClaims()
    const claimedData = claimedResponse.data
    console.log(claimedData)
    claimedVouchers.value = new Set(claimedData.map(claim => claim.VoucherID.toString())) // Store claimed voucher IDs in a Set

    // Filter out claimed vouchers from the available vouchers
    filteredVouchers.value = voucherData.value.filter(voucher => !claimedVouchers.value.has(voucher.id.toString()))

    availableCategories.value = Array.from(new Set(response.data.map(voucher => voucher.category)))
  } catch (err) {
    console.error('Error fetching vouchers:', err)
    error.value = 'Network Error'
  } finally {
    isLoading.value = false
  }
}

const filterVouchers = () => {
  if (selectedCategory.value) {
    // Filter vouchers based on selected category and exclude claimed vouchers
    filteredVouchers.value = voucherData.value.filter(voucher =>
      voucher.category === selectedCategory.value && !claimedVouchers.value.has(voucher.id.toString())
    )
  } else {
    // Show all vouchers excluding claimed ones if no category is selected
    filteredVouchers.value = voucherData.value.filter(voucher => 
      !claimedVouchers.value.has(voucher.id.toString())
    )
  }
}

// Claim voucher
const claimVoucher = async (voucherID: string) => {
  const voucherClaim: VoucherClaim = { user_id: user_id.value, voucher_id: Number(voucherID) } // Replace with actual claim data if needed
  try {
    const result = await createVoucherClaim(Number(voucherID), voucherClaim)
    successMessage.value = `Successfully claimed voucher`
    alertMessage.value = successMessage.value
    showAlert.value = true
    
    // Add the claimed voucher ID to the claimedVouchers set to prevent it from showing again
    claimedVouchers.value.add(voucherID)

    // Immediately remove the claimed voucher from the voucherData list
    voucherData.value = voucherData.value.filter((voucher) => voucher.id !== Number(voucherID))

    // Reapply the filtering to update the displayed vouchers
    filterVouchers()  // Ensure this re-applies the category filter and removes claimed vouchers from the display

  } catch (error) {
    console.error('Failed to claim voucher:', error)
    errorMessage.value = 'Failed to claim the voucher. Please try again.'
  }
}


// Fetch data on component mount
onMounted(() => {
  extractUserId()
  fetchVouchers()
})
</script>

<template>
  <DefaultLayout>
    <!-- Alerts -->
    <AlertSuccess v-if="showAlert" :message="alertMessage" class="mb-4" />

    <div v-if="error" class="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
      {{ error }}
      <button @click="fetchVouchers" class="ml-2 text-sm underline hover:no-underline">
        Try again
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center p-8">
      <div class="animate-spin rounded-full h-8 w-8 bWallet-b-2 bWallet-gray-900"></div>
    </div>

    <!-- Filter by Category -->
    <div class="mb-4">
      <label for="category" class="block text-gray-700 dark:text-gray-200">Filter by Category:</label>
      <select
        id="category"
        v-model="selectedCategory"
        @change="filterVouchers"
        class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-gray-200"
      >
        <option value="">All Categories</option>
        <option v-for="category in availableCategories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </div>

    <!-- Voucher List -->
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="voucher in filteredVouchers"
          :key="voucher.id"
          class="bg-white dark:bg-boxdark rounded-lg shadow-lg overflow-hidden"
        >
          <!-- Image -->
          <img
            :src="`${baseImageUrl}${voucher.foto}`"
            alt="Voucher Image"
            class="w-full h-48 object-cover"
          />
          <!-- Content -->
          <div class="p-4 flex flex-col">
            <div class="flex justify-between items-center">
              <div class="flex flex-col">
                <p class="text-lg font-semibold text-gray-800">{{ voucher.name }}</p>
                <p class="text-sm text-gray-600">{{ voucher.category }}</p>
              </div>
              <button
                @click="claimVoucher(String(voucher.id))"
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring"
              >
                Claim
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
  </DefaultLayout>
</template>
