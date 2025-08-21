#!/usr/bin/env node

import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('🚀 Starting Lingo Challenge fullstack application...')

// Start backend
console.log('📡 Starting backend server...')
const backend = spawn('bun', ['run', 'backend:dev'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true,
})

// Start frontend
console.log('🎨 Starting frontend development server...')
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true,
})

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...')
  backend.kill('SIGINT')
  frontend.kill('SIGINT')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down servers...')
  backend.kill('SIGTERM')
  frontend.kill('SIGTERM')
  process.exit(0)
})

backend.on('exit', (code) => {
  if (code !== 0) {
    console.error(`❌ Backend exited with code ${code}`)
  }
})

frontend.on('exit', (code) => {
  if (code !== 0) {
    console.error(`❌ Frontend exited with code ${code}`)
  }
})
