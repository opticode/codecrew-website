<template>
  <form
    @submit.prevent="handleSubmit"
    class="space-y-5"
    novalidate
  >
    <div>
      <label for="name" class="block text-sm mb-2 text-[#e8e8ed]" style="font-family: 'Syne Variable', sans-serif; font-size: 0.7rem; letter-spacing: 0.08em;">
        Name
      </label>
      <input
        id="name"
        v-model="form.name"
        type="text"
        required
        class="w-full px-4 py-3 rounded-lg bg-[#12121a] border text-[#e8e8ed] placeholder-[#6b7280] text-sm focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff]/30 transition-colors"
        :class="errors.name ? 'border-red-500' : 'border-white/10'"
        placeholder="Your name"
      />
      <p v-if="errors.name" class="text-red-400 text-xs mt-1">{{ errors.name }}</p>
    </div>

    <div>
      <label for="email" class="block text-sm mb-2 text-[#e8e8ed]" style="font-family: 'Syne Variable', sans-serif; font-size: 0.7rem; letter-spacing: 0.08em;">
        Email
      </label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        required
        class="w-full px-4 py-3 rounded-lg bg-[#12121a] border text-[#e8e8ed] placeholder-[#6b7280] text-sm focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff]/30 transition-colors"
        :class="errors.email ? 'border-red-500' : 'border-white/10'"
        placeholder="your@email.com"
      />
      <p v-if="errors.email" class="text-red-400 text-xs mt-1">{{ errors.email }}</p>
    </div>

    <div>
      <label for="message" class="block text-sm mb-2 text-[#e8e8ed]" style="font-family: 'Syne Variable', sans-serif; font-size: 0.7rem; letter-spacing: 0.08em;">
        Message
      </label>
      <textarea
        id="message"
        v-model="form.message"
        required
        rows="5"
        class="w-full px-4 py-3 rounded-lg bg-[#12121a] border text-[#e8e8ed] placeholder-[#6b7280] text-sm focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff]/30 transition-colors resize-none"
        :class="errors.message ? 'border-red-500' : 'border-white/10'"
        placeholder="Tell us about your project..."
      />
      <p v-if="errors.message" class="text-red-400 text-xs mt-1">{{ errors.message }}</p>
    </div>

    <button
      type="submit"
      :disabled="submitting"
      class="w-full py-3 px-6 rounded-lg bg-[#00e5ff] text-[#0a0a0f] font-medium text-sm tracking-wider transition-all hover:bg-[#33ebff] hover:shadow-[0_0_24px_rgba(0,229,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
      style="font-family: 'Syne Variable', sans-serif; font-size: 0.8rem;"
    >
      {{ submitting ? 'Sending...' : 'Send Message' }}
    </button>

    <p v-if="success" class="text-green-400 text-sm text-center">
      Thanks for reaching out! We'll get back to you soon.
    </p>
    <p v-if="submitError" class="text-red-400 text-sm text-center">
      {{ submitError }}
    </p>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

const form = reactive({ name: '', email: '', message: '' });
const errors = reactive({ name: '', email: '', message: '' });
const submitting = ref(false);
const success = ref(false);
const submitError = ref('');

function validate(): boolean {
  let valid = true;
  errors.name = '';
  errors.email = '';
  errors.message = '';

  if (!form.name.trim()) {
    errors.name = 'Name is required';
    valid = false;
  }
  if (!form.email.trim()) {
    errors.email = 'Email is required';
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email';
    valid = false;
  }
  if (!form.message.trim()) {
    errors.message = 'Message is required';
    valid = false;
  }

  return valid;
}

async function handleSubmit() {
  if (!validate()) return;

  submitting.value = true;
  success.value = false;
  submitError.value = '';

  try {
    const res = await fetch('https://formspree.io/f/xjgernqa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        message: form.message,
      }),
    });

    if (res.ok) {
      success.value = true;
      form.name = '';
      form.email = '';
      form.message = '';
    } else {
      submitError.value = 'Something went wrong. Please try emailing us directly.';
    }
  } catch {
    submitError.value = 'Network error. Please try again later.';
  } finally {
    submitting.value = false;
  }
}
</script>
