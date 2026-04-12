// SeekhoWithRua Quizzes Authentication Handler
// Uses shared COSMOS_AUTH from cosmos-auth.js

const TOKEN_KEY = COSMOS_AUTH.TOKEN_KEY;
const USER_KEY = COSMOS_AUTH.USER_KEY;
const QUIZ_PROGRESS_KEY = 'quizes_progress';

// Check if user is authenticated
function checkAuth() {
  return COSMOS_AUTH.isAuthenticated();
}

// Get current user
function getCurrentUser() {
  return COSMOS_AUTH.getUser();
}

// Get auth token
function getToken() {
  return COSMOS_AUTH.getToken();
}

// Get user's display name
function getUserDisplayName() {
  const user = getCurrentUser();
  if (!user) return null;
  return user.first_name || user.username || user.name || user.email?.split('@')[0] || 'User';
}

// Get user's avatar URL
function getUserAvatar() {
  const user = getCurrentUser();
  if (!user) return null;
  if (user.profile_picture || user.picture || user.avatar) {
    return user.profile_picture || user.picture || user.avatar;
  }
  const email = user.email || 'user';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=7c3aed&color=fff`;
}

// Show visual lock overlay
function showLoginRequiredModal(message = 'Please login to take this quiz') {
  const existingModal = document.getElementById('loginRequiredModal');
  if (existingModal) existingModal.remove();

  const modal = document.createElement('div');
  modal.id = 'loginRequiredModal';
  modal.innerHTML = `
    <div style="
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(4, 4, 15, 0.96);
      backdrop-filter: blur(12px);
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      z-index: 9999;
      font-family: 'Orbitron', sans-serif;
    ">
      <div style="
        width: 110px; height: 110px;
        border: 3px solid #7c3aed; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-size: 56px; margin-bottom: 28px;
        animation: lockPulse 2s ease-in-out infinite;
      ">📝</div>
      <h2 style="color:#fff;font-size:24px;margin:0 0 12px;text-align:center;">Quiz Locked</h2>
      <p style="color:rgba(255,255,255,0.55);font-size:14px;margin:0 0 28px;text-align:center;max-width:380px;line-height:1.6;">
        ${message}
      </p>
      <a href="https://app.seekhowithrua.com/login?redirect=${encodeURIComponent(window.location.href)}"
         style="padding:14px 40px;background:linear-gradient(135deg,#7c3aed,#00d4ff);
                color:#fff;text-decoration:none;border-radius:30px;font-weight:700;font-size:15px;
                box-shadow:0 8px 30px rgba(124,58,237,0.5);">
        🔐 Login to Start
      </a>
      <a href="index.html"
         style="margin-top:16px;color:rgba(255,255,255,0.4);font-size:13px;
                text-decoration:none;font-family:'Inter',sans-serif;">
        ← Back to Quizzes
      </a>
      <style>
        @keyframes lockPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(124,58,237,0.5); }
          50%      { box-shadow: 0 0 0 18px rgba(124,58,237,0); }
        }
      </style>
    </div>
  `;
  document.body.appendChild(modal);
}

// Close login modal
function closeLoginModal() {
  const modal = document.getElementById('loginRequiredModal');
  if (modal) modal.remove();
}

// Logout
function logout() {
  COSMOS_AUTH.logout();
}

// Redirect to main app login
function redirectToLogin() {
  COSMOS_AUTH.redirectToLogin(window.location.href);
}

// Update UI based on auth state
function updateAuthUI() {
  const isLoggedIn = checkAuth();
  const userSection = document.getElementById('userSection');
  if (!userSection) return;

  if (isLoggedIn) {
    const displayName = getUserDisplayName();
    const avatar = getUserAvatar();
    userSection.innerHTML = `
      <div class="user-info" style="
        display: flex; align-items: center; gap: 10px;
        background: rgba(124,58,237,0.1);
        border: 1px solid rgba(124,58,237,0.3);
        padding: 8px 15px; border-radius: 25px;
      ">
        <img src="${avatar}" alt="User" style="
          width:32px;height:32px;border-radius:50%;
          object-fit:cover;border:2px solid #7c3aed;">
        <span style="font-size:13px;color:#fff;font-weight:500;">${displayName}</span>
        <button onclick="window.quizAuth.logout()" style="
          background:rgba(239,68,68,0.2);border:none;color:#ef4444;
          padding:6px 12px;border-radius:15px;font-size:12px;cursor:pointer;">
          Logout
        </button>
      </div>
    `;
  } else {
    userSection.innerHTML = `
      <a href="https://app.seekhowithrua.com/login?redirect=${encodeURIComponent(window.location.href)}"
         style="background:linear-gradient(135deg,#7c3aed,#00d4ff);color:#fff;
                padding:8px 20px;border-radius:20px;text-decoration:none;
                font-size:13px;font-weight:600;white-space:nowrap;">
        🔐 Login
      </a>
    `;
  }
}

// Quiz Progress Functions
function getQuizProgress() {
  const stored = localStorage.getItem(QUIZ_PROGRESS_KEY);
  return stored ? JSON.parse(stored) : {};
}

function saveQuizResult(quizId, score, total, answers) {
  const progress = getQuizProgress();
  progress[quizId] = {
    score,
    total,
    percentage: Math.round((score / total) * 100),
    answers,
    completedAt: new Date().toISOString()
  };
  localStorage.setItem(QUIZ_PROGRESS_KEY, JSON.stringify(progress));
  return progress[quizId];
}

function getQuizResult(quizId) {
  const progress = getQuizProgress();
  return progress[quizId] || null;
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(updateAuthUI, 50);

  COSMOS_AUTH.onAuthChange(() => {
    updateAuthUI();
  });
});

// Export
window.quizAuth = {
  checkAuth,
  getCurrentUser,
  getToken,
  getUserDisplayName,
  getUserAvatar,
  logout,
  redirectToLogin,
  showLoginRequiredModal,
  closeLoginModal,
  updateAuthUI,
  getQuizProgress,
  saveQuizResult,
  getQuizResult,
  checkUrlForToken: () => COSMOS_AUTH.checkUrlForToken()
};
