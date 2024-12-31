<script setup lang="ts">
import DefaultAuthCard from '@/components/Auths/DefaultAuthCard.vue'
import InputGroup from '@/components/Auths/InputGroup.vue'
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const pageTitle = ref('Sign In')
const username = ref('')
const password = ref('')
const errorMessage = ref('')
const usernameError = ref('')
const passwordError = ref('')
const router = useRouter()

const validateForm = () => {
  let isValid = true
  // Clear previous errors
  usernameError.value = ''
  passwordError.value = ''

  // Username validation
  if (!username.value.trim()) {
    usernameError.value = 'Username is required.'
    isValid = false
  }

  // Password validation
  if (!password.value.trim()) {
    passwordError.value = 'Password is required.'
    isValid = false
  }

  return isValid
}

const handleSubmit = async (e: Event) => {
  e.preventDefault()

  // Validate form before submitting
  if (!validateForm()) {
    return // Stop if validation fails
  }

  try {
    console.log(`${username.value},${password.value}`)
    const response = await axios.post(
      'http://localhost:8000/api/v1/sessions',
      {
        username: String(username.value),
        password: String(password.value)
      },
      {
        headers: {
          'Content-Type': 'application/json' // Explicitly set Content-Type
        }
      }
    )

    const { token, name } = response.data.data

    // Store token in localStorage
    localStorage.setItem('token', token)

    // Redirect to dashboard
    router.push('/dashboard')
  } catch (error: any) {
    errorMessage.value = error.response?.data?.meta?.message || 'Login failed'
  }
}
</script>


<template>
  <div class="h-screen">
    <DefaultAuthCard subtitle="Start for free" title="Sign In to Access">
      <form @submit="handleSubmit">
        <InputGroup
          label="Username"
          type="text"
          placeholder="Enter your username"
          v-model="username"
          :error="usernameError"
        />
        <p v-if="usernameError" class="text-red-500 text-sm">{{ usernameError }}</p>

        <InputGroup
          label="Password"
          type="password"
          placeholder="Enter your password"
          v-model="password"
          :error="passwordError"
        />
        <p v-if="passwordError" class="text-red-500 text-sm">{{ passwordError }}</p>

        <div class="mb-5 mt-6">
          <input
            type="submit"
            value="Sign In"
            class="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
          />
        </div>
        <div class="mt-6 text-center">
          <p class="font-medium">
            Doesn't have an account?
            <router-link to="/auth/signup" class="text-primary">Sign up</router-link>
          </p>
        </div>
        <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
      </form>
    </DefaultAuthCard>
  </div>
</template>
