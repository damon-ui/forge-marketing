/* ========================================
   FORGE Marketing Site - JavaScript
   ======================================== */

// Supabase configuration
const SUPABASE_URL = 'https://fcvsadmwtdfvapdmpcsv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjdnNhZG13dGRmdmFwZG1wY3N2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NzU4NDcsImV4cCI6MjA4MDM1MTg0N30.XOGN7LQmVksy1BheoBRJ8LvtNoEBAww4wnbewHwJu7o';

// Initialize Supabase client
let supabaseClient = null;

async function initSupabase() {
  if (supabaseClient) return supabaseClient;
  
  // Dynamically load Supabase if not already available
  if (typeof window.supabase === 'undefined') {
    await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js');
  }
  
  // The UMD build exposes supabase.createClient
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return supabaseClient;
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Waitlist form handling
async function handleWaitlistSubmit(event) {
  event.preventDefault();
  
  const emailInput = document.getElementById('waitlist-email');
  const messageEl = document.getElementById('waitlist-message');
  const submitBtn = event.target.querySelector('button[type="submit"]');
  
  const email = emailInput.value.trim();
  
  if (!email) {
    showMessage(messageEl, 'Please enter your email address.', 'error');
    return;
  }
  
  // Disable button while submitting
  submitBtn.disabled = true;
  submitBtn.textContent = 'Joining...';
  
  try {
    // Ensure Supabase is initialized
    const sb = await initSupabase();
    
    // Insert into waitlist table (no .select() since we don't have a SELECT policy)
    const { error } = await sb
      .from('waitlist')
      .insert([{ email }]);
    
    if (error) {
      // Check for duplicate email
      if (error.code === '23505') {
        showMessage(messageEl, "You're already on the list! We'll be in touch soon.", 'success');
      } else {
        console.error('Waitlist error:', error);
        showMessage(messageEl, 'Something went wrong. Please try again.', 'error');
      }
    } else {
      showMessage(messageEl, "You're in! We'll notify you when we launch.", 'success');
      emailInput.value = '';
    }
  } catch (err) {
    console.error('Waitlist error:', err);
    showMessage(messageEl, 'Something went wrong. Please try again.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Join Waitlist';
  }
}

function showMessage(element, message, type) {
  element.textContent = message;
  element.className = 'waitlist-message ' + type;
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = document.querySelector('.nav').offsetHeight;
        const targetPosition = target.offsetTop - navHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Set up waitlist form
  const waitlistForm = document.getElementById('waitlist-form');
  if (waitlistForm) {
    waitlistForm.addEventListener('submit', handleWaitlistSubmit);
  }
  
  // Set up smooth scrolling
  initSmoothScroll();
});
